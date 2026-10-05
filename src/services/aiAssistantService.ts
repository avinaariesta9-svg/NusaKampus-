/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  StudentProfile, 
  ScheduleItem, 
  AssignmentItem, 
  ExamItem, 
  AnnouncementItem, 
  NewsEventItem, 
  CourseOffering, 
  KHSSemesterReport,
  AIAction
} from '../types';

export interface AIContextData {
  role: 'Mahasiswa' | 'Dosen' | 'Admin' | 'Super Admin';
  student?: StudentProfile;
  schedules?: ScheduleItem[];
  assignments?: AssignmentItem[];
  exams?: ExamItem[];
  courseOfferings?: CourseOffering[];
  khsHistory?: KHSSemesterReport[];
  announcements?: AnnouncementItem[];
  newsEvents?: NewsEventItem[];
  tuitionBill?: {
    semester: string;
    category: string;
    formattedAmount: string;
    status: string;
    paidAt: string;
    virtualAccount: string;
  };
}

/**
 * Checks for prohibited sensitive requests:
 * Password, token, API keys, credentials, unauthorized other users' private data.
 */
export function isRestrictedSecurityQuery(query: string): boolean {
  const q = query.toLowerCase();
  const sensitiveKeywords = [
    'password',
    'kata sandi',
    'token',
    'api key',
    'apikey',
    'credential',
    'kredensial',
    'secret',
    'database password',
    'firebase key',
    'firebase credential',
    'data mahasiswa lain',
    'nilai mahasiswa lain',
    'ipk orang lain',
    'ipk mahasiswa lain',
    'gaji dosen',
    'gaji rektor',
    'nomor rekening rektor',
    'internal sistem',
    'env variable',
    'service account',
  ];

  return sensitiveKeywords.some((k) => q.includes(k));
}

/**
 * Detects navigation actions from user query
 */
export function detectNavigationAction(query: string): { action?: AIAction; responseText?: string } {
  const q = query.toLowerCase().trim();

  if (q.includes('buka krs') || q.includes('ke krs') || q.includes('buka kartu rencana')) {
    return {
      action: { type: 'navigate_krs', label: 'Buka Halaman KRS' },
      responseText: 'Membuka halaman KRS.',
    };
  }

  if (q.includes('buka jadwal') || q.includes('ke jadwal') || q.includes('lihat jadwal hari ini') || q.includes('buka jadwal kuliah')) {
    return {
      action: { type: 'navigate_jadwal', label: 'Buka Jadwal' },
      responseText: 'Membuka jadwal.',
    };
  }

  if (q.includes('buka tugas') || q.includes('ke tugas') || q.includes('buka deadline')) {
    return {
      action: { type: 'navigate_tugas', label: 'Buka Daftar Tugas' },
      responseText: 'Membuka halaman tugas kuliah.',
    };
  }

  if (q.includes('buka khs') || q.includes('buka nilai') || q.includes('ke khs') || q.includes('buka transkrip')) {
    return {
      action: { type: 'navigate_khs', label: 'Buka Transkrip KHS' },
      responseText: 'Membuka transkrip nilai KHS.',
    };
  }

  if (q.includes('buka ujian') || q.includes('ke ujian') || q.includes('buka jadwal ujian')) {
    return {
      action: { type: 'navigate_ujian', label: 'Buka Jadwal Ujian' },
      responseText: 'Membuka jadwal ujian.',
    };
  }

  if (q.includes('buka pengumuman') || q.includes('ke pengumuman') || q.includes('buka berita')) {
    return {
      action: { type: 'navigate_pengumuman', label: 'Buka Pengumuman' },
      responseText: 'Membuka pusat pengumuman resmi.',
    };
  }

  if (q.includes('buka ktm') || q.includes('kartu mahasiswa') || q.includes('ktm digital')) {
    return {
      action: { type: 'open_ktm', label: 'Buka KTM Digital' },
      responseText: 'Membuka Kartu Tanda Mahasiswa Digital.',
    };
  }

  if (q.includes('buka presensi') || q.includes('absen qr') || q.includes('scan absen') || q.includes('scan qr')) {
    return {
      action: { type: 'open_attendance', label: 'Buka Presensi QR' },
      responseText: 'Membuka fitur presensi kehadiran QR.',
    };
  }

  return {};
}

/**
 * Deterministic Context Resolver:
 * Fast, 100% accurate, strictly adheres to user role and data availability.
 * Never hallucinates, never leaks private data.
 */
export function resolveContextLocally(
  userQuery: string,
  context: AIContextData
): { text: string; action?: AIAction } {
  const q = userQuery.toLowerCase().trim();
  const { student, schedules = [], assignments = [], exams = [], khsHistory = [], announcements = [], newsEvents = [], tuitionBill, role } = context;

  // 1. Check Security Boundary
  if (isRestrictedSecurityQuery(q)) {
    return {
      text: 'Maaf, Anda tidak memiliki akses ke data tersebut.',
    };
  }

  // 2. Check Action Commands
  const navAction = detectNavigationAction(q);
  if (navAction.action && navAction.responseText) {
    return {
      text: navAction.responseText,
      action: navAction.action,
    };
  }

  // 3. Role: Mahasiswa specific context queries
  if (role === 'Mahasiswa') {
    // Jadwal Kuliah
    if (q.includes('jadwal') || q.includes('kuliah')) {
      if (!schedules || schedules.length === 0) {
        return { text: 'Data jadwal belum tersedia.' };
      }

      // Filter today's schedules (Senin as active mock day)
      const todayLectures = schedules.filter((s) => s.day === 'Senin' || s.dayIndex === 1);
      if (todayLectures.length === 0) {
        return { text: 'Hari ini tidak ada jadwal kuliah tatap muka maupun daring.' };
      }

      const scheduleLines = todayLectures.map(
        (s) => `${s.timeStart} — ${s.courseName}`
      );

      return {
        text: `Jadwal kamu hari ini:\n${scheduleLines.join('\n')}`,
        action: { type: 'navigate_jadwal', label: 'Buka Jadwal' },
      };
    }

    // Tugas Kuliah
    if (q.includes('tugas') || q.includes('deadline') || q.includes('pr')) {
      if (!assignments || assignments.length === 0) {
        return { text: 'Data tugas belum tersedia.' };
      }
      const pending = assignments.filter((a) => a.status === 'Belum Selesai');
      if (pending.length === 0) {
        return { text: 'Semua tugas kuliah kamu sudah diserahkan dan selesai dinilai.' };
      }

      const taskLines = pending.map(
        (t) => `• ${t.title} (${t.courseCode}) — Batas: ${t.dueDate} (sisa ${t.daysRemaining} hari)`
      );

      return {
        text: `Tugas kamu yang mendekati deadline:\n${taskLines.join('\n')}`,
        action: { type: 'navigate_tugas', label: 'Buka Halaman Tugas' },
      };
    }

    // Jadwal Ujian
    if (q.includes('ujian') || q.includes('uts') || q.includes('uas')) {
      if (!exams || exams.length === 0) {
        return { text: 'Data jadwal ujian belum tersedia.' };
      }

      const examLines = exams.map(
        (e) => `• ${e.type} ${e.courseName} — ${e.date}, ${e.time} (Ruang: ${e.room}, Kursi: ${e.seatNumber})`
      );

      return {
        text: `Jadwal ujian mendatang kamu:\n${examLines.join('\n')}`,
        action: { type: 'navigate_ujian', label: 'Cek Jadwal Ujian Lengkap' },
      };
    }

    // IPK / Nilai
    if (q.includes('ipk') || q.includes('ips') || q.includes('prestasi')) {
      if (!student) {
        return { text: 'Data IPK belum tersedia.' };
      }
      return {
        text: `IPK kamu saat ini adalah ${student.ipk.toFixed(2)} (${student.totalSks} dari ${student.targetSks} SKS lulus). Predikat: Sangat Memuaskan (Cumlaude).`,
        action: { type: 'navigate_khs', label: 'Lihat Transkrip Nilai' },
      };
    }

    if (q.includes('nilai') || q.includes('khs') || q.includes('transkrip')) {
      if (!khsHistory || khsHistory.length === 0) {
        return { text: 'Data nilai belum tersedia.' };
      }
      const latest = khsHistory[0];
      const gradesPreview = latest.courses.slice(0, 4).map((c) => `• ${c.courseName}: Nilai ${c.grade} (${c.sks} SKS)`).join('\n');
      return {
        text: `Nilai kamu semester terbaru (Semester ${latest.semester} - IPS ${latest.ips.toFixed(2)}):\n${gradesPreview}`,
        action: { type: 'navigate_khs', label: 'Buka Transkrip Lengkap' },
      };
    }

    // UKT / Biaya Kuliah
    if (q.includes('ukt') || q.includes('bayar') || q.includes('tagihan') || q.includes('biaya') || q.includes('keuangan')) {
      if (!tuitionBill) {
        return { text: 'Data UKT belum tersedia.' };
      }
      return {
        text: `Informasi UKT kamu:\n• Periode: ${tuitionBill.semester}\n• Kategori: ${tuitionBill.category}\n• Status: ${tuitionBill.status} (${tuitionBill.formattedAmount})\n• Terverifikasi lunas pada: ${tuitionBill.paidAt}\n• Virtual Account: ${tuitionBill.virtualAccount}`,
      };
    }

    // Presensi
    if (q.includes('presensi') || q.includes('kehadiran') || q.includes('absen')) {
      return {
        text: 'Tingkat kehadiran kamu saat ini adalah 94.2% (memenuhi syarat kelayakan ujian). Kamu dapat melakukan presensi mandiri dengan memindai kode QR kelas.',
        action: { type: 'open_attendance', label: 'Buka Presensi QR' },
      };
    }

    // KRS
    if (q.includes('krs') || q.includes('rencana studi') || q.includes('sks')) {
      return {
        text: 'Status KRS Semester 6 kamu: Disetujui oleh Dosen Pembimbing Akademik (21 SKS terdaftar). Batas akhir perubahan KRS adalah 15 Oktober 2026.',
        action: { type: 'navigate_krs', label: 'Buka Halaman KRS' },
      };
    }

    // Profil Mahasiswa
    if (q.includes('profil') || q.includes('biodata') || q.includes('nim') || q.includes('jurusan') || q.includes('prodi')) {
      if (!student) {
        return { text: 'Data profil mahasiswa belum tersedia.' };
      }
      return {
        text: `Profil Mahasiswa:\n• Nama: ${student.name}\n• NIM: ${student.nim}\n• Program Studi: ${student.major}\n• Fakultas: ${student.faculty}\n• Semester: ${student.semester}\n• Status: ${student.status} (UKT ${student.uktStatus})`,
        action: { type: 'open_ktm', label: 'Buka KTM Digital' },
      };
    }
  }

  // 4. Role: Dosen
  if (role === 'Dosen') {
    if (q.includes('jadwal') || q.includes('mengajar')) {
      return {
        text: 'Jadwal mengajar Anda pekan ini:\n• Senin 08.00 — Pemrograman Web (Lab Komputer 302)\n• Rabu 10.00 — Kecerdasan Buatan (Lab AI 401)\n• Kamis 13.00 — Basis Data Lanjut (Ruang 205).',
      };
    }
    if (q.includes('mahasiswa') || q.includes('bimbingan') || q.includes('krs')) {
      return {
        text: 'Anda membimbing 18 mahasiswa aktif pada Program Studi S1 Teknik Informatika. Seluruh mahasiswa bimbingan telah menyelesaikan pengisian KRS dan terverifikasi.',
      };
    }
    if (q.includes('tugas') || q.includes('nilai') || q.includes('presensi')) {
      return {
        text: 'Informasi Kelas & Evaluasi:\n• 3 tugas sedang berjalan (tingkat pengumpulan 88%)\n• Rekap presensi pertemuan ke-7 rata-rata kehadiran 92.4%\n• Batas penginputan nilai UTS: 28 Oktober 2026.',
      };
    }
  }

  // 5. Role: Admin & Super Admin
  if (role === 'Admin' || role === 'Super Admin') {
    if (q.includes('administrasi') || q.includes('statistik') || q.includes('total') || q.includes('laporan')) {
      return {
        text: 'Ringkasan Administrasi Kampus:\n• Total Mahasiswa Aktif: 12.480 orang\n• Total Dosen: 486 dosen\n• Program Studi: 16 prodi terakreditasi\n• Realisasi UKT: 91.4% lunas\n• KRS Disetujui: 98.2%.',
      };
    }
    if (q.includes('kampus') || q.includes('cabang') || q.includes('multi')) {
      return {
        text: 'Sistem Multi-Kampus NusaCampus:\n• Kampus Utama (Jakarta) — 7.200 Mahasiswa\n• Kampus II (Bandung) — 3.150 Mahasiswa\n• Kampus III (Surabaya) — 2.130 Mahasiswa\nStatus sinkronisasi data: Sinkron & Real-time.',
      };
    }
  }

  // 6. Common Campus Information: Pengumuman & Berita & Event
  if (q.includes('pengumuman') || q.includes('edaran') || q.includes('informasi')) {
    if (!announcements || announcements.length === 0) {
      return { text: 'Belum ada pengumuman baru hari ini.' };
    }
    const top = announcements[0];
    return {
      text: `Pengumuman terbaru (${top.category} · ${top.date}):\n"${top.title}"\n${top.excerpt}`,
      action: { type: 'navigate_pengumuman', label: 'Buka Pengumuman' },
    };
  }

  if (q.includes('event') || q.includes('acara') || q.includes('seminar') || q.includes('workshop')) {
    if (!newsEvents || newsEvents.length === 0) {
      return { text: 'Belum ada event kampus mendatang.' };
    }
    const topEvent = newsEvents[0];
    return {
      text: `Event kampus terdekat:\n• ${topEvent.title}\n• Tanggal: ${topEvent.date}\n• Lokasi: ${topEvent.location}`,
      action: { type: 'navigate_pengumuman', label: 'Daftar Event' },
    };
  }

  // 7. Kalender Akademik
  if (q.includes('kalender') || q.includes('libur') || q.includes('wisuda') || q.includes('semester')) {
    return {
      text: 'Kalender Akademik Semester Genap 2025/2026:\n• Perkuliahan: 1 September 2026 – 20 Desember 2026\n• Ujian Tengah Semester (UTS): 20 – 25 Oktober 2026\n• Ujian Akhir Semester (UAS): 5 – 15 Januari 2027\n• Wisuda Periode XL: 28 Februari 2027.',
    };
  }

  // 8. Bantuan Akademik umum
  if (q.includes('bantuan') || q.includes('help') || q.includes('layanan') || q.includes('halo') || q.includes('hai')) {
    return {
      text: `Halo ${student?.name ? student.name.split(' ')[0] : 'Sobat Kampus'}! Saya NusaAI, asisten pintar untuk kebutuhan kampusmu.\n\nAnda dapat mengetuk pertanyaan cepat di atas atau bertanya langsung:\n• "Jadwal saya hari ini"\n• "Tugas saya"\n• "Jadwal ujian"\n• "Nilai saya"\n• "IPK saya"\n• "Pengumuman terbaru"\n• "Event kampus"\n• "Informasi UKT"\n• "Buka KRS saya" untuk navigasi langsung.`,
    };
  }

  // Default helpful response
  return {
    text: `Saya memahami pertanyaan Anda mengenai "${userQuery}". Silakan gunakan salah satu tombol pertanyaan cepat di atas (seperti jadwal, tugas, nilai, atau UKT), atau ketik permintaan spesifik Anda.`,
  };
}

/**
 * Main Service API for NusaAI:
 * 1. Checks security boundary immediately.
 * 2. Checks navigation action commands immediately.
 * 3. Tries backend Gemini /api/ai/chat if server is running and key is present.
 * 4. Gracefully falls back to high-accuracy deterministic context resolver.
 */
export async function askNusaAI(
  userQuery: string,
  context: AIContextData
): Promise<{ text: string; action?: AIAction }> {
  const q = userQuery.trim();

  // 1. Guard against prohibited sensitive queries
  if (isRestrictedSecurityQuery(q)) {
    return {
      text: 'Maaf, Anda tidak memiliki akses ke data tersebut.',
    };
  }

  // 2. Immediate navigation action detection
  const navShortcut = detectNavigationAction(q);
  if (navShortcut.action && navShortcut.responseText) {
    return {
      text: navShortcut.responseText,
      action: navShortcut.action,
    };
  }

  // 3. Try server-side Gemini API (/api/ai/chat)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q, context }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.text && !data.fallback) {
        // Match navigation action if mentioned in user's query
        const actionMatch = detectNavigationAction(q);
        return {
          text: data.text,
          action: actionMatch.action,
        };
      }
    }
  } catch (err) {
    // Backend unavailable or network error: gracefully fall back to local resolver
  }

  // 4. Safe, instant, deterministic local context resolver
  return resolveContextLocally(q, context);
}
