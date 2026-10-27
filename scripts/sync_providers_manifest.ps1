#Requires -Version 5.1
<#
.SYNOPSIS
    Delegador del pipeline Edge VERAZ (CERO FACHADAS).

.DESCRIPTION
    La generación canónica del manifest y de las particiones vive en un ÚNICO
    motor: `scripts/build_lean_verified_edge.cjs` (chunking < 1 MB, verified
    solo con teléfono real atribuible, GPS verificado por JSON-LD).

    Este script existe por compatibilidad con automatizaciones previas y
    garantiza que jamás se regenere el manifest con conteos truncados
    (particiones chunked) ni con cifras hardcodeadas.

.PARAMETER Check
    Solo audita (no escribe nada). Exit 1 si el escaparate no es veraz.

.EXAMPLE
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sync_providers_manifest.ps1
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sync_providers_manifest.ps1 -Check
#>
[CmdletBinding()]
param(
    [switch]$Check,
    [switch]$AlignCanonical
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Push-Location $RepoRoot
try {
    if (-not $Check) {
        Write-Output '[EDGE] Regenerando particiones y manifest desde el SSOT real...'
        node 'scripts/build_lean_verified_edge.cjs'
        if ($LASTEXITCODE -ne 0) {
            Write-Error "build_lean_verified_edge.cjs falló con Exit Code $LASTEXITCODE"
            exit $LASTEXITCODE
        }
    }

    if ($AlignCanonical -and -not $Check) {
        Write-Output '[EDGE] providers_canonical.json se genera dentro del pipeline (muestra veraz).'
    }

    Write-Output '[EDGE] Auditando integridad del escaparate...'
    node 'scripts/verify_provider_edge_truth.cjs'
    $exit = $LASTEXITCODE
    if ($exit -ne 0) {
        Write-Error "verify_provider_edge_truth.cjs detectó fachadas (Exit Code $exit)"
        exit $exit
    }

    Write-Output 'SSOT_SYNC_OK'
    exit 0
}
finally {
    Pop-Location
}
