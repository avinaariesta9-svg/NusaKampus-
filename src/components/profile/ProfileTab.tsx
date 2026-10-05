/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  User, 
  CreditCard, 
  GraduationCap, 
  Mail, 
  Phone, 
  Building2, 
  Award, 
  QrCode, 
  ChevronRight, 
  ShieldCheck, 
  LogOut, 
  Settings, 
  BookOpen,
  Calendar,
  Sparkles,
  MapPin
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { useToast } from '../common/ToastContext';
import { useFirebase } from '../auth/FirebaseContext';

interface ProfileTabProps {
  student: StudentProfile;
  onOpenKtmModal: () => void;
  onLogout: () => void;
  onNavigateToAcademic: (subtab: 'jadwal' | 'krs' | 'khs' | 'tugas') => void;
  onOpenAdminPortal?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  student,
  onOpenKtmModal,
  onLogout,
  onNavigateToAcademic,
  onOpenAdminPortal,
}) => {
  const { showToast } = useToast();
  const { branding } = useFirebase();
  return (
    <div className="pb-28 pt-3 px-4 max-w-lg mx-auto space-y-4">
      {/* 1. Profile Identity Header Card with Dynamic Branding */}
      <div className="rounded-3xl p-5 bg-white border border-slate-200/90 shadow-sm text-center relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-20"
          style={{
            background: `linear-gradient(135deg, ${branding.primaryColor || '#4f46e5'}, ${branding.secondaryColor || '#06b6d4'})`
          }}
        />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg mb-3 mt-4">
            <img
              src={student.avatar}
              alt={student.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-lg font-black text-slate-900">{student.name}</h2>
          <span 
            className="text-xs font-mono font-bold mt-0.5"
            style={{ color: branding.primaryColor || '#4f46e5' }}
          >
            {student.nim}
          </span>
          <span className="text-xs text-slate-500 mt-1">
            {student.program} · {student.major}
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {branding.appName}
            </span>
          </div>

          {/* Quick KTM Trigger Button */}
          <button
            onClick={onOpenKtmModal}
            style={{ backgroundColor: branding.primaryColor || '#4f46e5' }}
            className="mt-4 px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer hover:opacity-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Buka Kartu Mahasiswa (KTM)</span>
          </button>
        </div>
      </div>

      {/* Profil Kampus & Identitas Institusi (Tahap 8) */}
      <div className="rounded-2xl p-4 bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
              {branding.logo ? (
                <img src={branding.logo} alt={branding.appName} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 leading-snug">
                {branding.appName}
              </h3>
              <p className="text-[10px] text-slate-500">{branding.name}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {branding.status || 'Aktif'}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-start justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1 shrink-0">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Alamat Kampus</span>
            </span>
            <span className="text-slate-800 font-medium text-right max-w-[220px] text-[11px] leading-snug">
              {branding.address}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1 shrink-0">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Kontak & Hotline</span>
            </span>
            <span className="text-slate-800 font-mono text-[11px] text-right truncate max-w-[220px]">
              {branding.contact}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500">Warna Branding Kampus</span>
            <div className="flex items-center gap-1.5">
              <span 
                className="w-4 h-4 rounded-full border border-white shadow-xs inline-block" 
                style={{ backgroundColor: branding.primaryColor }}
                title="Warna Utama"
              />
              <span 
                className="w-4 h-4 rounded-full border border-white shadow-xs inline-block" 
                style={{ backgroundColor: branding.secondaryColor }}
                title="Warna Sekunder"
              />
              <span className="text-[10px] font-mono text-slate-500">
                {branding.primaryColor} / {branding.secondaryColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Academic Progress Banner */}
      <div className="rounded-2xl p-4 bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Progres Kelulusan Studi
          </h3>
          <span className="text-xs text-indigo-600 font-mono font-bold">
            {Math.round((student.totalSks / student.targetSks) * 100)}% Selesai
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(student.totalSks / student.targetSks) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Semester</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{student.semester} / 8</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">SKS Lulus</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{student.totalSks} SKS</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">IPK Terakhir</span>
            <span className="font-bold text-emerald-600 mt-0.5 block font-mono">{student.ipk.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 3. Biodata & Personal Information */}
      <div className="rounded-2xl p-4 bg-white border border-slate-200/90 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Data Akademik & Kemahasiswaan
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Fakultas</span>
            <span className="text-slate-800 font-medium text-right max-w-[200px] truncate">
              {student.faculty}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Tahun Masuk / Angkatan</span>
            <span className="text-slate-800 font-medium">{student.academicYear}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Status Pembayaran UKT</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {student.uktStatus}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Email Resmi Kampus</span>
            <span className="text-slate-800 font-mono text-[11px] truncate max-w-[200px]">
              {student.email}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-500">Nomor WhatsApp Aktif</span>
            <span className="text-slate-800 font-mono">{student.phone}</span>
          </div>
        </div>
      </div>

      {/* 4. Dosen Pembimbing Akademik (DPA) */}
      <div className="rounded-2xl p-4 bg-white border border-slate-200/90 shadow-sm space-y-2.5">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Dosen Pembimbing Akademik (DPA)
        </h3>
        
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {student.academicAdvisor.name}
            </p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              NIP: {student.academicAdvisor.nip}
            </p>
            <p className="text-[11px] text-indigo-600 mt-1">
              {student.academicAdvisor.email}
            </p>
          </div>

          <button
            onClick={() => showToast(`Membuka ruang konsultasi bimbingan akademik dengan ${student.academicAdvisor.name}.`, 'info')}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shrink-0 shadow-sm"
          >
            Konsultasi
          </button>
        </div>
      </div>

      {/* 5. Menu Akun & Keamanan */}
      <div className="rounded-2xl p-2 bg-white border border-slate-200/90 shadow-sm space-y-1">
        {[
          {
            label: 'Kartu Rencana & Hasil Studi',
            icon: BookOpen,
            action: () => onNavigateToAcademic('krs'),
          },
          {
            label: 'Pengaturan Akun & Sandi',
            icon: Settings,
            action: () => showToast('Pengaturan Akun: Anda dapat memperbarui kata sandi dan email cadangan di menu profil.', 'info'),
          },
          {
            label: 'Keamanan & Autentikasi Kampus',
            icon: ShieldCheck,
            action: () => showToast('Keamanan Akun: Akun Anda telah terproteksi dengan 2-Factor Authentication Kampus.', 'success'),
          },
          ...(onOpenAdminPortal
            ? [
                {
                  label: 'Masuk ke Portal Administrator',
                  icon: ShieldCheck,
                  action: onOpenAdminPortal,
                },
              ]
            : []),
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.action}
              className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3 font-medium">
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          );
        })}

        <button
          onClick={onLogout}
          className="w-full p-3 rounded-xl hover:bg-rose-50 text-xs text-rose-600 flex items-center justify-between transition-colors pt-2 border-t border-slate-100"
        >
          <div className="flex items-center gap-3 font-bold">
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Aplikasi</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>
    </div>
  );
};
