import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * 🏥 HEALTH ENDPOINT - V165.B
 * Monitoreo ligero y auditable de servicios críticos.
 * Soporta type=liveness y type=readiness (por defecto).
 */
export async function GET(req: NextRequest) {
  const start = Date.now();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'readiness';

  // 🟢 LIVENESS: Respuesta minimalista para confirmar que el proceso está vivo.
  if (type === 'liveness') {
    return new NextResponse(JSON.stringify({ 
      status: 'alive', 
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime())
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json', 
        'Cache-Control': 'no-cache, no-store, must-revalidate' 
      }
    });
  }

  // 🛡️ READINESS: Verificación de dependencias críticas.
  const healthData: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: 'V165.B',
    checks: {
      db: { status: 'unknown', latencyMs: 0 },
      telegram: { status: 'unknown' },
      stripe: { status: 'unknown' }
    }
  };

  // 1. DB CHECK (Operación mínima sin caché)
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    healthData.checks.db.status = 'healthy';
    healthData.checks.db.latencyMs = Date.now() - dbStart;
  } catch (error) {
    healthData.status = 'unhealthy';
    healthData.checks.db.status = 'error';
    healthData.checks.db.message = error instanceof Error ? error.message : String(error);
  }

  // 2. TELEGRAM CONFIGURATION (Verificación pasiva de credenciales)
  const hasTelegram = !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
  healthData.checks.telegram.status = hasTelegram ? 'configured' : 'missing_credentials';

  // 3. STRIPE CONFIGURATION (Verificación pasiva de credenciales)
  const hasStripe = !!process.env.STRIPE_SECRET_KEY;
  healthData.checks.stripe.status = hasStripe ? 'configured' : 'missing_credentials';

  const totalLatency = Date.now() - start;
  healthData.latencyMs = totalLatency;

  // Gate de seguridad: Si la DB falla, el estado global es 503 (Service Unavailable)
  const responseStatus = healthData.status === 'healthy' ? 200 : 503;

  return new NextResponse(JSON.stringify(healthData), {
    status: responseStatus,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'X-Health-Check-Latency': `${totalLatency}ms`
    }
  });
}
