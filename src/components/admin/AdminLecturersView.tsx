/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  X, 
  CheckCircle2, 
  BookOpen 
} from 'lucide-react';
import { AdminLecturer } from '../../types/admin';
import { useToast } from '../common/ToastContext';

interface AdminLecturersViewProps {
  lecturers: AdminLecturer[];
  onAddLecturer: (lec: AdminLecturer) => void;
  onEditLecturer: (lec: AdminLecturer) => void;
  onDeleteLecturer: (id: string) => void;
  externalSearchQuery?: string;
}

export const AdminLecturersView: React.FC<AdminLecturersViewProps> = ({
  lecturers,
  onAddLecturer,
  onEditLecturer,
  onDeleteLecturer,
  externalSearchQuery = '',
}) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filterProdi, setFilterProdi] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<AdminLecturer | null>(null);

  const [formData, setFormData] = useState<Partial<AdminLecturer>>({
    nip: '',
    nidn: '',
    name: '',
    title: 'Lektor',
    prodi: 'Teknik Informatika',
    fakultas: 'Fakultas Ilmu Komputer',
    email: '',
    phone: '',
    status: 'Aktif Mengajar',
    coursesCount: 3,
    specialization: '',
  });

  const query = (externalSearchQuery || search).toLowerCase();

  const filteredLecturers = lecturers.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(query) ||
      l.nip.toLowerCase().includes(query) ||
      l.specialization.toLowerCase().includes(query);
    const matchesProdi = filterProdi === 'Semua' || l.prodi === filterProdi;
    return matchesSearch && matchesProdi;
  });

  const handleOpenAdd = () => {
    setEditingLecturer(null);
    setFormData({
      nip: `198${Math.floor(100000000000000 + Math.random() * 90000000000000)}`,
      nidn: `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      name: '',
      title: 'Lektor',
      prodi: 'Teknik Informatika',
      fakultas: 'Fakultas Ilmu Komputer',
      email: '',
      phone: '+62 812-',
      status: 'Aktif Mengajar',
      coursesCount: 3,
      specialization: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lec: AdminLecturer) => {
    setEditingLecturer(lec);
    setFormData({ ...lec });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nip) {
      showToast('NIP dan Nama Dosen wajib diisi!', 'warning');
      return;
    }

    if (editingLecturer) {
      onEditLecturer({ ...editingLecturer, ...formData } as AdminLecturer);
      showToast(`Data dosen ${formData.name} berhasil diperbarui.`, 'success');
    } else {
      const newLec: AdminLecturer = {
        id: `lec-${Date.now()}`,
        nip: formData.nip || '',
        nidn: formData.nidn || '',
        name: formData.name || '',
        title: formData.title || 'Lektor',
        prodi: formData.prodi || 'Teknik Informatika',
        fakultas: formData.fakultas || 'Fakultas Ilmu Komputer',
        email: formData.email || `${formData.name?.toLowerCase().replace(/\s+/g, '.')}@nusantara.ac.id`,
        phone: formData.phone || '+62 811-0000-0000',
        status: (formData.status as any) || 'Aktif Mengajar',
        coursesCount: Number(formData.coursesCount) || 2,
        specialization: formData.specialization || 'Ilmu Komputer',
      };
      onAddLecturer(newLec);
      showToast(`Dosen ${newLec.name} berhasil ditambahkan!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    onDeleteLecturer(id);
    showToast(`Data dosen ${name} telah dihapus.`, 'info');
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Data Dosen & Tenaga Pengajar</h2>
            <p className="text-xs text-slate-400">
              Total {lecturers.length} dosen aktif mengajar di berbagai program studi
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dosen</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Dosen, NIP, atau Keahlian..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={filterProdi}
          onChange={(e) => setFilterProdi(e.target.value)}
          className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="Semua">Semua Program Studi</option>
          <option value="Teknik Informatika">Teknik Informatika</option>
          <option value="Sistem Informasi">Sistem Informasi</option>
          <option value="Sains Data & AI">Sains Data & AI</option>
          <option value="Teknik Komputer & IoT">Teknik Komputer & IoT</option>
        </select>
      </div>

      {/* Grid of Lecturers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLecturers.map((lec) => (
          <div
            key={lec.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    lec.status === 'Aktif Mengajar'
                      ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-950/50 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {lec.status}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(lec)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(lec.id, lec.name)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white line-clamp-1">{lec.name}</h3>
              <p className="text-[11px] text-cyan-400 font-mono mt-0.5">NIP: {lec.nip}</p>
              <p className="text-xs text-slate-300 font-medium mt-1">{lec.title}</p>
              <p className="text-[11px] text-slate-400">{lec.prodi}</p>

              <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] space-y-1">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                  Fokus Bidang Keahlian:
                </span>
                <p className="text-indigo-300 font-medium line-clamp-2">
                  {lec.specialization}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>{lec.coursesCount} Mata Kuliah</span>
              </span>
              <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                {lec.email}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Lecturer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>{editingLecturer ? 'Edit Data Dosen' : 'Tambah Dosen Baru'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dr. Ir. Budi Santoso, M.Kom."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">NIP</label>
                  <input
                    type="text"
                    required
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">NIDN</label>
                  <input
                    type="text"
                    value={formData.nidn}
                    onChange={(e) => setFormData({ ...formData, nidn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jabatan Fungsional</label>
                  <select
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Guru Besar">Guru Besar / Profesor</option>
                    <option value="Lektor Kepala">Lektor Kepala</option>
                    <option value="Lektor">Lektor</option>
                    <option value="Asisten Ahli">Asisten Ahli</option>
                    <option value="Pengajar">Tenaga Pengajar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Program Studi</label>
                  <select
                    value={formData.prodi}
                    onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Teknik Informatika">Teknik Informatika</option>
                    <option value="Sistem Informasi">Sistem Informasi</option>
                    <option value="Sains Data & AI">Sains Data & AI</option>
                    <option value="Teknik Komputer & IoT">Teknik Komputer & IoT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bidang Keahlian / Spesialisasi</label>
                <input
                  type="text"
                  placeholder="Contoh: AI, Deep Learning, Cyber Security"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Keaktifan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Aktif Mengajar">Aktif Mengajar</option>
                    <option value="Tugas Belajar">Tugas Belajar</option>
                    <option value="Cuti Riset">Cuti Riset</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mata Kuliah Diampu</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.coursesCount}
                    onChange={(e) => setFormData({ ...formData, coursesCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/30"
                >
                  {editingLecturer ? 'Simpan Perubahan' : 'Tambahkan Dosen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
