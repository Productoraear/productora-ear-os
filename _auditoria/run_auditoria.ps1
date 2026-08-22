# run_auditoria.ps1
# Genera el archivo baseline_build.md con información detallada del build

$OUT = $PSScriptRoot

# GUARDIÁN DE DISCO al inicio del script
$guardianDeDisco = Get-PSDrive H, C, D | Select Name, @{n='Libre_GB';e={[math]::Round($_.Free/1GB,1)}}
Add-Content -Path (Join-Path $OUT "inventario_resumen.md") -Value "`n## GUARDIÁN DE DISCO`n"
$guardianDeDisco | ForEach-Object { Add-Content -Path (Join-Path $OUT "inventario_resumen.md") -Value "- **$($_.Name)**: $($_.Libre_GB) GB libres" }

# Crear directorio H:\EAR_OS_INTEL_BUNKER\_catalogo\ si no existe
if (-not (Test-Path -Path "H:\EAR_OS_INTEL_BUNKER\_catalogo\")) {
    New-Item -ItemType Directory -Force -Path "H:\EAR_OS_INTEL_BUNKER\_catalogo\"
}
if ($guardianDeDisco | Where-Object { $_.Name -eq "H" -and $_.Libre_GB -lt 20 }) {
    Write-Error "La unidad H: tiene menos de 20 GB libres. Deteniendo la operación."
    exit 1}

# Pre-vuelo al inicio del script
$rama = (git branch --show-current).Trim()
if ($rama -ne "consolidacion-aditiva") { Write-Error "Rama incorrecta: $rama"; exit 1 }

# Obtener datos de la cabecera
$fecha = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$hashCommit = (git rev-parse HEAD).Trim()
$tscVersion = & npm list typescript --depth=0 | Select-String -Pattern "(?<=typescript@)\d+\.\d+\.\d+" | ForEach-Object { $_.Matches.Value }

# Ejecutar tsc y capturar la salida
$outputTsc = npx tsc --noEmit 2>&1 | Out-String
$tscExit = $LASTEXITCODE

# Resumen de errores
$errorCounts = @{}
$lines = $outputTsc -split "`n"
foreach ($line in $lines) {
    if ($line -match "TS\d+") {
        $errorCode = $matches[0]
        if (-not $errorCounts.ContainsKey($errorCode)) {
            $errorCounts[$errorCode] = 1
        } else {
            $errorCounts[$errorCode]++
        }
    }
}

# Generar el veredicto por exit code, no por regex
$verdict = if ($tscExit -eq 0) { "COMPILA (0 errores)" } else { "NO COMPILA (exit code $tscExit)" }

# Escribir el archivo baseline_build.md
$baselineContent = @"
## Informe de Build

**Fecha:** $fecha  
**Rama:** $rama  
**Hash Commit:** $hashCommit  
**Versión TypeScript:** $tscVersion  

### Salida de npx tsc --noEmit

$outputTsc

### Resumen de Errores

"@

foreach ($key in $errorCounts.Keys) {
    $baselineContent += "$key: $($errorCounts[$key])`n"
}

$baselineContent += @"

## Veredicto

**Resultado del Build:** $verdict
"@

Set-Content -Path (Join-Path $OUT "baseline_build.md") -Value $baselineContent

Write-Output "Informe de build generado en _auditoria/baseline_build.md"

# INVENTARIO (añadir al mismo script)

$pathsToCheck = @(
    "D:\",
    "C:\ruta1",
    "C:\ruta2",
    "C:\ruta3",
    "C:\ruta4",
    "C:\ruta5",
    "C:\ruta6",
    "C:\ruta7"
)

$rutasNoExistentes = @()

foreach ($path in $pathsToCheck) {
    if (-not (Test-Path -Path $path)) {
        $rutasNoExistentes += $path
        continue
    }

    $files = Get-ChildItem -Recurse -File -Path $path | Where-Object { $_.FullName -notmatch "(node_modules|\.git|\.next|dist|build|\.obsidian)" }
    $inventarioData = @()
    $assetsVisualesData = @()

    $fileCount = 0
    $totalFiles = $files.Count

    foreach ($file in $files) {
        $extension = [System.IO.Path]::GetExtension($file.FullName)
        if ($extension -in @(".ts", ".tsx", ".js", ".jsx", ".ps1", ".prisma", ".json", ".mjs")) {
            $hashSha256 = Get-FileHash -Path $file.FullName -Algorithm SHA256 | Select-Object -ExpandProperty Hash
            $inventarioData += [PSCustomObject]@{
                ruta_completa    = $file.FullName
                extension        = $extension
                tamano_bytes     = $file.Length
                fecha_modificacion = $file.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
                hash_sha256      = $hashSha256
                origen_ruta      = $path
            }
        } elseif ($extension -in @(".png", ".jpg", ".jpeg")) {
            $imageInfo = ""
            try {
                $image = [System.Drawing.Image]::FromFile($file.FullName)
                $imageInfo = " (${image.Width}x${image.Height})"
                $image.Dispose()
            } catch {
                # No se pudo obtener información de la imagen
            }
            $assetsVisualesData += "$($file.FullName) | $($file.Length) bytes | $($file.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss"))$imageInfo"
        }

        $fileCount++
        if ($fileCount % 500 -eq 0) {
            Write-Progress -Activity "Procesando archivos" -Status "$fileCount de $totalFiles procesados" -PercentComplete (($fileCount / $totalFiles) * 100)
$inventarioData | Export-Csv -Path "H:\EAR_OS_INTEL_BUNKER\_catalogo\inventario.csv" -NoTypeInformation -Append
        }
    }

    if ($inventarioData.Count % 500 -ne 0) {
        $inventarioData | Export-Csv -Path (Join-Path $OUT "inventario.csv") -NoTypeInformation -Append
    }
}

$inventarioCsvContent = Import-Csv -Path (Join-Path $OUT "inventario.csv")

# Agrupar por hash_sha256 para duplicados exactos
$duplicadosExactos = @{}
foreach ($row in $inventarioCsvContent) {
    if (-not $duplicadosExactos.ContainsKey($row.hash_sha256)) {
        $duplicadosExactos[$row.hash_sha256] = @()
    }
    $duplicadosExactos[$row.hash_sha256] += $row.ruta_completa
}

# Agrupar por nombre de archivo con >1 hash distinto para posibles duplicados
$posiblesDuplicados = @{}
foreach ($row in $inventarioCsvContent) {
    $fileName = [System.IO.Path]::GetFileName($row.ruta_completa)
    if (-not $posiblesDuplicados.ContainsKey($fileName)) {
        $posiblesDuplicados[$fileName] = @()
    }
    $posiblesDuplicados[$fileName] += $row.hash_sha256
}

# Filtrar posibles duplicados a solo aquellos con más de un hash distinto
$posiblesDuplicados = $posiblesDuplicados.GetEnumerator() | Where-Object { $_.Value.Count -gt 1 } | ForEach-Object {
    [PSCustomObject]@{
        nombre_archivo = $_.Key
        hashes         = $_.Value -join ", "
    }
}

# Generar inventario_resumen.md
$inventarioResumenContent = @"
## Resumen de Inventario

### Archivos por Ruta

"@

foreach ($path in $pathsToCheck) {
    $rutaFilesCount = $files | Where-Object { $_.FullName -like "$path\*" } | Measure-Object | Select-Object -ExpandProperty Count
    $inventarioResumenContent += "- **$path**: $rutaFilesCount archivos`n"
}

$totalArchivos = $files.Count
$duplicadosExactosCount = $duplicadosExactos.GetEnumerator().Count
$posiblesDuplicadosCount = $posiblesDuplicados.Count

$inventarioResumenContent += @"

### Totales

- **Total de archivos**: $totalArchivos
- **Grupos de duplicados exactos**: $duplicadosExactosCount grupos con $($duplicadosExactos.Values | Measure-Object -Sum).Sum archivos implicados

## DUPLICADOS EXACTOS

"@

foreach ($key in $duplicadosExactos.Keys) {
    if ($duplicadosExactos[$key].Count -gt 1) {
        $inventarioResumenContent += "- **Hash**: $key`n"
        foreach ($ruta in $duplicadosExactos[$key]) {
            $inventarioResumenContent += "  - $ruta`n"
        }
    }
}

$inventarioResumenContent += @"

## POSIBLES DUPLICADOS

"@

foreach ($item in $posiblesDuplicados) {
    $inventarioResumenContent += "- **Archivo**: $($item.nombre_archivo)`n"
    $inventarioResumenContent += "  - Hashes: $($item.hashes)`n"
}

$inventarioResumenContent += @"

## Veredicto del Baseline

**Resultado del Build:** $verdict
"@

# Escribir inventario_visuales_raw.md si hay datos de imágenes
if ($assetsVisualesData.Count -gt 0) {
    Set-Content -Path (Join-Path $OUT "assets_visuales_raw.md") -Value ($assetsVisualesData -join "`n")
}

Set-Content -Path (Join-Path $OUT "inventario_resumen.md") -Value $inventarioResumenContent

Write-Output "Inventario generado en _auditoria/inventario.csv, inventario_resumen.md y assets_visuales_raw.md"

# Registrar rutas no existentes si las hay
if ($rutasNoExistentes.Count -gt 0) {
    Add-Content -Path (Join-Path $OUT "inventario_resumen.md") -Value "`n## Rutas No Existentes`n"
    foreach ($ruta in $rutasNoExistentes) {
        Add-Content -Path (Join-Path $OUT "inventario_resumen.md") -Value "- **$ruta** no existe."
    }
}