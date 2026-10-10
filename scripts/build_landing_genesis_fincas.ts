/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR GÉNESIS — GENERADOR DE 10 LANDINGS SEMILLA REALES (PILOTO ΩD-001)
 * ════════════════════════════════════════════════════════════════════════════
 * Extrae las 10 primeras fincas REALES del catálogo SSOT `fincas-catalog.ts`,
 * inyecta el depósito inmutable de 100,00 € (Price-Lock SHA-256) desde el SSOT
 * canónico `ear-os-ssot.ts` y graba, para cada una, un documento HTML semilla
 * determinístico con:
 *   - `provenanceHash`  : SHA-256 del núcleo canónico (hecho respaldado por hash).
 *   - `stripeSessionId` : clave de idempotencia ACID determinística (mismo slug
 *                         → mismo id → los retries de Stripe producen UN lock).
 *   - `priceLockSha256` : SHA-256 del depósito + split soberano (80/10/10).
 *   - Sanitización ASVS L3 (escapeHtml) de todo dato dinámico antes de inyectar.
 *
 * Reglas SSOT estrictas:
 *   - CERO `any` implícito.
 *   - Salida 100% determinística (sin timestamps dentro del contenido hasheado)
 *     para que N ejecuciones produzcan EXACTAMENTE los mismos bytes (idempotencia).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '../src/lib/constants/fincas-catalog';
import type { FincaHomologada } from '../src/lib/constants/fincas-catalog';
import {
    DEPOSITO_STRIPE_EUR,
    CENTRALITA_EAR_OS,
    VAT_RATE,
    SPLIT_SOBERANO,
} from '../src/lib/constants/ear-os-ssot';

/** Slugs de las 10 fincas semilla del piloto (reales, extraídas del catálogo SSOT). */
const PILOT_SLUGS: readonly string[] = [
    'villa-escorial-park',
    'finca-la-chopera',
    'soto-de-mozanaque',
    'finca-el-regajal',
    'finca-aldea-santillana',
    'la-casona-de-torrelodones',
    'finca-las-tenadas',
    'cigarral-del-angel',
    'finca-los-enebrales',
    'la-quinta-de-jarama',
] as const;

/**
 * Narrativas semilla 100% redactadas de forma independiente por recinto.
 * Vocabulario, estructura sintáctica y longitud deliberadamente divergentes
 * para que el Jaccard 5-gram y el coseno TF-IDF queden por debajo de 0,10.
 */
const PILOT_NARRATIVES: Readonly<Record<string, string>> = {
    'villa-escorial-park':
        'Cruce el portón de esta mansión y abandone cualquier prisa urbana: veinte mil metros cuadrados arbolados, piscina vallada, proyector cinematográfico con butacas de masaje y nueve dormitorios para dormir a treinta invitados tras la celebración.',
    'finca-la-chopera':
        'Cuarenta hectáreas de arboleda histórica envuelven un invernadero traslúcido y una colección de palmeras centenarias, a media hora escasa de la capital por autopista libre de peaje.',
    'soto-de-mozanaque':
        'Antiguo palacete nobiliario restaurado donde las caballerizas se convierten en salón de baile y los troncos de plátano y cedro marcan el paseo nupcial hacia el pabellón de cristal.',
    'finca-el-regajal':
        'Entre hileras de viñedo y una reserva natural de lepidópteros, las barricas de roble absorben el sonido y devuelven una reverberación dorada que halaga a las cuerdas de cámara.',
    'finca-aldea-santillana':
        'Recinto elevado con despegue para aeronaves privadas, muralla medieval reconstruida y cúpula escénica sobre embalse; aquí no existe vecino perimetral que condicione el volumen de la fiesta.',
    'la-casona-de-torrelodones':
        'Casona de ascendencia indiana con zócalos de madera, celosías y un cenador vidriado; su escala contenida favorece cenas cantadas, conjuntos de cámara y despedidas de soltera de gala.',
    'finca-las-tenadas':
        'Vigas de roble traídas de graneros británicos y senderos de lavanda perfuman un pabellón de techos altos pensado para coros numerosos y pantallas de vídeo de gran formato.',
    'cigarral-del-angel':
        'Claustro de ermita del siglo once, terrazas árabes escalonadas y un balcón frontal sobre el cauce del Tajo con la torre catedralicia de Toledo encendida como telón de fondo.',
    'finca-los-enebrales':
        'Pradera alpina insertada en parque natural serrano, con cabaña de pino nórdico y pérgola de cuerdas; el aire frío y limpio eleva la claridad de cada nota sin compresor.',
    'la-quinta-de-jarama':
        'Premiado complejo de banquetes a orillas del río con salón de fuentes, jardinería de autor y acometidas redundantes que permiten doblar el equipo de sonido sin riesgo de corte eléctrico.',
} as const;

interface GenesisSchemaOrg {
    readonly '@context': string;
    readonly '@type': string;
    readonly name: string;
    readonly description: string;
    readonly offers: {
        readonly '@type': string;
        readonly price: number;
        readonly priceCurrency: string;
        readonly availability: string;
    };
    readonly areaServed: {
        readonly '@type': string;
        readonly name: string;
    };
}

interface GenesisLanding {
    readonly slug: string;
    readonly url: string;
    readonly title: string;
    readonly metaDescription: string;
    readonly fincaId: string;
    readonly name: string;
    readonly location: string;
    readonly provincia: string;
    readonly depositEur: number;
    readonly depositDeducible: boolean;
    readonly stripeSessionId: string;
    readonly priceLockSha256: string;
    readonly provenanceHash: string;
    readonly uniqueCopy: string;
    readonly htmlFilePath: string;
    readonly htmlSha256: string;
    readonly schemaOrg: GenesisSchemaOrg;
}

interface GenesisManifest {
    readonly engine: string;
    readonly version: string;
    readonly landingCount: number;
    readonly depositEur: number;
    readonly splitSoberano: {
        readonly artista: number;
        readonly earOs: number;
        readonly vimume: number;
    };
    readonly payload: readonly GenesisLanding[];
}

/** Serialización canónica y determinística (claves ordenadas recursivamente). */
function stableStringify(value: unknown): string {
    if (value === null || typeof value !== 'object') {
        return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
        return `[${value.map((item: unknown) => stableStringify(item)).join(',')}]`;
    }
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    const parts = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`);
    return `{${parts.join(',')}}`;
}

/** SHA-256 hex de un texto UTF-8 (cero dependencias externas). */
function sha256(text: string): string {
    return createHash('sha256').update(text, 'utf8').digest('hex');
}

/** Escape HTML anti-XSS (ASVS L3) — neutraliza todo dato dinámico. */
function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#39;');
}

/** Formatea importes EUR con coma decimal de forma determinística. */
function formatEur(value: number): string {
    return `${value.toFixed(2).replace('.', ',')} €`;
}

/** Núcleo narrativo único por finca (clave para Jaccard ≤ 0,10 y coseno ≤ 0,10). */
function buildUniqueCopy(finca: FincaHomologada): string {
    return PILOT_NARRATIVES[finca.slug] ?? finca.description;
}

/** Renderiza el HTML OLED S-Class determinístico de una finca semilla. */
function renderLandingHtml(
    finca: FincaHomologada,
    core: {
        readonly url: string;
        readonly uniqueCopy: string;
        readonly stripeSessionId: string;
        readonly priceLockSha256: string;
        readonly provenanceHash: string;
    },
): string {
    const depositLabel = formatEur(DEPOSITO_STRIPE_EUR);
    const splitArtista = (SPLIT_SOBERANO.artista * 100).toFixed(0);
    const splitEar = (SPLIT_SOBERANO.earOs * 100).toFixed(0);
    const splitVimume = (SPLIT_SOBERANO.vimume * 100).toFixed(0);
    const vatPct = (VAT_RATE * 100).toFixed(0);

    const espacios = finca.espaciosDisponibles
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join('');
    const servicios = finca.serviciosCoordinados
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join('');

    return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="index,follow" />
<meta name="ear-os:provenance-hash" content="${core.provenanceHash}" />
<meta name="ear-os:unique-copy" content="${escapeHtml(core.uniqueCopy)}" />
<title>${escapeHtml(finca.name)} · Eventos S-Class | EAR OS</title>
<meta name="description" content="${escapeHtml(finca.description)}" />
<style>
:root{--bg:#030305;--panel:#09090d;--gold:#ecb613;--cyan:#00E5FF;--line:rgba(255,255,255,.10)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:#fff;font-family:Inter,system-ui,sans-serif;line-height:1.6;overflow-x:hidden}
.wrap{max-width:1080px;margin:0 auto;padding:32px 20px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:24px;padding:28px;backdrop-filter:blur(8px)}
.hero{background:radial-gradient(1200px 500px at 50% -10%,rgba(236,182,19,.12),transparent)}
.eyebrow{color:var(--gold);font-size:12px;text-transform:uppercase;letter-spacing:.2em;font-weight:700}
h1{font-size:clamp(28px,5vw,48px);line-height:1.05;margin:10px 0 14px}
.gold{color:var(--gold)}
.cyan{color:var(--cyan)}
.muted{color:rgba(255,255,255,.62)}
.specs{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:22px 0}
.spec{background:rgba(0,0,0,.45);border:1px solid var(--line);border-radius:16px;padding:14px;font-size:13px}
.deposit{border:1px solid rgba(236,182,19,.4);background:rgba(236,182,19,.06)}
.deposit big{font-size:34px;font-weight:800;color:var(--gold)}
.split{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
.split span{padding:8px 12px;border-radius:12px;font-size:12px;border:1px solid var(--line);background:rgba(255,255,255,.03)}
ul{list-style:none;margin-top:12px}
li{padding:7px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.cta{display:inline-block;margin-top:18px;padding:14px 22px;border-radius:14px;background:var(--gold);color:#000;font-weight:800;text-decoration:none}
.hash{font-family:ui-monospace,monospace;font-size:11px;color:rgba(255,255,255,.5);word-break:break-all}
section{margin:26px 0}
</style>
</head>
<body class="hero">
<div class="wrap" data-provenance-hash="${core.provenanceHash}" data-stripe-session-id="${core.stripeSessionId}">
  <a class="cta" href="/reservar/solista?finca=${encodeURIComponent(finca.slug)}&lock=${core.stripeSessionId}">Cerrar fecha · Depósito ${depositLabel}</a>
  <section>
    <p class="eyebrow">Finca Homologada EAR OS · ${escapeHtml(finca.provincia)}</p>
    <h1>${escapeHtml(finca.name)}</h1>
    <p class="muted">${escapeHtml(finca.location)}</p>
  </section>

  <section class="specs">
    <div class="spec">Aforo<br/><strong>${finca.capacidadMaxPax} pax</strong></div>
    <div class="spec">Acometida<br/><strong class="gold">${finca.potenciaKw} kW · ${escapeHtml(finca.tomaElectrica)}</strong></div>
    <div class="spec">Distancia Hub<br/><strong>${finca.distanciaHubMentridaKm} km</strong></div>
    <div class="spec">Sonometría<br/><strong class="cyan">${finca.limiteAcustico.interiorDBA} int / ${finca.limiteAcustico.exteriorDBA} ext dBA</strong></div>
  </section>

  <section class="card deposit">
    <p class="eyebrow">Garantía Mutua de Doble Vía</p>
    <big>${depositLabel}</big>
    <p class="muted">Depósito inmutable Price-Lock SHA-256, 100% deducible del total del show. Bloqueo atómico de fecha/hora y filtro de respeto mutuo.</p>
    <div class="split">
      <span>Artista ${splitArtista}%</span>
      <span>EAR OS ${splitEar}%</span>
      <span>VIMUME ${splitVimume}%</span>
      <span>IVA ${vatPct}%</span>
    </div>
    <p class="hash">priceLock: ${core.priceLockSha256}</p>
  </section>

  <section class="card">
    <p class="eyebrow">Narrativa Única</p>
    <p>${escapeHtml(core.uniqueCopy)}</p>
  </section>

  <section class="card">
    <p class="eyebrow">Espacios</p>
    <ul>${espacios}</ul>
  </section>

  <section class="card">
    <p class="eyebrow">Producción Coordinada</p>
    <ul>${servicios}</ul>
  </section>

  <section class="card">
    <p class="eyebrow">Contacto Directo</p>
    <p>${escapeHtml(finca.directorioContacto.director)} · ${escapeHtml(finca.directorioContacto.telefono)}</p>
    <p class="muted">Centralita EAR OS: ${escapeHtml(CENTRALITA_EAR_OS)}</p>
  </section>

  <p class="hash">provenance: ${core.provenanceHash}</p>
</div>
<script type="application/ld+json">
${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: finca.name,
        description: finca.description,
        offers: {
            '@type': 'Offer',
            price: DEPOSITO_STRIPE_EUR,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
        },
        areaServed: { '@type': 'Place', name: finca.location },
    }).replace(/</g, '\\u003c')}
</script>
</body>
</html>`;
}

/** Punto de entrada determinístico e idempotente. */
function main(): void {
    const selected = PILOT_SLUGS.map((slug) =>
        SCLASS_12_FINCAS_HOMOLOGADAS.find((finca) => finca.slug === slug),
    ).filter((finca): finca is FincaHomologada => finca !== undefined);

    if (selected.length !== PILOT_SLUGS.length) {
        throw new Error(
            `[GENESIS] No se localizaron las ${PILOT_SLUGS.length} fincas semilla en el SSOT (encontradas ${selected.length}).`,
        );
    }

    const outDir = resolve(process.cwd(), 'public', 'landings', 'genesis');
    mkdirSync(outDir, { recursive: true });

    const entries: GenesisLanding[] = [];

    for (const finca of selected) {
        const uniqueCopy = buildUniqueCopy(finca);
        const stripeSessionId = sha256(
            `ear-os:finca:${finca.slug}:price-lock:deposit:${DEPOSITO_STRIPE_EUR.toFixed(2)}`,
        );
        const priceLockSha256 = sha256(
            stableStringify({
                amountEur: DEPOSITO_STRIPE_EUR,
                currency: 'EUR',
                mode: 'price-lock-sha256',
                split: SPLIT_SOBERANO,
            }),
        );
        const url = `/fincas/${finca.slug}`;
        const provenanceCore = {
            slug: finca.slug,
            url,
            fincaId: finca.id,
            depositEur: DEPOSITO_STRIPE_EUR,
            depositDeducible: true,
            stripeSessionId,
            priceLockSha256,
            uniqueCopy,
        };
        const provenanceHash = sha256(stableStringify(provenanceCore));

        const html = renderLandingHtml(finca, {
            url,
            uniqueCopy,
            stripeSessionId,
            priceLockSha256,
            provenanceHash,
        });
        const htmlSha256 = sha256(html);
        const htmlFilePath = `public/landings/genesis/${finca.slug}.html`;

        writeFileSync(join(outDir, `${finca.slug}.html`), html, 'utf8');

        entries.push({
            slug: finca.slug,
            url,
            title: `${finca.name} · Eventos S-Class | EAR OS`,
            metaDescription: finca.description,
            fincaId: finca.id,
            name: finca.name,
            location: finca.location,
            provincia: finca.provincia,
            depositEur: DEPOSITO_STRIPE_EUR,
            depositDeducible: true,
            stripeSessionId,
            priceLockSha256,
            provenanceHash,
            uniqueCopy,
            htmlFilePath,
            htmlSha256,
            schemaOrg: {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: finca.name,
                description: finca.description,
                offers: {
                    '@type': 'Offer',
                    price: DEPOSITO_STRIPE_EUR,
                    priceCurrency: 'EUR',
                    availability: 'https://schema.org/InStock',
                },
                areaServed: { '@type': 'Place', name: finca.location },
            },
        });
    }

    const manifest: GenesisManifest = {
        engine: 'omega-genesis-od-001-pilot',
        version: '1.0.0',
        landingCount: entries.length,
        depositEur: DEPOSITO_STRIPE_EUR,
        splitSoberano: {
            artista: SPLIT_SOBERANO.artista,
            earOs: SPLIT_SOBERANO.earOs,
            vimume: SPLIT_SOBERANO.vimume,
        },
        payload: entries,
    };

    writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

    process.stdout.write(
        `[GENESIS] ${entries.length} landings semilla generadas · depósito SSOT ${formatEur(DEPOSITO_STRIPE_EUR)} · manifest: ${join(outDir, 'manifest.json')}\n`,
    );
}

main();