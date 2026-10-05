/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  User, 
  CalendarDays, 
  BookOpen, 
  Award, 
  ClipboardList, 
  CreditCard, 
  GraduationCap, 
  Bell, 
  HelpCircle,
  RotateCcw,
  MessageSquare
} from 'lucide-react';
import { AIChatMessage, AIAction } from '../../types';
import { askNusaAI, AIContextData } from '../../services/aiAssistantService';

interface NusaAIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: AIContextData;
  onExecuteAction?: (actionType: AIAction['type']) => void;
}

export const NusaAIChatModal: React.FC<NusaAIChatModalProps> = ({
  isOpen,
  onClose,
  context,
  onExecuteAction,
}) => {
  const getInitialMessage = (): AIChatMessage => ({
    id: 'welcome',
    sender: 'ai',
    text: `Halo ${context.student?.name ? context.student.name.split(' ')[0] : 'Sobat Kampus'}! 👋 Saya **NusaAI**, asisten pintar untuk kebutuhan kampusmu.\n\nTanyakan apa saja seputar jadwal kuliah, tugas, nilai, ujian, atau UKT. Anda juga bisa langsung mengetuk pertanyaan cepat di bawah.`,
    timestamp: 'Baru saja',
  });

  const [messages, setMessages] = useState<AIChatMessage[]>([getInitialMessage()]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickQuestions = [
    { label: 'Jadwal saya hari ini', query: 'Jadwal saya hari ini' },
    { label: 'Tugas saya', query: 'Tugas saya yang mendekati deadline' },
    { label: 'Jadwal ujian', query: 'Jadwal ujian saya' },
    { label: 'Nilai saya', query: 'Nilai saya semester ini' },
    { label: 'IPK saya', query: 'Berapa IPK saya?' },
    { label: 'Pengumuman terbaru', query: 'Pengumuman kampus terbaru' },
    { label: 'Event kampus', query: 'Event kampus mendatang' },
    { label: 'Informasi UKT', query: 'Informasi tagihan UKT saya' },
    { label: 'Bantuan akademik', query: 'Bantuan akademik' },
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, isLoading]);

  if (!isOpen) return null;

  const handleResetChat = () => {
    setMessages([getInitialMessage()]);
    setInputQuery('');
    setHasError(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    setInputQuery('');
    setHasError(false);

    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await askNusaAI(query, context);

      const aiMessage: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        action: response.action,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // If action is detected and user specifically asked to navigate
      if (response.action && onExecuteAction) {
        const lowerQ = query.toLowerCase();
        if (lowerQ.includes('buka') || lowerQ.includes('ke ') || lowerQ.includes('lihat')) {
          setTimeout(() => {
            if (response.action) {
              onExecuteAction(response.action.type);
              onClose();
            }
          }, 1100);
        }
      }
    } catch (err) {
      console.error(err);
      setHasError(true);
      const errorMessage: AIChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'Maaf, terjadi kendala saat memproses pertanyaan Anda. Silakan coba sesaat lagi.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = (action: AIAction) => {
    if (onExecuteAction) {
      onExecuteAction(action.type);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col h-[650px] max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 text-white flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-inner">
              <Bot className="w-5 h-5 text-cyan-300" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight">NusaAI</h2>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wide backdrop-blur-sm">
                  {context.role}
                </span>
              </div>
              <p className="text-[11px] text-indigo-100 font-medium leading-none mt-1">
                Asisten pintar untuk kebutuhan kampusmu.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title="Mulai Percakapan Baru"
              aria-label="Reset Chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title="Tutup"
              aria-label="Tutup Dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Questions Horizontal Scroll Strip */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-3 py-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
              Pertanyaan Cepat:
            </span>
            {quickQuestions.map((q) => (
              <button
                key={q.label}
                onClick={() => handleSendMessage(q.query)}
                disabled={isLoading}
                className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 text-slate-700 border border-slate-200/90 rounded-lg whitespace-nowrap shadow-2xs transition-all active:scale-95 disabled:opacity-50"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <Bot className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-600">Belum ada percakapan</p>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Pilih pertanyaan cepat di atas atau ketik pertanyaan seputar kegiatan kampusmu.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAI = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
                >
                  {isAI && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[84%] sm:max-w-[80%] space-y-1.5`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isAI
                          ? msg.isError
                            ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-tl-xs'
                            : 'bg-white text-slate-800 border border-slate-200/90 shadow-2xs rounded-tl-xs'
                          : 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Interactive Action Button (e.g. Buka KRS) */}
                      {msg.action && (
                        <div className="pt-2.5 mt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => msg.action && handleActionClick(msg.action)}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors shadow-2xs cursor-pointer active:scale-98"
                          >
                            <span>{msg.action.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <span className={`text-[10px] text-slate-400 block px-1 ${isAI ? 'text-left' : 'text-right'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isAI && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Typing Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2.5 justify-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-500 font-medium pl-1">
                  NusaAI sedang memeriksa data kampusmu...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error State Banner if needed */}
        {hasError && (
          <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs flex items-center justify-between shrink-0">
            <span>Terjadi kesalahan saat memproses. Coba lagi?</span>
            <button
              onClick={() => handleSendMessage()}
              className="flex items-center gap-1 font-bold underline text-rose-800"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Kirim Ulang</span>
            </button>
          </div>
        )}

        {/* Input Bar Footer */}
        <div className="p-3 bg-white border-t border-slate-200/90 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya NusaAI (contoh: Jadwal hari ini, Tugas aktif, Buka KRS...)"
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shadow-indigo-600/20 active:scale-95 shrink-0 cursor-pointer"
              aria-label="Kirim Pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-400 mt-2">
            NusaAI menjawab berbasis data resmi akun kamu. Privasi dan keamanan terjamin.
          </p>
        </div>
      </div>
    </div>
  );
};
