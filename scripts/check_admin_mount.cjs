const fs = require("fs");
const p = "src/app/(admin)/admin/page.tsx";
if (fs.existsSync(p)) {
  const c = fs.readFileSync(p, "utf8");
  console.log("admin/page.tsx existe.");
  console.log("¿Incluye MasterUrlGovernanceMatrix?:", c.includes("MasterUrlGovernanceMatrix"));
} else {
  console.log("No existe admin/page.tsx");
}

