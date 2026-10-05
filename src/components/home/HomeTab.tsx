/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  QrCode, 
  CalendarDays, 
  FileCheck2, 
  Award, 
  ClipboardList, 
  CreditCard, 
  Library, 
  MessageSquare, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  Download,
  AlertCircle,
  Bell,
  GraduationCap,
  Bot
} from 'lucide-react';
import { 
  StudentProfile, 
  ScheduleItem, 
  AssignmentItem, 
  AnnouncementItem, 
  NewsEventItem,
  ExamItem,
  MediaSlide,
  AcademicSubTab,
  AnnouncementSubTab
} from '../../types';
import { MOCK_TUITION_BILL, INITIAL_MEDIA_SLIDES } from '../../data/mockData';
import { useToast } from '../common/ToastContext';
import { MediaSlider } from './MediaSlider';

interface HomeTabProps {
  student: StudentProfile;
  schedules: ScheduleItem[];
  assignments: AssignmentItem[];
  announcements: AnnouncementItem[];
  newsEvents: NewsEventItem[];
  exams?: ExamItem[];
  mediaSlides?: MediaSlide[];
  onNavigateToAcademic: (subtab: AcademicSubTab) => void;
  onNavigateToAnnouncement: (subtab: AnnouncementSubTab) => void;
  onOpenKtmModal: () => void;
  onOpenAttendanceModal: () => void;
  onOpenNotifications?: () => void;
  onOpenNusaAI?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  student,
  schedules,
  assignments,
  announcements,
  newsEvents,
  exams = [],
  mediaSlides = INITIAL_MEDIA_SLIDES,
  onNavigateToAcademic,
  onNavigateToAnnouncement,
  onOpenKtmModal,
  onOpenAttendanceModal,
  onOpenNotifications,
  onOpenNusaAI,
}) => {
  const { showToast } = useToast();
  
  // Find current day's or next lecture
  const upcomingLecture = schedules[0];
  const pendingAssignments = assignments.filter((a) => a.status === 'Belum Selesai');
  const upcomingExam = exams[0] || {
    id: 'ex-1',
    courseCode: 'IF3201',
    courseName: 'Kecerdasan Buatan & Machine Learning',
    type: 'UTS',
    date: '19 Okt 2026',
    time: '08:00 - 10:30 WIB',
    room: 'Lab AI 302',
    seatNumber: 'B-14',
    status: 'Akan Datang',
  };
  const highlightedAnnouncement = announcements[0];
  const highlightedEvent = newsEvents[0];

  // Dynamic Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const quickActions = [
    {
      id: 'jadwal',
      label: 'Jadwal Kuliah',
      subtext: 'Hari ini & Pekan ini',
      icon: CalendarDays,
      color: 'from-blue-600 to-indigo-600',
      action: () => onNavigateToAcademic('jadwal'),
    },
    {
      id: 'krs',
      label: 'KRS Online',
      subtext: 'Rencana Studi',
      icon: FileCheck2,
      color: 'from-indigo-600 to-violet-600',
      action: () => onNavigateToAcademic('krs'),
    },
    {
      id: 'khs',
      label: 'KHS & Nilai',
      subtext: 'IPK 3.86 (114 SKS)',
      icon: Award,
      color: 'from-emerald-600 to-teal-600',
      action: () => onNavigateToAcademic('khs'),
    },
    {
      id: 'tugas',
      label: 'Tugas & Ujian',
      subtext: `${pendingAssignments.length} tugas aktif`,
      icon: ClipboardList,
      color: 'from-amber-500 to-orange-600',
      action: () => onNavigateToAcademic('tugas'),
    },
    {
      id: 'presensi',
      label: 'Presensi QR',
      subtext: 'Check-in Ruang Kelas',
      icon: QrCode,
      color: 'from-purple-600 to-pink-600',
      action: onOpenAttendanceModal,
    },
    {
      id: 'ktm',
      label: 'KTM Digital',
      subtext: 'Akses Lab & Gedung',
      icon: CreditCard,
      color: 'from-cyan-600 to-blue-600',
      action: onOpenKtmModal,
    },
    {
      id: 'library',
      label: 'E-Library',
      subtext: 'Jurnal & Repositori',
      icon: Library,
      color: 'from-slate-700 to-slate-800',
      action: () => showToast('E-Library Kampus: Akses ke 25.000+ e-book & jurnal IEEE aktif.', 'info'),
    },
    {
      id: 'konsul',
      label: 'Bimbingan PA',
      subtext: 'Prof. Budi Santoso',
      icon: MessageSquare,
      color: 'from-violet-600 to-purple-600',
      action: () => showToast(`Konsultasi Dosen PA: Hubungi ${student.academicAdvisor.name} via portal bimbingan.`, 'info'),
    },
  ];

  return (
    <div className="pb-24 pt-3 px-4 max-w-lg mx-auto space-y-5">
      {/* 1. Header Profil Mahasiswa & Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-5 shadow-sm">
        <div className="flex items-start justify-between relative z-10 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getGreeting()}, Mahasiswa</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
              {student.name}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium pt-0.5">
              <span className="font-mono text-indigo-600 font-bold">{student.nim}</span>
              <span>·</span>
              <span>Semester {student.semester}</span>
              <span>·</span>
              <span className="truncate">{student.major}</span>
            </div>
          </div>

          {/* Quick KTM Digital Trigger Button */}
          <button 
            onClick={onOpenKtmModal}
            className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 active:scale-95 transition-all shadow-sm shrink-0"
            title="Buka Kartu Tanda Mahasiswa (KTM)"
          >
            <QrCode className="w-6 h-6" />
          </button>
        </div>

        {/* 2. Ringkasan IP/IPK (Academic Metric Highlights) */}
        <div className="grid grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-100">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">IPK Kumulatif</span>
            <span className="text-lg font-black text-slate-900 font-mono">{student.ipk.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Sangat Memuaskan</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total SKS</span>
            <span className="text-lg font-black text-slate-900 font-mono">{student.totalSks} <span className="text-xs text-slate-400 font-normal">/ {student.targetSks}</span></span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-full rounded-full" 
                style={{ width: `${(student.totalSks / student.targetSks) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Status Akademik</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {student.status}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">UKT: {student.uktStatus}</span>
          </div>
        </div>
      </div>

      {/* 2.5. NusaAI Assistant Card & Smart Summary ("Ringkasan Hari Ini") */}
      <section className="rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-white p-4 sm:p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          {/* AI Header Card */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center text-cyan-300 shadow-inner">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black tracking-tight text-white">NusaAI</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-indigo-200 font-medium">
                  "Punya pertanyaan tentang kampus?"
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenNusaAI}
              className="px-3 py-1.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <span>Tanya NusaAI</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
            </button>
          </div>

          {/* Smart Summary: Ringkasan Hari Ini */}
          <div className="pt-3 border-t border-white/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                Ringkasan Hari Ini
              </span>
              <span className="text-[10px] text-indigo-200 font-mono">
                Update Otomatis
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div 
                onClick={() => onNavigateToAcademic('jadwal')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer flex items-center gap-2"
                title="Buka Jadwal Kuliah"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="text-[11px] text-white truncate">
                  <strong>2</strong> jadwal kuliah
                </span>
              </div>

              <div 
                onClick={() => onNavigateToAcademic('tugas')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer flex items-center gap-2"
                title="Buka Daftar Tugas"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-[11px] text-white truncate">
                  <strong>{pendingAssignments.length}</strong> tugas mendekati deadline
                </span>
              </div>

              <div 
                onClick={() => onNavigateToAnnouncement('pengumuman')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer flex items-center gap-2"
                title="Buka Pengumuman"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-[11px] text-white truncate">
                  <strong>1</strong> pengumuman baru
                </span>
              </div>

              <div 
                onClick={() => onNavigateToAcademic('ujian')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer flex items-center gap-2"
                title="Buka Jadwal Ujian"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span className="text-[11px] text-white truncate">
                  <strong>1</strong> jadwal ujian mendatang
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MEDIA SLIDER DI TENGAH HOME (Setelah Ringkasan, Sebelum Menu Akademik) */}
      <MediaSlider slides={mediaSlides} />

      {/* 4. Menu Akademik (Layanan Terpadu Mahasiswa) */}
      <section>
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Layanan Terpadu Mahasiswa
          </h2>
          <span className="text-xs text-slate-400">8 Menu Cepat</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="group flex flex-col items-center text-center p-2.5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400 shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform mb-1.5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 line-clamp-1">
                  {item.label}
                </span>
                <span className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                  {item.subtext}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Jadwal Kuliah Hari Ini (Next Class Widget) */}
      {upcomingLecture && (
        <section className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Jadwal Kuliah Hari Ini
              </span>
            </div>
            <button
              onClick={() => onNavigateToAcademic('jadwal')}
              className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-0.5 font-semibold transition-colors"
            >
              <span>Semua Jadwal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {upcomingLecture.courseName}
              </h3>
              <span className="text-xs font-mono font-bold text-indigo-600 shrink-0 ml-2">
                {upcomingLecture.sks} SKS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dosen: {upcomingLecture.lecturer}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2.5 pt-2.5 border-t border-slate-200/80">
              <div className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>{upcomingLecture.timeStart} - {upcomingLecture.timeEnd} WIB</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{upcomingLecture.room}</span>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={onOpenAttendanceModal}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <QrCode className="w-4 h-4" />
                <span>Presensi Kehadiran ({upcomingLecture.attendancePercent}%)</span>
              </button>
              {upcomingLecture.zoomLink && (
                <a
                  href={upcomingLecture.zoomLink}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  Link Kuliah
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 6. Presensi Kehadiran Widget */}
      <section className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-purple-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Status Presensi Kehadiran
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
            94.2% Memenuhi Syarat Ujian
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-900">
              Scan Presensi Langsung di Kelas
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Presensi otomatis tercatat pada SIAKAD dalam radius 25 meter ruang kuliah.
            </p>
          </div>
          <button
            onClick={onOpenAttendanceModal}
            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR</span>
          </button>
        </div>
      </section>

      {/* 7. Tugas Terdekat & Ujian Terdekat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Tugas Terdekat */}
        <section className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Tugas Terdekat
                </h3>
              </div>
              <button
                onClick={() => onNavigateToAcademic('tugas')}
                className="text-[11px] text-indigo-600 font-bold hover:underline"
              >
                Semua ({assignments.length})
              </button>
            </div>

            {pendingAssignments.length > 0 ? (
              <div 
                onClick={() => onNavigateToAcademic('tugas')}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 cursor-pointer transition-all space-y-1"
              >
                <p className="text-xs font-bold text-slate-900 line-clamp-1">
                  {pendingAssignments[0].title}
                </p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">{pendingAssignments[0].courseCode}</span>
                  <span className="text-amber-600 font-bold">
                    Sisa {pendingAssignments[0].daysRemaining} hari
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">
                Semua tugas telah diserahkan.
              </p>
            )}
          </div>
        </section>

        {/* Ujian Terdekat */}
        <section className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-cyan-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Ujian Terdekat
                </h3>
              </div>
              <button
                onClick={() => onNavigateToAcademic('ujian')}
                className="text-[11px] text-indigo-600 font-bold hover:underline"
              >
                Jadwal Ujian
              </button>
            </div>

            <div 
              onClick={() => onNavigateToAcademic('ujian')}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 truncate max-w-[140px]">
                  {upcomingExam.courseName}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-700 text-[10px] font-bold">
                  {upcomingExam.type}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{upcomingExam.date}</span>
                <span className="font-mono text-indigo-600 font-semibold">Kursi {upcomingExam.seatNumber}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 8. Tagihan / UKT (Status Pembayaran Kuliah) */}
      <section className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Tagihan & Pembayaran UKT
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
            ● Status: {MOCK_TUITION_BILL.status}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {MOCK_TUITION_BILL.semester}
            </span>
            <span className="text-base font-black text-slate-900 font-mono">
              {MOCK_TUITION_BILL.formattedAmount}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Lunas pada {MOCK_TUITION_BILL.paidAt}
            </p>
          </div>

          <button
            onClick={() => showToast(`Kwitansi Pembayaran #${MOCK_TUITION_BILL.receiptNumber} berhasil diunduh.`, 'success')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors shadow-sm self-start sm:self-center"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Kwitansi UKT</span>
          </button>
        </div>
      </section>

      {/* 9. Pengumuman & Berita Kampus */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Kabar & Pengumuman Kampus
          </h2>
          <button
            onClick={() => onNavigateToAnnouncement('pengumuman')}
            className="text-xs text-indigo-600 hover:text-indigo-500 font-semibold"
          >
            Jelajahi Semua
          </button>
        </div>

        {/* Highlight Announcement */}
        {highlightedAnnouncement && (
          <div
            onClick={() => onNavigateToAnnouncement('pengumuman')}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2"
          >
            <div className="flex items-center gap-2 text-[11px] text-indigo-600 font-semibold">
              <span className="px-2 py-0.5 rounded bg-indigo-50 font-bold">{highlightedAnnouncement.category}</span>
              <span>·</span>
              <span>{highlightedAnnouncement.date}</span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
              {highlightedAnnouncement.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {highlightedAnnouncement.excerpt}
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate max-w-[200px]">{highlightedAnnouncement.sender}</span>
              <span className="text-indigo-600 flex items-center gap-0.5 font-bold">
                Baca Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}

        {/* Event Card */}
        {highlightedEvent && (
          <div
            onClick={() => onNavigateToAnnouncement('berita')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400 shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center gap-3.5"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
              <img
                src={highlightedEvent.image}
                alt={highlightedEvent.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-bold">
                <Calendar className="w-3 h-3" />
                <span>{highlightedEvent.date}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5">
                {highlightedEvent.title}
              </h4>
              <p className="text-[11px] text-slate-400 truncate mt-1">
                {highlightedEvent.location}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 10. Quick Notification Shortcut */}
      {onOpenNotifications && (
        <section 
          onClick={onOpenNotifications}
          className="rounded-2xl bg-white border border-slate-200/90 p-3.5 shadow-sm flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Pusat Pemberitahuan Kampus</p>
              <p className="text-[11px] text-slate-500">Cek pengingat jadwal, nilai baru, dan batas waktu KRS.</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </section>
      )}
    </div>
  );
};
