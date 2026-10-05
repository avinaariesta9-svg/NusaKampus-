/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BellRing, 
  Newspaper, 
  Calendar, 
  MapPin, 
  UserCheck, 
  Download, 
  CheckCircle2, 
  Clock, 
  Tag, 
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';
import { 
  AnnouncementSubTab, 
  AnnouncementItem, 
  NewsEventItem 
} from '../../types';
import { useToast } from '../common/ToastContext';

interface AnnouncementTabProps {
  initialSubTab?: AnnouncementSubTab;
  announcements: AnnouncementItem[];
  newsEvents: NewsEventItem[];
  onToggleEventRegistration: (eventId: string) => void;
}

export const AnnouncementTab: React.FC<AnnouncementTabProps> = ({
  initialSubTab = 'pengumuman',
  announcements,
  newsEvents,
  onToggleEventRegistration,
}) => {
  const { showToast } = useToast();
  const [subTab, setSubTab] = useState<AnnouncementSubTab>(initialSubTab);
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [activeAnnouncement, setActiveAnnouncement] = useState<AnnouncementItem | null>(null);
  const [activeNews, setActiveNews] = useState<NewsEventItem | null>(null);

  const categories = ['Semua', 'Rektorat', 'Akademik', 'Beasiswa', 'Fasilitas'];

  const filteredAnnouncements = announcements.filter((item) => {
    if (categoryFilter === 'Semua') return true;
    return item.category === categoryFilter;
  });

  return (
    <div className="pb-24 pt-3 px-4 max-w-lg mx-auto space-y-4">
      {/* 1. Sub-Tab Switcher */}
      <div className="p-1 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
        <button
          onClick={() => setSubTab('pengumuman')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            subTab === 'pengumuman'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>Pengumuman Resmi ({announcements.length})</span>
        </button>

        <button
          onClick={() => setSubTab('berita')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            subTab === 'berita'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>Berita & Event ({newsEvents.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW: PENGUMUMAN RESMI */}
      {/* ========================================================================= */}
      {subTab === 'pengumuman' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs rounded-xl font-bold whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Announcement Cards */}
          <div className="space-y-3">
            {filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                onClick={() => setActiveAnnouncement(ann)}
                className="rounded-2xl p-4 bg-white border border-slate-200/90 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2.5 group"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                    <span>{ann.category}</span>
                    <span>·</span>
                    <span>{ann.readTime}</span>
                  </div>
                  <span>{ann.date}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {ann.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {ann.excerpt}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate pr-2">{ann.sender}</span>
                  <span className="text-indigo-600 group-hover:text-indigo-700 flex items-center gap-0.5 shrink-0 font-bold">
                    <span>Selengkapnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: BERITA & EVENT */}
      {/* ========================================================================= */}
      {subTab === 'berita' && (
        <div className="space-y-4">
          <div className="space-y-4">
            {newsEvents.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden bg-white border border-slate-200/90 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all"
              >
                {/* Image Banner */}
                <div 
                  className="h-44 w-full relative bg-slate-100 cursor-pointer overflow-hidden group"
                  onClick={() => setActiveNews(item)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-600/90 text-white backdrop-blur-md">
                      {item.type}
                    </span>
                    <span className="text-xs text-white bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md font-medium">
                      {item.date}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 
                    onClick={() => setActiveNews(item)}
                    className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors leading-snug"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    {item.maxParticipants && (
                      <span className="shrink-0 text-slate-700 font-mono text-[11px] font-semibold">
                        {item.registeredCount} / {item.maxParticipants} Peserta
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Register action for Events/Workshops */}
                  {item.maxParticipants && (
                    <div className="pt-1">
                      <button
                        onClick={() => onToggleEventRegistration(item.id)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          item.isRegistered
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                        }`}
                      >
                        {item.isRegistered ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Terdaftar (Lihat Tiket QR)</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" />
                            <span>Daftar Sekarang (Gratis SKPI)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT DETAIL MODAL */}
      {activeAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setActiveAnnouncement(null)}
          />
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs text-indigo-600 font-bold">{activeAnnouncement.category} · {activeAnnouncement.date}</span>
                <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                  {activeAnnouncement.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Diterbitkan oleh: {activeAnnouncement.sender}</p>
              </div>
              <button
                onClick={() => setActiveAnnouncement(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {activeAnnouncement.content}
            </div>

            {activeAnnouncement.pdfAttachment && (
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium truncate pr-2">
                  Lampiran: {activeAnnouncement.pdfAttachment}
                </span>
                <button
                  onClick={() => showToast(`Mengunduh dokumen surat keputusan: ${activeAnnouncement.pdfAttachment}`, 'success')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEWS DETAIL MODAL */}
      {activeNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setActiveNews(null)}
          />
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
            <div className="h-48 w-full relative">
              <img
                src={activeNews.image}
                alt={activeNews.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveNews(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <span className="text-xs text-indigo-600 font-bold">{activeNews.type} · {activeNews.date}</span>
              <h3 className="text-base font-bold text-slate-900">{activeNews.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{activeNews.content}</p>
              
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 space-y-1">
                <p>Penyelenggara: <span className="text-slate-800 font-semibold">{activeNews.organizer}</span></p>
                <p>Lokasi: <span className="text-slate-800 font-semibold">{activeNews.location}</span></p>
              </div>

              {activeNews.maxParticipants && (
                <button
                  onClick={() => {
                    onToggleEventRegistration(activeNews.id);
                    setActiveNews({
                      ...activeNews,
                      isRegistered: !activeNews.isRegistered,
                    });
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
                >
                  {activeNews.isRegistered ? 'Batalkan Pendaftaran' : 'Daftar Ikuti Acara Ini'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
