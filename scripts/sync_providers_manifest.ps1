# scripts/sync_providers_manifest.ps1
# ==============================================================================
# SINCRONIZADOR SSOT DEL MANIFIESTO DE PROVEEDORES (EDGE CDN)
# Recalcula public/data/providers/manifest.json a partir de los archivos reales
# (*.json, excluyendo manifest.json). Incluye all_featured y senior_care.
# ==============================================================================
$ErrorActionPreference = 'Stop'

$base = Join-Path $PSScriptRoot '..\public\data\providers'
$manifestPath = Join-Path $base 'manifest.json'

if (-not (Test-Path $base)) {
    Write-Error "No existe el directorio de proveedores: $base"
    exit 1
}

$manifest = [ordered]@{}

Get-ChildItem $base -Filter *.json |
    Where-Object { $_.Name -ne 'manifest.json' } |
    ForEach-Object {
        try {
            $j = Get-Content $_.FullName -Raw | ConvertFrom-Json
            $count = if ($j -is [System.Array]) { $j.Count } else { 1 }
        } catch {
            Write-Warning "No se pudo parsear $($_.Name): $($_.Exception.Message)"
            $count = 0
        }
        $sizeKB = [Math]::Round($_.Length / 1KB, 1)
        $key = [IO.Path]::GetFileNameWithoutExtension($_.Name)
        $manifest[$key] = [ordered]@{
            count  = $count
            sizeKB = "$sizeKB"
        }
    }

$manifest | ConvertTo-Json -Depth 3 | Out-File -FilePath $manifestPath -Encoding utf8

Write-Output "manifest.json regenerado con $($manifest.Count) particiones:"
$manifest.GetEnumerator() | ForEach-Object {
    "{0,-16} {1,7} registros  ({2} KB)" -f $_.Key, $_.Value.count, $_.Value.sizeKB
}