# scripts/audit_git_bloat.ps1
# Auditoría anti-bloat: archivos masivos rastreados por git vs .gitignore
$ErrorActionPreference = 'Stop'

$repo = Split-Path $PSScriptRoot -Parent
Push-Location $repo
try {
    Write-Output "=== ARCHIVOS RASTREADOS > 1 MB EN repo (top 30) ==="
    git ls-files | ForEach-Object {
        $p = Join-Path $repo $_
        if (Test-Path $p) {
            $mb = [Math]::Round((Get-Item $p).Length / 1MB, 2)
            [PSCustomObject]@{ MB = $mb; Path = $_ }
        }
    } | Where-Object { $_.MB -gt 1 } |
        Sort-Object MB -Descending | Select-Object -First 30 |
        ForEach-Object { "{0,10} MB  {1}" -f $_.MB, $_.Path }

    Write-Output ""
    Write-Output "=== TAMAÑO TOTAL ARCHIVOS RASTREADOS (git) ==="
    $items = git ls-files | ForEach-Object {
        $p = Join-Path $repo $_
        if (Test-Path $p) { (Get-Item $p).Length } else { 0 }
    }
    $sum = ($items | Measure-Object -Sum).Sum
    "{0} MB en {1} archivos rastreados" -f [Math]::Round($sum / 1MB, 1), ($items | Measure-Object).Count
} finally {
    Pop-Location
}