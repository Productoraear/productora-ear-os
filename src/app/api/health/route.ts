/**
 * 🏥 HEALTH & READINESS ENDPOINT - EAR OS S-CLASS SURVEILLANCE
 * Purpose: Real-time system diagnostics and monitoring for Vercel/Datadog.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const START_TIME = Date.now();
const APP_VERSION = "V165.B - S-CLASS GOLD";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode') || 'readiness'; // liveness | readiness

  const timestamp = new Date().toISOString();
  const uptime = Math.floor((Date.now() - START_TIME) / 1000);

  // 1. LIVENESS CHECK (Fastest)
  if (mode === 'liveness') {
    return NextResponse.json({
      status: 'UP',
      timestamp,
      uptime: `${uptime}s`,
      version: APP_VERSION
    }, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
  }

  // 2. READINESS CHECK (Dependency Audit)
  let dbStatus = 'unhealthy';
  let dbLatency = 0;
  let telegramStatus = 'unhealthy';
  
  const startDb = Date.now();
  try {
    const supabase = createClient();
    // Use a robust table or multiple attempts for heartbeat
    const { error: error1 } = await supabase.from('marketplace_events').select('id').limit(1);
    
    if (!error1) {
      dbStatus = 'healthy';
    } else {
      // Fallback attempt
      const { error: error2 } = await supabase.from('workspaces').select('id').limit(1);
      if (!error2) {
        dbStatus = 'healthy';
      } else {
        console.error("🏥 [HEALTH_CHECK] DB_ERROR:", error1.message, "| FALLBACK:", error2.message);
      }
    }
    
    if (dbStatus === 'healthy') {
      dbLatency = Date.now() - startDb;
    }
  } catch (err: any) {
    console.error("🏥 [HEALTH_CHECK] DB_CRASH:", err.message);
  }

  // Telegram Config Check (Passive)
  if (process.env.TELEGRAM_BOT_TOKEN && (process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_INSTITUTIONAL_ID)) {
    telegramStatus = 'healthy';
  }

  const isHealthy = dbStatus === 'healthy';

  const healthReport = {
    status: isHealthy ? 'UP' : 'DEGRADED',
    timestamp,
    uptime: `${uptime}s`,
    version: APP_VERSION,
    engine: {
      node: process.version,
      memory: process.memoryUsage().heapUsed,
    },
    dependencies: {
      db: {
        status: dbStatus,
        latencyMs: dbLatency,
      },
      telegram: {
        status: telegramStatus
      }
    }
  };

  return NextResponse.json(healthReport, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Health-Check': 'S-Class-Surveillance'
    }
  });
}
