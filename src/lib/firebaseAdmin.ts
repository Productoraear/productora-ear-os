import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let _adminApp: ReturnType<typeof initializeApp> | null = null;

export const getFirebaseAdminApp = () => {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  if (_adminApp) {
    return _adminApp;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    _adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    return _adminApp;
  }

  return null;
};

export const adminAuth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(_target, prop) {
    const app = getFirebaseAdminApp();
    if (!app) {
      if (prop === 'verifyIdToken') {
        return async () => {
          throw new Error('[FIREBASE_ADMIN] No configurado en el servidor');
        };
      }
      return undefined;
    }
    const authInstance = getAuth(app);
    const value = (authInstance as any)[prop];
    return typeof value === 'function' ? value.bind(authInstance) : value;
  }
});

