/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  X, 
  Layers 
} from 'lucide-react';
import { AdminAssignmentExam } from '../../types/admin';
import { useToast } from '../common/ToastContext';

interface AdminAssignmentsExamsViewProps {
  items: AdminAssignmentExam[];
  onAddItem: (item: AdminAssignmentExam) => void;
  onEditItem: (item: AdminAssignmentExam) => void;
  onDeleteItem: (id: string) => void;
  externalSearchQuery?: string;
}

export const AdminAssignmentsExamsView: React.FC<AdminAssignmentsExamsViewProps> = ({
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
  externalSearchQuery = '',
}) => {
  const { showToast } = useToast();
  const [filterType, setFilterType] = useState('Semua');
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminAssignmentExam | null>(null);

  const [formData, setFormData] = useState<Partial<AdminAssignmentExam>>({
    type: 'Tugas',
    title: '',
    courseCode: 'IF3201',
    courseName: 'Kecerdasan Buatan & Machine Learning',
    lecturer: 'Dr. Eng. Dian Wahyuni, M.Cs.',
    deadline: '20 Apr 2026',
    submittedCount: 0,
    totalStudents: 40,
    status: 'Aktif',
  });

  const query = (externalSearchQuery || search).toLowerCase();

  const filteredItems = items.filter((item) => {
    const matchesType = filterType === 'Semua' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.courseName.toLowerCase().includes(query) ||
      item.courseCode.toLowerCase().includes(query) ||
      item.lecturer.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      type: 'Tugas',
      title: '',
      courseCode: 'IF3201',
      courseName: 'Kecerdasan Buatan & Machine Learning',
      lecturer: 'Dr. Eng. Dian Wahyuni, M.Cs.',
      deadline: '25 Apr 2026',
      submittedCount: 0,
      totalStudents: 40,
      status: 'Aktif',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminAssignmentExam) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.courseName) {
      showToast('Judul dan Mata Kuliah wajib diisi!', 'warning');
      return;
    }

    if (editingItem) {
      onEditItem({ ...editingItem, ...formData } as AdminAssignmentExam);
      showToast(`${formData.type} "${formData.title}" diperbarui.`, 'success');
    } else {
      const newItem: AdminAssignmentExam = {
        id: `tsk-${Date.now()}`,
        type: (formData.type as any) || 'Tugas',
        title: formData.title || '',
        courseCode: formData.courseCode || 'IF0000',
        courseName: formData.courseName || '',
        lecturer: formData.lecturer || 'Dosen Pengampu',
        deadline: formData.deadline || 'Segera',
        submittedCount: Number(formData.submittedCount) || 0,
        totalStudents: Number(formData.totalStudents) || 40,
        status: (formData.status as any) || 'Aktif',
      };
      onAddItem(newItem);
      showToast(`${newItem.type} "${newItem.title}" berhasil ditambahkan!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    onDeleteItem(id);
    showToast(`Item telah dihapus.`, 'info');
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Manajemen Tugas & Ujian</h2>
            <p className="text-xs text-slate-400">
              Total {items.length} tugas besar, kuis, UTS, dan UAS terjadwal
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tugas / Ujian</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Judul Tugas, Ujian, atau Mata Kuliah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['Semua', 'Tugas', 'UTS', 'UAS'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterType === t
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Assignments & Exams */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-bold">
              <tr>
                <th className="py-3.5 px-4">Tipe & Judul</th>
                <th className="py-3.5 px-3">Mata Kuliah & Dosen</th>
                <th className="py-3.5 px-3">Batas Waktu (Deadline)</th>
                <th className="py-3.5 px-3">Pengumpulan Mahasiswa</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          item.type === 'Tugas'
                            ? 'bg-blue-950/50 text-blue-400 border-blue-500/30'
                            : item.type === 'UTS'
                            ? 'bg-amber-950/50 text-amber-400 border-amber-500/30'
                            : 'bg-rose-950/50 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="font-bold text-white line-clamp-1">{item.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-white font-medium">{item.courseName}</div>
                    <div className="text-[11px] text-slate-400">
                      {item.courseCode} · {item.lecturer}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-cyan-400 font-mono font-bold">{item.deadline}</span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">
                        {item.submittedCount} / {item.totalStudents}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        ({Math.round((item.submittedCount / item.totalStudents) * 100)}%)
                      </span>
                    </div>
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div
                        className="bg-violet-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (item.submittedCount / item.totalStudents) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        item.status === 'Aktif'
                          ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                          : item.status === 'Selesai'
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-amber-950/50 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                <span>{editingItem ? 'Edit Item' : 'Tambah Tugas / Ujian'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipe</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-violet-500 focus:outline-none"
                  >
                    <option value="Tugas">Tugas / Proyek</option>
                    <option value="UTS">Ujian Tengah Semester (UTS)</option>
                    <option value="UAS">Ujian Akhir Semester (UAS)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Batas Waktu (Deadline)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 25 Apr 2026"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Tugas / Nama Ujian</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tugas Besar: Pembuatan Aplikasi Cloud"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mata Kuliah</label>
                  <input
                    type="text"
                    required
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kode MK</label>
                  <input
                    type="text"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dosen Pengampu</label>
                  <input
                    type="text"
                    value={formData.lecturer}
                    onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Peserta Kelas</label>
                  <input
                    type="number"
                    value={formData.totalStudents}
                    onChange={(e) => setFormData({ ...formData, totalStudents: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
