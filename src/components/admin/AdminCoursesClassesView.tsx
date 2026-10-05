/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  Clock, 
  MapPin, 
  X, 
  CheckCircle2 
} from 'lucide-react';
import { AdminCourse, AdminClass } from '../../types/admin';
import { useToast } from '../common/ToastContext';

interface AdminCoursesClassesViewProps {
  initialSubTab?: 'courses' | 'classes';
  courses: AdminCourse[];
  classes: AdminClass[];
  onAddCourse: (c: AdminCourse) => void;
  onEditCourse: (c: AdminCourse) => void;
  onDeleteCourse: (id: string) => void;
  onAddClass: (cls: AdminClass) => void;
  onEditClass: (cls: AdminClass) => void;
  onDeleteClass: (id: string) => void;
  externalSearchQuery?: string;
}

export const AdminCoursesClassesView: React.FC<AdminCoursesClassesViewProps> = ({
  initialSubTab = 'courses',
  courses,
  classes,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onAddClass,
  onEditClass,
  onDeleteClass,
  externalSearchQuery = '',
}) => {
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'classes'>(initialSubTab);
  const [search, setSearch] = useState('');

  // Course Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null);
  const [courseFormData, setCourseFormData] = useState<Partial<AdminCourse>>({
    code: '',
    name: '',
    sks: 3,
    semester: 6,
    prodi: 'Teknik Informatika',
    category: 'Wajib',
    lecturer: 'Dr. Eng. Dian Wahyuni, M.Cs.',
  });

  // Class Modal State
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<AdminClass | null>(null);
  const [classFormData, setClassFormData] = useState<Partial<AdminClass>>({
    courseCode: 'IF3201',
    courseName: 'Kecerdasan Buatan & Machine Learning',
    section: 'Kelas C',
    sks: 3,
    lecturer: 'Dr. Eng. Dian Wahyuni, M.Cs.',
    room: 'Lab AI 302',
    scheduleDay: 'Senin',
    scheduleTime: '08:00 - 10:30 WIB',
    quota: 40,
    enrolled: 0,
    semester: 6,
    prodi: 'Teknik Informatika',
  });

  const query = (externalSearchQuery || search).toLowerCase();

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query) ||
      c.lecturer.toLowerCase().includes(query)
  );

  const filteredClasses = classes.filter(
    (cls) =>
      cls.courseName.toLowerCase().includes(query) ||
      cls.courseCode.toLowerCase().includes(query) ||
      cls.section.toLowerCase().includes(query) ||
      cls.lecturer.toLowerCase().includes(query)
  );

  /* Course Handlers */
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseFormData({
      code: `IF${Math.floor(2000 + Math.random() * 2000)}`,
      name: '',
      sks: 3,
      semester: 6,
      prodi: 'Teknik Informatika',
      category: 'Wajib',
      lecturer: 'Dr. Eng. Dian Wahyuni, M.Cs.',
    });
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (c: AdminCourse) => {
    setEditingCourse(c);
    setCourseFormData({ ...c });
    setIsCourseModalOpen(true);
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormData.code || !courseFormData.name) {
      showToast('Kode dan Nama Mata Kuliah wajib diisi!', 'warning');
      return;
    }

    if (editingCourse) {
      onEditCourse({ ...editingCourse, ...courseFormData } as AdminCourse);
      showToast(`Mata Kuliah ${courseFormData.name} diperbarui.`, 'success');
    } else {
      const newCourse: AdminCourse = {
        id: `crs-${Date.now()}`,
        code: courseFormData.code || '',
        name: courseFormData.name || '',
        sks: Number(courseFormData.sks) || 3,
        semester: Number(courseFormData.semester) || 1,
        prodi: courseFormData.prodi || 'Teknik Informatika',
        category: (courseFormData.category as any) || 'Wajib',
        lecturer: courseFormData.lecturer || 'Belum Ditentukan',
      };
      onAddCourse(newCourse);
      showToast(`Mata Kuliah ${newCourse.name} berhasil ditambahkan!`, 'success');
    }

    setIsCourseModalOpen(false);
  };

  /* Class Handlers */
  const handleOpenAddClass = () => {
    setEditingClass(null);
    setClassFormData({
      courseCode: courses[0]?.code || 'IF3201',
      courseName: courses[0]?.name || 'Kecerdasan Buatan',
      section: 'Kelas A',
      sks: 3,
      lecturer: courses[0]?.lecturer || 'Dosen Pengampu',
      room: 'Ruang Teori 301',
      scheduleDay: 'Senin',
      scheduleTime: '08:00 - 10:30 WIB',
      quota: 40,
      enrolled: 0,
      semester: 6,
      prodi: 'Teknik Informatika',
    });
    setIsClassModalOpen(true);
  };

  const handleOpenEditClass = (cls: AdminClass) => {
    setEditingClass(cls);
    setClassFormData({ ...cls });
    setIsClassModalOpen(true);
  };

  const handleClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classFormData.courseName || !classFormData.section) {
      showToast('Nama Mata Kuliah dan Kelas wajib diisi!', 'warning');
      return;
    }

    if (editingClass) {
      onEditClass({ ...editingClass, ...classFormData } as AdminClass);
      showToast(`Kelas ${classFormData.section} diperbarui.`, 'success');
    } else {
      const newCls: AdminClass = {
        id: `cls-${Date.now()}`,
        courseCode: classFormData.courseCode || 'IF0000',
        courseName: classFormData.courseName || '',
        section: classFormData.section || 'Kelas A',
        sks: Number(classFormData.sks) || 3,
        lecturer: classFormData.lecturer || 'Dosen Pengampu',
        room: classFormData.room || 'Ruang Kuliah',
        scheduleDay: (classFormData.scheduleDay as any) || 'Senin',
        scheduleTime: classFormData.scheduleTime || '08:00 - 10:30 WIB',
        quota: Number(classFormData.quota) || 40,
        enrolled: Number(classFormData.enrolled) || 0,
        semester: Number(classFormData.semester) || 1,
        prodi: classFormData.prodi || 'Teknik Informatika',
      };
      onAddClass(newCls);
      showToast(`Kelas ${newCls.section} untuk ${newCls.courseName} berhasil dibuat!`, 'success');
    }

    setIsClassModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Sub-tab Navigation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('courses')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'courses'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mata Kuliah ({courses.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('classes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'classes'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kelas Perkuliahan ({classes.length})</span>
          </button>
        </div>

        <button
          onClick={activeSubTab === 'courses' ? handleOpenAddCourse : handleOpenAddClass}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{activeSubTab === 'courses' ? 'Tambah Mata Kuliah' : 'Tambah Kelas Baru'}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={
            activeSubTab === 'courses'
              ? 'Cari Kode, Nama Mata Kuliah, atau Dosen Pengampu...'
              : 'Cari Nama Mata Kuliah, Kelas, atau Ruangan...'
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Content: Courses Table */}
      {activeSubTab === 'courses' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Kode & Mata Kuliah</th>
                  <th className="py-3.5 px-3">SKS</th>
                  <th className="py-3.5 px-3">Semester</th>
                  <th className="py-3.5 px-3">Kategori</th>
                  <th className="py-3.5 px-3">Dosen Koordinator</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{c.name}</div>
                      <div className="text-[11px] font-mono text-cyan-400">{c.code}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold font-mono text-indigo-400">{c.sks} SKS</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-white">Semester {c.semester}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          c.category === 'Wajib'
                            ? 'bg-indigo-950/50 text-indigo-400 border-indigo-500/30'
                            : 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-300 font-medium">{c.lecturer}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditCourse(c)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            onDeleteCourse(c.id);
                            showToast(`Mata kuliah ${c.name} dihapus.`, 'info');
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content: Classes Table */}
      {activeSubTab === 'classes' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Kelas & Mata Kuliah</th>
                  <th className="py-3.5 px-3">Dosen</th>
                  <th className="py-3.5 px-3">Jadwal & Ruang</th>
                  <th className="py-3.5 px-3">Kapasitas Mahasiswa</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {filteredClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold font-mono text-[11px] border border-indigo-500/30">
                          {cls.section}
                        </span>
                        <div className="font-bold text-white">{cls.courseName}</div>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {cls.courseCode} · {cls.sks} SKS
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-200 font-medium">{cls.lecturer}</div>
                      <div className="text-[10px] text-slate-400">{cls.prodi}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-white font-medium">
                        {cls.scheduleDay}, {cls.scheduleTime}
                      </div>
                      <div className="text-[11px] text-cyan-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{cls.room}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          {cls.enrolled} / {cls.quota}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({Math.round((cls.enrolled / cls.quota) * 100)}%)
                        </span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (cls.enrolled / cls.quota) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditClass(cls)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            onDeleteClass(cls.id);
                            showToast(`Kelas ${cls.section} dihapus.`, 'info');
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>{editingCourse ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah Baru'}</span>
              </h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCourseSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kode MK</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: IF3201"
                    value={courseFormData.code}
                    onChange={(e) => setCourseFormData({ ...courseFormData, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bobot SKS</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={courseFormData.sks}
                    onChange={(e) => setCourseFormData({ ...courseFormData, sks: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Mata Kuliah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kecerdasan Buatan & Machine Learning"
                  value={courseFormData.name}
                  onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={courseFormData.semester}
                    onChange={(e) => setCourseFormData({ ...courseFormData, semester: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori</label>
                  <select
                    value={courseFormData.category}
                    onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Wajib">Wajib Prodi</option>
                    <option value="Pilihan">Pilihan Peminatan</option>
                    <option value="MBKM">MBKM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dosen Koordinator</label>
                <input
                  type="text"
                  placeholder="Nama dosen pengampu utama"
                  value={courseFormData.lecturer}
                  onChange={(e) => setCourseFormData({ ...courseFormData, lecturer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  {editingCourse ? 'Simpan Perubahan' : 'Tambahkan Mata Kuliah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>{editingClass ? 'Edit Kelas Perkuliahan' : 'Tambah Kelas Baru'}</span>
              </h3>
              <button onClick={() => setIsClassModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClassSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mata Kuliah</label>
                  <select
                    value={classFormData.courseName}
                    onChange={(e) => {
                      const sel = courses.find((c) => c.name === e.target.value);
                      setClassFormData({
                        ...classFormData,
                        courseName: e.target.value,
                        courseCode: sel ? sel.code : classFormData.courseCode,
                        sks: sel ? sel.sks : classFormData.sks,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Rombel / Kelas</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kelas A"
                    value={classFormData.section}
                    onChange={(e) => setClassFormData({ ...classFormData, section: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hari Perkuliahan</label>
                  <select
                    value={classFormData.scheduleDay}
                    onChange={(e) => setClassFormData({ ...classFormData, scheduleDay: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jam Perkuliahan</label>
                  <input
                    type="text"
                    placeholder="08:00 - 10:30 WIB"
                    value={classFormData.scheduleTime}
                    onChange={(e) => setClassFormData({ ...classFormData, scheduleTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ruangan / Lab</label>
                  <input
                    type="text"
                    placeholder="Contoh: Lab AI 302"
                    value={classFormData.room}
                    onChange={(e) => setClassFormData({ ...classFormData, room: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kapasitas Kuota</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={classFormData.quota}
                    onChange={(e) => setClassFormData({ ...classFormData, quota: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dosen Pengampu</label>
                <input
                  type="text"
                  value={classFormData.lecturer}
                  onChange={(e) => setClassFormData({ ...classFormData, lecturer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  {editingClass ? 'Simpan Perubahan' : 'Tambahkan Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
