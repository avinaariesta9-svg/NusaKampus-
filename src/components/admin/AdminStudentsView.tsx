/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  Download,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { AdminStudent } from '../../types/admin';
import { useToast } from '../common/ToastContext';

interface AdminStudentsViewProps {
  students: AdminStudent[];
  onAddStudent: (student: AdminStudent) => void;
  onEditStudent: (student: AdminStudent) => void;
  onDeleteStudent: (id: string) => void;
  externalSearchQuery?: string;
}

export const AdminStudentsView: React.FC<AdminStudentsViewProps> = ({
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  externalSearchQuery = '',
}) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filterProdi, setFilterProdi] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<AdminStudent | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AdminStudent>>({
    nim: '',
    name: '',
    gender: 'L',
    prodi: 'Teknik Informatika',
    fakultas: 'Fakultas Ilmu Komputer',
    angkatan: '2024',
    semester: 1,
    ipk: 3.50,
    totalSks: 20,
    status: 'Aktif',
    uktStatus: 'Lunas',
    email: '',
    phone: '',
  });

  const query = (externalSearchQuery || search).toLowerCase();

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(query) ||
      s.nim.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query);
    const matchesProdi = filterProdi === 'Semua' || s.prodi === filterProdi;
    const matchesStatus = filterStatus === 'Semua' || s.status === filterStatus;
    return matchesSearch && matchesProdi && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      nim: `241051${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      gender: 'L',
      prodi: 'Teknik Informatika',
      fakultas: 'Fakultas Ilmu Komputer',
      angkatan: '2024',
      semester: 1,
      ipk: 3.75,
      totalSks: 20,
      status: 'Aktif',
      uktStatus: 'Lunas',
      email: '',
      phone: '+62 812-',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: AdminStudent) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nim) {
      showToast('NIM dan Nama Mahasiswa wajib diisi!', 'warning');
      return;
    }

    if (editingStudent) {
      onEditStudent({ ...editingStudent, ...formData } as AdminStudent);
      showToast(`Data mahasiswa ${formData.name} berhasil diperbarui.`, 'success');
    } else {
      const newStudent: AdminStudent = {
        id: `std-${Date.now()}`,
        nim: formData.nim || '',
        name: formData.name || '',
        gender: formData.gender as 'L' | 'P',
        prodi: formData.prodi || 'Teknik Informatika',
        fakultas: formData.fakultas || 'Fakultas Ilmu Komputer',
        angkatan: formData.angkatan || '2024',
        semester: Number(formData.semester) || 1,
        ipk: Number(formData.ipk) || 3.5,
        totalSks: Number(formData.totalSks) || 20,
        status: (formData.status as any) || 'Aktif',
        uktStatus: (formData.uktStatus as any) || 'Lunas',
        email: formData.email || `${formData.nim}@mhs.nusantara.ac.id`,
        phone: formData.phone || '+62 812-0000-0000',
      };
      onAddStudent(newStudent);
      showToast(`Mahasiswa ${newStudent.name} berhasil ditambahkan!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    onDeleteStudent(id);
    showToast(`Data mahasiswa ${name} telah dihapus.`, 'info');
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Manajemen Data Mahasiswa</h2>
            <p className="text-xs text-slate-400">
              Total {students.length} mahasiswa aktif terdaftar pada sistem
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Mahasiswa</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari NIM, Nama, atau Email Mahasiswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterProdi}
            onChange={(e) => setFilterProdi(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="Semua">Semua Program Studi</option>
            <option value="Teknik Informatika">Teknik Informatika</option>
            <option value="Sistem Informasi">Sistem Informasi</option>
            <option value="Sains Data & AI">Sains Data & AI</option>
            <option value="Teknik Komputer & IoT">Teknik Komputer & IoT</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Cuti">Cuti</option>
            <option value="Lulus">Lulus</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-bold">
              <tr>
                <th className="py-3.5 px-4">Mahasiswa</th>
                <th className="py-3.5 px-3">Prodi & Angkatan</th>
                <th className="py-3.5 px-3">Semester</th>
                <th className="py-3.5 px-3">IPK / SKS</th>
                <th className="py-3.5 px-3">UKT</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Tidak ada data mahasiswa yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-bold text-white">{std.name}</div>
                        <div className="text-[11px] font-mono text-cyan-400">{std.nim}</div>
                        <div className="text-[10px] text-slate-400">{std.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{std.prodi}</div>
                      <div className="text-[11px] text-slate-400">Angkatan {std.angkatan}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-white">Sem {std.semester}</span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-indigo-400">{std.ipk.toFixed(2)}</span>
                      <span className="text-slate-400 text-[11px]"> ({std.totalSks} SKS)</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          std.uktStatus === 'Lunas'
                            ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                            : std.uktStatus === 'Beasiswa'
                            ? 'bg-cyan-950/50 text-cyan-400 border-cyan-500/30'
                            : 'bg-rose-950/50 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {std.uktStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          std.status === 'Aktif'
                            ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                            : std.status === 'Cuti'
                            ? 'bg-amber-950/50 text-amber-400 border-amber-500/30'
                            : 'bg-indigo-950/50 text-indigo-400 border-indigo-500/30'
                        }`}
                      >
                        {std.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(std)}
                          title="Edit Mahasiswa"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(std.id, std.name)}
                          title="Hapus Mahasiswa"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>{editingStudent ? 'Edit Data Mahasiswa' : 'Tambah Mahasiswa Baru'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">NIM</label>
                  <input
                    type="text"
                    required
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama mahasiswa"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Program Studi</label>
                  <select
                    value={formData.prodi}
                    onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Teknik Informatika">Teknik Informatika</option>
                    <option value="Sistem Informasi">Sistem Informasi</option>
                    <option value="Sains Data & AI">Sains Data & AI</option>
                    <option value="Teknik Komputer & IoT">Teknik Komputer & IoT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Angkatan</label>
                  <input
                    type="text"
                    value={formData.angkatan}
                    onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">IPK</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={formData.ipk}
                    onChange={(e) => setFormData({ ...formData, ipk: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total SKS</label>
                  <input
                    type="number"
                    value={formData.totalSks}
                    onChange={(e) => setFormData({ ...formData, totalSks: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Akademik</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Cuti">Cuti</option>
                    <option value="Lulus">Lulus</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pembayaran UKT</label>
                  <select
                    value={formData.uktStatus}
                    onChange={(e) => setFormData({ ...formData, uktStatus: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Lunas">Lunas</option>
                    <option value="Belum Lunas">Belum Lunas</option>
                    <option value="Beasiswa">Beasiswa Penuh</option>
                  </select>
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Tambahkan Mahasiswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
