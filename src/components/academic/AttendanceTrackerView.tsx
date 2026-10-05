import React, { useState } from 'react';
import { QrCode, CheckCircle2, AlertTriangle, Clock, Calendar, ChevronRight, X, ShieldCheck } from 'lucide-react';
import { AttendanceCourseRecord } from '../../types';
import { MOCK_ATTENDANCE_RECORDS } from '../../data/mockData';

interface AttendanceTrackerViewProps {
  onOpenAttendanceScan: () => void;
}

export const AttendanceTrackerView: React.FC<AttendanceTrackerViewProps> = ({ onOpenAttendanceScan }) => {
  const [selectedCourse, setSelectedCourse] = useState<AttendanceCourseRecord>(MOCK_ATTENDANCE_RECORDS[0]);
  const [logModalCourse, setLogModalCourse] = useState<AttendanceCourseRecord | null>(null);

  const getStatusBadge = (status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa') => {
    switch (status) {
      case 'Hadir':
        return <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold">Hadir</span>;
      case 'Izin':
        return <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md font-semibold">Izin</span>;
      case 'Sakit':
        return <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md font-semibold">Sakit</span>;
      default:
        return <span className="text-[10px] text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-md font-semibold">Alpa</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Attendance Scan CTA Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/30 shadow-lg flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-semibold">
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Presensi Cepat di Kelas</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Pindai QR Code yang ditampilkan Dosen di awal kuliah.
          </p>
        </div>
        <button
          onClick={onOpenAttendanceScan}
          className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shrink-0 shadow-md active:scale-95 transition-all flex items-center gap-1.5"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan QR</span>
        </button>
      </div>

      {/* Regulation Info */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>Batas minimal kehadiran syarat mengikuti UTS & UAS adalah <strong className="text-white">75%</strong> (maksimal 4x izin/sakit/alpa).</span>
      </div>

      {/* Attendance per Course Cards */}
      <div className="space-y-3">
        {MOCK_ATTENDANCE_RECORDS.map((item) => {
          const isSafe = item.percentage >= item.minRequiredPercent;
          return (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono">
                    <span>{item.courseCode}</span>
                    <span>·</span>
                    <span>{item.sks} SKS</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">
                    {item.courseName}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{item.lecturer}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xl font-black font-mono block ${isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.percentage}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {item.completedMeetings} / {item.totalMeetings} Pertemuan
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isSafe ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              {/* Breakdown counts */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                <div className="p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Hadir</span>
                  <span className="font-bold text-emerald-400 font-mono">{item.presentCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Izin</span>
                  <span className="font-bold text-cyan-400 font-mono">{item.excusedCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Sakit</span>
                  <span className="font-bold text-amber-400 font-mono">{item.sickCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Alpa</span>
                  <span className="font-bold text-rose-400 font-mono">{item.absentCount}</span>
                </div>
              </div>

              {/* View meeting logs button */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Berhak Mengikuti Ujian
                </span>
                <button
                  onClick={() => setLogModalCourse(item)}
                  className="text-xs text-indigo-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
                >
                  <span>Lihat Riwayat Log ({item.completedMeetings})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MEETING LOG MODAL */}
      {logModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setLogModalCourse(null)}
          />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs text-cyan-400 font-mono">{logModalCourse.courseCode} · Presensi {logModalCourse.percentage}%</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {logModalCourse.courseName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Dosen: {logModalCourse.lecturer}</p>
              </div>
              <button
                onClick={() => setLogModalCourse(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">
                Log Kehadiran Pertemuan 1 - {logModalCourse.completedMeetings}
              </span>
              <div className="space-y-2">
                {logModalCourse.logs.map((log) => (
                  <div
                    key={log.meetingNo}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-slate-800 text-cyan-300 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                        {log.meetingNo}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white leading-snug">
                          {log.topic}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{log.date}</span>
                          <span>·</span>
                          <span className="font-mono">{log.timeRecorded}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(log.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setLogModalCourse(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Tutup Log Pertemuan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
