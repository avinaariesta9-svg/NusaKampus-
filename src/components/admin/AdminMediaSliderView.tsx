/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Video, 
  Image as ImageIcon, 
  Sparkles, 
  ArrowUpDown, 
  Play,
  ExternalLink,
  Layers,
  X
} from 'lucide-react';
import { MediaSlide } from '../../types';
import { useToast } from '../common/ToastContext';
import { MediaSlider } from '../home/MediaSlider';

interface AdminMediaSliderViewProps {
  slides: MediaSlide[];
  onAddSlide: (slide: MediaSlide) => void;
  onEditSlide: (slide: MediaSlide) => void;
  onDeleteSlide: (id: string) => void;
  onToggleActive: (id: string) => void;
  externalSearchQuery?: string;
}

export const AdminMediaSliderView: React.FC<AdminMediaSliderViewProps> = ({
  slides,
  onAddSlide,
  onEditSlide,
  onDeleteSlide,
  onToggleActive,
  externalSearchQuery = '',
}) => {
  const { showToast } = useToast();
  const [localSearch, setLocalSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<MediaSlide | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<MediaSlide>>({
    type: 'image',
    title: '',
    category: 'Event Kampus',
    description: '',
    mediaUrl: '',
    thumbnailUrl: '',
    linkUrl: '#',
    order: slides.length + 1,
    isActive: true,
    videoDuration: '02:00',
  });

  const query = externalSearchQuery || localSearch;

  const filteredSlides = slides
    .filter((s) => {
      const matchSearch =
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(query.toLowerCase()));
      const matchType = typeFilter === 'all' || s.type === typeFilter;
      return matchSearch && matchType;
    })
    .sort((a, b) => a.order - b.order);

  const handleOpenAddModal = () => {
    setEditingSlide(null);
    setFormData({
      type: 'image',
      title: '',
      category: 'Event Kampus',
      description: '',
      mediaUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
      linkUrl: '#',
      order: slides.length + 1,
      isActive: true,
      videoDuration: '02:30',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slide: MediaSlide) => {
    setEditingSlide(slide);
    setFormData({ ...slide });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.mediaUrl) {
      showToast('Mohon lengkapi judul dan URL media!', 'warning');
      return;
    }

    if (editingSlide) {
      onEditSlide({
        ...editingSlide,
        ...formData,
      } as MediaSlide);
      showToast('Konten slide berhasil diperbarui.', 'success');
    } else {
      const newSlide: MediaSlide = {
        id: `slide-${Date.now()}`,
        type: formData.type || 'image',
        title: formData.title || '',
        category: formData.category || 'Event Kampus',
        description: formData.description || '',
        mediaUrl: formData.mediaUrl || '',
        thumbnailUrl: formData.thumbnailUrl || formData.mediaUrl || '',
        linkUrl: formData.linkUrl || '#',
        order: Number(formData.order) || slides.length + 1,
        isActive: formData.isActive ?? true,
        videoDuration: formData.videoDuration || '02:00',
      };
      onAddSlide(newSlide);
      showToast('Slide media kampus baru berhasil ditambahkan.', 'success');
    }

    setIsModalOpen(false);
  };

  const activeCount = slides.filter((s) => s.isActive).length;
  const videoCount = slides.filter((s) => s.type === 'video').length;
  const imageCount = slides.filter((s) => s.type === 'image').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Cards */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manajemen Media & Banner Kampus</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Media Slider Mahasiswa
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola foto kegiatan, banner promosi, dan video pengumuman yang tampil di tengah Beranda mahasiswa.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Konten Slide</span>
        </button>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Total Konten</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{slides.length}</span>
            <span className="text-[11px] text-slate-400 font-medium">slide</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Slide Aktif</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">{activeCount}</span>
            <span className="text-[11px] text-emerald-500 font-medium">tayang di Home</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Video Kegiatan</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-rose-600 font-mono">{videoCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">video aktif</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Foto & Banner</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-indigo-600 font-mono">{imageCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">banner statis</span>
          </div>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pratinjau Langsung (Live Preview di HP Mahasiswa)
            </h2>
          </div>
          <button
            onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
            className="text-xs text-indigo-600 hover:text-indigo-500 font-semibold"
          >
            {isPreviewExpanded ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        </div>

        {isPreviewExpanded && (
          <div className="max-w-md mx-auto p-3 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-inner">
            <MediaSlider slides={slides} />
          </div>
        )}
      </div>

      {/* Filter and Table of Slides */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul, kategori, atau deskripsi..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Semua ({slides.length})
            </button>
            <button
              onClick={() => setTypeFilter('image')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                typeFilter === 'image'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Foto ({imageCount})</span>
            </button>
            <button
              onClick={() => setTypeFilter('video')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                typeFilter === 'video'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video ({videoCount})</span>
            </button>
          </div>
        </div>

        {/* Slides List Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSlides.map((slide) => (
            <div
              key={slide.id}
              className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                slide.isActive
                  ? 'bg-white border-slate-200/90 shadow-sm hover:shadow-md'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div>
                {/* Media Preview thumbnail */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 mb-3 border border-slate-200">
                  <img
                    src={slide.thumbnailUrl || slide.mediaUrl}
                    alt={slide.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
                      #{slide.order}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        slide.type === 'video'
                          ? 'bg-rose-600 text-white flex items-center gap-1'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {slide.type === 'video' && <Play className="w-2.5 h-2.5 fill-white" />}
                      <span>{slide.type === 'video' ? 'Video' : 'Foto'}</span>
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => onToggleActive(slide.id)}
                      title={slide.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                        slide.isActive
                          ? 'bg-emerald-500/80 text-white'
                          : 'bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      {slide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {slide.category}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {slide.title}
                  </h3>
                  {slide.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {slide.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[11px] font-semibold ${slide.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {slide.isActive ? '● Sedang Tayang' : '○ Nonaktif'}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(slide)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Edit Konten Slide"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus slide "${slide.title}"?`)) {
                        onDeleteSlide(slide.id);
                        showToast('Slide berhasil dihapus.', 'info');
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Slide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 border border-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  {editingSlide ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingSlide ? 'Ubah Konten Slider' : 'Tambah Konten Slider Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Foto atau video untuk beranda mahasiswa
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 pt-4 text-xs">
              {/* Media Type Selector */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Tipe Konten
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'image' })}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                      formData.type === 'image'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Foto / Banner Gambar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'video' })}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                      formData.type === 'video'
                        ? 'bg-rose-50 border-rose-500 text-rose-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Video Kegiatan (MP4)</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Judul Slide <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dies Natalis ke-38 & Gelar Inovasi Nusantara"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Kategori Slide
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="Event Kampus">Event Kampus</option>
                  <option value="Video Kegiatan">Video Kegiatan</option>
                  <option value="Promosi & Beasiswa">Promosi & Beasiswa</option>
                  <option value="Video Profil">Video Profil</option>
                  <option value="Pengumuman Rektorat">Pengumuman Rektorat</option>
                  <option value="Kompetisi Nasional">Kompetisi Nasional</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  placeholder="Rincian informasi acara, lokasi, atau tanggal penting..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Media URL */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  URL Media {formData.type === 'video' ? '(Video MP4)' : '(Gambar Banner)'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder={
                    formData.type === 'video'
                      ? 'https://.../video.mp4'
                      : 'https://images.unsplash.com/...'
                  }
                  value={formData.mediaUrl}
                  onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  URL Thumbnail Cover
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Thumbnail akan ditampilkan sebagai cover poster awal sebelum video dimainkan.
                </p>
              </div>

              {/* Two columns: Order & Duration (if video) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Urutan Tampil (Order)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                {formData.type === 'video' ? (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Durasi Video
                    </label>
                    <input
                      type="text"
                      placeholder="02:30"
                      value={formData.videoDuration}
                      onChange={(e) => setFormData({ ...formData, videoDuration: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Link Tujuan
                    </label>
                    <input
                      type="text"
                      placeholder="https://... atau #"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="slide-active-check"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <label htmlFor="slide-active-check" className="font-semibold text-slate-700 cursor-pointer">
                  Aktifkan slide (langsung tayang di aplikasi mahasiswa)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20"
                >
                  {editingSlide ? 'Simpan Perubahan' : 'Tambahkan Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
