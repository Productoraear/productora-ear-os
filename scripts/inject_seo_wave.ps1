# ════════════════════════════════════════════════════════════════════════════════
# INYECCIÓN WAVE SEO "CABALLO DE TROYA" (S-CLASS)
# --------------------------------------------------------------------------------
# Convierte el MAPA DE BATALLA de GSC (reports/gsc_trojan_horse_forensics.md)
# en tareas atómicas encoladas para el Omega Engine. Requiere el dev server de
# Next.js activo en $Port (por defecto 3007).
#
# Uso:
#   pwsh -NoProfile -File scripts/inject_seo_wave.ps1 [-Port 3007]
#
# Cada tarea se ejecuta en UNA sesión de Cline (Pacto Anti-Sobrecostes).
# PROHIBIDO tocar tasks_queue.json a mano: se inyecta por el endpoint sancionado.
# ════════════════════════════════════════════════════════════════════════════════
param(
    [int]$Port = 3007
)

$ErrorActionPreference = 'Stop'
$EndPoint = "http://localhost:$Port/api/admin/tasks/inject"

function Invoke-InjectTask($task) {
    $json = $task | ConvertTo-Json -Depth 6
    try {
        $r = Invoke-RestMethod -Uri $EndPoint -Method Post -ContentType 'application/json' -Body $json -TimeoutSec 30
        Write-Output ("OK  " + $r.task.id + "  " + $r.task.title)
    } catch {
        Write-Output ("FAIL (" + $task.id + "): " + $_.Exception.Message)
    }
}

# ── Tarea 1: Dominio canónico único (eliminar fragmentación www / no-www) ─────
$t1 = @{
    id       = 'SEO-01-CANONICAL-UNICO'
    title    = 'Dominio canonico unico: erradicar canonicales hardcodeados con www'
    status   = 'QUEUED'
    files    = @('src/app/layout.tsx', 'src/app/(public)')
    action   = 'Unificar el dominio canonico a sin www (https://productoraear.com) en todo generateMetadata/alternates y metadataBase. Eliminar toda URL canonica hardcodeada con https://www.productoraear.com.'
    scaffold = "1. grep -rn 'https://www.productoraear.com' src --include='*.ts' --include='*.tsx' | grep -iE 'canonical|alternates|metadataBase|url:' para listar todas las fugas.\n2. Sustituir cada literal 'https://www.productoraear.com' por 'https://productoraear.com' SOLO en campos canonical/alternates/metadataBase (NO en success_url/cancel_url/redirects de marketing que apunten a www).\n3. Confirmar que src/app/layout.tsx solo expone metadataBase 'https://productoraear.com'.\n4. npx tsc --noEmit = 0."
    done_when = "Cero canonicales hardcodeados con www y tsc = 0."
    validation = 'npx tsc --noEmit'
}

# ── Tarea 2: sitemap.ts + robots.ts dinamicos (App Router) ────────────────────
$t2 = @{
    id       = 'SEO-02-SITEMAP-DINAMICO'
    title    = 'Migrar a sitemap.ts + robots.ts dinamicos del App Router'
    status   = 'QUEUED'
    files    = @('src/app/sitemap.ts', 'src/app/robots.ts', 'public/robots.txt')
    action   = 'Sustituir los sitemaps estaticos de public/ y los 178 bloques duplicados de robots.txt por generadores dinamicos Next.js 15 (sitemap.ts, robots.ts) que iteran el SSOT de rutas vendibles.'
    scaffold = "1. Crear src/app/sitemap.ts exportando default function sitemap() que devuelva MetadataRoute.Sitemap con las rutas reales que venden (/bodas, /fincas, /proveedores, /artistas/edwin-agudelo, /calculadora, /vimume, /checkout/presupuesto) + las paginas estaticas sin doorway.\n2. Crear src/app/robots.ts devolviendo un unico bloque User-agent * con Disallow /api/, /admin/, /dashboard, /checkout y Sitemap https://productoraear.com/sitemap.xml.\n3. Borrar public/robots.txt (o reducirlo a un unico Sitemap que apunte a https://productoraear.com/sitemap.xml).\n4. IMPORTANTE para Next 15: rutas dinamicas => const resolvedParams = await params.\n5. npx tsc --noEmit = 0."
    done_when = "Existen sitemap.ts y robots.ts funcionales, sin bloques duplicados, tsc = 0."
    validation = 'npx tsc --noEmit'
}

# ── Tarea 3: Neutralizar slugs crudos prov-* (raw numeric / harvest) ──────────
$t3 = @{
    id       = 'SEO-03-SLUGS-CRUDOS'
    title    = 'Neutralizar slugs crudos prov-* (deindexados / 4xx) del marketplace'
    status   = 'QUEUED'
    files    = @('src/app/(public)/proveedores/[slug]/page.tsx')
    action   = 'Evitar que Google indexe URLs no semanticas /proveedores/prov-NNNN o prov-harvest-*: 301 a slug semantico cuando exista, y noindex cuando sea perfil provisional.'
    scaffold = "1. grep -rn 'prov-' src --include='*.ts' --include='*.tsx' para localizar donde se construyen/enlazan los slugs crudos.\n2. En proveedores/[slug]/page.tsx, al detectar slug crudo (regex ^prov-), buscar el slug semantico del proveedor; si existe, redirect() 301; si no, devolver metadata con robots: { index: false }.\n3. NO borrar el archivo: solo blindar el patron prov-*.\n4. npx tsc --noEmit = 0."
    done_when = "Slugs prov-* devuelven 301 o noindex (nunca index), tsc = 0."
    validation = 'npx tsc --noEmit'
}

# ── Tarea 4: Doorway bodas 3 niveles (redirecciones + canonicas alternas) ─────
$t4 = @{
    id       = 'SEO-04-DOORWAY-BODAS'
    title    = 'Consolidar doorway pages bodas 3 niveles (redireccion/canonica)'
    status   = 'QUEUED'
    files    = @('src/app/(public)/bodas/[provincia]/[servicio]/page.tsx')
    action   = 'Las URLs /bodas/{provincia}/{servicio}/{municipio} generan 1150 redirecciones y 813 canonicas alternas (doorway pages). Consolidar senal hacia la pagina hub de provincia/servicio.'
    scaffold = "1. grep -rn 'generateMetadata' 'src/app/(public)/bodas' --include='*.tsx' para localizar todos los metadatos de la vertical bodas.\n2. Localizar la ruta que sirve /bodas/[provincia]/[servicio] y verificar si emite alternates canonical a una variante por municipio que no existe.\n3. Aplicar canonical unico a la forma /bodas/[provincia]/[servicio]; las variantes por municipio sin contenido diferencial deben redirigir 301 o noindex.\n4. No tocar motores de negocio; solo metadatos/canonical.\n5. npx tsc --noEmit = 0."
    done_when = "Canonical unico por hub provincia/servicio, sin variantes municipio autogeneradas, tsc = 0."
    validation = 'npx tsc --noEmit'
}

# ── Tarea 5: Neutralizar rutas deprecadas /weddings y /servicios doorway ──────
$t5 = @{
    id       = 'SEO-05-RUTAS-DEPRECADAS'
    title    = 'Redirigir o noindex rutas deprecadas /weddings y doorway /servicios'
    status   = 'QUEUED'
    files    = @('src/app/(public)/servicios/[...slug]', 'src/app/(public)/servicios/[servicio]')
    action   = 'Las rutas /weddings/* (deprecadas) y /servicios/{servicio}/{ocasion}/{municipio} (doorway) estan deindexadas o 4xx. Consolidar hacia hubs reales.'
    scaffold = "1. grep -rn '/weddings' src --include='*.tsx' --include='*.ts' y localizar la ruta o rewrite que todavia la sirve.\n2. Si /weddings/* ya no tiene pagina real, apuntar el rewrite/external a /bodas o devolver 410/noindex.\n3. Para /servicios doorway: emitir canonical a /servicios/{servicio} o noindex cuando no exista contenido diferencial por municipio/ocasion.\n4. npx tsc --noEmit = 0."
    done_when = "Cero rutas /weddings y /servicios doorway indexables, tsc = 0."
    validation = 'npx tsc --noEmit'
}

$tasks = @($t1, $t2, $t3, $t4, $t5)

Write-Output ("Inyectando Wave SEO en " + $EndPoint + " ...")
foreach ($t in $tasks) {
    Invoke-InjectTask $t
}
Write-Output "Wave SEO inyectada. Ejecutar: node .antigravity/omega.js next  (una tarea por sesion)."