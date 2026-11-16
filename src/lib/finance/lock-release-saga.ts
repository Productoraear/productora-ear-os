/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SAGA DE LIBERACIÓN DE BLOQUEOS DE AGENDA (45 MINUTOS)
 * ════════════════════════════════════════════════════════════════════════════
 * Evita el sobrebloqueo o reservas huérfanas:
 * Si una fecha fue bloqueada para formalización de depósito Price-Lock
 * y no se completa la transacción en 45 minutos (2.700.000 ms),
 * el bloqueo temporal se revoca automáticamente y la fecha vuelve a estar libre.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const LOCK_TTL_MINUTES = 45;
export const LOCK_TTL_MS = LOCK_TTL_MINUTES * 60 * 1000;

export interface CalendarLockItem {
  id: string;
  artistProfileId: string;
  date: string;
  lockedAt: string;
  status: 'ACTIVE' | 'RELEASED' | 'CONFIRMED';
}

const MEMORY_LOCKS_FILE = path.join(process.cwd(), '.antigravity', 'active_calendar_locks.json');

export function getActiveLocksFromFile(): CalendarLockItem[] {
  try {
    if (fs.existsSync(MEMORY_LOCKS_FILE)) {
      const data = fs.readFileSync(MEMORY_LOCKS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveActiveLocksToFile(locks: CalendarLockItem[]): void {
  try {
    const dir = path.dirname(MEMORY_LOCKS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(MEMORY_LOCKS_FILE, JSON.stringify(locks, null, 2), 'utf8');
  } catch {
    // fallback
  }
}

export interface ReleaseLocksResult {
  releasedCount: number;
  expiredLocks: CalendarLockItem[];
  scannedAt: string;
}

export async function releaseOrphanCalendarLocks(): Promise<ReleaseLocksResult> {
  const now = Date.now();
  const thresholdTime = now - LOCK_TTL_MS;
  const currentLocks = getActiveLocksFromFile();

  const activeRemaining: CalendarLockItem[] = [];
  const expired: CalendarLockItem[] = [];

  for (const lock of currentLocks) {
    const lockTime = new Date(lock.lockedAt).getTime();
    if (lock.status === 'ACTIVE' && lockTime < thresholdTime) {
      expired.push({ ...lock, status: 'RELEASED' });
    } else {
      activeRemaining.push(lock);
    }
  }

  // Persist updated list
  saveActiveLocksToFile(activeRemaining);

  // If database connection is active, clean up orphaned calendarBlocks
  try {
    const thresholdDate = new Date(thresholdTime);
    await Promise.race([
      prisma.calendarBlock.deleteMany({
        where: {
          createdAt: {
            lt: thresholdDate
          }
        }
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 1500))
    ]).catch(() => null);
  } catch {
    // DB unreachable, memory locks handled safely
  }

  return {
    releasedCount: expired.length,
    expiredLocks: expired,
    scannedAt: new Date().toISOString()
  };
}
