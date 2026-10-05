import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, Camera, RefreshCw } from 'lucide-react';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName?: string;
  room?: string;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  courseName = 'Kecerdasan Buatan & Machine Learning',
  room = 'Lab AI 302',
}) => {
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 1200);
  };

  const handleReset = () => {
    setScanned(false);
    setScanning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Presensi Kehadiran Daring/Luring</h3>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Window Simulation */}
        <div className="relative aspect-square w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4 text-center">
          {scanned ? (
            <div className="space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Presensi Berhasil Dicatat!</h4>
                <p className="text-xs text-slate-300 mt-1 font-mono">Status: Hadir Tepat Waktu</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Waktu: {new Date().toLocaleTimeString('id-ID')} WIB</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Target viewfinder box */}
              <div className="w-48 h-48 border-2 border-dashed border-indigo-400/80 rounded-2xl relative flex items-center justify-center">
                {scanning ? (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-bounce" />
                ) : (
                  <Camera className="w-10 h-10 text-indigo-400/50" />
                )}
              </div>
              <p className="text-xs text-slate-400 mt-4">
                {scanning ? 'Membaca kode QR di layar proyektor kelas...' : 'Arahkan kamera ke QR Code yang ditampilkan Dosen'}
              </p>
            </div>
          )}
        </div>

        {/* Matkul Info */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-white truncate">{courseName}</p>
          <p className="text-slate-400">{room} · Koordinat GPS Kampus Terverifikasi</p>
        </div>

        {/* Action Button */}
        <div>
          {scanned ? (
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Selesai & Tutup
            </button>
          ) : (
            <button
              onClick={handleSimulateScan}
              disabled={scanning}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {scanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi QR...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>Simulasikan Scan Presensi</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
