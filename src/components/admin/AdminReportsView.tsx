/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  Users, 
  Calendar 
} from 'lucide-react';
import { useToast } from '../common/ToastContext';

export const AdminReportsView: React.FC = () => {
  const { showToast } = useToast();

  const handleExport = (reportName: string, format: 'PDF' | 'Excel') => {
    showToast(`Mengunduh berkas ${reportName} dalam format ${format}...`, 'success');
  };

  const gradeDist = [
    { grade: 'Nilai A / A-', count: '48.2%', color: 'bg-emerald-500' },
    { grade: 'Nilai B+ / B / B-', count: '39.4%', color: 'bg-indigo-500' },
    { grade: 'Nilai C+ / C', count: '10.1%', color: 'bg-amber-500' },
    { grade: 'Nilai D / E (Mengulang)', count: '2.3%', color: 'bg-rose-500' },
  ];

  const reportDocs = [
    {
      title: 'Rekapitulasi Indeks Prestasi Kumulatif (IPK) Seluruh Program Studi',
      desc: 'Analisis pencapaian IPK semester ganjil dan genap berdasarkan fakultas dan tahun angkatan.',
      category: 'Akademik',
      date: 'Maret 2026',
    },
    {
      title: 'Laporan Audit Presensi & Kehadiran Mahasiswa Serta Dosen',
      desc: 'Data rekaman kehadiran harian, absensi barcode QR, serta kepatuhan tatap muka perkuliahan.',
      category: 'Kemahasiswaan',
      date: 'Maret 2026',
    },
    {
      title: 'Laporan Rekonsiliasi Keuangan & Pembayaran UKT Semester Genap',
      desc: 'Status pelunasan uang kuliah tunggal, verifikasi beasiswa KIP-K, dan cicilan bantuan studi.',
      category: 'Keuangan',
      date: 'Februari 2026',
    },
    {
      title: 'Evaluasi Dosen oleh Mahasiswa (EDOM) Semester Terakhir',
      desc: 'Kuesioner evaluasi mutu pengajaran dosen, kepuasan silabus, dan umpan balik sarana laboratorium.',
      category: 'Penjaminan Mutu',
      date: 'Januari 2026',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Laporan & Rekapitulasi Akademik</h2>
            <p className="text-xs text-slate-400">
              Pusat pelaporan data kinerja kampus, kelulusan, mutu, dan ekspor dokumen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('Laporan_Akademik_Lengkap', 'PDF')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>Ekspor Semua PDF</span>
          </button>
          <button
            onClick={() => handleExport('Data_Statistik_Kampus', 'Excel')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Ekspor Excel</span>
          </button>
        </div>
      </div>

      {/* Grade Distribution & KPI Recap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Distribusi Nilai */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Distribusi Nilai Akhir (KHS) Kampus</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 font-bold">Total 342 MK</span>
          </div>

          <div className="space-y-3 pt-1">
            {gradeDist.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.grade}</span>
                  <span className="text-white font-mono font-bold">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: item.count }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Sebesar <strong>87.6%</strong> mahasiswa berhasil memperoleh predikat Memuaskan (A dan B).
          </p>
        </div>

        {/* Indikator Kinerja Utama (IKU) */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3.5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Pencapaian Indikator Kinerja Utama (IKU)</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Kelulusan Tepat Waktu</span>
              <span className="text-lg font-bold text-white font-mono">88.4%</span>
              <span className="text-[10px] text-emerald-400 block">+3.2% dari tahun lalu</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Rasio Dosen : Mahasiswa</span>
              <span className="text-lg font-bold text-white font-mono">1 : 25</span>
              <span className="text-[10px] text-cyan-400 block">Sesuai Standar BAN-PT</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Mahasiswa Ikut MBKM</span>
              <span className="text-lg font-bold text-white font-mono">1.420</span>
              <span className="text-[10px] text-indigo-400 block">Magang & Studi Independen</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Publikasi Riset Terindeks</span>
              <span className="text-lg font-bold text-white font-mono">164</span>
              <span className="text-[10px] text-amber-400 block">Scopus & Sinta 1-2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dokumen Laporan Siap Unduh */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">Arsip Berkas Laporan Resmi</h3>

        <div className="divide-y divide-slate-800/80">
          {reportDocs.map((doc, idx) => (
            <div
              key={idx}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 p-2 rounded-xl transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-400 border border-indigo-500/30">
                    {doc.category}
                  </span>
                  <span className="text-xs font-bold text-white">{doc.title}</span>
                </div>
                <p className="text-xs text-slate-400">{doc.desc}</p>
                <span className="text-[10px] text-slate-500 font-mono">Periode: {doc.date}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleExport(doc.title, 'PDF')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  <Download className="w-3 h-3 text-rose-400" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleExport(doc.title, 'Excel')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>XLSX</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
