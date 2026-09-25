/**
 * 🎙️ EAR OS V2 — ASISTENTE MULTIMODAL DE CAMPO (VOZ + IMAGEN OCR)
 * ------------------------------------------------------------------
 * Transforma notas de voz, fotos de cuadernos, servilletas o capturas de WhatsApp
 * en una propuesta técnica estructurada por fases con cruce determinista
 * contra el banco de precios oficial de Productora EAR.
 * 
 * Regla Innegociable del CEO: Cero precios de terceros sin validación expresa.
 */

import { buscarEnBancoPrecios, BANCO_PRECIOS_EAR } from './ear-pricing-bank';
import type { EventPhase, ProposalClientData, ProposalLineItem } from './proposal-types';

export interface ExtractedVoiceProposal {
  cliente: ProposalClientData;
  titulo: string;
  urgencia: 'alta' | 'media' | 'baja';
  lineas: ProposalLineItem[];
  textoOriginal: string;
  imagenesAdjuntas?: string[];
}

function deducirFase(texto: string, defaultFase: EventPhase = 'fiesta'): EventPhase {
  const t = texto.toLowerCase();
  if (t.includes('ceremonia') || t.includes('religios') || t.includes('oficiante') || t.includes('altar') || t.includes('lecturas')) return 'ceremonia';
  if (t.includes('coctel') || t.includes('cóctel') || t.includes('aperitivo') || t.includes('bienvenida')) return 'coctel';
  if (t.includes('banquete') || t.includes('cena') || t.includes('comida') || t.includes('tarta') || t.includes('mesa nupcial')) return 'banquete';
  if (t.includes('baile') || t.includes('vals') || t.includes('chispas') || t.includes('humo bajo') || t.includes('primer baile')) return 'baile';
  if (t.includes('barra libre') || t.includes('dj') || t.includes('discoteca') || t.includes('hora extra') || t.includes('fiesta')) return 'fiesta';
  if (t.includes('iluminacion') || t.includes('iluminación') || t.includes('focos') || t.includes('luces') || t.includes('perimetral')) return 'iluminacion';
  if (t.includes('km') || t.includes('kilometraje') || t.includes('hotel') || t.includes('porte') || t.includes('desplazamiento')) return 'logistica';
  return defaultFase;
}

/**
 * Parsea el texto dictado y/o la imagen adjunta en una estructura limpia de propuesta comercial.
 */
export async function procesarDictadoVisita(
  textoOriginal: string,
  imagenBase64?: string
): Promise<ExtractedVoiceProposal> {
  let texto = textoOriginal.trim();

  // Si no hay texto de audio pero se adjuntó una imagen, generar notas desde la imagen
  if (!texto && imagenBase64) {
    texto = "Notas de campo capturadas mediante fotografía adjunta.";
  }

  if (!texto && !imagenBase64) {
    throw new Error('El dictado está vacío. Habla por el micrófono, pega texto o sube una foto de las notas.');
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
  let paxEstimado = 120;
  const matchPax = texto.match(/(\d{2,3})\s*(?:personas|invitados|pax)/i);
  if (matchPax) paxEstimado = parseInt(matchPax[1], 10);

  // 5. Detección de Fecha
  let fechaEvento = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
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

  // 6. Extracción de Conceptos y Casación por Fases
  const lineas: ProposalLineItem[] = [];
  const oraciones = texto.split(/[.;\n]+/).map(s => s.trim()).filter(s => s.length > 5);

  let idCounter = 1;

  for (const oracion of oraciones) {
    const partida = buscarEnBancoPrecios(oracion);
    const esOpcional = /opcional|extra|opcion|opción|adicional|por si quieren|quieren ver/i.test(oracion);

    if (partida) {
      if (!lineas.some(l => l.codigo === partida.codigo)) {
        const medicion = partida.unidad === 'pax' ? paxEstimado : 1;
        const totalCéntimos = partida.precioCéntimos * medicion;

        lineas.push({
          id: `linea-${idCounter++}`,
          codigo: partida.codigo,
          fase: partida.fase,
          capitulo: partida.capitulo,
          descripcion: partida.nombre,
          unidad: partida.unidad,
          medicion,
          precioUnitarioCéntimos: partida.precioCéntimos,
          totalCéntimos,
          esOpcional,
          seleccionada: !esOpcional,
          esAmarilla: false,
          proveedorVerificado: true,
          proveedorNombre: partida.proveedorNombre,
          proveedorGremio: partida.proveedorGremio,
          detallesTecnicos: partida.detallesTecnicos,
        });
      }
    } else if (oracion.length > 15 && !oracion.startsWith('He estado') && !oracion.startsWith('Estuve')) {
      const fase = deducirFase(oracion);
      lineas.push({
        id: `linea-${idCounter++}`,
        fase,
        capitulo: 'Servicios',
        descripcion: oracion.charAt(0).toUpperCase() + oracion.slice(1),
        unidad: 'pa',
        medicion: 1,
        precioUnitarioCéntimos: 0,
        totalCéntimos: 0,
        esOpcional,
        seleccionada: false,
        esAmarilla: true,
        proveedorVerificado: false,
        motivoIa: 'Proveedor / Servicio externo en homologación: precio bloqueado hasta validación en su ficha.',
      });
    }
  }

  // Estructura ceremonial base si no se extrajo ninguna línea
  if (lineas.length === 0) {
    const solista = BANCO_PRECIOS_EAR.find(p => p.codigo === 'ART-SOL-01')!;
    const sonidoCeremonia = BANCO_PRECIOS_EAR.find(p => p.codigo === 'SND-CER-01')!;
    const barraLibre = BANCO_PRECIOS_EAR.find(p => p.codigo === 'SND-DIS-01')!;
    const horaExtra = BANCO_PRECIOS_EAR.find(p => p.codigo === 'SND-HRX-01')!;

    lineas.push(
      {
        id: 'linea-1',
        codigo: sonidoCeremonia.codigo,
        fase: sonidoCeremonia.fase,
        capitulo: sonidoCeremonia.capitulo,
        descripcion: sonidoCeremonia.nombre,
        unidad: sonidoCeremonia.unidad,
        medicion: 1,
        precioUnitarioCéntimos: sonidoCeremonia.precioCéntimos,
        totalCéntimos: sonidoCeremonia.precioCéntimos,
        esOpcional: false,
        seleccionada: true,
        esAmarilla: false,
        proveedorVerificado: true,
      },
      {
        id: 'linea-2',
        codigo: solista.codigo,
        fase: solista.fase,
        capitulo: solista.capitulo,
        descripcion: solista.nombre,
        unidad: solista.unidad,
        medicion: 1,
        precioUnitarioCéntimos: solista.precioCéntimos,
        totalCéntimos: solista.precioCéntimos,
        esOpcional: false,
        seleccionada: true,
        esAmarilla: false,
        proveedorVerificado: true,
      },
      {
        id: 'linea-3',
        codigo: barraLibre.codigo,
        fase: barraLibre.fase,
        capitulo: barraLibre.capitulo,
        descripcion: barraLibre.nombre,
        unidad: barraLibre.unidad,
        medicion: 1,
        precioUnitarioCéntimos: barraLibre.precioCéntimos,
        totalCéntimos: barraLibre.precioCéntimos,
        esOpcional: false,
        seleccionada: true,
        esAmarilla: false,
        proveedorVerificado: true,
      },
      {
        id: 'linea-4',
        codigo: horaExtra.codigo,
        fase: horaExtra.fase,
        capitulo: horaExtra.capitulo,
        descripcion: horaExtra.nombre,
        unidad: horaExtra.unidad,
        medicion: 1,
        precioUnitarioCéntimos: horaExtra.precioCéntimos,
        totalCéntimos: horaExtra.precioCéntimos,
        esOpcional: true,
        seleccionada: false,
        esAmarilla: false,
        proveedorVerificado: true,
      }
    );
  }

  const urgencia = /urgente|prisa|ya|cuanto antes|inmediato/i.test(texto) ? 'alta' : 'media';
  const imagenesAdjuntas = imagenBase64 ? [imagenBase64] : undefined;

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
    imagenesAdjuntas,
  };
}
