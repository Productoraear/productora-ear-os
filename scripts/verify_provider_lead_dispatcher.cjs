'use strict';
const fs = require('fs');
const path = require('path');

const ROUTE = path.join(__dirname, '..', 'src', 'app', 'api', 'booking', 'notify-provider', 'route.ts');
let passed = 0;
let failed = 0;

function assert(name, cond) {
    if (cond) { passed++; console.log(`  OK   ${name}`); }
    else { failed++; console.error(`  FAIL ${name}`); }
}

const exists = fs.existsSync(ROUTE);
assert('1. route.ts existe', exists);
const src = exists ? fs.readFileSync(ROUTE, 'utf8') : '';

assert('2. exporta POST', /export\s+async\s+function\s+POST\s*\(/.test(src));
assert('3. importa fireAndForgetN8n', /import\s*\{[^}]*fireAndForgetN8n[^}]*\}\s*from\s*'@\/lib\/services\/n8n-dispatcher'/.test(src));
assert('4. invoca fireAndForgetN8n(', /fireAndForgetN8n\s*\(/.test(src));
assert("5. slug 'call-center-intake'", src.includes("'call-center-intake'"));
assert('6. enlace wa.me / api.whatsapp.com', src.includes('wa.me') || src.includes('api.whatsapp.com'));
assert('7. texto codificado con encodeURIComponent', src.includes('encodeURIComponent'));
assert('8. maneja 400', /status:\s*400/.test(src));
assert('9. maneja 422', /status:\s*422/.test(src));
assert('10. cero ": any"', !/:\s*any\b/.test(src) && !/\bas\s+any\b/.test(src));
assert('11. cero Math.random', !src.includes('Math.random'));
assert('12. fallback centralita +34693693048', src.includes('693693048'));
assert('13. respuesta success/requestId/whatsappUrl/dispatchedAt',
    ['success: true', 'requestId', 'whatsappUrl', 'dispatchedAt'].every((t) => src.includes(t)));
assert('14. valida todos los campos requeridos',
    ['requestId', 'providerId', 'providerName', 'clientName', 'clientPhone', 'eventDate', 'budget', 'location']
        .every((f) => src.includes(`'${f}'`) || src.includes(`${f}:`)));
assert('15. sanitización anti-XSS (< >)', src.includes("'<'") && src.includes("'>'"));
assert('16. try/catch hermético con 500', /catch\s*\(reason\)/.test(src) && /status:\s*500/.test(src));
assert('17. status 200 en éxito', /status:\s*200/.test(src));
assert('18. centralita no marcada como verificada', src.includes('providerPhoneVerified'));
assert('19. mensaje contiene "Productora EAR" y "depósito de fianza garantizado"',
    src.includes('Productora EAR') && src.includes('depósito de fianza garantizado'));

console.log(`\nResultado: ${passed} OK / ${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
