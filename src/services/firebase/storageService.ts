/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload an image file (profile photo, campus logo, or announcement image)
 */
export async function uploadMediaFile(
  file: File | Blob, 
  storagePath: string
): Promise<string> {
  try {
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.warn('Firebase Storage upload failed or not configured, using local blob URL fallback:', error);
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return '';
  }
}

/**
 * Generate standard storage paths for NusaCampus assets
 */
export const StoragePaths = {
  profilePhoto: (userId: string, filename: string) => `users/${userId}/avatars/${Date.now()}_${filename}`,
  campusLogo: (campusId: string, filename: string) => `campuses/${campusId}/logo_${Date.now()}_${filename}`,
  announcementImage: (announcementId: string, filename: string) => `announcements/${announcementId}/${Date.now()}_${filename}`,
  sliderMedia: (slideId: string, filename: string) => `media-slides/${slideId}/${Date.now()}_${filename}`,
};
