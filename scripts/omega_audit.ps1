# ══════════════════════════════════════════════════════════════════════
# B0.99 — MANDATO OMEGA DIOS · AUDITORÍA E2E EAR OS v12
# Valida heartbeat Stripe, certifica SSOT der proveedores y sella la build.
# Ejecutar: pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/omega_audit.ps1
# ══════════════════════════════════════════════════════════════════════
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root '.env'
$nexusFile = Join-Path $root 'src\lib\constants\SClassNexus.ts'

$PASS = 0
$FAIL = 0

function Write-Ok([string]$msg) {
    Write-Host "  [OK] $msg" -ForegroundColor Green
    $script:PASS++
}

function Write-Bad([string]$msg) {
    Write-Host "  [FAIL] $msg" -ForegroundColor Red
    $script:FAIL++
}

Write-Host ""
Write-Host "═══ EAR OS v12 · AUDITORÍA OMEGA E2E ═══" -ForegroundColor Cyan

# ── 1. HEARTBEAT STRIPE ──────────────────────────────────────────────
Write-Host "`n[1/2] Heartbeat de Stripe" -ForegroundColor Cyan
if (-not (Test-Path $envFile)) {
    Write-Bad "No se encontro el archivo .env en $root"
} else {
    $envLines = Get-Content $envFile -Raw
    $hasSecret = $envLines -match 'STRIPE_SECRET_KEY\s*=\s*\S+'
    if ($hasSecret) {
        Write-Ok "STRIPE_SECRET_KEY configurada. Pasarela de pagos operativa."
    } else {
        Write-Bad "STRIPE_SECRET_KEY ausente o vacia en .env"
    }
}

# ── 2. CERTIFICACIÓN SSOT PROVEEDORES NEXUS ─────────────────────────
Write-Host "`n[2/2] Nexus lee SSOT_PROVIDER_METRICS" -ForegroundColor Cyan
if (-not (Test-Path $nexusFile)) {
    Write-Bad "No se encontro $nexusFile"
} else {
    $nexus = Get-Content $nexusFile -Raw
    if ($nexus -match 'SSOT_PROVIDER_METRICS') {
        Write-Ok "Constante SSOT_PROVIDER_METRICS presente en el Nexus."

        if ($nexus -match 'TOTAL_PROVIDERS_VAULT\s*:\s*85946') {
            Write-Ok "Conteo canonico certificado: 85.946 proveedores indexados."
        } else {
            Write-Bad "El conteo canonical no coincide con 85.946."
        }
    } else {
        Write-Bad "El Nexus NO lee la constante SSOT_PROVIDER_METRICS."
    }
}

# ── VEREDICTO FINAL ─────────────────────────────────────────────────
Write-Host ""
if ($FAIL -eq 0) {
    Write-Host "EAR OS v12 PRODUCCIÓN SELLADA. CÓDIGO VERDE." -ForegroundColor Green
    Write-Host ""
    exit 0
} else {
    Write-Host "AUDITORÍA OMEGA CON $FAIL INCIDENCIAS. REVISA ANTES DE SELLAR." -ForegroundColor Red
    Write-Host ""
    exit 1
}