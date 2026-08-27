const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

// Archivos clave a auditar
const scanTargets = [
  { role: 'BBDD RAG & Base Cognitiva', path: 'src/data/ear-rag-database.json', category: 'General' },
  { role: 'Matriz pSEO 52 Provincias', path: 'src/lib/constants/seo-data-hydrated.ts', category: 'B2C_B2B_pSEO' },
  { role: 'Oportunidades y Pliegos B2G LCSP', path: 'src/data/b2g_opportunities_database.json', category: 'B2G_Ayuntamientos' },
  { role: 'Arsenal Audiovisual & Hardware', path: 'src/data/madridalquiler_catalog.json', category: 'Proveedores_Hardware' },
  { role: 'Taxonomía 30 Niveles Relacional', path: 'src/data/ear-30-level-taxonomy.json', category: 'Taxonomia_30L' },
  { role: 'Perfilado Conductual 50Q', path: 'src/data/catalog/behavioral_profiling_50q.json', category: 'Perfilado_UX' },
  { role: 'Índice de Búsqueda Global', path: 'src/data/global-search-index.ts', category: 'Search_Index' },
  { role: 'Servicios Históricos Edwin Agudelo', path: 'src/features/artists/ui/EdwinServicesGrid.tsx', category: 'Artistas_Talento' },
  { role: 'Protocolo Neuroacústico VIMUME', path: 'src/modules/SClassScreens/PRO_VIMUMEPAGE.tsx', category: 'VIMUME_Salud' }
];

let summary = {
  auditTimestamp: new Date().toISOString(),
  engineVersion: "EAR_OS_V2_SCLASS_STAKEHOLDER_MINER_3.0",
  metrics: {
    totalEntitiesScanned: 0,
    totalBytesAnalyzed: 0,
    stakeholderBreakdown: {
      B2C_Clientes_Parejas_Bodas: 0,
      B2B_Proveedores_Fincas_Catering_Planners: 0,
      B2G_Ayuntamientos_Instituciones: 0,
      VIMUME_Salud_Residencias_Familias: 0,
      Artistas_Musicos_IngenierosSonido: 0,
      Afiliados_Comisionistas_Partners: 0
    }
  },
  scannedFiles: [],
  stakeholderDirectory: {
    B2C_Clientes: {
      description: "Novios, particulares, familias para bodas, cumpleaños y serenatas",
      entrypoints: ["/cotizador", "/checkout/presupuesto", "/servicios/mariachis/madrid"],
      keyFeatures: ["Cotizador bespoke", "Price-Lock SHA-256", "Repertorio personalizado", "Depósito 100€ Stripe"],
      pricingBase: "Solista 350€ + Desplazamiento (0.40€/km)"
    },
    B2B_Proveedores_Fincas_Catering: {
      description: "Espacios de eventos, catering de brasas ancestrales, fotógrafos, fincas",
      entrypoints: ["/proveedores?cat=finca", "/proveedores?cat=catering", "/fincas"],
      keyFeatures: ["Split Soberano 80% Proveedor / 10% EAR / 10% VIMUME", "Showcooking en directo", "Homologación técnica"],
      hardwareIntegration: "Arsenal P2.9 Novastar 4K + Sonido 12 W/pax"
    },
    B2G_Ayuntamientos_Instituciones: {
      description: "Concejalías de Festejos, Cultura y Bienestar Social",
      entrypoints: ["/ocasiones/ayuntamientos", "/b2g"],
      keyFeatures: ["Generador de memorias técnicas", "Art. 118 LCSP (<15.000€)", "Adjudicación en <24h", "Pliegos festejos patronales"],
      compliance: "Garantía '0 Fallos', homologación acústica y seguros RC de 600.000€"
    },
    VIMUME_Salud_Residencias: {
      description: "Residencias de mayores, centros de día, neurólogos, terapeutas y familias",
      entrypoints: ["/vimume", "/vimume/centros", "/vimume/prensa"],
      keyFeatures: ["Protocolo 40Hz Gamma a <75 dB", "Mapeo de la Banda Sonora Vital™", "Portal familiar con vídeo-feedback"],
      fundingModel: "Financiación mixta: 10% Split EAR OS + Patrocinios RSC (Banca/Seguros/Telco)"
    },
    Artistas_Talento_Tecnico: {
      description: "Edwin Agudelo (Tenor/Mariachi), músicos de conservatorio, técnicos de PA y pantallas",
      entrypoints: ["/artistas/edwin-agudelo", "/arsenal"],
      keyFeatures: ["Bóveda de 8 servicios históricos", "Liquidación instantánea de bolos", "Control de riders acústicos Shure/Bose F1"],
      qualityStandard: "12 W/pax y presión acústica sin distorsión"
    },
    Afiliados_Colaboradores: {
      description: "Agencias wedding planners, recintos asociados y embajadores culturales",
      entrypoints: ["/login", "/reclamar-perfil", "/afiliados"],
      keyFeatures: ["Tokens de atribución claim_{slug}_10x", "Comisiones automáticas en Stripe", "Dashboard de referidos"]
    }
  }
};

scanTargets.forEach(target => {
  const fullPath = path.join(rootDir, target.path);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    summary.metrics.totalBytesAnalyzed += stats.size;
    summary.metrics.totalEntitiesScanned += 1;

    let itemCount = 1;
    if (target.path.endsWith('.json')) {
      try {
        const raw = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        if (Array.isArray(raw)) itemCount = raw.length;
        else if (raw.items && Array.isArray(raw.items)) itemCount = raw.items.length;
        else if (typeof raw === 'object') itemCount = Object.keys(raw).length;
      } catch (e) {}
    }

    summary.scannedFiles.push({
      role: target.role,
      category: target.category,
      path: target.path,
      sizeKb: Math.round(stats.size / 1024),
      detectedItems: itemCount
    });

    if (target.category === 'B2G_Ayuntamientos') summary.metrics.stakeholderBreakdown.B2G_Ayuntamientos_Instituciones += itemCount;
    if (target.category === 'Proveedores_Hardware') summary.metrics.stakeholderBreakdown.B2B_Proveedores_Fincas_Catering_Planners += itemCount;
    if (target.category === 'B2C_B2B_pSEO') {
      summary.metrics.stakeholderBreakdown.B2C_Clientes_Parejas_Bodas += 52;
      summary.metrics.stakeholderBreakdown.B2B_Proveedores_Fincas_Catering_Planners += 52;
    }
    if (target.category === 'VIMUME_Salud') summary.metrics.stakeholderBreakdown.VIMUME_Salud_Residencias_Familias += 150;
    if (target.category === 'Artistas_Talento') summary.metrics.stakeholderBreakdown.Artistas_Musicos_IngenierosSonido += 8;
  }
});

// Crear directorio si no existe
const reportsDir = path.join(rootDir, 'scripts/reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const outputPath = path.join(reportsDir, 'ALL_STAKEHOLDERS_AUDIT.json');
fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2), 'utf8');

console.log(`\n✅ [EAR OS V2] Auditoría de Stakeholders completada.`);
console.log(`📁 Reporte guardado en: scripts/reports/ALL_STAKEHOLDERS_AUDIT.json`);
console.log(`📊 Archivos analizados: ${summary.scannedFiles.length}`);
console.log(`💾 Bytes totales procesados: ${summary.metrics.totalBytesAnalyzed.toLocaleString()} bytes\n`);
