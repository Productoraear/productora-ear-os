# scripts/audit_srcdata_providers.ps1
# Auditoría de fuentes de datos de proveedores en src/data
$ErrorActionPreference = 'Stop'

$root = Join-Path $PSScriptRoot '..\src\data'

Write-Output "=== ARCHIVOS DE PROVEEDORES EN src/data (recursivo) ==="
Get-ChildItem $root -Recurse -File -Filter *.json |
    Where-Object { $_.Name -match 'provider|vendor|bodas|proveedor|celebrent' } |
    ForEach-Object {
        $lenKB = [Math]::Round($_.Length / 1KB, 1)
        "{0,10} KB  {1}" -f $lenKB, $_.FullName
    }

Write-Output ""
Write-Output "=== BASES MAESTRAS CLAVE (conteo de registros) ==="
$keyFiles = @(
    'src\data\all_providers_database.json',
    'src\data\bodas-vendors-harvested.json',
    'src\data\vampirized-providers-deep-sclass.json',
    'src\data\vampirized-providers-synchronized.json',
    'src\data\celebrents_providers.json'
)

foreach ($rel in $keyFiles) {
    $full = Join-Path (Split-Path $PSScriptRoot -Parent) $rel
    if (-not (Test-Path $full)) {
        "   FALTA: $rel"
        continue
    }
    try {
        $j = Get-Content $full -Raw | ConvertFrom-Json
        $c = if ($j -is [System.Array]) { $j.Count } else { 1 }
        "{0,8} registros  {1}" -f $c, $rel
    } catch {
        "   ERROR_LEER: $rel -> $($_.Exception.Message)"
    }
}