import dotenv from 'dotenv';
dotenv.config();
import { fetchTedNotices } from './ted-connector';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export interface Licitacion {
  id: string;
  ayuntamiento: string;
  objeto: string;
  presupuestoMaximo: number;
  cpv: string;
  tipoContrato: 'Menor (Art. 118)' | 'Abierto Simplificado' | 'Licitación Mayor Gran Formato';
  linkPliego: string;
  fuente?: 'PLACSP' | 'BOCM' | 'BOP_TOLEDO' | 'ACTA_PLENO' | 'SEDE_ELECTRONICA';
}

/**
 * 🛰️ HUNTER B2G AGENT SERVICE — Envío a Telegram de licitaciones públicas multiescala
 */
export async function sendTelegramB2GAlert(item: Licitacion): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('⚠️ [HUNTER B2G] Falta TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID en el entorno.');
    return false;
  }

  const message = formatAlertMessageHtml(item);
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`❌ [HUNTER B2G] Error enviando a Telegram (${res.status}):`, err);
      return false;
    }

    console.log(`✅ [HUNTER B2G] Alerta enviada con éxito para ${item.ayuntamiento} (${item.presupuestoMaximo} €)`);
    return true;
  } catch (error) {
    console.error('❌ [HUNTER B2G] Error de red:', error);
    return false;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatAlertMessageHtml(item: Licitacion): string {
  const isMenor = item.presupuestoMaximo <= 15000;
  const ofertaSugerida = isMenor 
    ? (item.presupuestoMaximo * 0.95).toFixed(2)
    : (item.presupuestoMaximo * 0.92).toFixed(2);

  const earCommandUrl = `https://productora-ear-os.netlify.app/ayuntamientos?municipio=${encodeURIComponent(
    item.ayuntamiento
  )}&objeto=${encodeURIComponent(item.objeto)}&presupuesto=${item.presupuestoMaximo}&cpv=${encodeURIComponent(
    item.cpv
  )}`;

  return `🏛️ <b>NUEVA OPORTUNIDAD B2G DETECTADA (HUNTER AGENT)</b>
--------------------------------------------------
📍 <b>Entidad Pública:</b> ${escapeHtml(item.ayuntamiento)}
📜 <b>Objeto:</b> ${escapeHtml(item.objeto)}
💶 <b>Presupuesto Base de Licitación:</b> <b>${item.presupuestoMaximo.toLocaleString('es-ES')} € + IVA</b>
🎯 <b>Oferta Sugerida Competitiva:</b> <b>${Number(ofertaSugerida).toLocaleString('es-ES')} € + IVA</b>
🏷️ <b>Modalidad:</b> ${item.tipoContrato} (CPV: ${item.cpv})
🛰️ <b>Fuente Verificable:</b> ${item.fuente || 'PLACSP'}

⚡ <b>ACCESO EN 1-CLIC (Nave Nodriza EAR OS):</b>
<a href="${earCommandUrl}">📄 Generar Memoria Técnica LCSP y Expediente en 1-Clic</a>

🔗 <a href="${item.linkPliego}">Auditar Perfil de Contratante en PLACSP</a>
--------------------------------------------------
<i>EAR OS V2 :: Soberanía Comercial y Radar de Contratación Pública</i>`;
}

/**
 * Radar de Oportunidades Multiescala — CONECTOR REAL TED API v3.
 * Sustituye el radar hardcodeado por avisos reales del Tenders Electronic Daily.
 * Fail-closed: sin TED_API_KEY no fabrica ninguna licitación.
 */
export async function runHunterB2GScan() {
  console.log('🔍 [HUNTER B2G] Iniciando barrido real multiescala (TED API v3)...\n');

  const scan = await fetchTedNotices(50);

  if (!scan.ok) {
    console.warn(`⚠️ [HUNTER B2G] FAIL-CLOSED: ${scan.error ?? 'sin resultados'}. 0 licitaciones fabricadas.`);
    return;
  }

  let dispatched = 0;
  for (const notice of scan.notices) {
    const cpvCode = notice.classificationCpvs[0] ?? '92300000-4';
    const baseValue = notice.baseValueEur ?? 0;
    const isMenor = baseValue > 0 && baseValue <= 15000;

    const item: Licitacion = {
      id: `TED-${notice.publicationNumber || 'UNKNOWN'}`,
      ayuntamiento: notice.buyer,
      objeto: notice.subject,
      presupuestoMaximo: baseValue,
      cpv: cpvCode,
      tipoContrato: isMenor
        ? 'Menor (Art. 118)'
        : baseValue > 15000
          ? 'Licitación Mayor Gran Formato'
          : 'Abierto Simplificado',
      linkPliego: notice.noticeUrl ?? 'https://ted.europa.eu',
      fuente: 'PLACSP'
    };

    const sent = await sendTelegramB2GAlert(item);
    if (sent) dispatched += 1;
  }

  console.log(`🎯 [HUNTER B2G] Barrido real completado: ${scan.notices.length} avisos, ${dispatched} alertas enviadas.`);
}
