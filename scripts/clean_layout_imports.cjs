const fs = require("fs");
let c = fs.readFileSync("src/app/layout.tsx", "utf8");
c = c.replace(/import NeuralClientCompanion from "@/features\/neural-companion\/ui\/NeuralClientCompanion";\r?\n/, "");
c = c.replace(/import SovereignUrgentFloatBar from "@/components\/layout\/SovereignUrgentFloatBar";\r?\n/, "");
c = c.replace(/import \{ GlobalLiveVisualEditor \} from "@/components\/editor\/GlobalLiveVisualEditor";\r?\n/, "");
c = c.replace(/import \{ OmniAgentConsoleModal \} from "@/components\/agents\/OmniAgentConsoleModal";\r?\n/, "");
c = c.replace(/import \{ AirbnbThemeToggleFloating \} from "@/components\/theme\/AirbnbThemeToggleFloating";\r?\n/, "");
fs.writeFileSync("src/app/layout.tsx", c, "utf8");
console.log("Imports limpiados");

