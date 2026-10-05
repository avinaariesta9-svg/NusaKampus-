export type TabType = 'home' | 'akademik' | 'jadwal' | 'notifikasi' | 'pengumuman' | 'profil';

export interface MediaSlide {
  id: string;
  type: 'image' | 'video';
  title: string;
  category: string;
  description?: string;
  mediaUrl: string;
  thumbnailUrl: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  videoDuration?: string;
}

export type AcademicSubTab = 
  | 'matakuliah' 
  | 'jadwal' 
  | 'dosen' 
  | 'krs' 
  | 'khs' 
  | 'nilai' 
  | 'ipk' 
  | 'presensi' 
  | 'ujian' 
  | 'kalender' 
  | 'tugas';

export type AnnouncementSubTab = 'pengumuman' | 'berita';

export interface LecturerItem {
  id: string;
  nip: string;
  nidn: string;
  name: string;
  avatar: string;
  title: string;
  department: string;
  specialization: string[];
  email: string;
  phone: string;
  room: string;
  officeHours: string;
  status: 'Aktif Mengajar' | 'Tugas Belajar' | 'Cuti Riset';
  coursesTaught: string[];
  education: string[];
}

export interface CurriculumCourse {
  id: string;
  code: string;
  name: string;
  sks: number;
  semester: number;
  category: 'Wajib Prodi' | 'Wajib Fakultas' | 'Pilihan Peminatan' | 'MBKM';
  prerequisite?: string;
  description: string;
  lecturer: string;
  syllabus: string[];
  status: 'Sudah Diambil' | 'Sedang Berjalan' | 'Belum Diambil';
}

export interface ComponentGrade {
  name: string;
  weight: number; // in percentage e.g. 20
  score: number; // 0 - 100
}

export interface CourseGradeDetail {
  id: string;
  courseCode: string;
  courseName: string;
  sks: number;
  semester: number;
  lecturer: string;
  components: ComponentGrade[];
  finalScore: number;
  letterGrade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'E';
  gradePoint: number;
  status: 'Lulus' | 'Mengulang';
}

export interface AttendanceMeetingLog {
  meetingNo: number;
  date: string;
  topic: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  timeRecorded: string;
}

export interface AttendanceCourseRecord {
  id: string;
  courseCode: string;
  courseName: string;
  sks: number;
  lecturer: string;
  totalMeetings: number; // usually 16
  completedMeetings: number;
  presentCount: number;
  excusedCount: number;
  sickCount: number;
  absentCount: number;
  percentage: number;
  minRequiredPercent: number; // 75%
  isExamEligible: boolean;
  logs: AttendanceMeetingLog[];
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  category: 'Registrasi & KRS' | 'Perkuliahan' | 'Ujian' | 'Libur Akademik' | 'Wisuda & Yudisium';
  startDate: string;
  endDate: string;
  semester: string;
  description: string;
  isImportant?: boolean;
}


export interface StudentProfile {
  nim: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  campusId?: string;
  campus?: string;
  faculty: string;
  major: string;
  program: string; // S1
  academicYear: string;
  semester: number;
  status: 'Aktif' | 'Cuti' | 'Lulus';
  ipk: number;
  ips: number;
  totalSks: number;
  targetSks: number;
  academicAdvisor: {
    name: string;
    nip: string;
    email: string;
    phone: string;
  };
  uktStatus: 'Lunas' | 'Belum Lunas';
  ktmQrCode: string;
}

export interface ScheduleItem {
  id: string;
  campusId?: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  dayIndex: number; // 1-6
  courseCode: string;
  courseName: string;
  sks: number;
  timeStart: string;
  timeEnd: string;
  room: string;
  building: string;
  lecturer: string;
  type: 'Tatap Muka' | 'Online / Hybrid' | 'Praktikum';
  zoomLink?: string;
  attendancePercent: number;
  statusNow?: 'ongoing' | 'upcoming' | 'finished';
}

export interface CourseOffering {
  id: string;
  campusId?: string;
  code: string;
  name: string;
  sks: number;
  semester: number;
  lecturer: string;
  schedule: string;
  room: string;
  quota: number;
  enrolled: number;
  isSelected: boolean;
  category: 'Wajib' | 'Pilihan' | 'MBKM';
}

export interface KHSItem {
  courseCode: string;
  courseName: string;
  sks: number;
  grade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'E';
  gradePoint: number;
  score: number;
  status: 'Lulus' | 'Mengulang';
}

export interface KHSSemesterReport {
  semester: number;
  academicYear: string;
  ips: number;
  ipk: number;
  sksSemester: number;
  sksTotal: number;
  courses: KHSItem[];
}

export interface AssignmentItem {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  daysRemaining: number;
  status: 'Belum Selesai' | 'Diserahkan' | 'Dinilai';
  grade?: number;
  submittedFile?: string;
  submittedAt?: string;
}

export interface ExamItem {
  id: string;
  courseCode: string;
  courseName: string;
  type: 'UTS' | 'UAS';
  date: string;
  time: string;
  room: string;
  seatNumber: string;
  lecturer: string;
  instruction: string;
  status: 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai';
}

export interface AnnouncementItem {
  id: string;
  campusId?: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Akademik' | 'Rektorat' | 'Beasiswa' | 'Fasilitas' | 'Kemahasiswaan';
  sender: string;
  date: string;
  readTime: string;
  isImportant?: boolean;
  pdfAttachment?: string;
}

export interface NewsEventItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  type: 'Event' | 'Berita' | 'Workshop' | 'Seminar';
  date: string;
  time?: string;
  location: string;
  organizer: string;
  image: string;
  registeredCount: number;
  maxParticipants?: number;
  isRegistered?: boolean;
  tags: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'akademik' | 'pengumuman' | 'tugas' | 'sistem';
  isRead: boolean;
  actionUrl?: string;
}

export interface AIAction {
  type: 
    | 'navigate_krs' 
    | 'navigate_jadwal' 
    | 'navigate_khs' 
    | 'navigate_tugas' 
    | 'navigate_ujian' 
    | 'navigate_pengumuman' 
    | 'navigate_ukt' 
    | 'open_ktm'
    | 'open_attendance';
  label: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  action?: AIAction;
  isError?: boolean;
}

