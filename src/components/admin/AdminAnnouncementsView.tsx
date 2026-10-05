/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Send, 
  X, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import { AdminAnnouncement } from '../../types/admin';
import { useToast } from '../common/ToastContext';

interface AdminAnnouncementsViewProps {
  announcements: AdminAnnouncement[];
  onAddAnnouncement: (ann: AdminAnnouncement) => void;
  onEditAnnouncement: (ann: AdminAnnouncement) => void;
  onDeleteAnnouncement: (id: string) => void;
  externalSearchQuery?: string;
}

export const AdminAnnouncementsView: React.FC<AdminAnnouncementsViewProps> = ({
  announcements,
  onAddAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  externalSearchQuery = '',
}) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<AdminAnnouncement | null>(null);

  const [formData, setFormData] = useState<Partial<AdminAnnouncement>>({
    title: '',
    category: 'Akademik',
    date: 'Hari ini, 09:00 WIB',
    sender: 'Biro Administrasi Akademik (BAAK)',
    target: 'Semua',
    isImportant: false,
    content: '',
  });

  const query = (externalSearchQuery || search).toLowerCase();

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(query) ||
      a.content.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query) ||
      a.sender.toLowerCase().includes(query)
  );

  const handleOpenAdd = () => {
    setEditingAnn(null);
    setFormData({
      title: '',
      category: 'Akademik',
      date: 'Hari ini',
      sender: 'Biro Administrasi Akademik (BAAK)',
      target: 'Semua',
      isImportant: false,
      content: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: AdminAnnouncement) => {
    setEditingAnn(ann);
    setFormData({ ...ann });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showToast('Judul dan Isi Pengumuman wajib diisi!', 'warning');
      return;
    }

    if (editingAnn) {
      onEditAnnouncement({ ...editingAnn, ...formData } as AdminAnnouncement);
      showToast(`Pengumuman "${formData.title}" diperbarui.`, 'success');
    } else {
      const newAnn: AdminAnnouncement = {
        id: `ann-${Date.now()}`,
        title: formData.title || '',
        category: (formData.category as any) || 'Akademik',
        date: formData.date || 'Baru saja',
        sender: formData.sender || 'Admin Kampus',
        target: (formData.target as any) || 'Semua',
        isImportant: !!formData.isImportant,
        content: formData.content || '',
      };
      onAddAnnouncement(newAnn);
      showToast(`Pengumuman "${newAnn.title}" berhasil dipublikasikan!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    onDeleteAnnouncement(id);
    showToast(`Pengumuman telah dihapus.`, 'info');
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Pengumuman & Surat Edaran</h2>
            <p className="text-xs text-slate-400">
              Total {announcements.length} edaran dan informasi aktif di portal kampus
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pengumuman</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari Judul, Isi Surat Edaran, atau Pengirim..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
        />
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className={`rounded-2xl bg-slate-900 border p-4 sm:p-5 transition-all ${
              ann.isImportant
                ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-900'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {ann.isImportant && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      PENTING
                    </span>
                  )}
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950/50 text-indigo-400 border border-indigo-500/30">
                    {ann.category}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    Target: {ann.target}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white pt-1">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {ann.content}
                </p>

                <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400">
                  <span>Penerbit: <strong className="text-slate-300">{ann.sender}</strong></span>
                  <span>·</span>
                  <span>{ann.date}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0">
                <button
                  onClick={() => handleOpenEdit(ann)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(ann.id, ann.title)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-rose-400" />
                <span>{editingAnn ? 'Edit Surat Edaran' : 'Buat Pengumuman Baru'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul pengumuman / surat edaran"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Rektorat">Rektorat</option>
                    <option value="Beasiswa">Beasiswa</option>
                    <option value="Fasilitas">Fasilitas</option>
                    <option value="Kemahasiswaan">Kemahasiswaan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Audiens</label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Semua">Semua Civitas</option>
                    <option value="Mahasiswa">Khusus Mahasiswa</option>
                    <option value="Dosen">Khusus Dosen</option>
                    <option value="Staf">Staf & Tendik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Penerbit / Pengirim</label>
                <input
                  type="text"
                  value={formData.sender}
                  onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Isi Edaran</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ketik rincian pengumuman secara jelas..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="important-checkbox"
                  checked={formData.isImportant}
                  onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="important-checkbox" className="text-slate-300 cursor-pointer font-medium">
                  Tandai sebagai Pengumuman Sangat Penting (Prioritas Tinggi)
                </label>
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
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  {editingAnn ? 'Simpan Perubahan' : 'Terbitkan Pengumuman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
