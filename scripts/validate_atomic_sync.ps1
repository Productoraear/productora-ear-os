# ============================================================================
# VALIDACION DEL BLINDAJE ATOMICO DEL PIPELINE DE PROVEEDORES EAR OS
# Verifica: compilacion Python, integridad/censo del canonico, artefactos
# residuales (.tmp/.bak) y ausencia de procesos Python activos.
# Salida: Exit Code 0 => OK · Exit Code 1 => fallo detectado
# Uso:   powershell -ExecutionPolicy Bypass -File scripts\validate_atomic_sync.ps1
# ============================================================================
$ErrorActionPreference = "Stop"
$ROOT = "H:\EAR_OS_V2\EAR_OS_V2"
Set-Location $ROOT

$failed = $false

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor DarkCyan
Write-Host "  VALIDACION BLINDAJE ATOMICO - PIPELINE PROVEEDORES EAR OS" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor DarkCyan

# --- 1/4 · Compilacion Python (py_compile) -----------------------------------
Write-Host "`n[1/4] Compilacion Python (py_compile)..." -ForegroundColor Cyan
$pyScripts = @(
    "scripts\unified\sincronizador_omega_proveedores.py",
    "scripts\unified\master_bodas_total_harvester.py",
    "scripts\unified\master_overnight_vampire_daemon.py",
    "scripts\check_providers_census.py"
)
foreach ($s in $pyScripts) {
    py -m py_compile (Join-Path $ROOT $s) 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [X] FALLO compilando: $s" -ForegroundColor Red
        $failed = $true
    } else {
        Write-Host "  [OK] $s" -ForegroundColor Green
    }
}

# --- 2/4 · Integridad y censo del archivo canonico ----------------------------
Write-Host "`n[2/4] Integridad JSON y censo del canonico..." -ForegroundColor Cyan
$canonical = Join-Path $ROOT "src\data\all_providers_database.json"
if (-not (Test-Path $canonical)) {
    Write-Host "  [X] No existe $canonical" -ForegroundColor Red
    $failed = $true
} else {
    $censusOut = @(py (Join-Path $ROOT "scripts\check_providers_census.py") $canonical 121335 2>&1)
    $censusCode = $LASTEXITCODE
    $censusText = ($censusOut -join "`n")
    if ($censusCode -ne 0 -or $censusText -notmatch "JSON_OK") {
        Write-Host "  [X] JSON corrupto o regresion de censo:" -ForegroundColor Red
        Write-Host "      $censusText" -ForegroundColor Red
        $failed = $true
    } else {
        if ($censusText -match "REGISTROS=(\d+)") {
            Write-Host "  [OK] JSON parseable · censo estable: $($Matches[1]) registros" -ForegroundColor Green
        } else {
            Write-Host "  [OK] $censusText" -ForegroundColor Green
        }
    }
}

# --- 3/4 · Artefactos residuales (.tmp/.bak) ----------------------------------
Write-Host "`n[3/4] Artefactos residuales (.tmp / .bak)..." -ForegroundColor Cyan
$scanDirs = @("src\data", "scripts\unified", "scripts\nightcrawler_results")
$foundArtifacts = $false
foreach ($d in $scanDirs) {
    $p = Join-Path $ROOT $d
    if (Test-Path $p) {
        Get-ChildItem -Path $p -Recurse -File -Include *.tmp,*.bak -ErrorAction SilentlyContinue |
            ForEach-Object {
                Write-Host "  [X] Artefacto residual: $($_.FullName)" -ForegroundColor Yellow
                $foundArtifacts = $true
            }
    }
}
if ($foundArtifacts) {
    Write-Host "  [!] Se detectaron artefactos residuales (no bloqueante, revisar)." -ForegroundColor Yellow
} else {
    Write-Host "  [OK] Sin artefactos .tmp/.bak residuales." -ForegroundColor Green
}

# --- 4/4 · Procesos Python activos --------------------------------------------
Write-Host "`n[4/4] Procesos Python activos..." -ForegroundColor Cyan
$procs = @(Get-Process python -ErrorAction SilentlyContinue)
if ($procs.Count -gt 0) {
    Write-Host "  [X] Hay $($procs.Count) proceso(s) Python activo(s):" -ForegroundColor Red
    $procs | ForEach-Object { Write-Host "      PID $($_.Id): $($_.ProcessName)" -ForegroundColor Red }
    $failed = $true
} else {
    Write-Host "  [OK] Sin procesos Python activos (daemon finalizado)." -ForegroundColor Green
}

# --- Veredicto -----------------------------------------------------------------
Write-Host ""
if ($failed) {
    Write-Host "=====================================================================" -ForegroundColor Red
    Write-Host "  VEREDICTO: FALLO DETECTADO (Exit Code 1)" -ForegroundColor Red
    Write-Host "=====================================================================" -ForegroundColor Red
    exit 1
} else {
    Write-Host "=====================================================================" -ForegroundColor Green
    Write-Host "  VEREDICTO: BLINDAJE ATOMICO INTEGRO (Exit Code 0)" -ForegroundColor Green
    Write-Host "=====================================================================" -ForegroundColor Green
    exit 0
}