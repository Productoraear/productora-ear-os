const fs = require('fs');
const path = require('path');
const dir = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\05_CODIGO_Y_SISTEMA';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && (f.toLowerCase().includes('finca') || f.toLowerCase().includes('cigarral') || f.toLowerCase().includes('quinta')));
console.log('Fincas en HTMLs:', files.length);

let totalWithPublicCalendar = 0;
let totalWithPrices = 0;
let totalWithCapacity = 0;
let totalWithPhone = 0;

for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const lower = content.toLowerCase();

  // Buscar si hay calendario interactivo de fechas ocupadas (no solo el datepicker del formulario)
  const hasBookedDates = lower.includes('fechas ocupadas') || lower.includes('fechas no disponibles') || lower.includes('booked_dates') || lower.includes('reserved_dates');
  if (hasBookedDates) totalWithPublicCalendar++;

  // Buscar precios
  if (lower.includes('precio por menú') || lower.includes('alquiler desde') || lower.includes('precio menú')) totalWithPrices++;

  // Buscar capacidad
  if (lower.includes('capacidad') || lower.includes('nº de invitados') || lower.includes('invitados')) totalWithCapacity++;

  // Buscar teléfonos
  const phones = content.match(/(?:\+34|0034|[689]\d{2})[\s.-]?\d{3}[\s.-]?\d{3}/g);
  if (phones && phones.length > 0) totalWithPhone++;
}

console.log('--- REPORTE FORENSE DE FINCAS VAMPIRIZADAS ---');
console.log('Fincas con Calendario Público de Fechas Ocupadas:', totalWithPublicCalendar, 'de', files.length);
console.log('Fincas con Precios / Rango de Menús extraídos:', totalWithPrices, 'de', files.length);
console.log('Fincas con Capacidad de Invitados:', totalWithCapacity, 'de', files.length);
console.log('Fincas con Teléfono en el código:', totalWithPhone, 'de', files.length);

