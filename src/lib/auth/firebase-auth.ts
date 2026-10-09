import { getApps, getApp, initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut,
    type User
} from 'firebase/auth';

// ============================================================================
// 🔐 FIREBASE AUTH PROVIDERS (S-CLASS) — Primer Factor de Identidad
// ============================================================================
// Google · Apple · Meta (Facebook) · Email/Password.
// El segundo factor (WhatsApp OTP) se resuelve en el backend.
// ============================================================================

const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// 🔒 FAIL-CLOSED FIREBASE (BLINDAJE SESSION_SECRET P0): sin apiKey real, el módulo NO se instancia.
if (!firebaseApiKey || firebaseApiKey === 'dummy_firebase_key') {
    throw new Error('[FIREBASE_AUTH] NEXT_PUBLIC_FIREBASE_API_KEY no configurada (fail-closed).');
}

const firebaseConfig = {
    apiKey: firebaseApiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'productora-ear-backend.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'productora-ear-backend',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'productora-ear-backend.firebasestorage.app',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({ display: 'popup' });
const appleProvider = new OAuthProvider('apple.com');

export type OAuthProviderId = 'google' | 'apple' | 'facebook';

export async function signInWithGoogle(): Promise<User> {
    const credential = await signInWithPopup(auth, googleProvider);
    return credential.user;
}

export async function signInWithFacebook(): Promise<User> {
    const credential = await signInWithPopup(auth, facebookProvider);
    return credential.user;
}

export async function signInWithApple(): Promise<User> {
    const credential = await signInWithPopup(auth, appleProvider);
    return credential.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
}

export async function registerWithEmail(email: string, password: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return credential.user;
}

export async function resetPasswordByEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
}

export async function signOutGlobal(): Promise<void> {
    await signOut(auth);
}

export default { auth, signInWithGoogle, signInWithFacebook, signInWithApple, signInWithEmail, registerWithEmail, resetPasswordByEmail, onAuthChange, signOutGlobal };