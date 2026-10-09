# Previsualiza Metadatos.csv y las 3 primeras lineas de cada Tabla.csv dentro de los ZIPs de GSC.
# Uso: pwsh -NoProfile -File scripts/preview_gsc_zips.ps1
Add-Type -AssemblyName System.IO.Compression.FileSystem
$ErrorActionPreference = 'Stop'

function Read-ZipEntryLines([System.IO.Compression.ZipArchive]$zip, [string]$name, [int]$maxLines) {
    $entry = $zip.Entries | Where-Object { $_.FullName -eq $name }
    if (-not $entry) { return @() }
    $reader = New-Object System.IO.StreamReader($entry.Open(), [System.Text.Encoding]::UTF8)
    $out = @()
    $i = 0
    try {
        while ($null -ne ($line = $reader.ReadLine()) -and $i -lt $maxLines) {
            $out += $line
            $i++
        }
    } finally {
        $reader.Dispose()
    }
    return $out
}

$src = 'D:\Migracion_C\M2-W10\Downloads'
$files = Get-ChildItem -LiteralPath $src -Filter 'https___www.productoraear.com_-Coverage-*.zip' | Sort-Object Name

foreach ($f in $files) {
    Write-Output ("")
    Write-Output ("########## " + $f.Name + " ##########")
    $zip = [System.IO.Compression.ZipFile]::OpenRead($f.FullName)
    try {
        $metaLines = Read-ZipEntryLines $zip 'Metadatos.csv' 10
        Write-Output ("--- Metadatos.csv ---")
        $metaLines | ForEach-Object { Write-Output $_ }

        $tabLines = Read-ZipEntryLines $zip 'Tabla.csv' 3
        Write-Output ("--- Tabla.csv (cabecera + 2 filas) ---")
        $tabLines | ForEach-Object { Write-Output $_ }
    } finally {
        $zip.Dispose()
    }
}