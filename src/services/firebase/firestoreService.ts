/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrors';
import { 
  MOCK_CAMPUSES, 
  STUDENT_NUSACAMPUS,
  SCHEDULES_NUSACAMPUS,
  COURSES_NUSACAMPUS,
  ANNOUNCEMENTS_NUSACAMPUS,
  ASSIGNMENTS_NUSACAMPUS,
  EXAMS_NUSACAMPUS,
  NEWS_EVENTS_NUSACAMPUS,
  INITIAL_MEDIA_SLIDES 
} from '../../data/mockData';
import { 
  ScheduleItem, 
  CourseOffering, 
  AnnouncementItem, 
  MediaSlide, 
  StudentProfile,
  AssignmentItem,
  ExamItem,
  NewsEventItem 
} from '../../types';

export interface CampusBranding {
  id?: string;
  campusId: string;
  name: string;
  appName: string;
  institutionType?: 'Universitas' | 'SDIT' | 'Sekolah';
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  contact: string;
  address: string;
  status: 'Aktif' | 'Renovasi' | 'Perluasan';
  city?: string;
  code?: string;
  totalStudents?: number;
  totalLecturers?: number;
}

export type CampusItem = CampusBranding;

export const isSditTenant = (_cid?: string): boolean => false;

/**
 * Fetch list of Campuses with dynamic branding
 */
export async function getCampuses(): Promise<CampusBranding[]> {
  const collectionPath = 'campuses';
  try {
    const snap = await getDocs(collection(db, collectionPath));
    if (snap.empty) {
      return MOCK_CAMPUSES as unknown as CampusBranding[];
    }
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CampusBranding));
  } catch (error) {
    console.warn('getCampuses fallback to mock data:', error);
    return MOCK_CAMPUSES as unknown as CampusBranding[];
  }
}

/**
 * Fetch dynamic branding for a specific campusId
 */
export async function getCampusBranding(campusId?: string): Promise<CampusBranding> {
  const fallback = MOCK_CAMPUSES[0] as CampusBranding;

  if (!campusId || campusId === 'all') {
    return fallback;
  }

  try {
    const docRef = doc(db, 'campuses', campusId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as CampusBranding;
    }
    return fallback;
  } catch (error) {
    console.warn('getCampusBranding fallback to preset branding:', error);
    return fallback;
  }
}

/**
 * Update dynamic branding for a campus in Firestore
 */
export async function updateCampusBranding(
  campusId: string, 
  updatedBranding: Partial<CampusBranding>
): Promise<void> {
  const collectionPath = 'campuses';
  try {
    const docRef = doc(db, collectionPath, campusId);
    await setDoc(docRef, updatedBranding, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionPath}/${campusId}`);
  }
}

/**
 * Fetch announcements strictly filtered by campusId
 */
export async function getAnnouncements(campusId?: string): Promise<AnnouncementItem[]> {
  const collectionPath = 'announcements';
  const defaultFallback = ANNOUNCEMENTS_NUSACAMPUS;

  try {
    let q = collection(db, collectionPath);
    let snap;
    if (campusId && campusId !== 'all') {
      const qFiltered = query(q, where('campusId', '==', campusId));
      snap = await getDocs(qFiltered);
    } else {
      snap = await getDocs(q);
    }

    if (snap.empty) {
      return defaultFallback;
    }
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AnnouncementItem));
  } catch (error) {
    console.warn('getAnnouncements fallback to mock data:', error);
    return defaultFallback;
  }
}

/**
 * Fetch schedules strictly filtered by campusId
 */
export async function getSchedules(campusId?: string): Promise<ScheduleItem[]> {
  const collectionPath = 'schedules';
  const defaultFallback = SCHEDULES_NUSACAMPUS;

  try {
    let q = collection(db, collectionPath);
    let snap;
    if (campusId && campusId !== 'all') {
      const qFiltered = query(q, where('campusId', '==', campusId));
      snap = await getDocs(qFiltered);
    } else {
      snap = await getDocs(q);
    }

    if (snap.empty) {
      return defaultFallback;
    }
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ScheduleItem));
  } catch (error) {
    console.warn('getSchedules fallback to mock data:', error);
    return defaultFallback;
  }
}

/**
 * Fetch courses strictly filtered by campusId
 */
export async function getCourses(campusId?: string): Promise<CourseOffering[]> {
  const collectionPath = 'courses';
  const defaultFallback = COURSES_NUSACAMPUS;

  try {
    let q = collection(db, collectionPath);
    let snap;
    if (campusId && campusId !== 'all') {
      const qFiltered = query(q, where('campusId', '==', campusId));
      snap = await getDocs(qFiltered);
    } else {
      snap = await getDocs(q);
    }

    if (snap.empty) {
      return defaultFallback;
    }
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CourseOffering));
  } catch (error) {
    console.warn('getCourses fallback to mock data:', error);
    return defaultFallback;
  }
}

/**
 * Fetch Student Profile strictly by campusId
 */
export async function getStudentProfile(_campusId?: string): Promise<StudentProfile> {
  return STUDENT_NUSACAMPUS;
}

/**
 * Fetch Assignments / Tugas strictly by campusId
 */
export async function getAssignments(_campusId?: string): Promise<AssignmentItem[]> {
  return ASSIGNMENTS_NUSACAMPUS;
}

/**
 * Fetch Exams / PTS / UTS strictly by campusId
 */
export async function getExams(_campusId?: string): Promise<ExamItem[]> {
  return EXAMS_NUSACAMPUS;
}

/**
 * Fetch News & Events strictly by campusId
 */
export async function getNewsEvents(_campusId?: string): Promise<NewsEventItem[]> {
  return NEWS_EVENTS_NUSACAMPUS;
}

/**
 * Fetch media slides
 */
export async function getMediaSlides(campusId?: string): Promise<MediaSlide[]> {
  const collectionPath = 'mediaSlides';
  try {
    let q = collection(db, collectionPath);
    const snap = await getDocs(q);

    if (snap.empty) {
      return INITIAL_MEDIA_SLIDES;
    }
    const slides = snap.docs.map((d) => ({ id: d.id, ...d.data() } as MediaSlide));
    return slides.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.warn('getMediaSlides fallback to mock data:', error);
    return INITIAL_MEDIA_SLIDES;
  }
}

/**
 * Save / Update a Media Slide in Firestore
 */
export async function saveMediaSlide(slide: MediaSlide): Promise<void> {
  const collectionPath = 'mediaSlides';
  try {
    const docRef = doc(db, collectionPath, slide.id);
    await setDoc(docRef, slide, { merge: true });
  } catch (error) {
    console.error('Error saving media slide to Firestore:', error);
  }
}

/**
 * Delete a Media Slide from Firestore
 */
export async function deleteMediaSlide(slideId: string): Promise<void> {
  const collectionPath = 'mediaSlides';
  try {
    const docRef = doc(db, collectionPath, slideId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting media slide from Firestore:', error);
  }
}

/**
 * Seed initial mock data into Firestore if database collections are empty
 * Seeds NusaCampus with complete dataset & branding
 */
export async function seedInitialFirestoreData(): Promise<boolean> {
  try {
    const campusesSnap = await getDocs(collection(db, 'campuses'));
    if (!campusesSnap.empty) {
      return false; // Already populated
    }

    const batch = writeBatch(db);

    // 1. Seed Campuses with Dynamic Branding (NusaCampus)
    MOCK_CAMPUSES.forEach((camp) => {
      const campRef = doc(db, 'campuses', camp.campusId);
      batch.set(campRef, {
        campusId: camp.campusId,
        name: camp.name,
        appName: camp.appName,
        institutionType: camp.institutionType,
        logo: camp.logo,
        primaryColor: camp.primaryColor,
        secondaryColor: camp.secondaryColor,
        contact: camp.contact,
        address: camp.address,
        status: camp.status,
        city: camp.city,
        code: camp.code,
        totalStudents: camp.totalStudents,
        totalLecturers: camp.totalLecturers,
      });
    });

    // 2. Seed Student Profile
    const studentUnivRef = doc(db, 'students', 'student-nusacampus');
    batch.set(studentUnivRef, STUDENT_NUSACAMPUS);

    // 3. Seed Schedules
    SCHEDULES_NUSACAMPUS.forEach((sch) => {
      const schRef = doc(db, 'schedules', sch.id);
      batch.set(schRef, sch);
    });

    // 4. Seed Courses
    COURSES_NUSACAMPUS.forEach((crs) => {
      const crsRef = doc(db, 'courses', crs.id);
      batch.set(crsRef, crs);
    });

    // 5. Seed Announcements
    ANNOUNCEMENTS_NUSACAMPUS.forEach((ann) => {
      const annRef = doc(db, 'announcements', ann.id);
      batch.set(annRef, ann);
    });

    // 6. Seed Media Slides
    INITIAL_MEDIA_SLIDES.forEach((slide) => {
      const slideRef = doc(db, 'mediaSlides', slide.id);
      batch.set(slideRef, slide);
    });

    // 7. Seed Default Super Admin access record
    const adminRef = doc(db, 'admins', 'superadmin-master');
    batch.set(adminRef, {
      email: 'avinaariesta9@gmail.com',
      role: 'Super Admin',
      campusId: 'all',
      createdAt: new Date().toISOString(),
    });

    await batch.commit();
    console.log('NusaCampus initial collections seeded successfully!');
    return true;
  } catch (err) {
    console.warn('Auto-seed bypassed or unauthenticated:', err);
    return false;
  }
}
