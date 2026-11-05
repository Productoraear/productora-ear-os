const fs = require("fs");
let lines = fs.readFileSync("src/app/layout.tsx", "utf8").split(/\r?\n/);
const toRemove = [
  'SovereignFloatingCallBar',
  'EarConcierge',
  'DynamicMobileExperienceOrchestrator'
];
lines = lines.filter(l => !toRemove.some(term => l.includes(term)));
fs.writeFileSync("src/app/layout.tsx", lines.join("\r\n"), "utf8");
console.log("Layout unificado: eliminada la triplicación de botones flotantes");

