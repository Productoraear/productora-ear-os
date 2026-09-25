/**
 * 💾 EAR OS V2 — MOTOR DE PERSISTENCIA Y REGISTRO DE PROPUESTAS
 * ------------------------------------------------------------------
 * Almacén híbrido de propuestas con persistencia local en JSON bajo
 * data/proposals y fallback seguro a memoria. Totalmente compatible con
 * Supabase y ejecutable en local y Vercel sin dependencias externas.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { SovereignProposal, ProposalStatus, ProposalSignature, ReadingTelemetryEvent } from './proposal-types';
import { sendTelegramNotification } from '../services/telegram';
import { formatoEurosCorto } from './proposal-calculator';

const PROPOSALS_DIR = path.join(process.cwd(), 'src', 'data', 'proposals');

// Asegurar directorio en entorno local
try {
  if (!fs.existsSync(PROPOSALS_DIR)) {
    fs.mkdirSync(PROPOSALS_DIR, { recursive: true });
  }
} catch {
  // Ignorar en entornos de solo lectura (Edge/Serverless)
}

// Memoria singleton para acceso ultra-rápido en la sesión
const memoryProposals = new Map<string, SovereignProposal>();
const memoryByToken = new Map<string, SovereignProposal>();

/**
 * Guarda o actualiza una propuesta en el almacén.
 */
export async function guardarPropuesta(propuesta: SovereignProposal): Promise<void> {
  memoryProposals.set(propuesta.id, propuesta);
  memoryByToken.set(propuesta.token, propuesta);

  try {
    const filePath = path.join(PROPOSALS_DIR, `${propuesta.token}.json`);
    fs.writeFileSync(filePath, JSON.stringify(propuesta, null, 2), 'utf-8');
  } catch {
    // Si el filesystem está bloqueado (Vercel read-only), memoryByToken retiene la propuesta
  }
}

/**
 * Obtiene una propuesta a partir de su token público indescifrable.
 */
export async function obtenerPropuestaPorToken(token: string): Promise<SovereignProposal | null> {
  if (memoryByToken.has(token)) {
    return memoryByToken.get(token)!;
  }

  try {
    const filePath = path.join(PROPOSALS_DIR, `${token}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const propuesta = JSON.parse(data) as SovereignProposal;
      memoryProposals.set(propuesta.id, propuesta);
      memoryByToken.set(token, propuesta);
      return propuesta;
    }
  } catch {
    // Fallback silencioso
  }

  return null;
}

/**
 * Obtiene todas las propuestas creadas para el panel de administración.
 */
export async function listarPropuestas(): Promise<SovereignProposal[]> {
  const lista: SovereignProposal[] = Array.from(memoryProposals.values());

  try {
    if (fs.existsSync(PROPOSALS_DIR)) {
      const files = fs.readdirSync(PROPOSALS_DIR).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const data = fs.readFileSync(path.join(PROPOSALS_DIR, file), 'utf-8');
        const p = JSON.parse(data) as SovereignProposal;
        if (!memoryProposals.has(p.id)) {
          memoryProposals.set(p.id, p);
          memoryByToken.set(p.token, p);
          lista.push(p);
        }
      }
    }
  } catch {
    // Fallback
  }

  return lista.sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime());
}

/**
 * Registra la firma digital de un cliente en la propuesta y transiciona el estado a 'ganado'.
 */
export async function registrarFirmaCliente(
  token: string,
  firma: ProposalSignature
): Promise<{ ok: boolean; error?: string }> {
  const propuesta = await obtenerPropuestaPorToken(token);
  if (!propuesta) return { ok: false, error: 'Propuesta no encontrada' };

  if (propuesta.estado === 'ganado') {
    return { ok: true }; // Ya firmada previamente
  }

  propuesta.firma = firma;
  propuesta.estado = 'ganado';
  await guardarPropuesta(propuesta);

  // Alerta instantánea a Telegram
  const totalCéntimos = propuesta.lineas
    .filter(l => !l.esOpcional || l.seleccionada)
    .reduce((acc, l) => acc + l.totalCéntimos, 0) * 1.21;

  const msg = `
✍️ *PROPUESTA FIRMADA DIGITALMENTE — S-CLASS*
━━━━━━━━━━━━━━━━━━━━━━━━
Cliente: *${propuesta.cliente.nombre}*
Finca: *${propuesta.cliente.fincaOEspacio}*
Total Estimado: *${formatoEurosCorto(totalCéntimos)}*
Dispositivo: \`${firma.dispositivo}\`
IP: \`${firma.ip}\`
Hora: *${firma.fecha} ${firma.hora}*

🚀 *Estado:* GANADO / Listo para liquidación de fianza Stripe 100 €.
`.trim();

  await sendTelegramNotification(msg);
  return { ok: true };
}

/**
 * Registra evento de telemetría de lectura y envía notificación inteligente si procede.
 */
export async function registrarEventoTelemetria(evento: ReadingTelemetryEvent): Promise<void> {
  const propuesta = await obtenerPropuestaPorToken(evento.token);
  if (!propuesta) return;

  // Si estaba en borrador o enviado, pasa a visto
  if (propuesta.estado === 'enviado') {
    propuesta.estado = 'visto';
    await guardarPropuesta(propuesta);
  }

  // Notificación en la primera apertura o reapertura
  if (!evento.seccion) {
    const totalCéntimos = propuesta.lineas
      .filter(l => !l.esOpcional || l.seleccionada)
      .reduce((acc, l) => acc + l.totalCéntimos, 0) * 1.21;

    const ciudad = evento.ciudad || 'Ubicación móvil';
    const disp = evento.dispositivo || 'Smartphone';
    const esCaducado = propuesta.estado === 'expirado';

    const texto = esCaducado
      ? `🔁 *SEÑAL DE COMPRA CRÍTICA:* ${propuesta.cliente.nombre} ha vuelto a abrir la propuesta caducada de ${formatoEurosCorto(totalCéntimos)} · ${propuesta.cliente.fincaOEspacio} · Visita nº ${evento.visitaNumero} · ${disp} · ${ciudad}. *Llamar ahora mismo.*`
      : `👀 *${propuesta.cliente.nombre}* acaba de abrir la propuesta de *${formatoEurosCorto(totalCéntimos)}* · ${propuesta.cliente.fincaOEspacio} · Visita nº ${evento.visitaNumero} · ${disp} · ${ciudad}`;

    await sendTelegramNotification(texto);
  }
}
