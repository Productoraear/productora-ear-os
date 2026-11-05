const fs = require("fs");
const sitemap = require("./src/app/sitemap.ts");

// Script ligero para generar el HTML estático en public/mapa-web.html
async function generateHtml() {
  const tsx = require("tsx/cjs/api");
  const mod = await tsx.require("./src/app/sitemap.ts", __filename);
  const entries = await mod.default();

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Índice Maestro Navegable EAR OS · ${entries.length} URLs Canónicas</title>
  <style>
    body { background-color: #030305; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 40px 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { color: #ecb613; font-size: 26px; margin-bottom: 6px; }
    p.subtitle { color: #a1a1aa; font-size: 14px; margin-bottom: 24px; }
    .badge { background: rgba(236, 182, 19, 0.15); border: 1px solid #ecb613; color: #ecb613; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; display: inline-block; margin-bottom: 16px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 10px; }
    .card { background: #09090d; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 12px 16px; transition: all 0.2s ease; display: flex; align-items: center; justify-content: space-between; }
    .card:hover { border-color: #ecb613; background: #12121c; transform: translateY(-2px); }
    a.link { color: #00E5FF; text-decoration: none; font-size: 13px; font-family: ui-monospace, monospace; word-break: break-all; flex-grow: 1; }
    a.link:hover { text-decoration: underline; color: #ecb613; }
    .priority { color: #71717a; font-size: 10px; font-family: monospace; margin-left: 10px; white-space: nowrap; }
    .stats { margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); color: #71717a; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">NAVEGACIÓN S-CLASS INTERACTIVA DIRECTA</div>
    <h1>Índice Maestro de Productora EAR</h1>
    <p class="subtitle">Todas las URLs maestras canónicas listas para navegar con 1 solo clic directo sin código XML.</p>
    <div class="grid">
      ${entries.map(entry => {
        const u = entry.url;
        const localUrl = u.replace('https://www.productoraear.com', 'http://localhost:3007');
        const displayPath = u.replace('https://www.productoraear.com', '') || '/ (Portada)';
        return `
        <div class="card">
          <a class="link" href="${localUrl}" target="_blank">🔗 ${displayPath}</a>
          <span class="priority">p: ${entry.priority ?? 0.8}</span>
        </div>`;
      }).join('')}
    </div>
    <div class="stats">EAR OS v9.0 · Total URLs Canónicas Generadas: ${entries.length} · Servidor Bare-Metal Hostinger</div>
  </div>
</body>
</html>`;

  fs.writeFileSync("public/mapa-web.html", html, "utf8");
  console.log("public/mapa-web.html generado con exito con", entries.length, "URLs");
}

generateHtml().catch(console.error);

