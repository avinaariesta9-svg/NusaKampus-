/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AdminRole = 'Super Admin' | 'Admin Kampus' | 'Dosen' | 'Mahasiswa';

export type AdminTab = 
  | 'dashboard'
  | 'mahasiswa'
  | 'dosen'
  | 'prodi'
  | 'matakuliah'
  | 'kelas'
  | 'jadwal'
  | 'pengumuman'
  | 'tugas-ujian'
  | 'laporan'
  | 'pengaturan'
  | 'slider';

export interface AdminStudent {
  id: string;
  nim: string;
  name: string;
  gender: 'L' | 'P';
  prodi: string;
  fakultas: string;
  angkatan: string;
  semester: number;
  ipk: number;
  totalSks: number;
  status: 'Aktif' | 'Cuti' | 'Lulus' | 'Non-Aktif';
  uktStatus: 'Lunas' | 'Belum Lunas' | 'Beasiswa';
  email: string;
  phone: string;
}

export interface AdminLecturer {
  id: string;
  nip: string;
  nidn: string;
  name: string;
  title: string;
  prodi: string;
  fakultas: string;
  email: string;
  phone: string;
  status: 'Aktif Mengajar' | 'Tugas Belajar' | 'Cuti Riset';
  coursesCount: number;
  specialization: string;
}

export interface AdminStudyProgram {
  id: string;
  code: string;
  name: string;
  degree: 'S1' | 'S2' | 'D3' | 'D4';
  fakultas: string;
  accreditation: 'Unggul' | 'A' | 'Baik Sekali';
  headOfDepartment: string;
  studentCount: number;
  lecturerCount: number;
  establishedYear: number;
}

export interface AdminCourse {
  id: string;
  code: string;
  name: string;
  sks: number;
  semester: number;
  prodi: string;
  category: 'Wajib' | 'Pilihan' | 'MBKM';
  lecturer: string;
}

export interface AdminClass {
  id: string;
  courseCode: string;
  courseName: string;
  section: string; // e.g. "Kelas A"
  sks: number;
  lecturer: string;
  room: string;
  scheduleDay: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  scheduleTime: string;
  quota: number;
  enrolled: number;
  semester: number;
  prodi: string;
}

export interface AdminSchedule {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  time: string;
  courseCode: string;
  courseName: string;
  lecturer: string;
  room: string;
  classSection: string;
  sks: number;
  type: 'Tatap Muka' | 'Praktikum' | 'Hybrid';
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  category: 'Akademik' | 'Rektorat' | 'Beasiswa' | 'Fasilitas' | 'Kemahasiswaan';
  date: string;
  sender: string;
  target: 'Semua' | 'Mahasiswa' | 'Dosen' | 'Staf';
  isImportant: boolean;
  content: string;
}

export interface AdminAssignmentExam {
  id: string;
  type: 'Tugas' | 'UTS' | 'UAS';
  title: string;
  courseCode: string;
  courseName: string;
  lecturer: string;
  deadline: string;
  submittedCount: number;
  totalStudents: number;
  status: 'Aktif' | 'Selesai' | 'Mendatang';
}

export interface AdminActivityLog {
  id: string;
  action: string;
  user: string;
  role: string;
  time: string;
  detail: string;
  category: 'mahasiswa' | 'akademik' | 'nilai' | 'sistem';
}

export interface QuickActionPayload {
  type: 'mahasiswa' | 'dosen' | 'matakuliah' | 'pengumuman' | 'jadwal';
}
