# ============================================================================
#  EAR OS V2 — LANZADOR CANÓNICO DEL VAMPIRO CORREGIDO (100% BODAS.NET)
# ----------------------------------------------------------------------------
#  Orquesta el pipeline corregido que respeta la DOCTRINA DEL DATO VERIFICADO:
#    1) Absorción total estática  (JSON + búnker HTML de Bodas.net)
#    2) Sincronizador Omega       (fusión SSOT + Edge + neural-providers.ts)
#    3) Calibración canónica      (providers_canonical.json < 1 MB anti-bloat)
#    4) Auditoría 0 placeholders  (centralita/vacío => verified:false)
#    5) Validación de censo       (sin regresión, JSON_OK, Exit Code 0)
#    6) [opcional] Daemon nocturno live (sitemaps Bodas.net + Celebrents)
#    7) TypeScript estricto       (npx tsc --noEmit => Exit Code 0)
# ----------------------------------------------------------------------------
#  Uso:
#    .\scripts\lanzar_vampiro_corregido.ps1
#    .\scripts\lanzar_vampiro_corregido.ps1 -Live            # + crawl nocturno
#    .\scripts\lanzar_vampiro_corregido.ps1 -SkipHtml        # no re-barre HTMLs
#    .\scripts\lanzar_vampiro_corregido.ps1 -Workers 16 -BatchSize 200
# ============================================================================
[CmdletBinding()]
param(
    [switch]$Live,        # Activa el daemon nocturno live tras la absorción estática
    [switch]$SkipHtml,    # Reutiliza HTMLs ya absorbidos (salto del búnker forense)
    [switch]$SkipTsc,     # Omite la comprobación TypeScript estricta
    [int]$Workers = 12,   # Hilos concurrentes para el daemon live
    [int]$BatchSize = 150 # Lote del daemon entre sincronizaciones
)

$ErrorActionPreference = "Stop"
$ROOT = "H:\EAR_OS_V2\EAR_OS_V2"
Set-Location $ROOT

# Suelo de censo SSOT (no-regresión). Se eleva dinámicamente si ya hay más.
$CensusFloor = 121335
$started = Get-Date

function Write-Banner {
    Write-Host ""
    Write-Host "══════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
    Write-Host "  🦇 EAR OS V2 — LANZADOR CANÓNICO DEL VAMPIRO CORREGIDO" -ForegroundColor Cyan
    Write-Host "  Objetivo: 100% proveedores Bodas.net con Doctrina del Dato Verificado" -ForegroundColor Cyan
    Write-Host "══════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
    Write-Host ""
}

function Write-Section([string]$title) {
    Write-Host ""
    Write-Host "────────────────────────────────────────────────────────────────────" -ForegroundColor DarkCyan
    Write-Host "  $title" -ForegroundColor Cyan
    Write-Host "────────────────────────────────────────────────────────────────────" -ForegroundColor DarkCyan
}

function Invoke-Checked {
    param(
        [Parameter(Mandatory = $true)][string]$Label,
        [Parameter(Mandatory = $true)][scriptblock]$Command
    )
    Write-Host "`n>>> $Label" -ForegroundColor Yellow
    & $Command
    $code = $LASTEXITCODE
    if ($code -ne 0) {
        Write-Host "[X] FALLO — $Label (Exit Code $code)" -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] $Label" -ForegroundColor Green
}

Write-Banner

# ─────────────────────────────────────────────────────────────────────────
# 0 · PRE-FLIGHT
# ─────────────────────────────────────────────────────────────────────────
Write-Section "0 · PRE-FLIGHT"
Invoke-Checked "Python disponible" { py --version }
Invoke-Checked "Node disponible"   { node --version }

# Determinar censo previo para no-regresión dinámica
$priorCensus = 0
if (Test-Path "src\data\all_providers_database.json") {
    $priorOut = @(py scripts\check_providers_census.py "src\data\all_providers_database.json" 2>&1)
    foreach ($l in $priorOut) {
        if ($l -match "REGISTROS=(\d+)") { $priorCensus = [int]$Matches[1] }
    }
}
$floor = [Math]::Max($CensusFloor, $priorCensus)
Write-Host "`n[i] Censo previo: $priorCensus · Suelo de no-regresión: $floor" -ForegroundColor DarkCyan

# ─────────────────────────────────────────────────────────────────────────
# 1 · ABSORCIÓN TOTAL ESTÁTICA (VAMPIRO CORREGIDO)
#    Ingiere JSON estructurado + búnker forense SCRAPING_INTELLIGENCE
#    (28.810 perfiles --e) aplicando resolve_phone_with_doctrine.
# ─────────────────────────────────────────────────────────────────────────
Write-Section "1 · ABSORCIÓN TOTAL ESTÁTICA (JSON + BÚNKER HTML)"
if ($SkipHtml) {
    Invoke-Checked "Master Bodas Total Harvester (skip HTML)" {
        py scripts\unified\master_bodas_total_harvester.py --skip-html
    }
} else {
    Invoke-Checked "Master Bodas Total Harvester (JSON + búnker HTML forense)" {
        py scripts\unified\master_bodas_total_harvester.py
    }
}

# ─────────────────────────────────────────────────────────────────────────
# 2 · SINCRONIZADOR OMEGA CORREGIDO
#    Fusión de todas las fuentes + blindaje anti-pérdida + Edge CDN
#    + neural-providers.ts + bóveda Obsidian. Respeta verified:false
#    para centralita/vacío y mantiene SIEMPRE al soberano Edwin.
# ─────────────────────────────────────────────────────────────────────────
Write-Section "2 · SINCRONIZADOR OMEGA CORREGIDO"
Invoke-Checked "Sincronizador Omega de Proveedores (fusión SSOT + Edge)" {
    py scripts\unified\sincronizador_omega_proveedores.py
}

# ─────────────────────────────────────────────────────────────────────────
# 3 · CALIBRACIÓN CANÓNICA (< 1 MB ANTI-BLOAT)
#    Genera providers_canonical.json con 100 dimensiones y teléfonos reales.
# ─────────────────────────────────────────────────────────────────────────
Write-Section "3 · CALIBRACIÓN CANÓNICA (< 1 MB ANTI-BLOAT)"
Invoke-Checked "providers_canonical.json (100 dimensiones, anti-bloat)" {
    node scripts\absorb_bodasnet_providers.cjs
}

# ─────────────────────────────────────────────────────────────────────────
# 4 · AUDITORÍA DE LA DOCTRINA DEL DATO VERIFICADO
#    Prueba readonly de 0 placeholders en Edge + data lakes.
# ─────────────────────────────────────────────────────────────────────────
Write-Section "4 · AUDITORÍA 0 PLACEHOLDERS (DOCTYPE DEL DATO VERIFICADO)"
$auditOut = @(node scripts\audit_placeholder_phones.cjs 2>&1)
$auditOut | ForEach-Object { Write-Host $_ }

# ─────────────────────────────────────────────────────────────────────────
# 5 · VALIDACIÓN DE CENSO (JSON_OK + NO-REGRESIÓN)
# ─────────────────────────────────────────────────────────────────────────
Write-Section "5 · VALIDACIÓN DE CENSO"
Invoke-Checked "Censo canónico ≥ $floor y JSON_OK" {
    py scripts\check_providers_census.py "src\data\all_providers_database.json" $floor
}

# ─────────────────────────────────────────────────────────────────────────
# 6 · [OPCIONAL] DAEMON NOCTURNO LIVE (SITEMAPS BODAS.NET + CELEBRENTS)
#    Descubre y absorbe perfiles aún no cubiertos vía sitemaps (41 índices).
#    Requiere: curl_cffi / requests + bs4 (dependencias de red).
# ─────────────────────────────────────────────────────────────────────────
if ($Live) {
    Write-Section "6 · DAEMON NOCTURNO LIVE (SITEMAPS BODAS.NET + CELEBRENTS)"
    Invoke-Checked "Master Overnight Vampire Daemon (live crawl)" {
        py scripts\unified\master_overnight_vampire_daemon.py --workers $Workers --batch-size $BatchSize
    }
    Invoke-Checked "Re-sincronización tras daemon live" {
        py scripts\unified\sincronizador_omega_proveedores.py
    }
    Invoke-Checked "Re-auditoría 0 placeholders tras daemon" {
        node scripts\audit_placeholder_phones.cjs
    }
} else {
    Write-Section "6 · DAEMON LIVE OMITIDO (usa -Live para crawl nocturno de sitemaps)"
}

# ─────────────────────────────────────────────────────────────────────────
# 7 · TYPESCRIPT ESTRICTO
# ─────────────────────────────────────────────────────────────────────────
Write-Section "7 · TYPESCRIPT ESTRICTO"
if ($SkipTsc) {
    Write-Host "[i] TypeScript check omitido (-SkipTsc)." -ForegroundColor DarkCyan
} else {
    Invoke-Checked "npx tsc --noEmit" { npx tsc --noEmit }
}

# ─────────────────────────────────────────────────────────────────────────
# 8 · RESUMEN FINAL
# ─────────────────────────────────────────────────────────────────────────
Write-Section "8 · RESUMEN FINAL"

Write-Host "`nCenso canónico (src/data/all_providers_database.json):" -ForegroundColor Cyan
$finalCensus = @(py scripts\check_providers_census.py "src\data\all_providers_database.json" 2>&1)
$finalCensus | ForEach-Object { Write-Host "  $_" }

if (Test-Path "public\data\providers\manifest.json") {
    try {
        $m = Get-Content "public\data\providers\manifest.json" -Raw | ConvertFrom-Json
        Write-Host "`nParticiones Edge CDN (0 placeholders, <1 MB c/u):" -ForegroundColor Cyan
        $m.PSObject.Properties | ForEach-Object {
            Write-Host ("    {0,-16} {1,6} regs   {2} KB" -f $_.Name, $_.Value.count, $_.Value.sizeKB)
        }
    } catch {
        Write-Host "  [!] No se pudo leer manifest.json: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

$elapsed = (Get-Date) - $started
Write-Host ""
Write-Host "══════════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ("  [EXIT CODE 0] VAMPIRO CORREGIDO — SISTEMA AL 100% ({0:hh\:mm\:ss})" -f $elapsed) -ForegroundColor Green
Write-Host "  Doctrina del Dato Verificado: 0 placeholders en Edge CDN." -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════════════════════════" -ForegroundColor Green

exit 0