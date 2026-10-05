/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Building, 
  Calendar, 
  ShieldCheck, 
  Database, 
  CheckCircle2 
} from 'lucide-react';
import { useToast } from '../common/ToastContext';

export const AdminSettingsView: React.FC = () => {
  const { showToast } = useToast();

  const [campusName, setCampusName] = useState('Universitas Teknologi Nusantara');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [semesterType, setSemesterType] = useState('Genap');
  const [rectorName, setRectorName] = useState('Prof. Dr. Ir. Hendrawan Suryo, M.T., IPU.');
  const [krsOpen, setKrsOpen] = useState(true);
  const [attendanceMinPercent, setAttendanceMinPercent] = useState(75);

  // Bobot Nilai
  const [weightTugas, setWeightTugas] = useState(25);
  const [weightUTS, setWeightUTS] = useState(30);
  const [weightUAS, setWeightUAS] = useState(35);
  const [weightPresensi, setWeightPresensi] = useState(10);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const totalWeight = Number(weightTugas) + Number(weightUTS) + Number(weightUAS) + Number(weightPresensi);
    if (totalWeight !== 100) {
      showToast(`Total bobot penilaian harus 100% (saat ini ${totalWeight}%).`, 'warning');
      return;
    }
    showToast('Pengaturan sistem akademik berhasil disimpan dan diperbarui!', 'success');
  };

  const handleTriggerBackup = () => {
    showToast('Simulasi Snapshot: Cadangan database akademik lokal berhasil dibuat.', 'success');
  };

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Pengaturan Sistem Kampus</h2>
            <p className="text-xs text-slate-400">
              Konfigurasi umum institusi, jadwal semester, dan standardisasi penilaian
            </p>
          </div>
        </div>

        <button
          onClick={handleTriggerBackup}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
        >
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Cadangkan Data (Backup)</span>
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-5">
        {/* Identitas Institusi & Periode */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" />
            <span>Identitas Perguruan Tinggi & Semester Aktif</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Perguruan Tinggi</label>
              <input
                type="text"
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Rektor Universitas</label>
              <input
                type="text"
                value={rectorName}
                onChange={(e) => setRectorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tahun Akademik</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Semester Aktif</label>
              <select
                value={semesterType}
                onChange={(e) => setSemesterType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
                <option value="Antara">Semester Pendek / Antara</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pengaturan Akademik & Bobot Nilai */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Standar Penilaian & Kehadiran Mahasiswa</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Bobot Tugas (%)</label>
              <input
                type="number"
                value={weightTugas}
                onChange={(e) => setWeightTugas(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Bobot UTS (%)</label>
              <input
                type="number"
                value={weightUTS}
                onChange={(e) => setWeightUTS(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Bobot UAS (%)</label>
              <input
                type="number"
                value={weightUAS}
                onChange={(e) => setWeightUAS(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Bobot Presensi (%)</label>
              <input
                type="number"
                value={weightPresensi}
                onChange={(e) => setWeightPresensi(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div>
              <span className="font-semibold text-white block">Status Akses Pengisian KRS</span>
              <span className="text-slate-400 text-[11px]">
                {krsOpen ? 'Mahasiswa dapat memilih mata kuliah' : 'Masa KRS terkunci'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setKrsOpen(!krsOpen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                krsOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {krsOpen ? 'KRS Terbuka' : 'KRS Ditutup'}
            </button>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Seluruh Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
