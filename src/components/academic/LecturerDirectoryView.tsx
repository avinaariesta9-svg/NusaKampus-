import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Clock, Search, ChevronRight, X, GraduationCap, BookOpen, MessageSquare } from 'lucide-react';
import { LecturerItem } from '../../types';
import { MOCK_LECTURERS } from '../../data/mockData';
import { useToast } from '../common/ToastContext';

export const LecturerDirectoryView: React.FC = () => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedLecturer, setSelectedLecturer] = useState<LecturerItem | null>(null);

  const filteredLecturers = MOCK_LECTURERS.filter((lec) =>
    lec.name.toLowerCase().includes(search.toLowerCase()) ||
    lec.specialization.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
    lec.coursesTaught.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama dosen, bidang keahlian, atau matkul..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Hapus
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Direktori Dosen Pengampu ({filteredLecturers.length})</span>
        <span className="text-cyan-400 font-medium">Fakultas Ilmu Komputer</span>
      </div>

      {/* Lecturer Cards */}
      <div className="space-y-3">
        {filteredLecturers.map((lec) => (
          <div
            key={lec.id}
            onClick={() => setSelectedLecturer(lec)}
            className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-indigo-500/30 shrink-0">
                <img
                  src={lec.avatar}
                  alt={lec.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {lec.name}
                </h4>
                <p className="text-[11px] text-indigo-300 font-medium mt-0.5">
                  {lec.title}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-1">
                  <span>NIP: {lec.nip}</span>
                  <span>·</span>
                  <span>NIDN: {lec.nidn}</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 mt-2 transition-transform group-hover:translate-x-0.5" />
            </div>

            {/* Specialization Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {lec.specialization.map((spec) => (
                <span
                  key={spec}
                  className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800"
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Office Hour Snippet */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-[11px]">{lec.officeHours}</span>
              </div>
              <span className="text-emerald-400 font-semibold text-[10px]">{lec.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedLecturer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedLecturer(null)}
          />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-cyan-400/50 shrink-0">
                  <img
                    src={selectedLecturer.avatar}
                    alt={selectedLecturer.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {selectedLecturer.name}
                  </h3>
                  <p className="text-xs text-indigo-300 font-medium mt-0.5">
                    {selectedLecturer.title}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    NIP: {selectedLecturer.nip} · NIDN: {selectedLecturer.nidn}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLecturer(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Office & Contact Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{selectedLecturer.room}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Office Hours: {selectedLecturer.officeHours}</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-300 font-mono">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{selectedLecturer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{selectedLecturer.phone}</span>
              </div>
            </div>

            {/* Education History */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-cyan-400" /> Riwayat Pendidikan
              </span>
              <div className="space-y-1">
                {selectedLecturer.education.map((edu, i) => (
                  <div key={i} className="p-2 rounded-xl bg-slate-950/40 text-xs text-slate-300 border border-slate-800/80">
                    {edu}
                  </div>
                ))}
              </div>
            </div>

            {/* Courses Taught */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Mata Kuliah yang Diampu
              </span>
              <div className="space-y-1">
                {selectedLecturer.coursesTaught.map((crs, i) => (
                  <div key={i} className="p-2 rounded-xl bg-slate-950/40 text-xs text-white border border-slate-800/80">
                    {crs}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Consultation */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => showToast(`Janji Temu Bimbingan: Pengajuan konsultasi akademik terkirim ke email ${selectedLecturer.email}.`, 'success')}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ajukan Bimbingan / Janji Temu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
