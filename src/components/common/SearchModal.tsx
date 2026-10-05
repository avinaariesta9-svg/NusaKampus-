/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, FileText, BellRing, Calendar, ArrowRight } from 'lucide-react';
import { MOCK_SCHEDULES, MOCK_ASSIGNMENTS, MOCK_ANNOUNCEMENTS, MOCK_NEWS_EVENTS } from '../../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: any, subtab?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const items: Array<{
      id: string;
      title: string;
      subtitle: string;
      type: 'kuliah' | 'tugas' | 'pengumuman' | 'event';
      targetTab: 'home' | 'akademik' | 'pengumuman' | 'profil';
      subtab?: string;
    }> = [];

    // Search Schedules
    MOCK_SCHEDULES.forEach((s) => {
      if (s.courseName.toLowerCase().includes(q) || s.courseCode.toLowerCase().includes(q) || s.lecturer.toLowerCase().includes(q)) {
        items.push({
          id: s.id,
          title: s.courseName,
          subtitle: `${s.courseCode} · ${s.day} ${s.timeStart} · ${s.room}`,
          type: 'kuliah',
          targetTab: 'akademik',
          subtab: 'jadwal',
        });
      }
    });

    // Search Assignments
    MOCK_ASSIGNMENTS.forEach((a) => {
      if (a.title.toLowerCase().includes(q) || a.courseName.toLowerCase().includes(q)) {
        items.push({
          id: a.id,
          title: a.title,
          subtitle: `Tugas ${a.courseCode} · Batas: ${a.dueDate}`,
          type: 'tugas',
          targetTab: 'akademik',
          subtab: 'tugas',
        });
      }
    });

    // Search Announcements
    MOCK_ANNOUNCEMENTS.forEach((ann) => {
      if (ann.title.toLowerCase().includes(q) || ann.content.toLowerCase().includes(q)) {
        items.push({
          id: ann.id,
          title: ann.title,
          subtitle: `${ann.category} · ${ann.sender}`,
          type: 'pengumuman',
          targetTab: 'pengumuman',
          subtab: 'pengumuman',
        });
      }
    });

    // Search Events
    MOCK_NEWS_EVENTS.forEach((e) => {
      if (e.title.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q) || e.organizer.toLowerCase().includes(q)) {
        items.push({
          id: e.id,
          title: e.title,
          subtitle: `${e.type} · ${e.date} · ${e.location}`,
          type: 'event',
          targetTab: 'pengumuman',
          subtab: 'berita',
        });
      }
    });

    return items;
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Search Bar Input */}
        <div className="p-3.5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari mata kuliah, tugas, pengumuman, atau event..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 font-semibold"
            >
              Hapus
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestions / Results */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          {!query.trim() ? (
            <div className="p-4 text-center">
              <p className="text-xs font-semibold text-slate-500">Pencarian Cepat Populer</p>
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                {['Machine Learning', 'Jadwal Hari Ini', 'KRS Semester 6', 'Beasiswa Nusa Gold', 'Tech Summit'].map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => setQuery(keyword)}
                    className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-xl text-slate-700 font-medium transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm font-semibold">Tidak ditemukan hasil untuk "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Coba kata kunci lain seperti nama dosen, kode matkul, atau acara.</p>
            </div>
          ) : (
            results.map((res) => (
              <div
                key={res.id}
                onClick={() => {
                  onNavigate(res.targetTab, res.subtab);
                  onClose();
                }}
                className="p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between gap-3 group transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {res.type === 'kuliah' && <BookOpen className="w-4 h-4" />}
                    {res.type === 'tugas' && <FileText className="w-4 h-4" />}
                    {res.type === 'pengumuman' && <BellRing className="w-4 h-4" />}
                    {res.type === 'event' && <Calendar className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                      {res.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {res.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
