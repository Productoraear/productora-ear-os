param(
    [string]$Root = "C:\EAR_OS_V2",
    [string]$Vault = "C:\EAR_OS_V2",
    [string]$ExternalQuarantine = "H:\99_CUARENTENA\vault_purged_2026_05_18",
    [switch]$DryRun = $true
)

$ErrorActionPreference = "Stop"

$folders = @(
    "00_INBOX_COGNITIVO",
    "01_SSOT_Y_KERNELS",
    "02_ARQUITECTURA_Y_MATRICES",
    "99_CUARENTENA_COGNITIVA"
)

$moveMap = @(
    @{ Src = "EAR_OS_STRATEGIC_ORCHESTRATOR_PLAN.md"; Dst = "01_SSOT_Y_KERNELS\EAR_OS_STRATEGIC_ORCHESTRATOR_PLAN.md" },
    @{ Src = "CLINE_OMEGA_KERNEL.md"; Dst = "01_SSOT_Y_KERNELS\CLINE_OMEGA_KERNEL.md" },
    @{ Src = "auditoria_forense_files.csv"; Dst = "$ExternalQuarantine\audits\auditoria_forense_files.csv" },
    @{ Src = "waybill_legacy.html"; Dst = "$ExternalQuarantine\legacy_html\waybill_legacy.html" },
    @{ Src = "tsc_errors.txt"; Dst = "$ExternalQuarantine\logs\compilation_history\tsc_errors.txt" },
    @{ Src = "google_business_posts_drafts.md"; Dst = "02_ARQUITECTURA_Y_MATRICES\google_business_posts_drafts.md" },
    @{ Src = "_ALMACEN_DE_CUARENTENA_6M"; Dst = "$ExternalQuarantine\_ALMACEN_DE_CUARENTENA_6M" }
)

function Ensure-Dir($Path) {
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
}

function Move-Safe($Source, $Destination) {
    if (-not (Test-Path $Source)) {
        Write-Host "[SKIP] No existe: $Source"
        return
    }
    $destDir = Split-Path $Destination -Parent
    Ensure-Dir $destDir
    if ($DryRun) {
        Write-Host "[DRYRUN] $Source -> $Destination"
    } else {
        Move-Item -Path $Source -Destination $Destination -Force
        Write-Host "[OK] $Source -> $Destination"
    }
}

Write-Host "== EAR OS / OBSIDIAN INIT =="
Ensure-Dir $Vault
Set-Location $Vault

foreach ($f in $folders) {
    Ensure-Dir (Join-Path $Vault $f)
}

$obsidianFolder = Join-Path $Vault ".obsidian"
Ensure-Dir $obsidianFolder

$excludeFile = Join-Path $obsidianFolder "app.json"
if (-not (Test-Path $excludeFile)) {
    @"
{
  "filesAndLinks": {
    "excludedFiles": [
      "node_modules/",
      ".next/",
      ".git/",
      "dist/",
      "build/"
    ]
  }
}
"@ | Set-Content -Path $excludeFile -Encoding UTF8
}

foreach ($m in $moveMap) {
    $src = Join-Path $Root $m.Src
    $dst = $m.Dst
    Move-Safe $src $dst
}

Write-Host "== DONE =="
Write-Host "DryRun = $DryRun"
Write-Host "Vault = $Vault"
Write-Host "ExternalQuarantine = $ExternalQuarantine"