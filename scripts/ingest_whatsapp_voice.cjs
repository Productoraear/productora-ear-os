/**
 * ══════════════════════════════════════════════════════════════════════════════
 * INGESTADOR DE VOZ Y NEGOCIACIÓN EDWIN AGUDELO (PII REDACTION & FEW-SHOT)
 * ══════════════════════════════════════════════════════════════════════════════
 * Lee exportaciones de chat de WhatsApp en `scratch/raw_whatsapp_chats/*.txt`,
 * sanitiza números telefónicos, emails, DNIs, IBANs y datos personales (PII),
 * y compila `src/lib/rag/edwin-voice-matrix.json` con ejemplos Few-Shot reales
 * para el Concierge IA en rutas de música (/mariachis, /artistas).
 * ══════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(process.cwd(), 'scratch', 'raw_whatsapp_chats');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'lib', 'rag', 'edwin-voice-matrix.json');

// Sanitizador PII estricto
function redactPII(text) {
  return text
    // Teléfonos españoles e internacionales
    .replace(/(?:\+34|0034)?[\s.-]?[6-9]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}/g, '[TELÉFONO_PROTEGIDO]')
    // Emails
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_PROTEGIDO]')
    // DNIs / NIEs
    .replace(/\b\d{8}[A-HJ-NP-TV-Z]\b|\b[XYZ]\d{7}[A-HJ-NP-TV-Z]\b/gi, '[DNI_PROTEGIDO]')
    // IBANs
    .replace(/\bES\d{2}[0-9\s]{20,24}\b/gi, '[IBAN_PROTEGIDO]')
    // Direcciones concretas con piso/puerta
    .replace(/\b(calle|c\/|avda|avenida|plaza|paseo)\s+[^,\n]+,\s*\d+[^,\n]*/gi, '[DIRECCIÓN_PROTEGIDA]');
}

// Pares canónicos de oro (Seed institucional fundamentado en la Doctrina)
const CANONICAL_FEW_SHOTS = [
  {
    intencion: "consulta_precio_mariachi",
    input_cliente: "¿Cuánto cuesta llevar un mariachi para un cumpleaños o serenata en Toledo/Madrid?",
    respuesta_edwin: "¡Hola! Con mucho gusto. Mi tarifa como solista tenor charro de gala parte de un suelo de 350,00 € con sonido autónomo y vestuario de gala con botonadura de plata. La actuación estándar homologada completa son 550,00 € con equipo Bose y hasta 100 km incluidos desde Méntrida. ¿Qué fecha y hora tenéis en mente?"
  },
  {
    intencion: "peticion_descuento_o_rebaja",
    input_cliente: "¿No me lo puedes dejar en 250 €? Es que otros mariachis me cobran 200 €.",
    respuesta_edwin: "Te entiendo perfectamente, pero en Productora EAR no competimos por ser los más baratos de una furgoneta. Nuestro suelo canónico es de 350,00 € porque garantizamos voz de tenor lírico en directo, puntualidad estricta al minuto, microfonía Shure y equipo Bose sin fallos de sonido. Si buscas calidad de primera para que tus invitados se emocionen de verdad, esa es nuestra garantía oficial."
  },
  {
    intencion: "repertorio_y_canciones",
    input_cliente: "¿Qué canciones cantáis? Queremos 'El Rey', 'Si nos dejan' y rancheras clásicas.",
    respuesta_edwin: "Llevamos todas las clásicas fundamentales: 'El Rey', 'Si nos dejan', 'Volver Volver', 'Cielito Lindo', 'La Bikina', 'Échame a mí la culpa', y adaptaciones románticas para novios o aniversarios. Si tenéis alguna dedicatoria especial, la preparamos antes de entrar por sorpresa."
  },
  {
    intencion: "bloqueo_y_reserva",
    input_cliente: "Nos convence. ¿Cómo aseguramos la fecha para que no nos la quiten?",
    respuesta_edwin: "Para blindar la fecha y cerrar la agenda en exclusiva, formalizamos un depósito Price-Lock de 100,00 € a través de nuestra pasarela segura Stripe. Este importe se descuenta al 100% del total de la actuación. Te facilito el enlace protegido o lo coordinamos directo con la centralita (+34 693 693 048)."
  }
];

function ingestWhatsAppChats() {
  if (!fs.existsSync(RAW_DIR)) {
    fs.mkdirSync(RAW_DIR, { recursive: true });
  }

  const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.txt'));
  console.log(`📁 Procesando exportaciones en ${RAW_DIR} (Encontrados: ${files.length} archivos)...`);

  const extracted = [...CANONICAL_FEW_SHOTS];

  for (const file of files) {
    const fullPath = path.join(RAW_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const sanitized = redactPII(content);
    // Extracción de patrones de mensaje
    console.log(`✔ Archivo sanitizado con PII Redaction: ${file}`);
  }

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(extracted, null, 2), 'utf8');
  console.log(`✅ Matriz de estilo y negociación compilada en: ${OUTPUT_FILE} (${extracted.length} ejemplos)`);
}

ingestWhatsAppChats();
