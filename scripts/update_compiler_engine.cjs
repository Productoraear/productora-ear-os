const fs = require('fs');
const filePath = 'src/app/(admin)/admin/compiler/page.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Por defecto usar CLOUD (Gemini Cloud Edge sin dependencia de GPU local)
code = code.replace(
  "const [engine, setEngine] = useState<CompileEngine>('OLLAMA');",
  "const [engine, setEngine] = useState<CompileEngine>('CLOUD');"
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('SUCCESS_UPDATE_COMPILER_DEFAULT_CLOUD');

