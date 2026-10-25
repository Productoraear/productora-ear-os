# ==============================================================================
# EAR OS - SUPERVISOR DE DRENAJE BODAS.NET (VAMPIRO / CAZADOR S-CLASS)
# Reanuda el drenaje completo sin limite tras caidas de red o reinicios.
# Estado persistente: scripts/nightcrawler_results/*.json
# NOTA: archivo 100% ASCII (PowerShell 5.1 lee sin BOM como ANSI).
# ==============================================================================
param(
  [int]$MaxRounds = 200,
  [int]$RetryDelaySec = 30,
  [int]$MaxCatalogs = 400,
  [int]$Limit = 4000,
  [int]$Workers = 6,
  [double]$MaxHours = 0
)

$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$results = Join-Path $root 'nightcrawler_results'
$harvester = Join-Path $root 'vampire_bodas_live_harvester.mjs'
$progress = Join-Path $results 'master_vampire_progress.json'
$log = Join-Path $results 'bodas_drain_stdout.log'
$errLog = Join-Path $results 'bodas_drain_stderr.log'

New-Item -ItemType Directory -Force -Path $results | Out-Null

$nodeArgs = @($harvester, '--drain', '--max-catalogs', "$MaxCatalogs", '--limit', "$Limit", '--workers', "$Workers")
if ($MaxHours -gt 0) { $nodeArgs += @('--max-hours', "$MaxHours") }

for ($round = 1; $round -le $MaxRounds; $round++) {
  Add-Content -Path $log -Value ("=== ROUND $round | $(Get-Date -Format o) ===")
  & node @nodeArgs *>&1 | Out-File -FilePath $log -Append -Encoding utf8

  $code = $LASTEXITCODE
  Add-Content -Path $log -Value ("=== ROUND $round exit=$code | $(Get-Date -Format o) ===")

  $done = $false
  $paused = $false
  if (Test-Path $progress) {
    try {
      $p = Get-Content $progress -Raw | ConvertFrom-Json
      $pendingCatalogs = [int]$p.pending_catalogs
      $pendingStorefronts = [int]$p.pending_storefronts
      if ($p.status -eq 'COMPLETED' -or ($pendingCatalogs -eq 0 -and $pendingStorefronts -eq 0)) { $done = $true }
      if ($MaxHours -gt 0 -and [double]$p.elapsed_min -ge ($MaxHours * 60)) { $paused = $true }
    } catch {
      Add-Content -Path $log -Value ("[warn] progreso ilegible: " + $_.Exception.Message)
    }
  }

  if ($done) {
    Add-Content -Path $log -Value '=== DRAIN COMPLETED ==='
    break
  }
  if ($paused) {
    Add-Content -Path $log -Value '=== DRAIN PAUSED (presupuesto de horas agotado) ==='
    break
  }
  if ($code -eq 130 -or $code -eq 143) {
    Add-Content -Path $log -Value '=== DRAIN INTERRUMPIDO POR SENAL ==='
    break
  }
  Start-Sleep -Seconds $RetryDelaySec
}
