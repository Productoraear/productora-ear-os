const fs = require("fs");
let c = fs.readFileSync("src/app/(admin)/admin/AdminDashboardClient.tsx", "utf8");

// Añadir importación de MasterUrlGovernanceMatrix
if (!c.includes("MasterUrlGovernanceMatrix")) {
  c = `import { MasterUrlGovernanceMatrix } from '@/components/admin/MasterUrlGovernanceMatrix';\n` + c;
}

// Inyectar el componente justo antes del cierre final de contenedor
const target = `      {/* ===================================================================== */}\n      {/* 7. VISTA 5: DIRECTORIO MAESTRO DE TODAS LAS 22 URLS DEL ADMIN         */}`;
const replacement = `      {/* ===================================================================== */}
      {/* 🏛️ MATRIZ DE GOBERNANZA & CALIDAD DE URLs (ADMIN CEO)                 */}
      {/* ===================================================================== */}
      <div className="mt-8">
        <MasterUrlGovernanceMatrix />
      </div>

      {/* ===================================================================== */}
      {/* 7. VISTA 5: DIRECTORIO MAESTRO DE TODAS LAS 22 URLS DEL ADMIN         */}`;

c = c.replace(target, replacement);
fs.writeFileSync("src/app/(admin)/admin/AdminDashboardClient.tsx", c, "utf8");
console.log("MasterUrlGovernanceMatrix montado exitosamente en AdminDashboardClient");

