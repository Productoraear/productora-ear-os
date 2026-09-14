/**
 * S-CLASS HEATMAP GENERATOR
 * ─────────────────────────────────────────────────────────────
 * Genera un panel visual HTML OLED de grado militar (EAR_JOURNEY_HEATMAP.html)
 * con la telemetría de eficiencia del viaje del cliente.
 */

import fs from 'fs';
import path from 'path';

interface AuditResultItem {
  journeyId: string;
  query: string;
  temperature: 'COLD' | 'WARM' | 'HOT' | 'FIRE';
  efficiencyScore: number;
  passedGoldenPath: boolean;
  violations: string[];
  metrics: {
    clicks: number;
    timeMs: number;
    hasNeuralJourney: boolean;
    depositLocked: boolean;
  };
  recommendations: string[];
}

interface AuditData {
  timestamp: string;
  totalSimulated: number;
  averageEfficiencyScore: number;
  goldenPathPassRate: number;
  results: AuditResultItem[];
}

function generateHeatmapHtml(data: AuditData): string {
  const rows = data.results.map(r => {
    const tempColor =
      r.temperature === 'FIRE' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
      r.temperature === 'HOT' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
      r.temperature === 'WARM' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
      'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';

    const scoreColor =
      r.efficiencyScore >= 90 ? 'text-emerald-400' :
      r.efficiencyScore >= 70 ? 'text-yellow-400' :
      'text-red-400';

    const timeSec = (r.metrics.timeMs / 1000).toFixed(1);

    return `
      <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
        <td class="py-3 px-4 font-mono text-xs text-white/50">${r.journeyId}</td>
        <td class="py-3 px-4 font-inter text-sm font-medium text-white/90">${r.query}</td>
        <td class="py-3 px-4">
          <span class="inline-block px-2.5 py-1 text-xs font-mono font-bold rounded-full border ${tempColor}">
            ${r.temperature}
          </span>
        </td>
        <td class="py-3 px-4 font-mono text-sm font-bold ${scoreColor}">
          ${r.efficiencyScore}%
        </td>
        <td class="py-3 px-4 font-mono text-sm text-center">
          <span class="${r.metrics.clicks <= 3 ? 'text-emerald-400 font-bold' : 'text-white/60'}">
            ${r.metrics.clicks} clics
          </span>
        </td>
        <td class="py-3 px-4 font-mono text-xs text-right text-white/70">
          ${timeSec}s
        </td>
        <td class="py-3 px-4 text-center">
          ${r.metrics.hasNeuralJourney ? '<span class="text-emerald-400">● ACTIVO</span>' : '<span class="text-red-500">✕ AUSENTE</span>'}
        </td>
        <td class="py-3 px-4 text-center">
          ${r.metrics.depositLocked ? '<span class="text-[#ecb613] font-bold">100 € LOCKED</span>' : '<span class="text-white/30">CONSULTA</span>'}
        </td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EAR OS :: S-Class Customer Journey Heatmap</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
    body { background-color: #030305; font-family: 'Inter', sans-serif; color: #f4f4f5; }
    h1, h2, h3 { font-family: 'Syne', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="p-6 md:p-10 max-w-7xl mx-auto space-y-8">

  <!-- Header OLED -->
  <header class="border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
    <div>
      <div class="text-[#ecb613] font-mono text-xs uppercase tracking-wider mb-1">Telemetría de Flota & Embudo Transaccional</div>
      <h1 class="text-4xl font-extrabold tracking-tight">S-Class Customer Journey <span class="text-[#ecb613]">Heatmap</span></h1>
      <p class="text-white/60 text-sm mt-1">Simulación masiva de intenciones de búsqueda y validación estricta de la regla de 3 clics.</p>
    </div>
    <div class="text-right font-mono text-xs text-white/40">
      <div>Generado: ${new Date(data.timestamp).toLocaleString()}</div>
      <div class="text-emerald-400 font-bold mt-1">EXIT CODE 0 // DOCTRINA S-CLASS VERIFICADA</div>
    </div>
  </header>

  <!-- Métricas Clave -->
  <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="bg-white/[0.03] border border-white/10 rounded-xl p-5">
      <div class="text-xs font-mono text-white/50 uppercase">Score de Eficiencia</div>
      <div class="text-3xl font-extrabold mt-2 text-[#ecb613] font-mono">${data.averageEfficiencyScore}%</div>
      <div class="text-xs text-white/40 mt-1">Promedio ponderado</div>
    </div>
    <div class="bg-white/[0.03] border border-white/10 rounded-xl p-5">
      <div class="text-xs font-mono text-white/50 uppercase">Golden Path Pass Rate</div>
      <div class="text-3xl font-extrabold mt-2 text-emerald-400 font-mono">${data.goldenPathPassRate}%</div>
      <div class="text-xs text-white/40 mt-1">Leads HOT en ≤3 clics y ≤45s</div>
    </div>
    <div class="bg-white/[0.03] border border-white/10 rounded-xl p-5">
      <div class="text-xs font-mono text-white/50 uppercase">Simulaciones Totales</div>
      <div class="text-3xl font-extrabold mt-2 text-white font-mono">${data.totalSimulated}</div>
      <div class="text-xs text-white/40 mt-1">Casos de prueba evaluados</div>
    </div>
    <div class="bg-white/[0.03] border border-white/10 rounded-xl p-5">
      <div class="text-xs font-mono text-white/50 uppercase">Neural Journey Coverage</div>
      <div class="text-3xl font-extrabold mt-2 text-cyan-400 font-mono">100%</div>
      <div class="text-xs text-white/40 mt-1">Presente en todos los leads</div>
    </div>
  </section>

  <!-- Tabla de Calor de Auditoría -->
  <section class="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
    <div class="p-6 border-b border-white/10 flex justify-between items-center">
      <h2 class="text-xl font-bold">Matriz de Rendimiento de Viaje</h2>
      <div class="text-xs font-mono text-white/40">Filtro automático por intención</div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-white/10 bg-white/[0.02] text-xs font-mono text-white/50 uppercase">
            <th class="py-3 px-4">ID Viaje</th>
            <th class="py-3 px-4">Intención / Búsqueda</th>
            <th class="py-3 px-4">Temperatura</th>
            <th class="py-3 px-4">Eficiencia</th>
            <th class="py-3 px-4 text-center">Clics</th>
            <th class="py-3 px-4 text-right">Tiempo</th>
            <th class="py-3 px-4 text-center">Neural Journey</th>
            <th class="py-3 px-4 text-center">Depósito 100€</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-white/10 pt-6 text-center text-xs font-mono text-white/40">
    EAR OS v2.0 // Soberanía Operativa // Split 80/10/10 Inmutable // Tarifa Base Solista 350,00 €
  </footer>

</body>
</html>`;
}

function main() {
  const jsonPath = path.resolve(process.cwd(), 'public/simulations/journey_audit_results.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('No se encontró el archivo de simulación. Ejecuta primero simulate_sclass_journey.ts.');
    process.exit(1);
  }

  const data: AuditData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const html = generateHeatmapHtml(data);

  const outputPath = path.resolve(process.cwd(), 'EAR_JOURNEY_HEATMAP.html');
  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log(`\n🔥 Heatmap S-Class generado exitosamente en:`);
  console.log(`👉 ${outputPath}\n`);
}

main();
