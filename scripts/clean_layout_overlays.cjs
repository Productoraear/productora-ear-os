const fs = require("fs");
let c = fs.readFileSync("src/app/layout.tsx", "utf8");
c = c.replace(/<SovereignUrgentFloatBar \/>\r?\n/, "");
c = c.replace(/<NeuralClientCompanion \/>\r?\n/, "");
c = c.replace(/<GlobalLiveVisualEditor \/>\r?\n/, "");
c = c.replace(/<AirbnbThemeToggleFloating \/>\r?\n/, "");
c = c.replace(/<React\.Suspense fallback=\{null\}>[\s\S]*?<OmniAgentConsoleModal \/>[\s\S]*?<\/React\.Suspense>\r?\n/, "");
fs.writeFileSync("src/app/layout.tsx", c, "utf8");
console.log("Limpieza ejecutada");

