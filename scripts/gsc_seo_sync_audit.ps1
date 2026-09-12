# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# AUDITORÍA SITEMAP / GSC / DOMINIOS — Resumen sintético (<300 tokens)
# Entradas: ZIPs de Google Search Console (Coverage + Performance)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zips = @(
  'H:\https___www.productoraear.com_-Coverage-2026-09-07.zip',
  'H:\https___www.productoraear.com_-Performance-on-Search-2026-09-12.zip'
)

foreach ($z in $zips) {
  Write-Output "━━━━ ZIP: $z"
  if (-not (Test-Path -LiteralPath $z)) {
    Write-Output '  NO EXISTE'
    continue
  }

  $archive = [System.IO.Compression.ZipFile]::OpenRead($z)
  $entries = $archive.Entries
  Write-Output ("  Total entradas: " + $entries.Count)

  foreach ($e in $entries) {
    Write-Output ("  - " + $e.FullName + "  [" + $e.Length + " bytes]")
  }

  # Leer primer CSV/TSV y resumir columnas + nº filas + cabecera
  foreach ($e in $entries) {
    if ($e.FullName -match '\.(csv|tsv|txt)$') {
      Write-Output ("  ── ARCHIVO DATOS: " + $e.FullName)
      $reader = New-Object System.IO.StreamReader($e.Open())
      try {
        $header = $reader.ReadLine()
        Write-Output ("  HEADER: " + $header)
        $count = 0
        $sample = @()
        while (($null -ne ($line = $reader.ReadLine())) -and $count -lt 200000) {
          $count++
          if ($sample.Count -lt 3) { $sample += $line }
        }
        Write-Output ("  FILAS_DATOS: " + $count)
        foreach ($s in $sample) {
          $short = $s
          if ($short.Length -gt 220) { $short = $short.Substring(0,220) + '…' }
          Write-Output ("  SAMPLE: " + $short)
        }
      } finally {
        $reader.Close()
      }
    }
  }

  $archive.Dispose()
}