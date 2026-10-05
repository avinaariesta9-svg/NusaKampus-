/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  MapPin, 
  User, 
  X, 
  CheckCircle2 
} from 'lucide-react';
import { AdminSchedule } from '../../types/admin';
import { useToast } from '../common/ToastContext';

interface AdminScheduleViewProps {
  schedules: AdminSchedule[];
  onAddSchedule: (sch: AdminSchedule) => void;
  onEditSchedule: (sch: AdminSchedule) => void;
  onDeleteSchedule: (id: string) => void;
  externalSearchQuery?: string;
}

export const AdminScheduleView: React.FC<AdminScheduleViewProps> = ({
  schedules,
  onAddSchedule,
  onEditSchedule,
  onDeleteSchedule,
  externalSearchQuery = '',
}) => {
  const { showToast } = useToast();
  const [selectedDay, setSelectedDay] = useState<string>('Semua');
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<AdminSchedule | null>(null);
  const [formData, setFormData] = useState<Partial<AdminSchedule>>({
    day: 'Senin',
    time: '08:00 - 10:30 WIB',
    courseCode: 'IF3201',
    courseName: 'Kecerdasan Buatan & Machine Learning',
    lecturer: 'Dr. Eng. Dian Wahyuni, M.Cs.',
    room: 'Lab AI & Data Science 302',
    classSection: 'Kelas A',
    sks: 3,
    type: 'Praktikum',
  });

  const days = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const query = (externalSearchQuery || search).toLowerCase();

  const filteredSchedules = schedules.filter((s) => {
    const matchesDay = selectedDay === 'Semua' || s.day === selectedDay;
    const matchesSearch =
      s.courseName.toLowerCase().includes(query) ||
      s.courseCode.toLowerCase().includes(query) ||
      s.lecturer.toLowerCase().includes(query) ||
      s.room.toLowerCase().includes(query);
    return matchesDay && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingSchedule(null);
    setFormData({
      day: 'Senin',
      time: '08:00 - 10:30 WIB',
      courseCode: 'IF3201',
      courseName: '',
      lecturer: 'Dosen Pengampu',
      room: 'Ruang Kuliah',
      classSection: 'Kelas A',
      sks: 3,
      type: 'Tatap Muka',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sch: AdminSchedule) => {
    setEditingSchedule(sch);
    setFormData({ ...sch });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseName || !formData.time) {
      showToast('Nama Mata Kuliah dan Waktu perkuliahan wajib diisi!', 'warning');
      return;
    }

    if (editingSchedule) {
      onEditSchedule({ ...editingSchedule, ...formData } as AdminSchedule);
      showToast(`Jadwal ${formData.courseName} berhasil diperbarui.`, 'success');
    } else {
      const newSch: AdminSchedule = {
        id: `sch-${Date.now()}`,
        day: (formData.day as any) || 'Senin',
        time: formData.time || '08:00 - 10:30 WIB',
        courseCode: formData.courseCode || 'IF0000',
        courseName: formData.courseName || '',
        lecturer: formData.lecturer || 'Dosen Pengampu',
        room: formData.room || 'Ruang Kuliah',
        classSection: formData.classSection || 'Kelas A',
        sks: Number(formData.sks) || 3,
        type: (formData.type as any) || 'Tatap Muka',
      };
      onAddSchedule(newSch);
      showToast(`Jadwal kuliah ${newSch.courseName} berhasil ditambahkan!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    onDeleteSchedule(id);
    showToast(`Jadwal ${name} telah dihapus.`, 'info');
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Jadwal Kuliah Mingguan</h2>
            <p className="text-xs text-slate-400">
              Total {schedules.length} sesi perkuliahan aktif terjadwal di kampus
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal</span>
        </button>
      </div>

      {/* Filter by Day and Search */}
      <div className="space-y-2.5 bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Mata Kuliah, Dosen, atau Ruang Perkuliahan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                selectedDay === d
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Schedules Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-bold">
              <tr>
                <th className="py-3.5 px-4">Hari & Jam</th>
                <th className="py-3.5 px-3">Mata Kuliah & Kelas</th>
                <th className="py-3.5 px-3">Dosen Pengampu</th>
                <th className="py-3.5 px-3">Ruang / Lab</th>
                <th className="py-3.5 px-3">Metode</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredSchedules.map((sch) => (
                <tr key={sch.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{sch.day}</span>
                    <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {sch.time}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[10px]">
                        {sch.classSection}
                      </span>
                      <span className="font-bold text-white">{sch.courseName}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {sch.courseCode} · {sch.sks} SKS
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-200">{sch.lecturer}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-cyan-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {sch.room}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        sch.type === 'Praktikum'
                          ? 'bg-amber-950/50 text-amber-400 border-amber-500/30'
                          : sch.type === 'Hybrid'
                          ? 'bg-cyan-950/50 text-cyan-400 border-cyan-500/30'
                          : 'bg-indigo-950/50 text-indigo-400 border-indigo-500/30'
                      }`}
                    >
                      {sch.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(sch)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sch.id, sch.courseName)}
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

      {/* Add / Edit Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>{editingSchedule ? 'Edit Jadwal Kuliah' : 'Tambah Jadwal Kuliah Baru'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hari</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value as any })}
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
                  <label className="block text-slate-300 font-semibold mb-1">Waktu Perkuliahan</label>
                  <input
                    type="text"
                    required
                    placeholder="08:00 - 10:30 WIB"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Mata Kuliah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kecerdasan Buatan & Machine Learning"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kode MK</label>
                  <input
                    type="text"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kelas</label>
                  <input
                    type="text"
                    value={formData.classSection}
                    onChange={(e) => setFormData({ ...formData, classSection: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">SKS</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.sks}
                    onChange={(e) => setFormData({ ...formData, sks: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ruangan</label>
                  <input
                    type="text"
                    placeholder="Lab AI 302"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Metode</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Tatap Muka">Tatap Muka</option>
                    <option value="Praktikum">Praktikum</option>
                    <option value="Hybrid">Hybrid / Online</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dosen Pengampu</label>
                <input
                  type="text"
                  value={formData.lecturer}
                  onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  {editingSchedule ? 'Simpan Perubahan' : 'Tambahkan Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
