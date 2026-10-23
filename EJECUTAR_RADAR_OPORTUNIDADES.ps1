<#
.SYNOPSIS
    EAR OS V2 - OPPORTUNITY RADAR S-CLASS (POWERSHELL RUNNER)
.DESCRIPTION
    Ejecuta el Radar Real de Oportunidades contra fuentes vivas:
    - Feeds RSS Oficiales del BOE (Subvenciones y Ayudas Publicas, Premios Culturales)
    - Google Noticias en tiempo real (Convocatorias de Artistas, Comisiones de Fiestas, Plenos, VIMUME)
    - TED API v3 (Licitaciones publicas europeas)
    - Google Alerts personalizados (si estan en GOOGLE_ALERTS_RSS)
#>

[CmdletBinding()]
param(
    [switch]$Scan = $true,
    [switch]$Watch = $false,
    [switch]$OpenGoogleAlerts = $false,
    [switch]$Summary = $false,
    [int]$IntervalMinutes = 60
)

$Host.UI.RawUI.WindowTitle = "EAR OS // Opportunity Radar S-Class"

function Write-RadarHeader {
    Write-Host ""
    Write-Host "=======================================================================" -ForegroundColor Cyan
    Write-Host "         EAR OS V2 :: OPPORTUNITY RADAR // BARRIDO EN VIVO             " -ForegroundColor Cyan
    Write-Host "         Fuentes: BOE + Google News + TED API + Google Alerts          " -ForegroundColor DarkCyan
    Write-Host "         Doctrina: CERO FACHADAS - 100% DATOS VERIFICABLES REALES      " -ForegroundColor Yellow
    Write-Host "=======================================================================" -ForegroundColor Cyan
    Write-Host ""
}

# 1. MODO: ABRIR GOOGLE ALERTS EN CHROME PARA PRODUCTORAEAR@GMAIL.COM
if ($OpenGoogleAlerts) {
    Write-RadarHeader
    Write-Host "[GOOGLE ALERTS ASSISTANT] Abriendo consultas estrategicas en tu navegador..." -ForegroundColor Yellow
    Write-Host "Cuenta objetivo: productoraear@gmail.com" -ForegroundColor Gray
    Write-Host ""

    $queries = @(
        'site:contrataciondelestado.es "espectaculos" OR "sonorizacion" OR "orquesta"',
        '"convocatoria de artistas" fiestas patronales 2026',
        '"comision de fiestas" contratacion orquesta OR mariachi',
        'subvenciones musica ayuntamiento "festejos"',
        '"pleno municipal" "comision de fiestas" OR "festejos"',
        '"servicios sociales" "mayores" musicoterapia OR "centro de dia"'
    )

    foreach ($q in $queries) {
        $encoded = [System.Uri]::EscapeDataString($q)
        $url = "https://www.google.es/alerts?q=$encoded"
        Write-Host "  -> Abriendo alerta: $q" -ForegroundColor Cyan
        Start-Process "chrome.exe" -ArgumentList $url -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 600
    }

    Write-Host ""
    Write-Host "Pestanas abiertas en Chrome con exito." -ForegroundColor Green
    Write-Host "PASO UNICO EN CADA PESTANA:" -ForegroundColor Yellow
    Write-Host "   1. Pulsa 'Mostrar opciones'." -ForegroundColor White
    Write-Host "   2. En 'Entregar en:', selecciona 'Feed RSS'." -ForegroundColor White
    Write-Host "   3. Pulsa 'Crear alerta'." -ForegroundColor White
    Write-Host "   4. Copia el enlace RSS que genera Google y pegalo en .env.local como:" -ForegroundColor White
    Write-Host "      GOOGLE_ALERTS_RSS=https://www.google.com/alerts/feeds/AAA/BBB,https://..." -ForegroundColor DarkGray
    Write-Host ""
    exit 0
}

# 2. FUNCION DE BARRIDO REAL (TSX RUNNER)
function Invoke-RadarScan {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Iniciando barrido forense de fuentes vivas..." -ForegroundColor Cyan

    $output = npx tsx scripts/run_opportunity_radar.ts 2>&1
    $jsonLine = $output | Where-Object { $_ -match '^{\s*"ok"' } | Select-Object -Last 1

    if (-not $jsonLine) {
        Write-Host "Error ejecutando radar:" -ForegroundColor Red
        $output | ForEach-Object { Write-Host "   $_" -ForegroundColor DarkRed }
        return
    }

    $res = $jsonLine | ConvertFrom-Json

    if ($res.ok -eq $true) {
        Write-Host "  [OK] Barrido completado en $($res.elapsedSeconds)s" -ForegroundColor Green
        Write-Host "  * Feeds consultados : $($res.scannedFeeds)" -ForegroundColor White
        Write-Host "  * Avisos extraidos  : $($res.fetchedCount)" -ForegroundColor White
        Write-Host "  * Novedades unicas  : $($res.newCount)" -ForegroundColor Yellow
        Write-Host "  * Alto Match (>=80%): $($res.highMatchCount)" -ForegroundColor Magenta
        Write-Host "  * Telegram enviados : $($res.telegramDispatched)" -ForegroundColor Cyan
        Write-Host "  * n8n encolados     : $($res.n8nDispatched)" -ForegroundColor Cyan
        Write-Host "  * Total en Almacen  : $($res.storedTotal)" -ForegroundColor DarkGray
        Write-Host ""

        if ($res.topOpportunities -and $res.topOpportunities.Count -gt 0) {
            Write-Host "TOP OPORTUNIDADES EN VIVO:" -ForegroundColor Yellow
            foreach ($item in $res.topOpportunities) {
                $vimumeBadge = ""
                if ($item.vimume) { $vimumeBadge = "[VIMUME 40Hz]" }
                Write-Host "  [$($item.score)%] $($item.categories) $vimumeBadge" -ForegroundColor Cyan
                Write-Host "    $($item.title)" -ForegroundColor White
                Write-Host "    Link: $($item.url)" -ForegroundColor DarkGray
                Write-Host ""
            }
        }
    } else {
        Write-Host "  [WARN] Radar reporto: $($res.error)" -ForegroundColor Yellow
    }
}

# 3. MOSTRAR RESUMEN DE OPORTUNIDADES PERSISTIDAS
if ($Summary) {
    Write-RadarHeader
    $storePath = Join-Path $PSScriptRoot "src\data\opportunities_radar.json"
    if (-not (Test-Path $storePath)) {
        Write-Host "No hay almacen todavia. Ejecuta primero: .\EJECUTAR_RADAR_OPORTUNIDADES.ps1" -ForegroundColor Yellow
        exit 0
    }

    $store = Get-Content $storePath -Raw | ConvertFrom-Json
    Write-Host "ALMACEN S-CLASS :: $($store.opportunities.Count) Oportunidades Almacenadas" -ForegroundColor Cyan
    Write-Host "Ultimo barrido: $($store.lastScanAt)" -ForegroundColor Gray
    Write-Host ""

    $top = $store.opportunities | Sort-Object matchScore -Descending | Select-Object -First 20

    foreach ($item in $top) {
        $scoreColor = "Gray"
        if ($item.matchScore -ge 85) { $scoreColor = "Green" }
        elseif ($item.matchScore -ge 75) { $scoreColor = "Yellow" }
        $vimume = ""
        if ($item.vimumeCompatible) { $vimume = "[VIMUME]" }
        $cats = $item.categories -join ' - '
        Write-Host "[$($item.matchScore)%] $cats $vimume" -ForegroundColor $scoreColor
        Write-Host "  $($item.title)" -ForegroundColor White
        Write-Host "  $($item.url)" -ForegroundColor DarkCyan
        Write-Host ""
    }
    exit 0
}

# 4. MODO WATCH (CENTINELA CONTINUO)
if ($Watch) {
    Write-RadarHeader
    Write-Host "[MODO CENTINELA ACTIVO] Ejecutando barrido cada $IntervalMinutes minutos..." -ForegroundColor Green
    Write-Host "Presiona Ctrl + C para detener." -ForegroundColor DarkGray
    Write-Host ""

    while ($true) {
        Invoke-RadarScan
        Write-Host "Esperando $IntervalMinutes minutos hasta el proximo barrido..." -ForegroundColor DarkGray
        Start-Sleep -Seconds ($IntervalMinutes * 60)
    }
    exit 0
}

# 5. MODO DEFAULT: ESCANEO INMEDIATO
Write-RadarHeader
Invoke-RadarScan

Write-Host "-----------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "COMANDOS UTILES:" -ForegroundColor Yellow
Write-Host "  * Ver resumen en consola : .\EJECUTAR_RADAR_OPORTUNIDADES.ps1 -Summary" -ForegroundColor White
Write-Host "  * Abrir Google Alerts    : .\EJECUTAR_RADAR_OPORTUNIDADES.ps1 -OpenGoogleAlerts" -ForegroundColor White
Write-Host "  * Modo Vigilante 24/7    : .\EJECUTAR_RADAR_OPORTUNIDADES.ps1 -Watch -IntervalMinutes 30" -ForegroundColor White
Write-Host "  * API REST en vivo       : http://localhost:3007/api/opportunity-radar" -ForegroundColor White
Write-Host "-----------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
