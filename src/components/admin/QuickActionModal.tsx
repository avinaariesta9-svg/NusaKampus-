/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Bell, 
  Calendar, 
  X, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { useToast } from '../common/ToastContext';
import { 
  AdminStudent, 
  AdminLecturer, 
  AdminCourse, 
  AdminAnnouncement, 
  AdminSchedule 
} from '../../types/admin';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: 'mahasiswa' | 'dosen' | 'matakuliah' | 'pengumuman' | 'jadwal';
  onAddStudent: (s: AdminStudent) => void;
  onAddLecturer: (l: AdminLecturer) => void;
  onAddCourse: (c: AdminCourse) => void;
  onAddAnnouncement: (a: AdminAnnouncement) => void;
  onAddSchedule: (sch: AdminSchedule) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  defaultAction = 'mahasiswa',
  onAddStudent,
  onAddLecturer,
  onAddCourse,
  onAddAnnouncement,
  onAddSchedule,
}) => {
  const { showToast } = useToast();
  const [selectedType, setSelectedType] = useState<
    'mahasiswa' | 'dosen' | 'matakuliah' | 'pengumuman' | 'jadwal'
  >(defaultAction);

  // Form Fields
  const [titleOrName, setTitleOrName] = useState('');
  const [codeOrNip, setCodeOrNip] = useState('');
  const [extraField, setExtraField] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleOrName) {
      showToast('Mohon lengkapi isian utama formulir!', 'warning');
      return;
    }

    if (selectedType === 'mahasiswa') {
      const s: AdminStudent = {
        id: `std-${Date.now()}`,
        nim: codeOrNip || `241051${Math.floor(1000 + Math.random() * 9000)}`,
        name: titleOrName,
        gender: 'L',
        prodi: extraField || 'Teknik Informatika',
        fakultas: 'Fakultas Ilmu Komputer',
        angkatan: '2024',
        semester: 1,
        ipk: 3.75,
        totalSks: 20,
        status: 'Aktif',
        uktStatus: 'Lunas',
        email: `${codeOrNip || 'mhs'}@mhs.nusantara.ac.id`,
        phone: '+62 812-0000-0000',
      };
      onAddStudent(s);
      showToast(`Mahasiswa ${s.name} berhasil ditambahkan!`, 'success');
    } else if (selectedType === 'dosen') {
      const l: AdminLecturer = {
        id: `lec-${Date.now()}`,
        nip: codeOrNip || `198${Math.floor(100000000000000 + Math.random() * 90000000000000)}`,
        nidn: `00${Math.floor(10000000 + Math.random() * 90000000)}`,
        name: titleOrName,
        title: 'Lektor',
        prodi: extraField || 'Teknik Informatika',
        fakultas: 'Fakultas Ilmu Komputer',
        email: `${titleOrName.toLowerCase().replace(/\s+/g, '.')}@nusantara.ac.id`,
        phone: '+62 811-0000-0000',
        status: 'Aktif Mengajar',
        coursesCount: 3,
        specialization: 'Ilmu Komputer',
      };
      onAddLecturer(l);
      showToast(`Dosen ${l.name} berhasil ditambahkan!`, 'success');
    } else if (selectedType === 'matakuliah') {
      const c: AdminCourse = {
        id: `crs-${Date.now()}`,
        code: codeOrNip || `IF${Math.floor(2000 + Math.random() * 2000)}`,
        name: titleOrName,
        sks: 3,
        semester: 6,
        prodi: extraField || 'Teknik Informatika',
        category: 'Wajib',
        lecturer: 'Dosen Pengampu',
      };
      onAddCourse(c);
      showToast(`Mata Kuliah ${c.name} berhasil dibuat!`, 'success');
    } else if (selectedType === 'pengumuman') {
      const a: AdminAnnouncement = {
        id: `ann-${Date.now()}`,
        title: titleOrName,
        category: 'Akademik',
        date: 'Baru saja',
        sender: 'Admin Kampus',
        target: 'Semua',
        isImportant: true,
        content: extraField || titleOrName,
      };
      onAddAnnouncement(a);
      showToast(`Pengumuman berhasil dipublikasikan!`, 'success');
    } else if (selectedType === 'jadwal') {
      const sch: AdminSchedule = {
        id: `sch-${Date.now()}`,
        day: (codeOrNip as any) || 'Senin',
        time: extraField || '08:00 - 10:30 WIB',
        courseCode: 'IF3201',
        courseName: titleOrName,
        lecturer: 'Dosen Pengampu',
        room: 'Ruang Teori 301',
        classSection: 'Kelas A',
        sks: 3,
        type: 'Tatap Muka',
      };
      onAddSchedule(sch);
      showToast(`Jadwal perkuliahan berhasil dijadwalkan!`, 'success');
    }

    onClose();
    setTitleOrName('');
    setCodeOrNip('');
    setExtraField('');
  };

  const actions = [
    { id: 'mahasiswa', label: 'Tambah Mahasiswa', icon: Users, color: 'text-indigo-400' },
    { id: 'dosen', label: 'Tambah Dosen', icon: GraduationCap, color: 'text-emerald-400' },
    { id: 'matakuliah', label: 'Tambah Mata Kuliah', icon: BookOpen, color: 'text-cyan-400' },
    { id: 'pengumuman', label: 'Buat Pengumuman', icon: Bell, color: 'text-rose-400' },
    { id: 'jadwal', label: 'Tambah Jadwal', icon: Calendar, color: 'text-amber-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Menu Aksi Cepat (Quick Action)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Type Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {actions.map((act) => {
            const Icon = act.icon;
            const isSelected = selectedType === act.id;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => setSelectedType(act.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${act.color}`} />
                <span className="truncate">{act.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {selectedType === 'mahasiswa' && 'Nama Lengkap Mahasiswa'}
              {selectedType === 'dosen' && 'Nama Lengkap Dosen & Gelar'}
              {selectedType === 'matakuliah' && 'Nama Mata Kuliah'}
              {selectedType === 'pengumuman' && 'Judul Surat Edaran / Pengumuman'}
              {selectedType === 'jadwal' && 'Nama Mata Kuliah'}
            </label>
            <input
              type="text"
              required
              placeholder="Ketik di sini..."
              value={titleOrName}
              onChange={(e) => setTitleOrName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {selectedType === 'mahasiswa' && 'Nomor Induk (NIM)'}
                {selectedType === 'dosen' && 'Nomor Induk Pegawai (NIP)'}
                {selectedType === 'matakuliah' && 'Kode Mata Kuliah'}
                {selectedType === 'pengumuman' && 'Kategori (Akademik/Umum)'}
                {selectedType === 'jadwal' && 'Hari (Senin/Selasa/...)'}
              </label>
              <input
                type="text"
                placeholder="Contoh kode / nomor..."
                value={codeOrNip}
                onChange={(e) => setCodeOrNip(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {selectedType === 'mahasiswa' && 'Program Studi'}
                {selectedType === 'dosen' && 'Program Studi / Fakultas'}
                {selectedType === 'matakuliah' && 'Program Studi'}
                {selectedType === 'pengumuman' && 'Ringkasan Isi'}
                {selectedType === 'jadwal' && 'Jam Perkuliahan'}
              </label>
              <input
                type="text"
                placeholder="Contoh: Teknik Informatika / 08:00 WIB"
                value={extraField}
                onChange={(e) => setExtraField(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
            >
              Simpan & Terbitkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
