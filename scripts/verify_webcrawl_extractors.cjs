#!/usr/bin/env node
'use strict';
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * VERIFY_WEBCRAWL_EXTRACTORS.CJS — GUARDIÁN DE EXTRACCIÓN (SIN RED)
 * ════════════════════════════════════════════════════════════════════════════════
 * Asegura que las reglas de contacto del crawler no publican basura:
 *   1. tel: y wa.me se detectan con prioridad sobre el texto.
 *   2. Centralita, numeración premium y placeholders quedan fuera.
 *   3. Emails de marketplaces, no-reply y recursos estáticos quedan fuera.
 *   4. CIF inválido (checksum) no se acepta jamás.
 *   5. Una página aparcada o ajena NO confirma identidad.
 * Exit Code 0 = extractores blindados.
 * ════════════════════════════════════════════════════════════════════════════════
 */

const webcrawl = require('./lib/provider_webcrawl.cjs');

const failures = [];
let checks = 0;

function check(label, condition, detail) {
    checks++;
    if (!condition) failures.push(`${label}${detail ? ` -> ${detail}` : ''}`);
}

function expectEqual(label, actual, expected) {
    check(label, JSON.stringify(actual) === JSON.stringify(expected), `esperado ${JSON.stringify(expected)}, obtenido ${JSON.stringify(actual)}`);
}

const HTML = `
<html><head><title>Finca Los Olivos — Bodas en Toledo</title></head>
<body>
  <h1>Finca Los Olivos</h1>
  <p>Celebraciones en Toledo desde 1998. Teléfono de reservas: 925 12 34 56.</p>
  <p>Atención WhatsApp: +34 655 222 333</p>
  <a href="tel:+34600123456">Llamar ahora</a>
  <a href="https://wa.me/34600123456">WhatsApp</a>
  <a href="https://www.instagram.com/fincalosolivos">Instagram</a>
  <a href="https://www.facebook.com/sharer/sharer.php?u=x">Compartir</a>
  <p>Denominación social: Finca Los Olivos S.L. con domicilio en Toledo. CIF: B-12345674</p>
  <p>Email de contacto: reservas@fincalosolivos.es</p>
  <p>Soporte: no-reply@wixpress.com · bodas@bodas.net</p>
  <p>Centralita de la red: 693 693 048 · Tarificación: 902 123 456 · Placeholder: 600 000 000</p>
</body></html>`;

const intel = webcrawl.extractPageIntel({
    html: HTML,
    url: 'https://fincalosolivos.es/contacto',
    providerName: 'Finca Los Olivos',
    domain: 'fincalosolivos.es',
    province: 'Toledo'
});

/* 1. Teléfonos: prioridad tel: > whatsapp > texto, sin centralita/premium/placeholder. */
check('detecta teléfonos', intel.phones.phones.length >= 3, JSON.stringify(intel.phones.phones));
check('prioriza tel: href', intel.phones.primarySource === 'tel_href', intel.phones.primarySource);
check('tel: primero', intel.phones.primaryDigits === '600123456', intel.phones.primaryDigits);
check('incluye wa.me', intel.phones.digits.includes('655222333'), JSON.stringify(intel.phones.digits));
check('incluye texto fijo', intel.phones.digits.includes('925123456'), JSON.stringify(intel.phones.digits));
check('registra whatsapp', intel.phones.whatsapp.includes('600123456'), JSON.stringify(intel.phones.whatsapp));
check('excluye centralita', !intel.phones.digits.includes('693693048'));
check('excluye premium', !intel.phones.digits.includes('902123456'));
check('excluye placeholder', !intel.phones.digits.includes('600000000'));
expectEqual('formato teléfono', webcrawl.formatPhone('600123456'), '+34 600 123 456');
expectEqual('tipo móvil', webcrawl.phoneKindOf('600123456'), 'MOVIL');
expectEqual('tipo fijo', webcrawl.phoneKindOf('925123456'), 'FIJO');

/* 2. Validación de numeración española. */
check('valida móvil', webcrawl.isValidSpanishPhone('600123456'));
check('valida fijo', webcrawl.isValidSpanishPhone('+34 925 12 34 56'));
check('rechaza centralita', !webcrawl.isValidSpanishPhone('693693048'));
check('rechaza premium', !webcrawl.isValidSpanishPhone('902123456'));
check('rechaza repetido', !webcrawl.isValidSpanishPhone('666666666'));
check('rechaza longitud', !webcrawl.isValidSpanishPhone('60012345'));

/* 3. Emails: solo buzones reales del dominio propio. */
expectEqual('emails válidos', intel.emails, ['reservas@fincalosolivos.es']);
check('filtra no-reply', !intel.emails.some((e) => e.startsWith('no-reply')));
check('filtra marketplace', !intel.emails.some((e) => e.endsWith('@bodas.net')));

/* 4. Identidad legal: CIF con checksum real. */
expectEqual('CIF válido', intel.cif, 'B12345674');
check('rechaza CIF inválido', webcrawl.extractCif('CIF: B-12345678') === '');
check('acepta CIF válido', webcrawl.extractCif('CIF: B-12345674') === 'B12345674');
check('razón social', /Finca Los Olivos/i.test(intel.razonSocial), intel.razonSocial);

/* 5. Identidad de página: propia sí, ajena/aparcada no. */
check('confirma identidad propia', intel.identity.confirmed === true);
check('dominio coincide', intel.identity.domainHit === true);
check('fuerza de identidad fuerte', intel.identity.strength === 'domain' || intel.identity.strength === 'full', intel.identity.strength);
check('detecta provincia', intel.provinceSignal === 'match', intel.provinceSignal);
check('página no aparcada', intel.parked === false);
check('redes sociales', Boolean(intel.socials.instagram), JSON.stringify(intel.socials));
check('filtra sharer facebook', !intel.socials.facebook);

const foreign = webcrawl.extractPageIntel({
    html: '<html><body><h1>Estudio Jurídico Ramírez</h1><p>Servicios legales en Barcelona. Tel: 934 55 66 77</p></body></html>',
    url: 'https://dominio-aparcado.es',
    providerName: 'Finca Los Olivos',
    domain: 'dominio-aparcado.es',
    province: 'Toledo'
});
check('rechaza página ajena', foreign.identity.confirmed === false, JSON.stringify(foreign.identity));

const parked = webcrawl.extractPageIntel({
    html: '<html><body><h1>Este dominio está en venta</h1><p>Compre este dominio por 900 EUR. Contacte con nuestro equipo comercial.</p></body></html>',
    url: 'https://fincalosolivos.es',
    providerName: 'Finca Los Olivos',
    domain: 'fincalosolivos.es'
});
check('detecta dominio aparcado', parked.parked === true);

/* 6. Provenance: hash estable y sensible al contenido. */
const hashA = webcrawl.sha256('<p>uno</p>');
const hashB = webcrawl.sha256('<p>dos</p>');
check('provenance estable', hashA === webcrawl.sha256('<p>uno</p>') && hashA !== hashB && hashA.length === 64);

/* 7. Dominios: normalización y bloqueo de marketplaces. */
expectEqual('dominio simple', webcrawl.domainOf('https://www.fincalosolivos.es/contacto'), 'fincalosolivos.es');
expectEqual('dominio multi-etiqueta', webcrawl.registrableDomain('sub.example.co.uk'), 'example.co.uk');
check('bloquea bodas.net', webcrawl.isMarketplaceHost('www.bodas.net') === true);
check('permite dominio propio', webcrawl.isMarketplaceHost('fincalosolivos.es') === false);
check('decodifica entidades', webcrawl.htmlToText('<p>Precio&nbsp;900&euro; &#64; aquí</p>').includes('@'));

console.log(JSON.stringify({ checks, fallos: failures.length }, null, 2));
if (failures.length > 0) {
    console.error('\n❌ FALLOS DE EXTRACCIÓN:');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
}
console.log('\n✅ EXTRACTORES BLINDADOS: 0 falsos positivos en teléfono, email, CIF e identidad.');
