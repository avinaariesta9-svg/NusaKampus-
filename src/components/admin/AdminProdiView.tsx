/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  GraduationCap, 
  Award, 
  X, 
  CheckCircle2 
} from 'lucide-react';
import { AdminStudyProgram } from '../../types/admin';
import { useToast } from '../common/ToastContext';

interface AdminProdiViewProps {
  prodiList: AdminStudyProgram[];
  onAddProdi: (prodi: AdminStudyProgram) => void;
  onEditProdi: (prodi: AdminStudyProgram) => void;
  onDeleteProdi: (id: string) => void;
  externalSearchQuery?: string;
}

export const AdminProdiView: React.FC<AdminProdiViewProps> = ({
  prodiList,
  onAddProdi,
  onEditProdi,
  onDeleteProdi,
  externalSearchQuery = '',
}) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProdi, setEditingProdi] = useState<AdminStudyProgram | null>(null);

  const [formData, setFormData] = useState<Partial<AdminStudyProgram>>({
    code: '',
    name: '',
    degree: 'S1',
    fakultas: 'Fakultas Ilmu Komputer',
    accreditation: 'Unggul',
    headOfDepartment: '',
    studentCount: 1200,
    lecturerCount: 25,
    establishedYear: 2020,
  });

  const query = (externalSearchQuery || search).toLowerCase();

  const filteredProdi = prodiList.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query) ||
      p.fakultas.toLowerCase().includes(query) ||
      p.headOfDepartment.toLowerCase().includes(query)
  );

  const handleOpenAdd = () => {
    setEditingProdi(null);
    setFormData({
      code: 'TI-S1',
      name: '',
      degree: 'S1',
      fakultas: 'Fakultas Ilmu Komputer',
      accreditation: 'Unggul',
      headOfDepartment: '',
      studentCount: 500,
      lecturerCount: 15,
      establishedYear: 2022,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: AdminStudyProgram) => {
    setEditingProdi(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      showToast('Kode dan Nama Program Studi wajib diisi!', 'warning');
      return;
    }

    if (editingProdi) {
      onEditProdi({ ...editingProdi, ...formData } as AdminStudyProgram);
      showToast(`Program Studi ${formData.name} berhasil diperbarui.`, 'success');
    } else {
      const newProdi: AdminStudyProgram = {
        id: `prd-${Date.now()}`,
        code: formData.code || '',
        name: formData.name || '',
        degree: formData.degree as any || 'S1',
        fakultas: formData.fakultas || 'Fakultas Ilmu Komputer',
        accreditation: (formData.accreditation as any) || 'Unggul',
        headOfDepartment: formData.headOfDepartment || 'Belum Ditentukan',
        studentCount: Number(formData.studentCount) || 0,
        lecturerCount: Number(formData.lecturerCount) || 0,
        establishedYear: Number(formData.establishedYear) || 2024,
      };
      onAddProdi(newProdi);
      showToast(`Program Studi ${newProdi.name} berhasil ditambahkan!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    onDeleteProdi(id);
    showToast(`Program Studi ${name} telah dihapus.`, 'info');
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Fakultas & Program Studi</h2>
            <p className="text-xs text-slate-400">
              Total {prodiList.length} program studi sarjana & magister aktif
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Program Studi</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari Program Studi, Jenjang, atau Kaprodi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProdi.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-400 border border-indigo-500/30">
                  {p.code} · {p.degree}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white line-clamp-1">{p.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{p.fakultas}</p>

              <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Akreditasi:</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded text-[11px] border border-emerald-500/30">
                    {p.accreditation}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ketua Prodi:</span>
                  <span className="text-slate-200 font-medium truncate max-w-[150px]">
                    {p.headOfDepartment}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-white font-bold">{p.studentCount.toLocaleString('id-ID')}</span> mhs
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-white font-bold">{p.lecturerCount}</span> dosen
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Prodi Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>{editingProdi ? 'Edit Program Studi' : 'Tambah Program Studi Baru'}</span>
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
                  <label className="block text-slate-300 font-semibold mb-1">Kode Prodi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: TI-S1"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jenjang</label>
                  <select
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="S1">Strata 1 (S1)</option>
                    <option value="S2">Magister (S2)</option>
                    <option value="D4">Sarjana Terapan (D4)</option>
                    <option value="D3">Diploma 3 (D3)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Program Studi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Teknik Informatika"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fakultas</label>
                  <select
                    value={formData.fakultas}
                    onChange={(e) => setFormData({ ...formData, fakultas: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Fakultas Ilmu Komputer">Fakultas Ilmu Komputer</option>
                    <option value="Fakultas Teknik Elektro">Fakultas Teknik Elektro</option>
                    <option value="Fakultas Ekonomi & Bisnis">Fakultas Ekonomi & Bisnis</option>
                    <option value="Fakultas Desain">Fakultas Desain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Akreditasi</label>
                  <select
                    value={formData.accreditation}
                    onChange={(e) => setFormData({ ...formData, accreditation: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Unggul">Unggul</option>
                    <option value="A">A</option>
                    <option value="Baik Sekali">Baik Sekali</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ketua Program Studi (Kaprodi)</label>
                <input
                  type="text"
                  placeholder="Nama & gelar Kaprodi"
                  value={formData.headOfDepartment}
                  onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jumlah Mahasiswa</label>
                  <input
                    type="number"
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jumlah Dosen Homebase</label>
                  <input
                    type="number"
                    value={formData.lecturerCount}
                    onChange={(e) => setFormData({ ...formData, lecturerCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
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
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-600/30"
                >
                  {editingProdi ? 'Simpan Perubahan' : 'Tambahkan Prodi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
