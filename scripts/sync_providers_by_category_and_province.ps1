# scripts/sync_providers_by_category_and_province.ps1
# Sincronización de proveedores por categoría y provincia en España

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

# Sincronización de proveedores por categoría y provincia
$provinces = @('madrid', 'barcelona', 'sevilla', 'valencia', 'zaragoza', 'málaga', 'murcia', 'palma_de_mallorca', 'las_palmas_de_gran_canaria', 'bilbao', 'vigo', 'santander', 'lugo', 'lleida', 'tarragona', 'oviedo', 'pamplona', 'san_sebastián', 'zamora', 'burgos', 'leon', 'palencia', 'salamanca', 'segovia', 'valladolid', 'soria', 'jaén', 'córdoba', 'almería', 'granada', 'huelva', 'cáceres', 'badajoz', 'lugo', 'ourense', 'pontevedra', 'castellón_de_la_plana', 'alicante', 'elche_de_la_sierra', 'valladolid', 'zamora', 'soria', 'jaén', 'córdoba', 'almería', 'granada', 'huelva', 'cáceres', 'badajoz', 'lugo', 'ourense', 'pontevedra')
$categories = @('casa_de_eventos', 'residencia', 'centro_senior')

foreach ($province in $provinces) {
    foreach ($category in $categories) {
        $filePath = Join-Path $base "$province-$category.json"
        if (Test-Path $filePath) {
            $providers = Get-Content $filePath -Raw | ConvertFrom-Json
            if (-not $manifest."$province-$category") {
                $manifest | Add-Member -MemberType NoteProperty -Name "$province-$category" -Value @{
                    count = $providers.Count
                    sizeKB = (Get-Item $filePath).Length / 1KB
                }
            } else {
                $manifest."$province-$category".count = $providers.Count
                $manifest."$province-$category".sizeKB = (Get-Item $filePath).Length / 1KB
            }
        } else {
            if ($manifest."$province-$category") {
                $manifest.PSObject.Properties.Remove("$province-$category")
            }
        }
    }
}

# Guardar el manifest actualizado
$manifest | ConvertTo-Json -Depth 100 | Set-Content $manifestPath

Write-Output "=== MANIFEST ACTUALIZADO ==="
$manifest.PSObject.Properties | ForEach-Object {
    "{0,-24} {1,8} registros   (sizeKB={2})" -f $_.Name, $_.Value.count, $_.Value.sizeKB
}