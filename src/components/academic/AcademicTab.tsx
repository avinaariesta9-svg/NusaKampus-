/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CalendarDays, 
  BookOpen, 
  Users, 
  FileCheck2, 
  Award, 
  FileSpreadsheet, 
  TrendingUp, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Download, 
  FileText, 
  Upload, 
  Calendar, 
  QrCode,
  CheckSquare,
  Sparkles,
  X
} from 'lucide-react';
import { 
  AcademicSubTab, 
  ScheduleItem, 
  CourseOffering, 
  KHSSemesterReport, 
  AssignmentItem, 
  ExamItem 
} from '../../types';
import { useToast } from '../common/ToastContext';
import { CurriculumCoursesView } from './CurriculumCoursesView';
import { LecturerDirectoryView } from './LecturerDirectoryView';
import { GradeDetailView } from './GradeDetailView';
import { GPAAnalyticsView } from './GPAAnalyticsView';
import { AttendanceTrackerView } from './AttendanceTrackerView';
import { ExamScheduleView } from './ExamScheduleView';
import { AcademicCalendarView } from './AcademicCalendarView';

interface AcademicTabProps {
  initialSubTab?: AcademicSubTab;
  schedules: ScheduleItem[];
  courseOfferings: CourseOffering[];
  onToggleCourse: (courseId: string) => void;
  khsHistory: KHSSemesterReport[];
  assignments: AssignmentItem[];
  onSubmitAssignment: (assignmentId: string, fileName: string) => void;
  exams: ExamItem[];
  onOpenAttendanceScan?: () => void;
}

export const AcademicTab: React.FC<AcademicTabProps> = ({
  initialSubTab = 'jadwal',
  schedules,
  courseOfferings,
  onToggleCourse,
  khsHistory,
  assignments,
  onSubmitAssignment,
  exams,
  onOpenAttendanceScan = () => {},
}) => {
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<AcademicSubTab>(initialSubTab);

  // Jadwal sub-state
  const [selectedDay, setSelectedDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>('Senin');

  // KHS sub-state
  const [selectedSemester, setSelectedSemester] = useState<number>(5);

  // Tugas sub-state
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'submitted'>('all');
  const [activeSubmitModal, setActiveSubmitModal] = useState<AssignmentItem | null>(null);
  const [mockFileName, setMockFileName] = useState('');

  // KRS metrics calculation
  const selectedCourses = courseOfferings.filter((c) => c.isSelected);
  const totalSelectedSks = selectedCourses.reduce((sum, c) => sum + c.sks, 0);
  const maxSksAllowed = 24;

  // Filtered schedules for selected day
  const filteredSchedules = schedules.filter((s) => s.day === selectedDay);

  // Current KHS report
  const currentKhs = khsHistory.find((k) => k.semester === selectedSemester) || khsHistory[0];

  // Filtered assignments
  const filteredAssignments = assignments.filter((a) => {
    if (taskFilter === 'pending') return a.status === 'Belum Selesai';
    if (taskFilter === 'submitted') return a.status !== 'Belum Selesai';
    return true;
  });

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmitModal || !mockFileName.trim()) return;
    onSubmitAssignment(activeSubmitModal.id, mockFileName.trim());
    showToast(`Tugas "${activeSubmitModal.title}" berhasil diunggah.`, 'success');
    setActiveSubmitModal(null);
    setMockFileName('');
  };

  const academicModules: Array<{
    id: AcademicSubTab;
    label: string;
    icon: React.ElementType;
  }> = [
    { id: 'jadwal', label: 'Jadwal', icon: CalendarDays },
    { id: 'krs', label: 'KRS Online', icon: FileCheck2 },
    { id: 'khs', label: 'KHS', icon: Award },
    { id: 'nilai', label: 'Nilai', icon: FileSpreadsheet },
    { id: 'ipk', label: 'IP / IPK', icon: TrendingUp },
    { id: 'presensi', label: 'Presensi', icon: CheckSquare },
    { id: 'ujian', label: 'Jadwal Ujian', icon: Calendar },
    { id: 'matakuliah', label: 'Mata Kuliah', icon: BookOpen },
    { id: 'dosen', label: 'Dosen', icon: Users },
    { id: 'tugas', label: 'Tugas', icon: FileText },
    { id: 'kalender', label: 'Kalender', icon: CalendarDays },
  ];

  return (
    <div className="pb-28 pt-3 px-4 max-w-lg mx-auto space-y-4">
      {/* 1. Academic Horizontal Scroll Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {academicModules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeSubTab === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveSubTab(mod.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{mod.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. JADWAL KULIAH                                                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'jadwal' && (
        <div className="space-y-4">
          {/* Day Selector Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const).map((day) => {
              const count = schedules.filter((s) => s.day === day).length;
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold block">{day}</span>
                  <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {count} Matkul
                  </span>
                </button>
              );
            })}
          </div>

          {/* Schedule Summary Banner */}
          <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between text-xs text-slate-700">
            <span className="font-semibold">Perkuliahan Hari {selectedDay}</span>
            <span className="font-mono text-indigo-600 font-bold">
              {filteredSchedules.reduce((acc, c) => acc + c.sks, 0)} Total SKS
            </span>
          </div>

          {/* Schedule List */}
          {filteredSchedules.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 shadow-sm">
              <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">Tidak ada jadwal kuliah hari ini</p>
              <p className="text-xs text-slate-400 mt-1">Gunakan waktu ini untuk riset mandiri atau belajar kelompok.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSchedules.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl p-4 bg-white border border-slate-200/90 hover:border-indigo-400 shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-indigo-600 font-mono font-bold">
                        <span>{item.courseCode}</span>
                        <span>·</span>
                        <span>{item.type}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                        {item.courseName}
                      </h3>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-xs font-bold shrink-0 border border-indigo-200">
                      {item.sks} SKS
                    </div>
                  </div>

                  {/* Lecturer */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.lecturer}</span>
                  </div>

                  {/* Location & Time */}
                  <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{item.timeStart} - {item.timeEnd} WIB</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{item.room}</span>
                    </div>
                  </div>

                  {/* Attendance Bar */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400 font-medium">Presensi Kehadiran</span>
                      <span className="text-emerald-600 font-mono font-bold">{item.attendancePercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${item.attendancePercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. KRS (KARTU RENCANA STUDI)                                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'krs' && (
        <div className="space-y-4">
          {/* SKS Budget Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs text-slate-500 font-medium">Beban SKS Semester 6</span>
                <h3 className="text-lg font-black text-slate-900 font-mono">
                  {totalSelectedSks} <span className="text-sm text-slate-400 font-normal">/ {maxSksAllowed} SKS Maksimal</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold block">Persetujuan DPA</span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  totalSelectedSks > maxSksAllowed ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-600 to-cyan-500'
                }`}
                style={{ width: `${Math.min(100, (totalSelectedSks / maxSksAllowed) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Sisa kuota pengambilan: {Math.max(0, maxSksAllowed - totalSelectedSks)} SKS lagi.
            </p>
          </div>

          {/* Action Header */}
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Daftar Paket & Pilihan Matkul ({courseOfferings.length})
            </h3>
            <button
              onClick={() => showToast('Cetak KRS Digital: Berkas PDF Rencana Studi Semester 6 berhasil diunduh.', 'success')}
              className="text-xs text-indigo-600 hover:text-indigo-500 flex items-center gap-1 font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Cetak KRS</span>
            </button>
          </div>

          {/* Course Offering List */}
          <div className="space-y-3">
            {courseOfferings.map((course) => (
              <div
                key={course.id}
                className={`p-4 rounded-2xl border transition-all ${
                  course.isSelected
                    ? 'bg-white border-indigo-400 shadow-sm'
                    : 'bg-white border-slate-200/80 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <span className="text-indigo-600 font-bold">{course.code}</span>
                      <span>·</span>
                      <span>{course.category}</span>
                      <span>·</span>
                      <span>{course.sks} SKS</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {course.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{course.lecturer}</p>
                    <p className="text-[11px] text-indigo-600 font-medium mt-1">
                      {course.schedule} ({course.room})
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleCourse(course.id)}
                    className={`p-2 rounded-xl transition-colors shrink-0 ${
                      course.isSelected
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    }`}
                    title={course.isSelected ? 'Batalkan Matkul' : 'Pilih Matkul Ini'}
                  >
                    {course.isSelected ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Kapasitas Kelas: {course.enrolled} / {course.quota}</span>
                  <span className={course.enrolled >= course.quota ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                    {course.enrolled >= course.quota ? 'Penuh' : 'Tersedia'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. KHS (KARTU HASIL STUDI)                                                */}
      {/* ========================================================================= */}
      {activeSubTab === 'khs' && (
        <div className="space-y-4">
          {/* Semester Selector Bar */}
          <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-sm">
            <span className="text-xs text-slate-600 font-semibold pl-2">Pilih Semester:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {khsHistory.map((rep) => (
                <button
                  key={rep.semester}
                  onClick={() => setSelectedSemester(rep.semester)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    selectedSemester === rep.semester
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sem {rep.semester}
                </button>
              ))}
            </div>
          </div>

          {/* Academic Semester Summary Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Indeks Prestasi Semester (IPS)</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                {currentKhs.ips.toFixed(2)}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">Predikat: Pujian (Cumlaude)</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">IPK Akumulatif</span>
              <span className="text-2xl font-black text-indigo-600 font-mono mt-1 block">
                {currentKhs.ipk.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Total {currentKhs.sksTotal} SKS Lulus
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between text-xs px-0.5">
            <span className="font-bold text-slate-800 uppercase tracking-wide">
              Daftar Nilai Semester {currentKhs.semester} ({currentKhs.academicYear})
            </span>
            <button
              onClick={() => showToast(`Transkrip KHS Semester ${currentKhs.semester} berhasil diunduh.`, 'success')}
              className="text-indigo-600 hover:text-indigo-500 flex items-center gap-1 font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh KHS</span>
            </button>
          </div>

          {/* Grade Table / Cards */}
          <div className="space-y-2.5">
            {currentKhs.courses.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span className="font-bold text-indigo-600">{item.courseCode}</span>
                    <span>·</span>
                    <span>{item.sks} SKS</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {item.courseName}
                  </h4>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Skor: {item.score} / 100 · Bobot: {item.gradePoint.toFixed(2)}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold font-mono text-base text-indigo-700">
                    {item.grade}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. NILAI DETAIL                                                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'nilai' && <GradeDetailView />}

      {/* ========================================================================= */}
      {/* 5. IP / IPK ANALYTICS                                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'ipk' && <GPAAnalyticsView />}

      {/* ========================================================================= */}
      {/* 6. PRESENSI                                                               */}
      {/* ========================================================================= */}
      {activeSubTab === 'presensi' && (
        <AttendanceTrackerView onOpenAttendanceScan={onOpenAttendanceScan} />
      )}

      {/* ========================================================================= */}
      {/* 7. JADWAL UJIAN                                                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'ujian' && <ExamScheduleView />}

      {/* ========================================================================= */}
      {/* 8. MATA KULIAH KURIKULUM                                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'matakuliah' && <CurriculumCoursesView />}

      {/* ========================================================================= */}
      {/* 9. DIREKTORI DOSEN                                                        */}
      {/* ========================================================================= */}
      {activeSubTab === 'dosen' && <LecturerDirectoryView />}

      {/* ========================================================================= */}
      {/* 10. TUGAS KULIAH & PROYEK                                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'tugas' && (
        <div className="space-y-4">
          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Semua Tugas' },
              { id: 'pending', label: 'Belum Selesai' },
              { id: 'submitted', label: 'Selesai / Dinilai' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTaskFilter(f.id as any)}
                className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
                  taskFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredAssignments.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl p-4 bg-white border border-slate-200/90 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-indigo-600 font-mono font-bold">
                      <span>{task.courseCode}</span>
                      <span>·</span>
                      <span className="truncate">{task.courseName}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {task.title}
                    </h4>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg shrink-0 ${
                      task.status === 'Belum Selesai'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : task.status === 'Dinilai'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {task.description}
                </p>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Batas: {task.dueDate} · {task.dueTime}</span>
                  </div>

                  {task.grade !== undefined && (
                    <span className="font-mono font-bold text-emerald-600">
                      Nilai: {task.grade} / 100
                    </span>
                  )}
                </div>

                {/* Submission Action */}
                <div className="pt-2">
                  {task.status === 'Belum Selesai' ? (
                    <button
                      onClick={() => setActiveSubmitModal(task)}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Kumpulkan Berkas Tugas</span>
                    </button>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate font-medium">{task.submittedFile}</span>
                      </div>
                      <span className="text-slate-400 shrink-0">{task.submittedAt}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. KALENDER AKADEMIK                                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'kalender' && <AcademicCalendarView />}

      {/* SUBMISSION MODAL */}
      {activeSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setActiveSubmitModal(null)}
          />
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Kumpulkan Tugas</h3>
                <p className="text-xs text-slate-500 mt-0.5">{activeSubmitModal.title}</p>
              </div>
              <button
                onClick={() => setActiveSubmitModal(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Dokumen / Link Repository Tugas
                </label>
                <input
                  type="text"
                  value={mockFileName}
                  onChange={(e) => setMockFileName(e.target.value)}
                  placeholder="Contoh: Tugas_MachineLearning_AryaPratama.zip"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
                <Upload className="w-6 h-6 text-indigo-600 mx-auto mb-1.5" />
                <p className="text-xs text-slate-700 font-semibold">Simulasi Upload File Mahasiswa</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Format didukung: PDF, ZIP, RAR (Maks 50MB)</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubmitModal(null)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Kirim Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
