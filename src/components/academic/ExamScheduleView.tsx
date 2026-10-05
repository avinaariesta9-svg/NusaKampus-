import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, FileText, Download, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import { ExamItem } from '../../types';
import { MOCK_EXAMS } from '../../data/mockData';
import { useToast } from '../common/ToastContext';

export const ExamScheduleView: React.FC = () => {
  const { showToast } = useToast();
  const [examType, setExamType] = useState<'UTS' | 'UAS'>('UTS');
  const [showExamTicket, setShowExamTicket] = useState(false);

  const filteredExams = MOCK_EXAMS.filter((e) => e.type === examType);

  return (
    <div className="space-y-4">
      {/* Switcher UTS vs UAS */}
      <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
        <button
          onClick={() => setExamType('UTS')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            examType === 'UTS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Ujian Tengah Semester (UTS)
        </button>
        <button
          onClick={() => setExamType('UAS')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            examType === 'UAS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Ujian Akhir Semester (UAS)
        </button>
      </div>

      {/* Digital Exam Ticket CTA */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
            Kartu Peserta Ujian Digital
          </span>
          <h4 className="text-xs font-bold text-white mt-0.5">
            Kartu Ujian Semester Gasal 2026
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Syarat masuk ruang ujian luring & daring.
          </p>
        </div>
        <button
          onClick={() => setShowExamTicket(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 shadow-md flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Lihat Kartu</span>
        </button>
      </div>

      {/* Rules Notice */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Tata Tertib Ujian Resmi</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Wajib bersepatu, mengenakan jas almamater, hadir 15 menit sebelum waktu dimulai, dan menunjukkan Kartu Peserta Ujian Digital di aplikasi NusaCampus.
        </p>
      </div>

      {/* Exam Schedule List */}
      <div className="space-y-3">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-rose-400 font-bold">
                  <span>{exam.type}</span>
                  <span>·</span>
                  <span className="text-slate-400 font-mono">{exam.courseCode}</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">
                  {exam.courseName}
                </h4>
              </div>

              <div className="px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold shrink-0">
                Kursi {exam.seatNumber}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{exam.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{exam.time}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{exam.room}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Petunjuk Pengawas: </span>
              {exam.instruction}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL KARTU UJIAN DIGITAL */}
      {showExamTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowExamTicket(false)}
          />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl z-10 space-y-4">
            <div className="text-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white">UNIVERSITAS NUSANTARA</h3>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">KARTU PESERTA UJIAN SEMESTER GASAL 2026</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Nama Mahasiswa</span>
                <span className="font-bold text-white">Arya Pratama Putra</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">NIM</span>
                <span className="text-cyan-400 font-bold">2210511042</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Program Studi</span>
                <span className="text-white">S1 Teknik Informatika</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Status Validasi BAAK</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi Lunas UKT
                </span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl flex flex-col items-center justify-center text-center">
              <QrCode className="w-28 h-28 text-slate-950" />
              <span className="text-[10px] font-mono font-bold text-slate-800 mt-1">
                KPU-2210511042-UTS-VALID-2026
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowExamTicket(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => showToast('Kartu Peserta Ujian Digital berhasil diunduh ke memori perangkat.', 'success')}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
