import React, { useState } from 'react';
import { X, QrCode, ShieldCheck, Download, Share2, Sparkles, GraduationCap } from 'lucide-react';
import { StudentProfile } from '../../types';
import { useToast } from '../common/ToastContext';

interface DigitalKTMModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
}

export const DigitalKTMModal: React.FC<DigitalKTMModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const { showToast } = useToast();
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-5 shadow-2xl z-10 space-y-4">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              KTM Digital Nusantara
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D-Like Card Surface */}
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative w-full h-[220px] rounded-2xl p-5 bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/40 shadow-2xl flex flex-col justify-between cursor-pointer select-none overflow-hidden group"
        >
          {/* Neon aesthetic accents */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl" />

          {/* Top of Card */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow">
                <GraduationCap className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <span className="text-xs font-black tracking-tight text-white block">
                  UNIVERSITAS NUSANTARA
                </span>
                <span className="text-[9px] text-cyan-300 uppercase tracking-widest block font-medium">
                  Kartu Tanda Mahasiswa Digital
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              {student.status}
            </span>
          </div>

          {/* Center Details */}
          <div className="relative z-10 flex items-center gap-3.5 my-auto">
            <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-cyan-400/50 shadow-md shrink-0">
              <img
                src={student.avatar}
                alt={student.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-extrabold text-white truncate">
                {student.name}
              </h4>
              <p className="text-xs font-mono text-cyan-300 tracking-wider">
                {student.nim}
              </p>
              <p className="text-[10px] text-slate-300 truncate mt-0.5">
                {student.major} · {student.program}
              </p>
            </div>
          </div>

          {/* Bottom Card Bar */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-700/60">
            <span>Berlaku s/d: 2027</span>
            <span className="flex items-center gap-1 text-slate-300 font-mono">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" /> TAP UNTUK QR
            </span>
          </div>
        </div>

        {/* QR Code Verification Display */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center space-y-2.5">
          <div className="p-3 bg-white rounded-xl shadow-md">
            {/* SVG Mock QR Code */}
            <div className="w-28 h-28 bg-slate-900 p-1 flex items-center justify-center rounded">
              <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-white">
                <div className="bg-black col-span-2 row-span-2 rounded-sm" />
                <div className="bg-black" />
                <div className="bg-black col-span-2 row-span-2 rounded-sm" />
                <div className="bg-black" />
                <div className="bg-black" />
                <div className="bg-black" />
                <div className="bg-black" />
                <div className="bg-black" />
                <div className="bg-black" />
                <div className="bg-black col-span-2 row-span-2 rounded-sm" />
                <div className="bg-black" />
                <div className="bg-black" />
                <div className="bg-black" />
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-white block">
              {student.ktmQrCode}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Gunakan untuk validasi gerbang kampus, perpustakaan, & ruang ujian
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => showToast('KTM Digital berhasil disimpan ke Galeri Smartphone.', 'success')}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simpan Gambar</span>
          </button>
          <button
            onClick={() => showToast('Link verifikasi keabsahan QR KTM Digital berhasil disalin ke clipboard.', 'success')}
            className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
