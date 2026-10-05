/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Layers, 
  Bell, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Calendar, 
  BarChart2,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { 
  ADMIN_STATISTICS, 
  MOCK_STUDENTS_PER_SEMESTER, 
  MOCK_STUDENTS_PER_PRODI, 
  INITIAL_ADMIN_ACTIVITY_LOGS 
} from '../../data/adminMockData';
import { AdminTab } from '../../types/admin';

interface AdminOverviewViewProps {
  onNavigateTab: (tab: AdminTab) => void;
  onOpenQuickAction: (action?: 'mahasiswa' | 'dosen' | 'matakuliah' | 'pengumuman' | 'jadwal') => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  onNavigateTab,
  onOpenQuickAction,
}) => {
  const maxSemesterCount = Math.max(...MOCK_STUDENTS_PER_SEMESTER.map((s) => s.count));

  const stats = [
    {
      title: 'Total Mahasiswa',
      value: ADMIN_STATISTICS.totalStudents.toLocaleString('id-ID'),
      subtext: '+480 mhs baru semester ini',
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Aktif',
      tab: 'mahasiswa' as AdminTab,
    },
    {
      title: 'Total Dosen',
      value: ADMIN_STATISTICS.totalLecturers.toLocaleString('id-ID'),
      subtext: '94% bergelar S3/Doktor',
      icon: GraduationCap,
      color: 'from-emerald-600 to-teal-600',
      badge: '98% Aktif',
      tab: 'dosen' as AdminTab,
    },
    {
      title: 'Total Program Studi',
      value: ADMIN_STATISTICS.totalStudyPrograms.toString(),
      subtext: '12 Akreditasi Unggul',
      icon: Building2,
      color: 'from-cyan-600 to-blue-600',
      badge: '4 Fakultas',
      tab: 'prodi' as AdminTab,
    },
    {
      title: 'Total Mata Kuliah',
      value: ADMIN_STATISTICS.totalCourses.toString(),
      subtext: 'Kurikulum OBE 2026',
      icon: BookOpen,
      color: 'from-violet-600 to-purple-600',
      badge: '342 SKS Aktif',
      tab: 'matakuliah' as AdminTab,
    },
    {
      title: 'Total Kelas Aktif',
      value: ADMIN_STATISTICS.totalClasses.toString(),
      subtext: 'Rasio keterisian kelas 92%',
      icon: Layers,
      color: 'from-amber-600 to-orange-600',
      badge: '148 Rombel',
      tab: 'kelas' as AdminTab,
    },
    {
      title: 'Pengumuman Aktif',
      value: ADMIN_STATISTICS.activeAnnouncements.toString(),
      subtext: '4 Surat Edaran penting',
      icon: Bell,
      color: 'from-rose-600 to-pink-600',
      badge: 'Terkini',
      tab: 'pengumuman' as AdminTab,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Quick Action Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 p-6 sm:p-7 shadow-lg text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                SISTEM ONLINE
              </span>
              <span className="text-xs text-indigo-100 font-medium">· Tahun Akademik 2025/2026 Genap</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Pusat Kendali Akademik Kampus
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-xl">
              Pantau seluruh aktivitas akademik mahasiswa, dosen pengampu, kurikulum, media slider, dan jadwal perkuliahan secara real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenQuickAction('mahasiswa')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Mahasiswa</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('dosen')}
              className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Dosen</span>
            </button>
            <button
              onClick={() => onNavigateTab('slider')}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Media Slider</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 6 Kartu Statistik Utama */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(s.tab)}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-500/50 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${s.color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {s.value}
                </h3>
                <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">
                  {s.title}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 truncate">{s.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Dua Grafik: Mahasiswa per Semester & Berdasarkan Program Studi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Grafik 1: Mahasiswa per Semester (Bar Chart) */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                <span>Distribusi Mahasiswa per Semester</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total 12.480 mahasiswa aktif terdaftar di Semester Genap
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
              98.2% Retensi
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4">
            <div className="h-48 flex items-end justify-between gap-2 px-1 border-b border-slate-100">
              {MOCK_STUDENTS_PER_SEMESTER.map((item, idx) => {
                const heightPercent = Math.round((item.count / maxSemesterCount) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-lg transition-opacity pointer-events-none whitespace-nowrap z-20">
                      {item.count.toLocaleString('id-ID')} mhs
                    </div>

                    <div className="w-full bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden p-0.5">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-600 to-cyan-500 rounded-t transition-all duration-700 group-hover:brightness-110"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                      {item.semester}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3">
              <span>Semester 1–2 (Tingkat I)</span>
              <span>Semester 3–4 (Tingkat II)</span>
              <span>Semester 5–6 (Tingkat III)</span>
              <span>Semester 7–8 (Tingkat Akhir)</span>
            </div>
          </div>
        </div>

        {/* Grafik 2: Mahasiswa berdasarkan Program Studi (Horizontal Progress) */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-600" />
                <span>Mahasiswa Berdasarkan Program Studi</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Peminatan dan sebaran kuota per fakultas
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('prodi')}
              className="text-xs text-indigo-600 hover:text-indigo-500 font-semibold"
            >
              Lihat 16 Prodi →
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {MOCK_STUDENTS_PER_PRODI.map((prodi, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate max-w-[220px]">
                    {prodi.prodi}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-900 font-bold">{prodi.count.toLocaleString('id-ID')}</span>
                    <span className="text-slate-400">({prodi.percentage}%)</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${prodi.color} rounded-full transition-all duration-700`}
                    style={{ width: `${prodi.percentage * 3.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Ringkasan Aktivitas Akademik & Aktivitas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Ringkasan Aktivitas Akademik (KPI Rings & Progress) */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Ringkasan Mutu Akademik</span>
          </h3>

          <div className="space-y-3.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-700 font-medium">Tingkat Kehadiran Mahasiswa</span>
                <span className="font-bold text-emerald-600 font-mono">
                  {ADMIN_STATISTICS.averageAttendanceRate}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full" 
                  style={{ width: `${ADMIN_STATISTICS.averageAttendanceRate}%` }} 
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-700 font-medium">Realisasi Pembayaran UKT</span>
                <span className="font-bold text-cyan-600 font-mono">
                  {ADMIN_STATISTICS.paidUktPercentage}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full rounded-full" 
                  style={{ width: `${ADMIN_STATISTICS.paidUktPercentage}%` }} 
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-700 font-medium">Rata-rata IPK Mahasiswa</span>
                <span className="font-bold text-indigo-600 font-mono">
                  {ADMIN_STATISTICS.averageIpk.toFixed(2)} / 4.00
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full" 
                  style={{ width: `${(ADMIN_STATISTICS.averageIpk / 4) * 100}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Status Akreditasi Kampus</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              UNGGUL (BAN-PT)
            </span>
          </div>
        </div>

        {/* Aktivitas Terbaru (Log Feed) */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-600" />
              <span>Aktivitas & Log Sistem Terbaru</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Live Sync</span>
          </div>

          <div className="divide-y divide-slate-100">
            {INITIAL_ADMIN_ACTIVITY_LOGS.map((act) => (
              <div key={act.id} className="py-2.5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{act.action}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                        {act.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{act.detail}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Oleh: {act.user}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
