const fs = require('fs');

let content = fs.readFileSync('src/app/(admin)/admin/AdminDashboardClient.tsx', 'utf8');

// 1. Importar PartnerShowcaseMetricsPanel si no está
const importTarget = "import { MasterUrlGovernanceMatrix } from '@/components/admin/MasterUrlGovernanceMatrix';";
const importRepl = "import { MasterUrlGovernanceMatrix } from '@/components/admin/MasterUrlGovernanceMatrix';\nimport { PartnerShowcaseMetricsPanel } from '@/components/otzarreta/PartnerShowcaseMetricsPanel';";

if (!content.includes('PartnerShowcaseMetricsPanel')) {
  content = content.replace(importTarget, importRepl);
}

// 2. Insertar bloque antes de MasterUrlGovernanceMatrix
const matrixAnchor = "{/* 🏛️ MATRIZ DE GOBERNANZA & CALIDAD DE URLs (ADMIN CEO)                 */}";

if (!content.includes('TELEMETRÍA DE ESCAPARATES FLAGSHIP')) {
  const showcaseBlock = `      {/* ===================================================================== */}
      {/* 👑 TELEMETRÍA DE ESCAPARATES FLAGSHIP (EZKERTZA BERRIA & GLOBAL EAR OS)   */}
      {/* ===================================================================== */}
      <div className="mt-8">
        <PartnerShowcaseMetricsPanel standaloneMode={true} initialTab="rendimiento" />
      </div>

      {/* ===================================================================== */}
`;
  content = content.replace(
    `      {/* ===================================================================== */}\r\n      ${matrixAnchor}`,
    `${showcaseBlock}      ${matrixAnchor}`
  );

  // fallback para LF
  if (!content.includes('TELEMETRÍA DE ESCAPARATES FLAGSHIP')) {
    content = content.replace(
      `      {/* ===================================================================== */}\n      ${matrixAnchor}`,
      `${showcaseBlock}      ${matrixAnchor}`
    );
  }
}

fs.writeFileSync('src/app/(admin)/admin/AdminDashboardClient.tsx', content, 'utf8');
console.log('SUCCESS_INJECTED');

