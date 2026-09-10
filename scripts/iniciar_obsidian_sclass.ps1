# scripts/iniciar_obsidian_sclass.ps1
# ==============================================================================
# DIAGNOSTICO, PURGA DE CACHE Y LANZADOR DEFINITIVO DE OBSIDIAN S-CLASS
# ==============================================================================
# Resuelve de raiz los bloqueos de Electron, caches GPU corruptas y bucles
# infinitos causados por indexar carpetas de codigo masivas (node_modules/.git).
# ==============================================================================

$ErrorActionPreference = 'SilentlyContinue'

Write-Host "`n"
Write-Host "======================================================================" -ForegroundColor Yellow
Write-Host "    OBSIDIAN RESCUE & S-CLASS LAUNCHER - PRODUCTORA EAR OS            " -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Yellow
Write-Host "  Modo: CEO & Visual para No Programadores`n" -ForegroundColor DarkGray

# 1. Rutas Maestras
$vaultPath = "H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT"
$appDataObsidian = Join-Path $env:APPDATA "obsidian"
$obsidianConfig = Join-Path $appDataObsidian "obsidian.json"

# 2. Paso 1: Terminar cualquier proceso colgado de Obsidian
Write-Host "[1/6] Deteniendo procesos colgados de Obsidian en segundo plano..." -ForegroundColor Cyan
$killed = 0
Get-Process -Name "Obsidian" -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    $killed++
}
if ($killed -gt 0) {
    Write-Host "      [OK] Se cerraron $killed instancias zombi de Obsidian." -ForegroundColor Green
    Start-Sleep -Milliseconds 800
} else {
    Write-Host "      [OK] No habia procesos bloqueados." -ForegroundColor Green
}

# 3. Paso 2: Purgar caches corruptas de Electron (Causa #1 de pantalla negra/carga infinita)
Write-Host "[2/6] Purgando caches corruptas de Electron y GPU..." -ForegroundColor Cyan
$cacheDirs = @(
    (Join-Path $appDataObsidian "GPUCache"),
    (Join-Path $appDataObsidian "Cache"),
    (Join-Path $appDataObsidian "Code Cache"),
    (Join-Path $appDataObsidian "DawnCache")
)

foreach ($cDir in $cacheDirs) {
    if (Test-Path $cDir) {
        Remove-Item -Path $cDir -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "      [OK] Cache purgada: $(Split-Path $cDir -Leaf)" -ForegroundColor DarkGray
    }
}

# 4. Paso 3: Asegurar que el Vault oficial exista con su configuracion de exclusion
Write-Host "[3/6] Configurando filtros de seguridad en Boveda Oficial..." -ForegroundColor Cyan
if (-not (Test-Path $vaultPath)) {
    New-Item -ItemType Directory -Path $vaultPath -Force | Out-Null
}

$vaultObsidianDir = Join-Path $vaultPath ".obsidian"
if (-not (Test-Path $vaultObsidianDir)) {
    New-Item -ItemType Directory -Path $vaultObsidianDir -Force | Out-Null
}

# exclusion total de archivos pesados (*.json, *.html, code, node_modules) para que Obsidian vuele en 2s
$vaultAppJson = Join-Path $vaultObsidianDir "app.json"
$appJsonContent = @"
{
  "userIgnoreFilters": [
    "**/*.json",
    "**/*.html",
    "**/*.csv",
    "**/*.zip",
    "**/05_CODIGO_Y_SISTEMA/**",
    "**/EXTRACTED_CODE/**",
    "**/vendors_html/**",
    "**/vendors_images/**",
    "**/QUARANTINE_ROUTES/**",
    "**/02_PROVEEDORES_SCLASS/*.json",
    "**/Providers/*.json",
    "**/node_modules/**",
    "**/.next/**",
    "**/.git/**",
    "**/dist/**",
    "**/build/**",
    "**/.antigravity/**",
    "**/scratch/**"
  ],
  "showUnsupportedFiles": false,
  "livePreview": true,
  "readableLineLength": false
}
"@
$appJsonContent | Set-Content -Path $vaultAppJson -Encoding UTF8 -Force
Write-Host "      [OK] Blindaje de exclusion activo (*.json y *.html bloqueados del indexado de Obsidian)." -ForegroundColor Green

# 5. Paso 4: Sincronizar Portada Visual S-Class Oficial
Write-Host "[4/6] Sincronizando Portada Visual S-Class para Edwin..." -ForegroundColor Cyan
$docSource = "H:\EAR_OS_V2\EAR_OS_V2\docs\00_CENTRO_DE_MANDO_SCLASS.md"
$dashboardPath = Join-Path $vaultPath "00_CENTRO_DE_MANDO_SCLASS.md"

if (Test-Path $docSource) {
    Copy-Item -Path $docSource -Destination $dashboardPath -Force
    Write-Host "      [OK] Portada oficial de 5 Carpetas Maestras sincronizada en el Vault." -ForegroundColor Green
} else {
    Write-Host "      [OK] Conservando portada existente." -ForegroundColor DarkGray
}

# 6. Paso 5: Sanitizar obsidian.json para forzar la apertura del Vault limpio
Write-Host "[5/6] Configurando obsidian.json para abrir el Vault correcto..." -ForegroundColor Cyan
if (-not (Test-Path $appDataObsidian)) {
    New-Item -ItemType Directory -Path $appDataObsidian -Force | Out-Null
}

# Generar un hash determinista para el vault id
$vaultId = [System.BitConverter]::ToString([System.Security.Cryptography.MD5]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes($vaultPath))).Replace("-", "").ToLower().Substring(0, 16)

$obsidianJsonContent = @"
{
  "vaults": {
    "$vaultId": {
      "path": "$($vaultPath.Replace('\', '\\'))",
      "ts": $([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()),
      "open": true
    }
  },
  "insider": false
}
"@

$obsidianJsonContent | Set-Content -Path $obsidianConfig -Encoding UTF8 -Force
Write-Host "      [OK] Vault predeterminado configurado en: $vaultPath" -ForegroundColor Green

# 7. Paso 6: Localizar y Lanzar Obsidian
Write-Host "[6/6] Localizando ejecutable de Obsidian en el sistema..." -ForegroundColor Cyan
$obsidianCandidates = @(
    (Join-Path $env:LOCALAPPDATA "Programs\obsidian\Obsidian.exe"),
    (Join-Path $env:LOCALAPPDATA "Obsidian\Obsidian.exe"),
    "C:\Program Files\Obsidian\Obsidian.exe",
    "C:\Program Files (x86)\Obsidian\Obsidian.exe"
)

$exePath = $null
foreach ($cand in $obsidianCandidates) {
    if (Test-Path $cand) {
        $exePath = $cand
        break
    }
}

if (-not $exePath) {
    # Buscar en PATH
    $cmd = Get-Command "Obsidian.exe" -ErrorAction SilentlyContinue
    if ($cmd) {
        $exePath = $cmd.Source
    }
}

# Crear acceso directo en el Escritorio para 1-clic futuro
$desktopPath = [System.Environment]::GetFolderPath('Desktop')
if (Test-Path $desktopPath) {
    $desktopLauncherBat = Join-Path $desktopPath "Abrir_Obsidian_EAR_OS.bat"
    @"
@echo off
powershell -ExecutionPolicy Bypass -File "H:\EAR_OS_V2\EAR_OS_V2\scripts\iniciar_obsidian_sclass.ps1"
"@ | Set-Content -Path $desktopLauncherBat -Encoding ASCII -Force
    Write-Host "      [OK] Creado lanzador de 1-clic en tu Escritorio: 'Abrir_Obsidian_EAR_OS.bat'" -ForegroundColor Green
}

if ($exePath) {
    Write-Host "`n  ======================================================================" -ForegroundColor Green
    Write-Host "  [EXIT CODE 0] INICIANDO OBSIDIAN EN MODO ULTRA-RAPIDO..." -ForegroundColor Green
    Write-Host "  Ejecutable : $exePath" -ForegroundColor DarkGray
    Write-Host "  Boveda     : $vaultPath" -ForegroundColor Cyan
    Write-Host "  ======================================================================" -ForegroundColor Green
    
    # Lanzar Obsidian directamente: al tener obsidian.json configurado con open=true, abrira la boveda de inmediato
    Start-Process -FilePath $exePath
} else {
    Write-Host "`n  [AVISO] No se encontro Obsidian.exe en las rutas estandar." -ForegroundColor Yellow
    Write-Host "  Abre Obsidian manualmente: Se abrira de inmediato en la boveda limpia." -ForegroundColor Yellow
}
