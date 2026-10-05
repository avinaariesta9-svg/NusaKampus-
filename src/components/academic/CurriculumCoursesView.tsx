import React, { useState } from 'react';
import { BookOpen, Search, ChevronRight, X, User, Layers, CheckCircle2, Clock } from 'lucide-react';
import { CurriculumCourse } from '../../types';
import { MOCK_CURRICULUM_COURSES } from '../../data/mockData';

export const CurriculumCoursesView: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CurriculumCourse | null>(null);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const filteredCourses = MOCK_CURRICULUM_COURSES.filter((course) => {
    const matchSemester = selectedSemester === 'all' || course.semester === selectedSemester;
    const matchSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSemester && matchSearch;
  });

  const getStatusBadge = (status: CurriculumCourse['status']) => {
    switch (status) {
      case 'Sudah Diambil':
        return <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium"><CheckCircle2 className="w-3 h-3" /> Selesai</span>;
      case 'Sedang Berjalan':
        return <span className="text-[10px] text-cyan-400 flex items-center gap-1 font-medium"><Clock className="w-3 h-3" /> Sedang Ditempuh</span>;
      default:
        return <span className="text-[10px] text-slate-500 font-medium">Belum Diambil</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari kurikulum, kode matkul, atau dosen..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Hapus
          </button>
        )}
      </div>

      {/* Semester Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSelectedSemester('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            selectedSemester === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Semua Semester
        </button>
        {semesters.map((sem) => (
          <button
            key={sem}
            onClick={() => setSelectedSemester(sem)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              selectedSemester === sem
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Sem {sem}
          </button>
        ))}
      </div>

      {/* Summary Row */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Menampilkan {filteredCourses.length} Mata Kuliah</span>
        <span className="font-mono text-cyan-400">Kurikulum MBKM 2024</span>
      </div>

      {/* Course List */}
      <div className="space-y-3">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-2.5 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono">
                  <span>{course.code}</span>
                  <span>·</span>
                  <span>Semester {course.semester}</span>
                  <span>·</span>
                  <span>{course.category}</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mt-0.5">
                  {course.name}
                </h4>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold shrink-0">
                {course.sks} SKS
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {course.description}
            </p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 truncate pr-2">
                <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{course.lecturer}</span>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                {getStatusBadge(course.status)}
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedCourse(null)}
          />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
                  <span>{selectedCourse.code}</span>
                  <span>·</span>
                  <span>Semester {selectedCourse.semester}</span>
                  <span>·</span>
                  <span className="text-indigo-300 font-bold">{selectedCourse.sks} SKS</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1 leading-snug">
                  {selectedCourse.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{selectedCourse.category}</p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300">Deskripsi Mata Kuliah</span>
              <p className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {selectedCourse.description}
              </p>
            </div>

            {/* Prerequisite */}
            {selectedCourse.prerequisite && (
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                <span className="font-semibold text-white">Prasyarat: </span>
                {selectedCourse.prerequisite}
              </div>
            )}

            {/* Lecturer Info */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Dosen Pengampu Utama</span>
              <span className="font-semibold text-white">{selectedCourse.lecturer}</span>
            </div>

            {/* Syllabus Topics */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Silabus & Topik Pembelajaran (16 Pekan)
              </span>
              <div className="space-y-1.5">
                {selectedCourse.syllabus.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-300"
                  >
                    <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center font-mono text-[10px] text-cyan-400 font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedCourse(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Tutup Rincian Matkul
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
