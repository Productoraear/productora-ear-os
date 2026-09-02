import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const getFirebaseAdminApp = () => {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  try {
    return initializeApp();
  } catch (err) {
    console.warn("⚠️ [FIREBASE ADMIN] Inicialización diferida por falta de credenciales");
    return null;
  }
};

let adminApp: any = null;
let adminAuth: any = null;

try {
  adminApp = getFirebaseAdminApp();
  if (adminApp) {
    adminAuth = getAuth(adminApp);
  }
} catch (err) {
  console.warn("⚠️ [FIREBASE ADMIN] Auth no inicializado en este runtime");
}

export { adminAuth };
