param(
    [ValidateSet("scan", "absorb")]
    [string]$Action = "scan",

    [string[]]$Paths = @()
)

$ErrorActionPreference = "Stop"

# ── SSOT: rutas soberanas ─────────────────────────────────────────────────────────
$destRoot = "H:\ARCHIVO_HISTORICO_EAR\ABSORBIDOS_COMPLETOS"
if (-not (Test-Path $destRoot)) {
    New-Item -ItemType Directory -Path $destRoot -Force | Out-Null
}

# El radar apunta prioritariamente a H:\ (bovedas maestras) y progresivamente a unidades detectadas (C:\, D:\, E:\)
# Nunca escaneamos el repo (src/, scripts/, prisma/) para no desplazar codigo fuente.
$candidateRoots = @(
    "H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT",
    "H:\ARCHIVO_HISTORICO_EAR",
    "H:\ARCHIVO_FRIO_ESTRUCTURAL",
    "C:\Users\M2-W10\Documents",
    "D:\EAR_ARCHIVES",
    "D:\SANTUARIO"
)
$rootScan = $candidateRoots | Where-Object { Test-Path $_ }
if ($rootScan.Count -eq 0) {
    # Fallback seguro
    $rootScan = @("H:\00_PRODUCTORA_EAR") | Where-Object { Test-Path $_ }
}

# Solo absorbemos documentos ligeros (<1MB) para mantener el repo ultra-ligero
$pendingExtensions = @('.md', '.txt', '.json', '.csv', '.pdf', '.py', '.ps1', '.ts', '.tsx', '.js', '.html')

# Excluimos dependencias y artefactos de build: jamas absorber dependencias del proyecto
$excludedDirs = @('node_modules', '.next', '.git', '.vercel', 'dist', 'out')

function Test-Excluded {
    param([string]$FullPath)
    foreach ($dir in $excludedDirs) {
        if ($FullPath -match "[\/\\]$dir([\/\\]|$)") { return $true }
    }
    return $false
}

function Get-PendingFiles {
    $items = foreach ($root in $rootScan) {
        Get-ChildItem -Path $root -Recurse -File -ErrorAction SilentlyContinue |
            Where-Object {
                $_.Extension -in $pendingExtensions -and
                $_.Length -lt 1MB -and
                -not (Test-Excluded -FullPath $_.FullName)
            }
    }
    return @($items)
}

function Write-HashJson {
    param([hashtable]$Payload)
    # ConvertTo-Json no serializa hashtables ordenados de forma fiable en PS5; usamos [ordered] + PSCustomObject
    $obj = [PSCustomObject]$Payload
    return ($obj | ConvertTo-Json -Depth 5 -Compress)
}

switch ($Action) {
    "scan" {
        $all = Get-PendingFiles
        $total = $all.Count
        $sumBytes = ($all | Measure-Object -Property Length -Sum).Sum
        if (-not $sumBytes) { $sumBytes = 0 }
        $sizeMB = [math]::Round($sumBytes / 1MB, 2)

        # Porcentaje de absorción: lo ya movido al archivo histórico vs. pendientes
        $absorbed = @(Get-ChildItem -Path $destRoot -Recurse -File -ErrorAction SilentlyContinue).Count
        $grandTotal = $absorbed + $total
        $pct = if ($grandTotal -gt 0) { [math]::Round(($absorbed / $grandTotal) * 100, 1) } else { 0 }

        $result = [ordered]@{
            action        = "scan"
            ts            = (Get-Date).ToString("o")
            pending       = $total
            sizeMB        = $sizeMB
            absorbed      = $absorbed
            absorptionPct = $pct
            suggestions   = @(
                "A: Absorber $total documentos ligeros (${sizeMB} MB) al Archivo Historico EAR.",
                "B: Priorizar JSON de inteligencia B2B y leads antes que notas sueltas.",
                "C: Mover a H:\ARCHIVO_HISTORICO_EAR\ABSORBIDOS_COMPLETOS\ y liberar el repo Git."
            )
            sample        = @($all | Select-Object -First 8 @{ n = 'path'; e = { $_.FullName } }, @{ n = 'bytes'; e = { $_.Length } })
        }
        Write-HashJson $result
    }

    "absorb" {
        $targets = @()
        if ($Paths.Count -gt 0) {
            foreach ($p in $Paths) {
                if (Test-Path -LiteralPath $p -PathType Leaf) {
                    $targets += Get-Item -LiteralPath $p
                }
            }
        }
        else {
            $targets = Get-PendingFiles
        }

        if ($targets.Count -eq 0) {
            $result = [ordered]@{
                action   = "absorb"
                ts       = (Get-Date).ToString("o")
                moved    = 0
                failed   = 0
                status   = "idle"
                message  = "No hay documentos pendientes para absorber."
                destRoot = $destRoot
            }
            Write-HashJson $result
            return
        }

        $moved = 0
        $failed = 0
        $errors = @()

        foreach ($file in $targets) {
            try {
                $rel = $file.FullName.Substring(2) -replace '[\\/:*?"<>|]', '_'
                $destPath = Join-Path $destRoot $rel
                $destDir = Split-Path $destPath -Parent
                if (-not (Test-Path $destDir)) {
                    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
                }
                # Evitar colisión de nombres
                if (Test-Path -LiteralPath $destPath) {
                    $stamp = Get-Date -Format "yyyyMMddHHmmss"
                    $destPath = Join-Path $destDir ("$stamp`_" + (Split-Path $destPath -Leaf))
                }
                Move-Item -LiteralPath $file.FullName -Destination $destPath -Force
                $moved++
            }
            catch {
                $failed++
                $errors += $_.Exception.Message
            }
        }

        $result = [ordered]@{
            action   = "absorb"
            ts       = (Get-Date).ToString("o")
            moved    = $moved
            failed   = $failed
            status   = if ($failed -gt 0) { "partial" } else { "ok" }
            message  = "Se movieron $moved documentos a $destRoot"
            destRoot = $destRoot
            errors   = @($errors | Select-Object -First 5)
        }
        Write-HashJson $result
    }
}