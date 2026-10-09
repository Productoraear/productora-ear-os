# Inspector de ZIPs de Google Search Console (Coverage Validation / Drilldown)
# Uso: pwsh -NoProfile -File scripts/inspect_gsc_zips.ps1
Add-Type -AssemblyName System.IO.Compression.FileSystem
$ErrorActionPreference = 'Stop'

$src = 'D:\Migracion_C\M2-W10\Downloads'
$files = Get-ChildItem -LiteralPath $src -Filter 'https___www.productoraear.com_-Coverage-*.zip' | Sort-Object Name

foreach ($f in $files) {
    Write-Output ("=== " + $f.Name + "  (" + $f.Length + " bytes) ===")
    $zip = [System.IO.Compression.ZipFile]::OpenRead($f.FullName)
    foreach ($e in $zip.Entries) {
        Write-Output ("  " + $e.FullName + "  (" + $e.Length + " bytes)")
    }
    $zip.Dispose()
}