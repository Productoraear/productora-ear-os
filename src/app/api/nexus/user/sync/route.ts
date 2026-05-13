import { NextResponse } from 'next/server';
import { UserService } from '@/lib/services/UserService';

export async function POST(request: Request) {
  try {
    const { id, email } = await request.json();

    if (!id || !email) {
      return NextResponse.json({ error: 'Missing ID or Email' }, { status: 400 });
    }

    const profile = await UserService.getOrCreateProfile(id, email);

    if (!profile) {
      return NextResponse.json({ error: 'Failed to sync profile' }, { status: 500 });
    }

    return NextResponse.json(profile);
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
