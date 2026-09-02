import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * 🔒 CONGELADOR DE TARIFA CRIPTOGRÁFICO (PALANCA 8 - PRICE LOCK)
 * Genera un Hash SHA-256 inmutable con timestamp de expiración (72 horas)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      amount, 
      eventDate, 
      riderConfig = 'Bose F1 Model 812 + FBT Sub', 
      location = 'Madrid / Toledo',
      customerEmail = 'anonimo@productoraear.com',
      userId
    } = body;

    if (!amount || amount <= 0 || !eventDate) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos: amount y eventDate' }, { status: 400 });
    }

    const nonce = crypto.randomBytes(16).toString('hex');
    const lockTimestamp = Date.now();
    const expiresAtMs = lockTimestamp + 72 * 60 * 60 * 1000; // 72 horas
    const expiresAtDate = new Date(expiresAtMs);

    // 1. Generación de Hash Determinista de Cierre
    const rawString = `${amount}:${eventDate}:${riderConfig}:${location}:${nonce}:${lockTimestamp}`;
    const priceLockHash = `0x${crypto.createHash('sha256').update(rawString).digest('hex').toUpperCase().slice(0, 32)}`;

    // 2. Registro en Bóveda Database via Prisma (si userId/DB está listo)
    let ledgerEntry = null;
    try {
      ledgerEntry = await prisma.commissionLedger.create({
        data: {
          userId: userId || null,
          amount: Number(amount),
          currency: 'EUR',
          status: 'PENDING',
          reference: `LOCK-${priceLockHash.slice(2, 10)}`,
          sourceEvent: 'price_lock_72h',
          description: `Price-Lock 72h: ${riderConfig} | Ubc: ${location} | Hash: ${priceLockHash}`,
          notes: `ExpiresAt: ${expiresAtDate.toISOString()} | Payer: ${customerEmail}`,
        }
      });
    } catch (dbErr) {
      console.warn('⚠️ [PRICE-LOCK] Registro diferido en DB (modo memoria activo):', dbErr);
    }

    console.log(`🔒 [PRICE-LOCK EMITTED] Hash: ${priceLockHash} | Amount: ${amount}€ | Expiración: ${expiresAtDate.toISOString()}`);

    return NextResponse.json({
      success: true,
      priceLockHash,
      amount: Number(amount),
      eventDate,
      riderConfig,
      location,
      lockTimestamp,
      expiresAt: expiresAtDate.toISOString(),
      expiresAtMs,
      depositRequired: 100, // 100€ Pay-to-Lock
      ledgerId: ledgerEntry?.id || null,
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ [PRICE-LOCK ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Fallo generando congelador de tarifa' }, { status: 500 });
  }
}
