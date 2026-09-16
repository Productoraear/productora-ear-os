# scripts/audit_providers_sync.ps1
# Auditoría de sincronización de proveedores vs manifest.json
$ErrorActionPreference = 'Stop'

$base = Join-Path $PSScriptRoot '..\public\data\providers'
$manifestPath = Join-Path $base 'manifest.json'

if (-not (Test-Path $manifestPath)) {
    Write-Output "ERROR: no existe manifest.json en $base"
    exit 1
}

$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json

Write-Output "=== ARCHIVOS REALES EN public/data/providers/ ==="
Get-ChildItem $base -Filter '*.json' | ForEach-Object {
    try {
        $j = Get-Content $_.FullName -Raw | ConvertFrom-Json
        $c = if ($j -is [System.Array]) { $j.Count } else { 1 }
        "{0,-24} {1,8} registros" -f $_.Name, $c
    } catch {
        "{0,-24} PARSER_ERROR: {1}" -f $_.Name, $_.Exception.Message
    }
}

Write-Output ""
Write-Output "=== MANIFEST DECLARADO ==="
$manifest.PSObject.Properties | ForEach-Object {
    "{0,-24} {1,8} registros   (sizeKB={2})" -f $_.Name, $_.Value.count, $_.Value.sizeKB
}

Write-Output ""
Write-Output "=== DISCREPANCIAS (nombre en manifest sin archivo, o viceversa) ==="
$manifestKeys = @($manifest.PSObject.Properties.Name)
$fileKeys = @(Get-ChildItem $base -Filter '*.json' | ForEach-Object { [IO.Path]::GetFileNameWithoutExtension($_.Name) })

$expectedFiles = $manifestKeys | ForEach-Object { "$_.json" }
$actualFiles = @(Get-ChildItem $base -Filter '*.json' | ForEach-Object { $_.Name })

Write-Output "-- En manifest pero sin archivo fisico:"
$expectedFiles | Where-Object { $actualFiles -notcontains $_ } | ForEach-Object { "   FALTA: $_" }

Write-Output "-- Archivo fisico no declarado en manifest:"
$actualFiles | Where-Object { $expectedFiles -notcontains $_ } | ForEach-Object { "   HUERFANO: $_" }