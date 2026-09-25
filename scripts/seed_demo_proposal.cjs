/**
 * 🌟 SEED DE DEMO S-CLASS: PROPUESTA INAUGURAL CRISTINA & PABLO
 * -------------------------------------------------------------
 * Inicializa una propuesta viva estructurada por las 7 fases del evento.
 */

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'data', 'proposals');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const propuesta = {
  id: "prop-demo-cristina-pablo",
  numero: "EAR-2026-101",
  token: "boda-cristina-pablo-jarama",
  titulo: "Producción Integral, Sonorización Ceremonia & Disco S-Class",
  estado: "enviado",
  cliente: {
    nombre: "Cristina & Pablo",
    email: "novios@bodasjarama.es",
    telefono: "+34 693 693 048",
    fincaOEspacio: "La Quinta de Jarama",
    poblacion: "San Sebastián de los Reyes",
    provincia: "Madrid",
    fechaEvento: "2026-09-12",
    paxEstimado: 150
  },
  lineas: [
    {
      id: "linea-1",
      codigo: "SND-CER-01",
      fase: "ceremonia",
      capitulo: "Sonorización",
      descripcion: "Pack Sonorización Ceremonia Civil S-Class (Bose S1 Pro + Shure Beta 87A)",
      unidad: "pa",
      medicion: 1,
      precioUnitarioCéntimos: 25000,
      totalCéntimos: 25000,
      esOpcional: false,
      seleccionada: true,
      esAmarilla: false,
      proveedorVerificado: true
    },
    {
      id: "linea-2",
      codigo: "ART-SOL-01",
      fase: "coctel",
      capitulo: "Artistas",
      descripcion: "Solista Edwin Agudelo (Voz Lírica y Repertorio Acústico para Cóctel)",
      unidad: "ud",
      medicion: 1,
      precioUnitarioCéntimos: 35000,
      totalCéntimos: 35000,
      esOpcional: false,
      seleccionada: true,
      esAmarilla: false,
      proveedorVerificado: true
    },
    {
      id: "linea-3",
      codigo: "SND-BAN-01",
      fase: "banquete",
      capitulo: "Sonorización",
      descripcion: "Megafonía & Hilo Musical Banquete / Entrada Nupcial",
      unidad: "pa",
      medicion: 1,
      precioUnitarioCéntimos: 18000,
      totalCéntimos: 18000,
      esOpcional: false,
      seleccionada: true,
      esAmarilla: false,
      proveedorVerificado: true
    },
    {
      id: "linea-4",
      codigo: "EFE-CHI-01",
      fase: "baile",
      capitulo: "Efectos",
      descripcion: "Efecto Chispas Frías Cold Spark (2 Cabezas no pirotécnicas para primer baile)",
      unidad: "pa",
      medicion: 1,
      precioUnitarioCéntimos: 22000,
      totalCéntimos: 22000,
      esOpcional: true,
      seleccionada: false,
      esAmarilla: false,
      proveedorVerificado: true
    },
    {
      id: "linea-5",
      codigo: "SND-DIS-01",
      fase: "fiesta",
      capitulo: "Sonorización",
      descripcion: "Pack Barra Libre S-Class 4 Horas (Bose F1 1000W + Cabina Pioneer DJ + Iluminación)",
      unidad: "pa",
      medicion: 1,
      precioUnitarioCéntimos: 65000,
      totalCéntimos: 65000,
      esOpcional: false,
      seleccionada: true,
      esAmarilla: false,
      proveedorVerificado: true
    },
    {
      id: "linea-6",
      codigo: "SND-HRX-01",
      fase: "fiesta",
      capitulo: "Sonorización",
      descripcion: "Hora Extra Adicional de Barra Libre y DJ Residente",
      unidad: "h",
      medicion: 1,
      precioUnitarioCéntimos: 12000,
      totalCéntimos: 12000,
      esOpcional: true,
      seleccionada: false,
      esAmarilla: false,
      proveedorVerificado: true
    },
    {
      id: "linea-7",
      codigo: "ILU-PER-01",
      fase: "iluminacion",
      capitulo: "Iluminación",
      descripcion: "Pack Iluminación Perimetral Wireless (12 Focos LED RGBW a Batería)",
      unidad: "pa",
      medicion: 1,
      precioUnitarioCéntimos: 28000,
      totalCéntimos: 28000,
      esOpcional: true,
      seleccionada: false,
      esAmarilla: false,
      proveedorVerificado: true
    },
    {
      id: "linea-8",
      codigo: "LOG-KM-01",
      fase: "logistica",
      capitulo: "Logística",
      descripcion: "Desplazamiento Técnico y Logística Flota Méntrida",
      unidad: "pa",
      medicion: 1,
      precioUnitarioCéntimos: 0,
      totalCéntimos: 0,
      esOpcional: false,
      seleccionada: true,
      esAmarilla: false,
      proveedorVerificado: true
    }
  ],
  ivaPct: 21,
  descuentoPct: 0,
  caducidadDias: 14,
  creadoEn: new Date().toISOString(),
  enviadoEn: new Date().toISOString(),
  expiraEn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
};

const targetPath = path.join(dir, `${propuesta.token}.json`);
fs.writeFileSync(targetPath, JSON.stringify(propuesta, null, 2), 'utf-8');

console.log('✅ Propuesta inaugural 7 fases sembrada con éxito en:', targetPath);
console.log('🔗 URL pública de prueba: /propuesta/' + propuesta.token);
