import dotenv from 'dotenv';
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export interface Licitacion {
  id: string;
  ayuntamiento: string;
  objeto: string;
  presupuestoMaximo: number;
  cpv: string;
  tipoContrato: 'Menor' | 'Abierto';
  linkPliego: string;
  fuente?: 'PLACSP' | 'BOCM' | 'BOP_TOLEDO' | 'ACTA_PLENO';
}

/**
 * 🛰️ HUNTER B2G AGENT — Dispara alertas inmediatas a Telegram con ofertas calculadas y enlaces ODS
 */
export async function sendTelegramB2GAlert(item: Licitacion): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('⚠️ [HUNTER B2G] Falta TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID en el entorno (.env). Modo simulación activo.');
    console.log('📦 [SIMULACIÓN ALERTA B2G]:\n' + formatAlertMessageHtml(item) + '\n');
    return false;
  }

  const message = formatAlertMessageHtml(item);
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
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

    console.log(`✅ [HUNTER B2G] Alerta enviada con éxito para ${item.ayuntamiento}`);
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
  // Cálculo del margen óptimo (95% del techo presupuestario)
  const ofertaSugerida = (item.presupuestoMaximo * 0.95).toFixed(2);
  const dossierUrl = `https://www.productoraear.com/blog/b2g?municipio=${encodeURIComponent(
    item.ayuntamiento
  )}&presupuesto=${ofertaSugerida}&cpv=${item.cpv}`;

  return `🏛️ <b>NUEVA OPORTUNIDAD B2G DETECTADA (HUNTER AGENT)</b>
--------------------------------------------------
📍 <b>Municipio:</b> ${escapeHtml(item.ayuntamiento)}
📜 <b>Objeto:</b> ${escapeHtml(item.objeto)}
💶 <b>Presupuesto Máx:</b> ${item.presupuestoMaximo.toLocaleString('es-ES')} € + IVA
🎯 <b>Oferta Sugerida (95%):</b> <b>${Number(ofertaSugerida).toLocaleString('es-ES')} € + IVA</b>
🏷️ <b>Tipo:</b> ${item.tipoContrato} (CPV: ${item.cpv})
🛰️ <b>Fuente:</b> ${item.fuente || 'PLACSP / Pleno'}

📋 <b>Dossier Autogenerado ODS 2030:</b>
<a href="${dossierUrl}">Generar Memoria Técnica y PDF</a>

🔗 <a href="${item.linkPliego}">Ver en Plataforma de Contratación</a>
--------------------------------------------------
<i>EAR OS V2 :: Soberanía Comercial e Inteligencia de Plenos</i>`;
}

/**
 * Radar de Oportunidades Prioritarias (Navalcarnero, Méntrida, Toledo, Madrid Sur)
 */
export async function runHunterB2GScan() {
  console.log('🔍 [HUNTER B2G] Iniciando barrido forense de licitaciones y actas de plenos...\n');

  const oportunidadesMuestra: Licitacion[] = [
    {
      id: 'LIC-NAV-2026-004',
      ayuntamiento: 'Ayuntamiento de Navalcarnero (Madrid)',
      objeto: 'Sonorización, iluminación técnica e infraestructura acústica para Fiestas Patronales y Ciclo Cultural de Otoño',
      presupuestoMaximo: 14850,
      cpv: '51313000-9',
      tipoContrato: 'Menor',
      linkPliego: 'https://contrataciondelestado.es/wps/poc?uri=deeplink:perfilContratante&idBp=Navalcarnero',
      fuente: 'ACTA_PLENO'
    },
    {
      id: 'LIC-MEN-2026-012',
      ayuntamiento: 'Ayuntamiento de Méntrida (Toledo)',
      objeto: 'Programa de Estimulación Sonora y Musicoterapia para el Centro de Mayores Municipal (Plan VIMUME 2026)',
      presupuestoMaximo: 13900,
      cpv: '85312000-9',
      tipoContrato: 'Menor',
      linkPliego: 'https://contrataciondelestado.es/wps/poc?uri=deeplink:perfilContratante&idBp=Mentrida',
      fuente: 'BOP_TOLEDO'
    },
    {
      id: 'LIC-TOL-2026-089',
      ayuntamiento: 'Diputación Provincial de Toledo',
      objeto: 'Circuito de Espectáculos Musicales y Solistas en Municipios de Menos de 5.000 Habitantes',
      presupuestoMaximo: 14950,
      cpv: '92300000-4',
      tipoContrato: 'Menor',
      linkPliego: 'https://contrataciondelestado.es/wps/poc?uri=deeplink:perfilContratante&idBp=DipuToledo',
      fuente: 'PLACSP'
    }
  ];

  for (const item of oportunidadesMuestra) {
    await sendTelegramB2GAlert(item);
  }

  console.log('🎯 [HUNTER B2G] Barrido completado.');
}

runHunterB2GScan();
