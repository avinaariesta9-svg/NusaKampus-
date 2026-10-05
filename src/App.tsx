/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  INITIAL_STUDENT, 
  MOCK_SCHEDULES, 
  MOCK_COURSE_OFFERINGS, 
  MOCK_KHS_HISTORY, 
  MOCK_ASSIGNMENTS, 
  MOCK_EXAMS, 
  MOCK_ANNOUNCEMENTS, 
  MOCK_NEWS_EVENTS, 
  MOCK_NOTIFICATIONS,
  INITIAL_MEDIA_SLIDES,
  MOCK_TUITION_BILL
} from './data/mockData';
import { 
  TabType, 
  AcademicSubTab, 
  AnnouncementSubTab, 
  StudentProfile, 
  CourseOffering, 
  AssignmentItem, 
  ExamItem,
  NewsEventItem, 
  NotificationItem,
  MediaSlide,
  AIAction
} from './types';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { SearchModal } from './components/common/SearchModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { HomeTab } from './components/home/HomeTab';
import { AcademicTab } from './components/academic/AcademicTab';
import { AnnouncementTab } from './components/announcements/AnnouncementTab';
import { ProfileTab } from './components/profile/ProfileTab';
import { DigitalKTMModal } from './components/profile/DigitalKTMModal';
import { AttendanceModal } from './components/home/AttendanceModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NusaAIChatModal } from './components/ai/NusaAIChatModal';
import { FloatingNusaAIButton } from './components/common/FloatingNusaAIButton';
import { FirebaseProvider, useFirebase } from './components/auth/FirebaseContext';
import { 
  getSchedules, 
  getCourses, 
  getAnnouncements, 
  getMediaSlides, 
  saveMediaSlide, 
  deleteMediaSlide,
  getStudentProfile,
  getAssignments,
  getExams,
  getNewsEvents
} from './services/firebase/firestoreService';
import { Smartphone, Monitor, ShieldCheck, Sparkles, Bot, Database, Building2 } from 'lucide-react';

function AppContent() {
  const { user, role, campusId, setCampusId, logout, isFirebaseConnected, branding } = useFirebase();

  // Portal Mode: 'student' | 'admin'
  const [portalMode, setPortalMode] = useState<'student' | 'admin'>('student');

  // Student Profile State
  const [student, setStudent] = useState<StudentProfile>(() => {
    if (user && user.role === 'Mahasiswa') {
      return {
        ...INITIAL_STUDENT,
        name: user.name,
        email: user.email,
        nim: user.nimOrNip || INITIAL_STUDENT.nim,
        avatar: user.avatar || INITIAL_STUDENT.avatar,
        campus: campusId === 'campus-bandung' ? 'Kampus II (Bandung)' : campusId === 'campus-surabaya' ? 'Kampus III (Surabaya)' : 'Kampus Utama (Jakarta)',
      };
    }
    return INITIAL_STUDENT;
  });

  // Main Navigation State (Student Portal)
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [academicSubTab, setAcademicSubTab] = useState<AcademicSubTab>('jadwal');
  const [announcementSubTab, setAnnouncementSubTab] = useState<AnnouncementSubTab>('pengumuman');

  // Domain Interactive Data States
  const [courseOfferings, setCourseOfferings] = useState<CourseOffering[]>(MOCK_COURSE_OFFERINGS);
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(MOCK_ASSIGNMENTS);
  const [exams, setExams] = useState<ExamItem[]>(MOCK_EXAMS);
  const [newsEvents, setNewsEvents] = useState<NewsEventItem[]>(MOCK_NEWS_EVENTS);
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [mediaSlides, setMediaSlides] = useState<MediaSlide[]>(INITIAL_MEDIA_SLIDES);

  // Modals & Drawers
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isKtmOpen, setIsKtmOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Desktop Device Frame View Mode
  const [mobileFrameMode, setMobileFrameMode] = useState<boolean>(false);

  // Unread notifications count
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // Sync student data when user/campus changes
  useEffect(() => {
    if (user) {
      setStudent((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        nim: user.nimOrNip || prev.nim,
        avatar: user.avatar || prev.avatar,
        major: user.major || prev.major,
      }));
    }
  }, [user, campusId]);

  // Load campus data from Firestore (with automatic fallback to mock data)
  useEffect(() => {
    let isMounted = true;

    async function loadCampusData() {
      try {
        const [schs, crss, anns, slds, stdProfile, asgns, exms, nEvents] = await Promise.all([
          getSchedules(campusId),
          getCourses(campusId),
          getAnnouncements(campusId),
          getMediaSlides(campusId),
          getStudentProfile(campusId),
          getAssignments(campusId),
          getExams(campusId),
          getNewsEvents(campusId),
        ]);
        if (isMounted) {
          if (schs && schs.length) setSchedules(schs);
          if (crss && crss.length) setCourseOfferings(crss);
          if (anns && anns.length) setAnnouncements(anns);
          if (slds && slds.length) setMediaSlides(slds);
          if (asgns && asgns.length) setAssignments(asgns);
          if (exms && exms.length) setExams(exms);
          if (nEvents && nEvents.length) setNewsEvents(nEvents);
          if (stdProfile && (!user || user.role === 'Mahasiswa')) {
            setStudent(stdProfile);
          }
        }
      } catch (err) {
        console.warn('Campus data fetch error, maintaining active data:', err);
      }
    }

    loadCampusData();

    return () => {
      isMounted = false;
    };
  }, [campusId, user]);

  // Media Slides Handlers (sync with Firestore)
  const handleAddSlide = async (slide: MediaSlide) => {
    setMediaSlides((prev) => [slide, ...prev]);
    await saveMediaSlide(slide);
  };

  const handleEditSlide = async (updatedSlide: MediaSlide) => {
    setMediaSlides((prev) =>
      prev.map((s) => (s.id === updatedSlide.id ? updatedSlide : s))
    );
    await saveMediaSlide(updatedSlide);
  };

  const handleDeleteSlide = async (id: string) => {
    setMediaSlides((prev) => prev.filter((s) => s.id !== id));
    await deleteMediaSlide(id);
  };

  const handleToggleActiveSlide = async (id: string) => {
    let modified: MediaSlide | undefined;
    setMediaSlides((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          modified = { ...s, isActive: !s.isActive };
          return modified;
        }
        return s;
      })
    );
    if (modified) {
      await saveMediaSlide(modified);
    }
  };

  // Student Portal Handlers
  const handleLoginSuccess = (studentData?: Partial<StudentProfile>) => {
    if (studentData) {
      setStudent((prev) => ({
        ...prev,
        ...studentData,
      }));
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCourse = (courseId: string) => {
    setCourseOfferings((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              isSelected: !c.isSelected,
              enrolled: c.isSelected ? c.enrolled - 1 : c.enrolled + 1,
            }
          : c
      )
    );
  };

  const handleSubmitAssignment = (assignmentId: string, fileName: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'Diserahkan',
              submittedFile: fileName,
              submittedAt: 'Baru saja diunggah',
            }
          : a
      )
    );
  };

  const handleToggleEventRegistration = (eventId: string) => {
    setNewsEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const nextRegistered = !e.isRegistered;
          return {
            ...e,
            isRegistered: nextRegistered,
            registeredCount: nextRegistered ? e.registeredCount + 1 : e.registeredCount - 1,
          };
        }
        return e;
      })
    );
  };

  const handleMarkAllNotifsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkNotifItemAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleNavigateToAcademic = (subtab: AcademicSubTab) => {
    setAcademicSubTab(subtab);
    setActiveTab('akademik');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAnnouncement = (subtab: AnnouncementSubTab) => {
    setAnnouncementSubTab(subtab);
    setActiveTab('pengumuman');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchNavigate = (tab: TabType, subtab?: string) => {
    setActiveTab(tab);
    if (tab === 'akademik' && subtab) {
      setAcademicSubTab(subtab as AcademicSubTab);
    }
    if (tab === 'pengumuman' && subtab) {
      setAnnouncementSubTab(subtab as AnnouncementSubTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // AI Navigation Action Executor
  const handleAIAction = (actionType: AIAction['type']) => {
    switch (actionType) {
      case 'navigate_krs':
        handleNavigateToAcademic('krs');
        break;
      case 'navigate_jadwal':
        handleNavigateToAcademic('jadwal');
        break;
      case 'navigate_tugas':
        handleNavigateToAcademic('tugas');
        break;
      case 'navigate_khs':
        handleNavigateToAcademic('khs');
        break;
      case 'navigate_ujian':
        handleNavigateToAcademic('ujian');
        break;
      case 'navigate_pengumuman':
        handleNavigateToAnnouncement('pengumuman');
        break;
      case 'open_ktm':
        setIsKtmOpen(true);
        break;
      case 'open_attendance':
        setIsAttendanceOpen(true);
        break;
      default:
        break;
    }
  };

  /* ========================================================================= */
  /* UN-AUTHENTICATED ROUTING                                                  */
  /* ========================================================================= */
  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  /* ========================================================================= */
  /* PORTAL ADMIN ROUTING                                                      */
  /* ========================================================================= */
  if (portalMode === 'admin') {
    return (
      <>
        <AdminDashboard
          onExitToStudentPortal={() => setPortalMode('student')}
          mediaSlides={mediaSlides}
          onAddSlide={handleAddSlide}
          onEditSlide={handleEditSlide}
          onDeleteSlide={handleDeleteSlide}
          onToggleActiveSlide={handleToggleActiveSlide}
          onOpenNusaAI={() => setIsAIOpen(true)}
        />

        {/* Global Floating NusaAI Button */}
        <FloatingNusaAIButton onClick={() => setIsAIOpen(true)} />

        {/* NusaAI Assistant Dialog */}
        <NusaAIChatModal
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          context={{
            role,
            student,
            schedules,
            assignments,
            exams,
            courseOfferings,
            khsHistory: MOCK_KHS_HISTORY,
            announcements,
            newsEvents,
            tuitionBill: MOCK_TUITION_BILL,
          }}
          onExecuteAction={handleAIAction}
        />
      </>
    );
  }

  /* ========================================================================= */
  /* PORTAL MAHASISWA & USER INTERFACE                                         */
  /* ========================================================================= */
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col items-center">
      {/* Top Desktop Frame & Role Switcher Bar */}
      <div className="hidden lg:flex w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 py-2.5 items-center justify-between text-xs text-slate-600 z-50 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-slate-900">{branding.appName || 'NusaCampus Super App'}</span>
          <span className="text-slate-300">·</span>
          
          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] border"
                style={{ backgroundColor: `${branding.primaryColor || '#4f46e5'}15`, color: branding.primaryColor || '#4f46e5', borderColor: `${branding.primaryColor || '#4f46e5'}40` }}>
            {branding.name || 'NusaCampus (Kampus Terpadu)'}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
            Role: {role}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick NusaAI Header Trigger */}
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs shadow-xs hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-200" />
            <span>Tanya NusaAI</span>
          </button>

          {/* Switch to Admin Portal Button (Enabled for Admin / Super Admin or preview) */}
          {(role === 'Super Admin' || role === 'Admin' || role === 'Mahasiswa' || role === 'Dosen') && (
            <button
              onClick={() => setPortalMode('admin')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold shadow-xs transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal Admin</span>
            </button>
          )}

          <button
            onClick={() => setMobileFrameMode(!mobileFrameMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
          >
            {mobileFrameMode ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{mobileFrameMode ? 'Tampilan Responsif Penuh' : 'Mode Bingkai Smartphone'}</span>
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col min-h-screen ${
          mobileFrameMode
            ? 'max-w-[430px] my-6 rounded-[44px] ring-12 ring-slate-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-300 bg-slate-50'
            : 'max-w-lg shadow-xl bg-slate-50 border-x border-slate-200/80'
        }`}
      >
        {/* Mobile Status Bar Simulation when in Device Frame Mode */}
        {mobileFrameMode && (
          <div className="pt-2 px-6 pb-1 bg-white border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-800 font-bold select-none">
            <span>09:41</span>
            <div className="w-24 h-4 bg-slate-900 rounded-full" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Global Header with Multi-Campus Selector */}
        <Header
          student={student}
          unreadCount={unreadNotifsCount}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenKtmModal={() => setIsKtmOpen(true)}
          onSelectTab={handleSelectTab}
          activeTab={activeTab}
          onOpenNusaAI={() => setIsAIOpen(true)}
          activeCampusId={campusId}
          onCampusChange={(cid) => setCampusId(cid)}
        />

        {/* Mobile Portal Switcher Quick Pill (Visible on mobile screens) */}
        <div className="lg:hidden px-4 pt-2.5 pb-1 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              Role: {role}
            </span>
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold border"
                  style={{ backgroundColor: `${branding.primaryColor || '#4f46e5'}15`, color: branding.primaryColor || '#4f46e5', borderColor: `${branding.primaryColor || '#4f46e5'}30` }}>
              {branding.appName}
            </span>
          </div>
          <button
            onClick={() => setPortalMode('admin')}
            className="text-[11px] text-indigo-700 hover:text-indigo-800 font-bold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Portal Admin</span>
          </button>
        </div>

        {/* Main Content View Switcher */}
        <main className="flex-1 w-full overflow-x-hidden pb-16 sm:pb-8">
          {activeTab === 'home' && (
            <HomeTab
              student={student}
              schedules={schedules}
              assignments={assignments}
              announcements={announcements}
              newsEvents={newsEvents}
              exams={exams}
              mediaSlides={mediaSlides}
              onNavigateToAcademic={handleNavigateToAcademic}
              onNavigateToAnnouncement={handleNavigateToAnnouncement}
              onOpenKtmModal={() => setIsKtmOpen(true)}
              onOpenAttendanceModal={() => setIsAttendanceOpen(true)}
              onOpenNotifications={() => setIsNotificationOpen(true)}
              onOpenNusaAI={() => setIsAIOpen(true)}
            />
          )}

          {(activeTab === 'akademik' || activeTab === 'jadwal') && (
            <AcademicTab
              initialSubTab={academicSubTab}
              schedules={schedules}
              courseOfferings={courseOfferings}
              onToggleCourse={handleToggleCourse}
              khsHistory={MOCK_KHS_HISTORY}
              assignments={assignments}
              onSubmitAssignment={handleSubmitAssignment}
              exams={exams}
              onOpenAttendanceScan={() => setIsAttendanceOpen(true)}
            />
          )}

          {activeTab === 'pengumuman' && (
            <AnnouncementTab
              initialSubTab={announcementSubTab}
              announcements={announcements}
              newsEvents={newsEvents}
              onToggleEventRegistration={handleToggleEventRegistration}
            />
          )}

          {activeTab === 'profil' && (
            <ProfileTab
              student={student}
              onOpenKtmModal={() => setIsKtmOpen(true)}
              onLogout={handleLogout}
              onNavigateToAcademic={handleNavigateToAcademic}
              onOpenAdminPortal={() => setPortalMode('admin')}
            />
          )}
        </main>

        {/* Global Bottom Navigation (Beranda – Akademik – Jadwal – Notifikasi – Profil) */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          taskPendingCount={assignments.filter((a) => a.status === 'Belum Selesai').length}
          unreadNotifsCount={unreadNotifsCount}
        />

        {/* Floating NusaAI Assistant Button (Accessible anywhere) */}
        <FloatingNusaAIButton onClick={() => setIsAIOpen(true)} />

        {/* Notifications Slide-Over Drawer */}
        <NotificationDrawer
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllNotifsAsRead}
          onMarkItemAsRead={handleMarkNotifItemAsRead}
        />

        {/* Global Quick Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={handleSearchNavigate}
        />

        {/* Digital Student Card (KTM) Modal */}
        <DigitalKTMModal
          isOpen={isKtmOpen}
          onClose={() => setIsKtmOpen(false)}
          student={student}
        />

        {/* Attendance QR Simulation Modal */}
        <AttendanceModal
          isOpen={isAttendanceOpen}
          onClose={() => setIsAttendanceOpen(false)}
        />

        {/* NusaAI Assistant Dialog Modal */}
        <NusaAIChatModal
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          context={{
            role,
            student,
            schedules,
            assignments,
            exams,
            courseOfferings,
            khsHistory: MOCK_KHS_HISTORY,
            announcements,
            newsEvents,
            tuitionBill: MOCK_TUITION_BILL,
          }}
          onExecuteAction={handleAIAction}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}
