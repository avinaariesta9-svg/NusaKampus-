/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrors';

export type UserRole = 'Super Admin' | 'Admin' | 'Dosen' | 'Mahasiswa';

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  campusId: string;
  avatar?: string;
  nimOrNip?: string;
  major?: string;
  isFirebaseUser?: boolean;
}

const DEMO_USERS_NUSACAMPUS: Record<string, AppUser> = {
  mahasiswa: {
    uid: 'demo-student-nusacampus',
    email: 'fauzan.rabbani@mhs.nusacampus.ac.id',
    name: 'Muhammad Fauzan Rabbani',
    role: 'Mahasiswa',
    campusId: 'nusacampus',
    nimOrNip: '221081001',
    major: 'Teknik Informatika (S1)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
  },
  dosen: {
    uid: 'demo-lecturer-nusacampus',
    email: 'ahmad.syakir@nusacampus.ac.id',
    name: 'Dr. Ir. Ahmad Syakir, M.Kom.',
    role: 'Dosen',
    campusId: 'nusacampus',
    nimOrNip: '198005122006041001',
    major: 'Teknik Informatika',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  },
  admin: {
    uid: 'demo-admin-nusacampus',
    email: 'baak@nusacampus.ac.id',
    name: 'Admin BAAK NusaCampus',
    role: 'Admin',
    campusId: 'nusacampus',
    nimOrNip: 'ADM-NC-MAIN',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
  },
  superadmin: {
    uid: 'demo-superadmin-01',
    email: 'avinaariesta9@gmail.com',
    name: 'Avina Ariesta (Super Admin)',
    role: 'Super Admin',
    campusId: 'all',
    nimOrNip: 'SA-NUSA-01',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
  },
};

// Aliases for compatibility
const DEMO_USERS_UNIVERSITAS_ALIKHLAS = DEMO_USERS_NUSACAMPUS;
const DEMO_USERS_SDIT_ALIKHLAS = DEMO_USERS_NUSACAMPUS;
const DEMO_USERS_KAMPUS_A = DEMO_USERS_NUSACAMPUS;
const DEMO_USERS_KAMPUS_B = DEMO_USERS_NUSACAMPUS;

/**
 * Sign in using Google OAuth Popup
 */
export async function signInWithGoogle(selectedCampusId: string = 'campus-jakarta'): Promise<AppUser> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;

    // Check if user exists in Firestore
    const userDocRef = doc(db, 'users', fbUser.uid);
    let appUser: AppUser;

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        appUser = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          name: data.name || fbUser.displayName || 'Pengguna NusaCampus',
          role: data.role || (fbUser.email === 'avinaariesta9@gmail.com' ? 'Super Admin' : 'Mahasiswa'),
          campusId: data.campusId || selectedCampusId,
          avatar: data.avatar || fbUser.photoURL || undefined,
          isFirebaseUser: true,
        };
      } else {
        // Create initial user document
        const isSuperAdminEmail = fbUser.email === 'avinaariesta9@gmail.com';
        const role: UserRole = isSuperAdminEmail ? 'Super Admin' : 'Mahasiswa';
        appUser = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || 'Pengguna Baru',
          role,
          campusId: selectedCampusId,
          avatar: fbUser.photoURL || undefined,
          isFirebaseUser: true,
        };

        await setDoc(userDocRef, {
          ...appUser,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (fsErr) {
      console.warn('Could not read/write user to Firestore, continuing with auth profile:', fsErr);
      appUser = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        name: fbUser.displayName || 'Pengguna NusaCampus',
        role: fbUser.email === 'avinaariesta9@gmail.com' ? 'Super Admin' : 'Mahasiswa',
        campusId: selectedCampusId,
        avatar: fbUser.photoURL || undefined,
        isFirebaseUser: true,
      };
    }

    return appUser;
  } catch (error) {
    console.error('Sign-in with Google failed:', error);
    throw error;
  }
}

/**
 * Demo Login (For quick evaluation, testing, or offline demo mode)
 */
export function signInDemo(roleKey: 'mahasiswa' | 'dosen' | 'admin' | 'superadmin', targetCampusId: string = 'nusacampus'): AppUser {
  const pool = DEMO_USERS_NUSACAMPUS;
  const user = { ...pool[roleKey] };
  if (targetCampusId && roleKey !== 'superadmin') {
    user.campusId = targetCampusId;
  }
  return user;
}

/**
 * Sign out from Firebase and clear session
 */
export async function signOutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.warn('Firebase signout error:', error);
  }
}

/**
 * Listen to auth state changes
 */
export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Role Permission Validator
 */
export function hasPermission(
  userRole: UserRole, 
  allowedRoles: UserRole[]
): boolean {
  if (userRole === 'Super Admin') return true;
  return allowedRoles.includes(userRole);
}

/**
 * Campus Access Validator
 */
export function canAccessCampus(
  userRole: UserRole, 
  userCampusId: string, 
  targetCampusId: string
): boolean {
  if (userRole === 'Super Admin') return true;
  return userCampusId === targetCampusId;
}
