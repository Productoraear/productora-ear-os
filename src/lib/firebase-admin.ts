import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * 🛰️ EAR OS - FIREBASE ADMIN CONFIG (BACK-END)
 * Se utiliza para sincronizar el conocimiento de H: y F: con la nube.
 */

// NOTA: Para producción SaaS total, necesitaremos un Service Account. 
// Para desarrollo local, Next.js usará las credenciales de tu Firebase CLI.

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'productora-ear-backend',
};

function createFirebaseAdminApp() {
  if (getApps().length <= 0) {
    return initializeApp(firebaseAdminConfig);
  } else {
    return getApps()[0];
  }
}

const adminApp = createFirebaseAdminApp();
export const db = getFirestore(adminApp);
