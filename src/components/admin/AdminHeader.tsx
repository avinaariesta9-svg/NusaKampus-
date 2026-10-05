/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  LogOut, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  ExternalLink,
  Bot
} from 'lucide-react';
import { AdminTab, AdminRole } from '../../types/admin';
import { useToast } from '../common/ToastContext';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenMobileSidebar: () => void;
  onOpenQuickAction: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentRole: AdminRole;
  onRoleChange: (role: AdminRole) => void;
  onExitToStudentPortal: () => void;
  onOpenNusaAI?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onOpenMobileSidebar,
  onOpenQuickAction,
  searchQuery,
  onSearchChange,
  currentRole,
  onRoleChange,
  onExitToStudentPortal,
  onOpenNusaAI,
}) => {
  const { showToast } = useToast();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const getTabTitle = (tab: AdminTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard & Statistik Kampus';
      case 'slider':
        return 'Manajemen Media Slider Kampus';
      case 'mahasiswa':
        return 'Data Mahasiswa';
      case 'dosen':
        return 'Data Dosen & Tenaga Pengajar';
      case 'prodi':
        return 'Fakultas & Program Studi';
      case 'matakuliah':
        return 'Kurikulum & Mata Kuliah';
      case 'kelas':
        return 'Manajemen Kelas Perkuliahan';
      case 'jadwal':
        return 'Jadwal Kuliah Mingguan';
      case 'pengumuman':
        return 'Pengumuman & Surat Edaran';
      case 'tugas-ujian':
        return 'Manajemen Tugas & Ujian';
      case 'laporan':
        return 'Laporan & Rekapitulasi Akademik';
      case 'pengaturan':
        return 'Pengaturan Sistem Kampus';
      default:
        return 'Dashboard Admin';
    }
  };

  const roles: AdminRole[] = ['Super Admin', 'Admin Kampus', 'Dosen', 'Mahasiswa'];

  const handleSelectRole = (r: AdminRole) => {
    setIsRoleDropdownOpen(false);
    if (r === 'Mahasiswa') {
      showToast('Beralih ke mode Portal Mahasiswa.', 'info');
      onExitToStudentPortal();
    } else {
      onRoleChange(r);
      showToast(`Peran admin diubah ke: ${r}`, 'success');
    }
  };

  const handleSimulateLogout = () => {
    showToast('Simulasi Sesi: Anda telah keluar dari sesi Admin.', 'info');
    onExitToStudentPortal();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                {getTabTitle(activeTab)}
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              NusaCampus Academic Cloud · Semester Genap 2025/2026
            </p>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Bar */}
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari data di tab ini..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* NusaAI Button */}
          {onOpenNusaAI && (
            <button
              onClick={onOpenNusaAI}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition-all shadow-2xs active:scale-95"
              title="Tanya NusaAI"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span className="hidden sm:inline">NusaAI</span>
            </button>
          )}

          {/* Quick Action Button */}
          <button
            onClick={onOpenQuickAction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Aksi Cepat</span>
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">{currentRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Ganti Peran (Role)
                </p>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleSelectRole(r)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                      currentRole === r
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{r}</span>
                    {r === 'Mahasiswa' && (
                      <span className="text-[10px] text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded font-bold">
                        Portal Mhs
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Notifikasi Admin</span>
                  <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer" onClick={() => setIsNotifOpen(false)}>
                    Tutup
                  </span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2">
                    <p className="font-semibold text-slate-800">14 Mahasiswa Mengajukan KRS</p>
                    <p className="text-[11px] text-slate-500">Prodi Teknik Informatika menunggu approval.</p>
                    <span className="text-[10px] text-slate-400">10 menit lalu</span>
                  </div>
                  <div className="py-2">
                    <p className="font-semibold text-slate-800">Backup Data Terjadwal Selesai</p>
                    <p className="text-[11px] text-slate-500">Database snapshot tersimpan otomatis.</p>
                    <span className="text-[10px] text-slate-400">1 jam lalu</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Pill & Logout */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <div className="w-7 h-7 rounded-xl overflow-hidden ring-1 ring-slate-300 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={handleSimulateLogout}
              title="Logout (Keluar ke Portal Mahasiswa)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
