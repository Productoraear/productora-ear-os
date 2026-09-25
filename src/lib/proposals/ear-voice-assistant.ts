/**
 * 🎙️ EAR OS V2 — ASISTENTE DE CAMPO POR VOZ & PARSER ESTRUCTURADO
 * ------------------------------------------------------------------
 * Transforma notas de voz o dictado de visitas en fincas y llamadas
 * en una propuesta técnica estructurada con cruce determinista
 * contra el banco de precios oficial de Productora EAR.
 * 
 * Principio Fundamental: La IA solo interpreta lenguaje natural;
 * el banco de precios asigna los importes con cero alucinaciones.
 */

import { buscarEnBancoPrecios, BANCO_PRECIOS_EAR } from './ear-pricing-bank';
import type { ProposalClientData, ProposalLineItem } from './proposal-types';

export interface ExtractedVoiceProposal {
  cliente: ProposalClientData;
  titulo: string;
  urgencia: 'alta' | 'media' | 'baja';
  lineas: ProposalLineItem[];
  textoOriginal: string;
}

/**
 * Parsea el texto dictado en una estructura limpia de propuesta comercial.
 * Funciona de forma autónoma con parsing semántico robusto en servidor.
 */
export async function procesarDictadoVisita(textoOriginal: string): Promise<ExtractedVoiceProposal> {
  const texto = textoOriginal.trim();
  if (!texto) {
    throw new Error('El texto del dictado está vacío. Dicta la visita o pega tus notas.');
  }

  // 1. Detección Inteligente de Finca / Espacio
  const fincasConocidas = [
    'Quinta del Jarama', 'Quinta de Jarama', 'La Quinta del Jarama', 'La Quinta de Jarama',
    'Finca Las Jarillas', 'Las Jarillas', 'El Regajal', 'Finca El Regajal',
    'La Vega del Henares', 'Soto de Cerrolato', 'Castillo de Viñuelas',
    'La Posta Real', 'Finca La Posta Real', 'Palacio del Negralejo', 'Aldea Santillana',
    'Finca Monteamor', 'Finca Asturiana', 'Finca Los Jarales', 'Monasterio de Lupiana'
  ];

  let fincaDetectada = 'Finca / Espacio Privado';
  for (const f of fincasConocidas) {
    if (new RegExp(`\\b${f}\\b`, 'i').test(texto)) {
      fincaDetectada = f;
      break;
    }
  }

  // 2. Detección de Nombres de Novios / Cliente
  let clienteNombre = 'Cliente / Novios';
  const matchNombres = texto.match(/(?:con los novios|con|para|cliente)\s+([A-ZÁÉÍÓÚ][a-záéíóú]+(?:\s+y\s+[A-ZÁÉÍÓÚ][a-záéíóú]+)?)/i);
  if (matchNombres && matchNombres[1]) {
    clienteNombre = matchNombres[1].trim();
  }

  // 3. Detección de Teléfono y Email
  let telefono = '';
  const matchTel = texto.match(/(?:6\d{2}[\s.-]?\d{3}[\s.-]?\d{3}|7\d{2}[\s.-]?\d{3}[\s.-]?\d{3})/);
  if (matchTel) telefono = matchTel[0].replace(/[\s.-]/g, '');

  let email = '';
  const matchEmail = texto.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (matchEmail) email = matchEmail[1].toLowerCase();

  // 4. Detección de Invitados (Pax)
  let paxEstimado = 120; // Default ceremonial
  const matchPax = texto.match(/(\d{2,3})\s*(?:personas|invitados|pax)/i);
  if (matchPax) paxEstimado = parseInt(matchPax[1], 10);

  // 5. Detección de Fecha
  let fechaEvento = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // +60 días por defecto
  const matchFecha = texto.match(/(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(?:\s+de\s+(\d{4}))?/i);
  if (matchFecha) {
    const meses: Record<string, string> = {
      enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
      julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
    };
    const dia = matchFecha[1].padStart(2, '0');
    const mes = meses[matchFecha[2].toLowerCase()] || '06';
    const anio = matchFecha[3] || '2026';
    fechaEvento = `${anio}-${mes}-${dia}`;
  }

  // 6. Extracción de Conceptos y Casación con el Banco de Precios
  const lineas: ProposalLineItem[] = [];
  const oraciones = texto.split(/[.;\n]+/).map(s => s.trim()).filter(s => s.length > 5);

  let idCounter = 1;

  for (const oracion of oraciones) {
    const partida = buscarEnBancoPrecios(oracion);
    const esOpcional = /opcional|extra|opcion|opción|adicional|por si quieren|quieren ver/i.test(oracion);

    if (partida) {
      // Evitar duplicados exactos en la misma propuesta
      if (!lineas.some(l => l.codigo === partida.codigo)) {
        lineas.push({
          id: `linea-${idCounter++}`,
          codigo: partida.codigo,
          capitulo: partida.capitulo,
          descripcion: partida.nombre,
          unidad: partida.unidad,
          medicion: 1,
          precioUnitarioCéntimos: partida.precioCéntimos,
          totalCéntimos: partida.precioCéntimos,
          esOpcional,
          seleccionada: !esOpcional, // Las opcionales nacen sin marcar (Regla SSOT)
          esAmarilla: false,
        });
      }
    } else if (oracion.length > 15 && !oracion.startsWith('He estado') && !oracion.startsWith('Estuve')) {
      // Concepto no homologado: nace en amarillo con precio 0 para revisión humana
      lineas.push({
        id: `linea-${idCounter++}`,
        capitulo: 'Servicios',
        descripcion: oracion.charAt(0).toUpperCase() + oracion.slice(1),
        unidad: 'pa',
        medicion: 1,
        precioUnitarioCéntimos: 0,
        totalCéntimos: 0,
        esOpcional,
        seleccionada: false,
        esAmarilla: true,
        motivoIa: 'Concepto detectado fuera del catálogo oficial — Fijar precio manualmente.',
      });
    }
  }

  // Si no se extrajo ninguna línea conocida, dotar de una estructura ceremonial base
  if (lineas.length === 0) {
    const solista = BANCO_PRECIOS_EAR.find(p => p.codigo === 'ART-SOL-01')!;
    const sonidoCeremonia = BANCO_PRECIOS_EAR.find(p => p.codigo === 'SND-CER-01')!;
    const barraLibre = BANCO_PRECIOS_EAR.find(p => p.codigo === 'SND-DIS-01')!;
    const horaExtra = BANCO_PRECIOS_EAR.find(p => p.codigo === 'SND-HRX-01')!;

    lineas.push(
      {
        id: 'linea-1',
        codigo: solista.codigo,
        capitulo: solista.capitulo,
        descripcion: solista.nombre,
        unidad: solista.unidad,
        medicion: 1,
        precioUnitarioCéntimos: solista.precioCéntimos,
        totalCéntimos: solista.precioCéntimos,
        esOpcional: false,
        seleccionada: true,
        esAmarilla: false,
      },
      {
        id: 'linea-2',
        codigo: sonidoCeremonia.codigo,
        capitulo: sonidoCeremonia.capitulo,
        descripcion: sonidoCeremonia.nombre,
        unidad: sonidoCeremonia.unidad,
        medicion: 1,
        precioUnitarioCéntimos: sonidoCeremonia.precioCéntimos,
        totalCéntimos: sonidoCeremonia.precioCéntimos,
        esOpcional: false,
        seleccionada: true,
        esAmarilla: false,
      },
      {
        id: 'linea-3',
        codigo: barraLibre.codigo,
        capitulo: barraLibre.capitulo,
        descripcion: barraLibre.nombre,
        unidad: barraLibre.unidad,
        medicion: 1,
        precioUnitarioCéntimos: barraLibre.precioCéntimos,
        totalCéntimos: barraLibre.precioCéntimos,
        esOpcional: false,
        seleccionada: true,
        esAmarilla: false,
      },
      {
        id: 'linea-4',
        codigo: horaExtra.codigo,
        capitulo: horaExtra.capitulo,
        descripcion: horaExtra.nombre,
        unidad: horaExtra.unidad,
        medicion: 1,
        precioUnitarioCéntimos: horaExtra.precioCéntimos,
        totalCéntimos: horaExtra.precioCéntimos,
        esOpcional: true,
        seleccionada: false,
        esAmarilla: false,
      }
    );
  }

  const urgencia = /urgente|prisa|ya|cuanto antes|inmediato/i.test(texto) ? 'alta' : 'media';

  return {
    cliente: {
      nombre: clienteNombre,
      email,
      telefono,
      fincaOEspacio: fincaDetectada,
      poblacion: 'Madrid',
      provincia: 'Madrid',
      fechaEvento,
      paxEstimado,
    },
    titulo: `Producción Integral & Audiovisual · ${clienteNombre} · ${fincaDetectada}`,
    urgencia,
    lineas,
    textoOriginal: texto,
  };
}
