import React, { useState } from 'react';
import { Calendar, Clock, Bookmark, ChevronRight, Download, Filter } from 'lucide-react';
import { AcademicCalendarEvent } from '../../types';
import { MOCK_ACADEMIC_CALENDAR } from '../../data/mockData';
import { useToast } from '../common/ToastContext';

export const AcademicCalendarView: React.FC = () => {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = [
    'Semua',
    'Registrasi & KRS',
    'Perkuliahan',
    'Ujian',
    'Libur Akademik',
    'Wisuda & Yudisium',
  ];

  const filteredEvents = MOCK_ACADEMIC_CALENDAR.filter((item) => {
    if (selectedCategory === 'Semua') return true;
    return item.category === selectedCategory;
  });

  const getCategoryColor = (category: AcademicCalendarEvent['category']) => {
    switch (category) {
      case 'Registrasi & KRS':
        return 'text-indigo-400 border-indigo-500/30 bg-indigo-950/50';
      case 'Perkuliahan':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/50';
      case 'Ujian':
        return 'text-rose-400 border-rose-500/30 bg-rose-950/50';
      case 'Libur Akademik':
        return 'text-amber-400 border-amber-500/30 bg-amber-950/50';
      default:
        return 'text-purple-400 border-purple-500/30 bg-purple-950/50';
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
            Tahun Akademik 2026/2027
          </span>
          <h3 className="text-base font-extrabold text-white mt-0.5">
            Kalender Akademik Resmi
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Biro Administrasi Akademik & Kemahasiswaan
          </p>
        </div>
        <button
          onClick={() => showToast('Mengunduh Kalender Akademik Resmi 2026/2027 (Format PDF Cetak).', 'success')}
          className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 shadow flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh PDF</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Timeline List */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className={`glass-card rounded-2xl p-4 border transition-all ${
              evt.isImportant ? 'border-indigo-500/40' : 'border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getCategoryColor(evt.category)}`}>
                    {evt.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {evt.semester}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">
                  {evt.title}
                </h4>
              </div>

              {evt.isImportant && (
                <span className="px-2 py-0.5 bg-rose-950/80 border border-rose-500/30 text-rose-400 text-[10px] font-bold rounded-md shrink-0">
                  Penting
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              {evt.description}
            </p>

            <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
                <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{evt.startDate} — {evt.endDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
