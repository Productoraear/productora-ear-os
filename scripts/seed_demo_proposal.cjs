/**
 * 🌟 SEED DE DEMO S-CLASS: PROPUESTA INAUGURAL CRISTINA & PABLO
 * -------------------------------------------------------------
 * Inicializa una propuesta viva para verificación inmediata.
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
      capitulo: "Sonorización",
      descripcion: "Pack Sonorización Ceremonia Civil S-Class (Bose S1 Pro + Shure Beta 87A)",
      unidad: "pa",
      medicion: 1,
      precioUnitarioCéntimos: 25000,
      totalCéntimos: 25000,
      esOpcional: false,
      seleccionada: true,
      esAmarilla: false
    },
    {
      id: "linea-2",
      codigo: "ART-SOL-01",
      capitulo: "Artistas",
      descripcion: "Solista Edwin Agudelo (Voz Lírica y Repertorio Acústico para Cóctel)",
      unidad: "ud",
      medicion: 1,
      precioUnitarioCéntimos: 35000,
      totalCéntimos: 35000,
      esOpcional: false,
      seleccionada: true,
      esAmarilla: false
    },
    {
      id: "linea-3",
      codigo: "SND-DIS-01",
      capitulo: "Sonorización",
      descripcion: "Pack Barra Libre S-Class 4 Horas (Bose F1 1000W + Cabina Pioneer DJ + Iluminación)",
      unidad: "pa",
      medicion: 1,
      precioUnitarioCéntimos: 65000,
      totalCéntimos: 65000,
      esOpcional: false,
      seleccionada: true,
      esAmarilla: false
    },
    {
      id: "linea-4",
      codigo: "ILU-PER-01",
      capitulo: "Iluminación",
      descripcion: "Pack Iluminación Perimetral Wireless (12 Focos LED RGBW a Batería)",
      unidad: "pa",
      medicion: 1,
      precioUnitarioCéntimos: 28000,
      totalCéntimos: 28000,
      esOpcional: true,
      seleccionada: false,
      esAmarilla: false
    },
    {
      id: "linea-5",
      codigo: "EFE-CHI-01",
      capitulo: "Efectos",
      descripcion: "Efecto Chispas Frías Cold Spark (2 Cabezas no pirotécnicas para entrada/baile)",
      unidad: "pa",
      medicion: 1,
      precioUnitarioCéntimos: 22000,
      totalCéntimos: 22000,
      esOpcional: true,
      seleccionada: false,
      esAmarilla: false
    },
    {
      id: "linea-6",
      codigo: "SND-HRX-01",
      capitulo: "Sonorización",
      descripcion: "Hora Extra Adicional de Barra Libre y Sonido en Directo",
      unidad: "h",
      medicion: 1,
      precioUnitarioCéntimos: 12000,
      totalCéntimos: 12000,
      esOpcional: true,
      seleccionada: false,
      esAmarilla: false
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

console.log('✅ Propuesta inaugural sembrada con éxito en:', targetPath);
console.log('🔗 URL pública de prueba: /propuesta/' + propuesta.token);
