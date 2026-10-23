import { existsSync, writeFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

/**
 * Kill-switch por archivo (.antigravity/STOP). Solo servidor.
 * Si el archivo existe, ningún agente puede enviar ni procesar mensajes.
 */
const STOP_FILE: string = join(process.cwd(), '.antigravity', 'STOP');

export function isKillSwitchActive(): boolean {
  try {
    return existsSync(STOP_FILE);
  } catch {
    // Ante la duda, fallar cerrado: se considera activado.
    return true;
  }
}

export function activateKillSwitch(reason: string): void {
  const safeReason: string = reason.replace(/[\r\n]+/g, ' ').slice(0, 200);
  mkdirSync(dirname(STOP_FILE), { recursive: true });
  writeFileSync(STOP_FILE, `${new Date().toISOString()} ${safeReason}\n`, 'utf8');
}

export function releaseKillSwitch(): void {
  if (existsSync(STOP_FILE)) unlinkSync(STOP_FILE);
}
