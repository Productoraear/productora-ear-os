const fs = require('fs');
const pathMain = 'H:/00_PRODUCTORA_EAR/SAAS_FINAL_STAGING/src/main.tsx';

try {
    let content = fs.readFileSync(pathMain, 'utf8');

    // 1. Inyectar Imports de Contexto si no existen
    if (!content.includes('AuthProvider')) {
        const imports = "import { AuthProvider } from './contexts/AuthContext';\nimport { SuitProvider } from './contexts/SuitContext';\n";
        content = imports + content;
        
        // 2. Envolver App con los Providers
        content = content.replace('<App />', '<AuthProvider><SuitProvider><App /></SuitProvider></AuthProvider>');
        
        fs.writeFileSync(pathMain, content);
        console.log('Main.tsx configurado con Auth y Suit Context.');
    } else {
        console.log('La infraestructura global ya está configurada.');
    }
} catch (err) {
    console.error('Error operando en Main.tsx: ', err);
}
