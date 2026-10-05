/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  AdminTab, 
  AdminRole, 
  AdminStudent, 
  AdminLecturer, 
  AdminStudyProgram, 
  AdminCourse, 
  AdminClass, 
  AdminSchedule, 
  AdminAnnouncement, 
  AdminAssignmentExam 
} from '../../types/admin';
import { MediaSlide } from '../../types';
import { 
  INITIAL_ADMIN_STUDENTS, 
  INITIAL_ADMIN_LECTURERS, 
  INITIAL_ADMIN_PRODI, 
  INITIAL_ADMIN_COURSES, 
  INITIAL_ADMIN_CLASSES, 
  INITIAL_ADMIN_SCHEDULES, 
  INITIAL_ADMIN_ANNOUNCEMENTS, 
  INITIAL_ADMIN_ASSIGNMENTS_EXAMS 
} from '../../data/adminMockData';
import { INITIAL_MEDIA_SLIDES } from '../../data/mockData';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminOverviewView } from './AdminOverviewView';
import { AdminStudentsView } from './AdminStudentsView';
import { AdminLecturersView } from './AdminLecturersView';
import { AdminProdiView } from './AdminProdiView';
import { AdminCoursesClassesView } from './AdminCoursesClassesView';
import { AdminScheduleView } from './AdminScheduleView';
import { AdminAnnouncementsView } from './AdminAnnouncementsView';
import { AdminAssignmentsExamsView } from './AdminAssignmentsExamsView';
import { AdminReportsView } from './AdminReportsView';
import { AdminSettingsView } from './AdminSettingsView';
import { AdminMediaSliderView } from './AdminMediaSliderView';
import { QuickActionModal } from './QuickActionModal';

interface AdminDashboardProps {
  onExitToStudentPortal: () => void;
  mediaSlides?: MediaSlide[];
  onAddSlide?: (slide: MediaSlide) => void;
  onEditSlide?: (slide: MediaSlide) => void;
  onDeleteSlide?: (id: string) => void;
  onToggleActiveSlide?: (id: string) => void;
  onOpenNusaAI?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitToStudentPortal,
  mediaSlides: propSlides,
  onAddSlide: propAddSlide,
  onEditSlide: propEditSlide,
  onDeleteSlide: propDeleteSlide,
  onToggleActiveSlide: propToggleActiveSlide,
  onOpenNusaAI,
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<AdminRole>('Super Admin');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Action Modal State
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<
    'mahasiswa' | 'dosen' | 'matakuliah' | 'pengumuman' | 'jadwal'
  >('mahasiswa');

  // Interactive Datasets State
  const [students, setStudents] = useState<AdminStudent[]>(INITIAL_ADMIN_STUDENTS);
  const [lecturers, setLecturers] = useState<AdminLecturer[]>(INITIAL_ADMIN_LECTURERS);
  const [prodiList, setProdiList] = useState<AdminStudyProgram[]>(INITIAL_ADMIN_PRODI);
  const [courses, setCourses] = useState<AdminCourse[]>(INITIAL_ADMIN_COURSES);
  const [classes, setClasses] = useState<AdminClass[]>(INITIAL_ADMIN_CLASSES);
  const [schedules, setSchedules] = useState<AdminSchedule[]>(INITIAL_ADMIN_SCHEDULES);
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>(INITIAL_ADMIN_ANNOUNCEMENTS);
  const [assignmentsExams, setAssignmentsExams] = useState<AdminAssignmentExam[]>(
    INITIAL_ADMIN_ASSIGNMENTS_EXAMS
  );

  // Local Media Slides State (if not provided via props)
  const [localSlides, setLocalSlides] = useState<MediaSlide[]>(INITIAL_MEDIA_SLIDES);
  const slides = propSlides || localSlides;

  const handleAddSlide = (s: MediaSlide) => {
    if (propAddSlide) propAddSlide(s);
    else setLocalSlides((prev) => [s, ...prev]);
  };

  const handleEditSlide = (s: MediaSlide) => {
    if (propEditSlide) propEditSlide(s);
    else setLocalSlides((prev) => prev.map((item) => (item.id === s.id ? s : item)));
  };

  const handleDeleteSlide = (id: string) => {
    if (propDeleteSlide) propDeleteSlide(id);
    else setLocalSlides((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleActiveSlide = (id: string) => {
    if (propToggleActiveSlide) propToggleActiveSlide(id);
    else
      setLocalSlides((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
      );
  };

  // Student CRUD
  const handleAddStudent = (s: AdminStudent) => setStudents((prev) => [s, ...prev]);
  const handleEditStudent = (s: AdminStudent) =>
    setStudents((prev) => prev.map((item) => (item.id === s.id ? s : item)));
  const handleDeleteStudent = (id: string) =>
    setStudents((prev) => prev.filter((item) => item.id !== id));

  // Lecturer CRUD
  const handleAddLecturer = (l: AdminLecturer) => setLecturers((prev) => [l, ...prev]);
  const handleEditLecturer = (l: AdminLecturer) =>
    setLecturers((prev) => prev.map((item) => (item.id === l.id ? l : item)));
  const handleDeleteLecturer = (id: string) =>
    setLecturers((prev) => prev.filter((item) => item.id !== id));

  // Prodi CRUD
  const handleAddProdi = (p: AdminStudyProgram) => setProdiList((prev) => [p, ...prev]);
  const handleEditProdi = (p: AdminStudyProgram) =>
    setProdiList((prev) => prev.map((item) => (item.id === p.id ? p : item)));
  const handleDeleteProdi = (id: string) =>
    setProdiList((prev) => prev.filter((item) => item.id !== id));

  // Course CRUD
  const handleAddCourse = (c: AdminCourse) => setCourses((prev) => [c, ...prev]);
  const handleEditCourse = (c: AdminCourse) =>
    setCourses((prev) => prev.map((item) => (item.id === c.id ? c : item)));
  const handleDeleteCourse = (id: string) =>
    setCourses((prev) => prev.filter((item) => item.id !== id));

  // Class CRUD
  const handleAddClass = (cls: AdminClass) => setClasses((prev) => [cls, ...prev]);
  const handleEditClass = (cls: AdminClass) =>
    setClasses((prev) => prev.map((item) => (item.id === cls.id ? cls : item)));
  const handleDeleteClass = (id: string) =>
    setClasses((prev) => prev.filter((item) => item.id !== id));

  // Schedule CRUD
  const handleAddSchedule = (sch: AdminSchedule) => setSchedules((prev) => [sch, ...prev]);
  const handleEditSchedule = (sch: AdminSchedule) =>
    setSchedules((prev) => prev.map((item) => (item.id === sch.id ? sch : item)));
  const handleDeleteSchedule = (id: string) =>
    setSchedules((prev) => prev.filter((item) => item.id !== id));

  // Announcement CRUD
  const handleAddAnnouncement = (ann: AdminAnnouncement) =>
    setAnnouncements((prev) => [ann, ...prev]);
  const handleEditAnnouncement = (ann: AdminAnnouncement) =>
    setAnnouncements((prev) => prev.map((item) => (item.id === ann.id ? ann : item)));
  const handleDeleteAnnouncement = (id: string) =>
    setAnnouncements((prev) => prev.filter((item) => item.id !== id));

  // Assignment / Exam CRUD
  const handleAddAssignmentExam = (item: AdminAssignmentExam) =>
    setAssignmentsExams((prev) => [item, ...prev]);
  const handleEditAssignmentExam = (item: AdminAssignmentExam) =>
    setAssignmentsExams((prev) => prev.map((i) => (i.id === item.id ? item : i)));
  const handleDeleteAssignmentExam = (id: string) =>
    setAssignmentsExams((prev) => prev.filter((i) => i.id !== id));

  // Open Quick Action
  const handleOpenQuickAction = (
    type: 'mahasiswa' | 'dosen' | 'matakuliah' | 'pengumuman' | 'jadwal' = 'mahasiswa'
  ) => {
    setQuickActionType(type);
    setIsQuickActionOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onExitToStudentPortal={onExitToStudentPortal}
        currentRole={currentRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Header */}
        <AdminHeader
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenQuickAction={() => handleOpenQuickAction('mahasiswa')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onExitToStudentPortal={onExitToStudentPortal}
          onOpenNusaAI={onOpenNusaAI}
        />

        {/* Views Container */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <AdminOverviewView
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenQuickAction={handleOpenQuickAction}
            />
          )}

          {activeTab === 'slider' && (
            <AdminMediaSliderView
              slides={slides}
              onAddSlide={handleAddSlide}
              onEditSlide={handleEditSlide}
              onDeleteSlide={handleDeleteSlide}
              onToggleActive={handleToggleActiveSlide}
              externalSearchQuery={searchQuery}
            />
          )}

          {activeTab === 'mahasiswa' && (
            <AdminStudentsView
              students={students}
              onAddStudent={handleAddStudent}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
              externalSearchQuery={searchQuery}
            />
          )}

          {activeTab === 'dosen' && (
            <AdminLecturersView
              lecturers={lecturers}
              onAddLecturer={handleAddLecturer}
              onEditLecturer={handleEditLecturer}
              onDeleteLecturer={handleDeleteLecturer}
              externalSearchQuery={searchQuery}
            />
          )}

          {activeTab === 'prodi' && (
            <AdminProdiView
              prodiList={prodiList}
              onAddProdi={handleAddProdi}
              onEditProdi={handleEditProdi}
              onDeleteProdi={handleDeleteProdi}
              externalSearchQuery={searchQuery}
            />
          )}

          {activeTab === 'matakuliah' && (
            <AdminCoursesClassesView
              initialSubTab="courses"
              courses={courses}
              classes={classes}
              onAddCourse={handleAddCourse}
              onEditCourse={handleEditCourse}
              onDeleteCourse={handleDeleteCourse}
              onAddClass={handleAddClass}
              onEditClass={handleEditClass}
              onDeleteClass={handleDeleteClass}
              externalSearchQuery={searchQuery}
            />
          )}

          {activeTab === 'kelas' && (
            <AdminCoursesClassesView
              initialSubTab="classes"
              courses={courses}
              classes={classes}
              onAddCourse={handleAddCourse}
              onEditCourse={handleEditCourse}
              onDeleteCourse={handleDeleteCourse}
              onAddClass={handleAddClass}
              onEditClass={handleEditClass}
              onDeleteClass={handleDeleteClass}
              externalSearchQuery={searchQuery}
            />
          )}

          {activeTab === 'jadwal' && (
            <AdminScheduleView
              schedules={schedules}
              onAddSchedule={handleAddSchedule}
              onEditSchedule={handleEditSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              externalSearchQuery={searchQuery}
            />
          )}

          {activeTab === 'pengumuman' && (
            <AdminAnnouncementsView
              announcements={announcements}
              onAddAnnouncement={handleAddAnnouncement}
              onEditAnnouncement={handleEditAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              externalSearchQuery={searchQuery}
            />
          )}

          {activeTab === 'tugas-ujian' && (
            <AdminAssignmentsExamsView
              items={assignmentsExams}
              onAddItem={handleAddAssignmentExam}
              onEditItem={handleEditAssignmentExam}
              onDeleteItem={handleDeleteAssignmentExam}
              externalSearchQuery={searchQuery}
            />
          )}

          {activeTab === 'laporan' && <AdminReportsView />}

          {activeTab === 'pengaturan' && <AdminSettingsView />}
        </main>
      </div>

      {/* Global Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        defaultAction={quickActionType}
        onAddStudent={handleAddStudent}
        onAddLecturer={handleAddLecturer}
        onAddCourse={handleAddCourse}
        onAddAnnouncement={handleAddAnnouncement}
        onAddSchedule={handleAddSchedule}
      />
    </div>
  );
};
