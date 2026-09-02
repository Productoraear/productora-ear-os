import { NextResponse } from 'next/server';
import { UserService } from '@/lib/services/UserService';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Empty token' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (authError: any) {
      console.warn('⚠️ [API_USER_SYNC] Token verification failed:', authError.message);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const uid = decodedToken.uid;
    const email = decodedToken.email;

    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized: Missing UID in token' }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Bad Request: Missing Email in token' }, { status: 400 });
    }

    const profile = await UserService.getOrCreateProfile(uid, email);

    if (!profile) {
      return NextResponse.json({ error: 'Failed to sync profile' }, { status: 500 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error: any) {
    console.error('🛑 [API_USER_SYNC_CRITICAL]:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      meta: error.meta
    });
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error.message 
    }, { status: 500 });
  }
}
