/**
 * 📱 WHATSAPP CENTRAL DISPATCH ENGINE (+34 693 693 048)
 * Bloque B0.07 — Generación determinista de enlaces wa.me con plantillas contractuales SSOT.
 */

export const CENTRAL_PHONE = '+34693693048';
export const DISPLAY_PHONE = '+34 693 693 048';

export type DispatchTemplateType = 'solista' | 'mariachi' | 'vimume' | 'b2g' | 'custom';

export interface DispatchParams {
  type: DispatchTemplateType;
  clientName?: string;
  clientPhone?: string;
  province?: string;
  eventDate?: string;
  customNotes?: string;
  pax?: number;
  formatName?: string;
  totalEur?: number;
}

export function generateWhatsAppDispatchLink(params: DispatchParams): {
  url: string;
  rawText: string;
} {
  const name = params.clientName || 'Cliente VIP';
  const province = params.province || 'Madrid';
  const date = params.eventDate || 'Fecha a confirmar';

  let text = '';

  switch (params.type) {
    case 'solista': {
      const price = params.totalEur || 350;
      text = `🏛️ *RESERVA OFICIAL SOLISTA PREMIUM — PRODUCTORA EAR*
• *Artista:* Edwin Agudelo (Tenor Lírico)
• *Cliente:* ${name}
• *Provincia:* ${province}
• *Fecha Evento:* ${date}
• *Tarifa Base:* ${price} € (Incluye Sonido Bose F1 / S1 Pro, Shure Beta 87A, Ramo en vivo y Canción Dedicada)
• *Garantía:* Depósito Price-Lock 100 € en Stripe / Split 80/10/10

Hola Edwin, solicito confirmación de disponibilidad para esta fecha.`;
      break;
    }

    case 'mariachi': {
      const format = params.formatName || 'Trío Mariachi Gala';
      const price = params.totalEur || 450;
      text = `🎺 *RESERVA AGRUPACIÓN MARIACHI — PRODUCTORA EAR*
• *Formato:* ${format}
• *Cliente:* ${name}
• *Provincia:* ${province}
• *Fecha Evento:* ${date}
• *Importe Acordado:* ${price} €
• *Garantía:* Depósito Price-Lock 100 € en Stripe (SHA-256)

Hola equipo EAR, solicito verificar agenda para esta formación.`;
      break;
    }

    case 'vimume': {
      text = `🧠 *PILOTO TERAPÉUTICO VIMUME (NEURO-MUSICOTERAPIA 40 HZ)*
• *Solicitante:* ${name}
• *Centro / Residencia:* ${province}
• *Duración:* 14 Días de Intervención (Protocolo OMS ICOPE)
• *Beneficio:* Reducción 38.2% agitación CMAI y desescalada 74% psicofármacos.
• *Deducción Fiscal:* Hasta 80% IRPF / 40-50% Sociedades (Ley 49/2002 / Modelo 182 AEAT)

Solicito llamada del equipo clínico VIMUME para iniciar evaluación inicial.`;
      break;
    }

    case 'b2g': {
      const amount = params.totalEur || 14250;
      text = `🏛️ *LICITACIÓN MENOR B2G / AYUNTAMIENTO (ART. 118 LCSP)*
• *Entidad:* ${name}
• *Provincia / Municipio:* ${province}
• *Presupuesto Estimado:* ${amount} € (< 14.250 € Sin Impuestos)
• *Requisitos:* Factura Electrónica FACe/DIR3, Límite dBA <75 SPL, Certificado Drones AESA y Seguro RC 1.2M€.

Solicito envío de memoria técnica y propuesta contractual de urgencia.`;
      break;
    }

    default: {
      text = `Hola Productora EAR (+34 693 693 048), solicito información y presupuesto para un evento en ${province} para el ${date}. ${params.customNotes || ''}`;
      break;
    }
  }

  const cleanPhone = CENTRAL_PHONE.replace(/\D/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;

  return { url, rawText: text };
}
