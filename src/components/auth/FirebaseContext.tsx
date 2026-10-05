/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppUser, 
  UserRole, 
  signInWithGoogle, 
  signInDemo, 
  signOutUser, 
  subscribeToAuthState 
} from '../../services/firebase/authService';
import { testConnection } from '../../services/firebase/firebase';
import { 
  seedInitialFirestoreData, 
  CampusBranding, 
  getCampusBranding, 
  updateCampusBranding 
} from '../../services/firebase/firestoreService';
import { MOCK_CAMPUSES } from '../../data/mockData';

interface FirebaseContextType {
  user: AppUser | null;
  role: UserRole;
  campusId: string;
  branding: CampusBranding;
  isFirebaseConnected: boolean;
  isLoading: boolean;
  setCampusId: (campusId: string) => void;
  loginWithGoogle: () => Promise<void>;
  loginDemo: (role: 'mahasiswa' | 'dosen' | 'admin' | 'superadmin', campusId?: string) => void;
  logout: () => Promise<void>;
  updateBranding: (updated: Partial<CampusBranding>) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campusId, setCampusIdState] = useState<string>('demo_universitas_alikhlas');
  const [user, setUser] = useState<AppUser | null>(() => signInDemo('mahasiswa', 'demo_universitas_alikhlas'));
  const [branding, setBranding] = useState<CampusBranding>(() => MOCK_CAMPUSES[0] as CampusBranding);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load dynamic branding when campusId changes
  useEffect(() => {
    let isMounted = true;
    getCampusBranding(campusId).then((b) => {
      if (isMounted) {
        setBranding(b);
        // Apply dynamic theme colors to root document
        document.documentElement.style.setProperty('--campus-primary', b.primaryColor);
        document.documentElement.style.setProperty('--campus-secondary', b.secondaryColor);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [campusId]);

  useEffect(() => {
    let isMounted = true;

    // 1. Test Firestore Connection
    testConnection().then((connected) => {
      if (isMounted) {
        setIsFirebaseConnected(connected);
      }
    });

    // 2. Listen to Firebase Auth state
    const unsubscribe = subscribeToAuthState(async (fbUser) => {
      if (fbUser) {
        const isSuperAdmin = fbUser.email === 'avinaariesta9@gmail.com';
        setUser({
          uid: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || 'Pengguna NusaCampus',
          role: isSuperAdmin ? 'Super Admin' : 'Mahasiswa',
          campusId,
          avatar: fbUser.photoURL || undefined,
          isFirebaseUser: true,
        });

        // Trigger seed if empty
        seedInitialFirestoreData().catch(() => {});
      }
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const setCampusId = (newCampusId: string) => {
    setCampusIdState(newCampusId);
    if (user && user.role !== 'Super Admin' && !user.isFirebaseUser) {
      const roleKey = user.role === 'Admin' ? 'admin' : user.role === 'Dosen' ? 'dosen' : 'mahasiswa';
      const adaptedUser = signInDemo(roleKey, newCampusId);
      setUser(adaptedUser);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const loggedUser = await signInWithGoogle(campusId);
      setUser(loggedUser);
      setCampusIdState(loggedUser.campusId || 'kampus_demo_a');
    } catch (err) {
      console.error('Login with Google error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = (role: 'mahasiswa' | 'dosen' | 'admin' | 'superadmin', selectedCampus?: string) => {
    const targetCampus = selectedCampus || campusId;
    const demoUser = signInDemo(role, targetCampus);
    setUser(demoUser);
    if (selectedCampus) {
      setCampusIdState(selectedCampus);
    }
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
  };

  const updateBranding = async (updated: Partial<CampusBranding>) => {
    await updateCampusBranding(campusId, updated);
    setBranding((prev) => ({ ...prev, ...updated }));
  };

  const currentRole: UserRole = user?.role || 'Mahasiswa';

  return (
    <FirebaseContext.Provider
      value={{
        user,
        role: currentRole,
        campusId,
        branding,
        isFirebaseConnected,
        isLoading,
        setCampusId,
        loginWithGoogle,
        loginDemo,
        logout,
        updateBranding,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
