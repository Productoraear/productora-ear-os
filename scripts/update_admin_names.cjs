const fs = require('fs');
const filePath = 'src/app/(admin)/admin/AdminDashboardClient.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Reemplazos de nombres en español claro para el CEO y el comercial
code = code.replace(
  'name: "Meta-Compiler (Vibe Coding)", url: "/admin/compiler", badge: "DAG", desc: "Orquestador de micro-servicios y compilación reactiva."',
  'name: "Afinador de Prompts (Asistente IA)", url: "/admin/compiler", badge: "GEMINI EDGE", desc: "Traduce lenguaje natural a instrucciones técnicas perfectas para el obrero (Cline) con Gemini Flash."'
);

code = code.replace(
  'name: "Opportunity Radar Terminal"',
  'name: "Radar de Parejas y Oportunidades"'
);

code = code.replace(
  'name: "Voice Studio IA", url: "/admin/voice-studio", badge: "GPU 24GB", desc: "Modelos de voz locales operando en la AMD RX 7900 XTX."',
  'name: "Estudio de Locución y Voz IA", url: "/admin/voice-studio", badge: "AUDIO", desc: "Generación de voces, cuñas y locuciones profesionales para eventos."'
);

code = code.replace(
  'name: "Consola Sentinel ZTM", url: "/admin/sentinel", badge: "ZERO-TKN", desc: "Protección contra saturación de memoria de Ollama."',
  'name: "Guardián de Memoria y Costes (Sentinel)", url: "/admin/sentinel", badge: "0 TOKEN", desc: "Protección contra saturación y control de tokens facturados."'
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('SUCCESS_UPDATE_ADMIN_DASHBOARD');

