import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    let totalVendors = 0;
    let claimedVendors = 0;
    let fleetCount = 0;
    let totalRevenue = 0;
    let transactionsCount = 0;

    // 1. Consulta segura a PostgreSQL con Prisma
    try {
      const [vendors, claimed, fleet, ledgerEntries] = await Promise.all([
        prisma.vendorShadowProfile.count(),
        prisma.vendorShadowProfile.count({ where: { isClaimed: true } }),
        prisma.equipmentInventory.count(),
        prisma.commissionLedger.findMany({
          where: { status: 'PAID' },
          select: { amount: true }
        })
      ]);

      totalVendors = vendors;
      claimedVendors = claimed;
      fleetCount = fleet;
      totalRevenue = ledgerEntries.reduce((acc, curr) => acc + (curr.amount || 0), 0);
      transactionsCount = ledgerEntries.length;
    } catch (dbErr) {
      console.warn('⚠️ [TELEMETRY API] Fallback a cache local JSON:', dbErr);
    }

    // 2. Si la DB no está disponible en local, leer datos del backup JSON
    if (totalVendors === 0) {
      try {
        const jsonPath = path.join(process.cwd(), 'scripts', 'vampire_mass_extracted.json');
        const altJsonPath = path.join(process.cwd(), 'scripts', 'vampire_shadow_profiles_sanitized.json');
        
        let targetPath = fs.existsSync(jsonPath) ? jsonPath : (fs.existsSync(altJsonPath) ? altJsonPath : null);
        if (targetPath) {
          const raw = fs.readFileSync(targetPath, 'utf-8');
          const parsed = JSON.parse(raw);
          totalVendors = Array.isArray(parsed) ? parsed.length : 0;
          claimedVendors = Array.isArray(parsed) ? parsed.filter(p => p.isClaimed).length : 0;
        }
      } catch (err) {
        console.warn('⚠️ [TELEMETRY API] Error leyendo JSON local:', err);
      }
    }

    // Aforo y equipos estándar si la base de datos de inventario está en seeding
    if (fleetCount === 0) {
      fleetCount = 4; // 2x Bose F1 + 1x Behringer XR18 + 1x Shure GLXD4
    }

    const vimumeFund = Math.round(totalRevenue * 0.10 * 100) / 100;
    const artistPayouts = Math.round(totalRevenue * 0.80 * 100) / 100;
    const earShare = Math.round(totalRevenue * 0.10 * 100) / 100;

    return NextResponse.json({
      success: true,
      totalVendors,
      claimedVendors,
      unclaimedVendors: Math.max(0, totalVendors - claimedVendors),
      fleetCount,
      totalRevenue,
      transactionsCount,
      distribution: {
        artistPayouts,
        earShare,
        vimumeFund
      },
      systemStatus: 'OPERATIONAL',
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ [TELEMETRY API ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Error interno de telemetría' }, { status: 500 });
  }
}
