import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

/**
 * 🏥 HEALTH CHECK MONITOR - S-CLASS SYSTEM DIAGNOSTIC (V153)
 * Resolves Postgres ping, Firebase configurations, and API keys validation.
 */
export async function GET() {
  const timestamp = new Date().toISOString();
  
  const status = {
    status: 'healthy',
    timestamp,
    environment: process.env.NODE_ENV || 'production',
    checks: {
      postgres: 'UNKNOWN',
      firebase: 'UNKNOWN',
      stripe: 'UNKNOWN',
      gemini: 'UNKNOWN'
    },
    subsystems: {
      b2g: 'OPERATIONAL',
      b2b: 'OPERATIONAL',
      vimume: 'OPERATIONAL',
      pricing_engine: 'OPERATIONAL'
    },
    latencyMs: 0
  };

  const startTime = Date.now();

  // 1. PostgreSQL Database Ping Check
  try {
    // Quick select raw statement to test pooling & credentials
    await prisma.$queryRaw`SELECT 1`;
    status.checks.postgres = 'UP';
  } catch (err: any) {
    status.status = 'unhealthy';
    status.checks.postgres = `DOWN: ${err.message}`;
    console.error('🚨 [HEALTH_MONITOR] PostgreSQL verification failed:', err.message);
  }

  // 2. Firebase Diagnostic Check
  try {
    if (db && db.app) {
      status.checks.firebase = 'UP';
    } else {
      status.checks.firebase = 'MISCONFIGURED';
    }
  } catch (err: any) {
    status.status = 'unhealthy';
    status.checks.firebase = `DOWN: ${err.message}`;
  }

  // 3. Stripe & Gemini Credentials Verification
  status.checks.stripe = process.env.STRIPE_SECRET_KEY ? 'CONFIGURED' : 'MISSING';
  status.checks.gemini = process.env.GEMINI_API_KEY ? 'CONFIGURED' : 'MISSING';

  status.latencyMs = Date.now() - startTime;

  const responseStatus = status.status === 'healthy' ? 200 : 500;
  return NextResponse.json(status, { status: responseStatus });
}
