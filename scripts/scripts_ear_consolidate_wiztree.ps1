<#
.SYNOPSIS
    EAR Vault - Consolidador Masivo de Exportaciones MFT/WizTree (Multi-Unidad)
.DESCRIPTION
    ¿PARA QUÉ SIRVE?:
    Este script busca automáticamente todos los archivos CSV exportados por WizTree 
    (en H:\WizTree_* o cualquier subcarpeta) que contienen los volcados MFT de todo el PC 
    (unidades C:, D:, E:, G:, H:, J:, K:, L:, etc.). 
    
    Procesa masivamente por streaming cada CSV, elimina duplicados, filtra la basura del sistema 
    (node_modules, Windows, AppData, etc.), y consolida un único archivo maestro global optimizado:
    H:\EAR_GOLDEN_INDEX.csv con todos los activos de oro del PC entero.
.NOTES
    Ejecutar desde PowerShell 7 en la raíz del proyecto.
#>

$ErrorActionPreference = 'Stop'
Clear-Host

$OutputCsv = "H:\EAR_GOLDEN_INDEX.csv"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  EAR VAULT — CONSOLIDADOR OMNI-DRIVE DE WIZTREE (MFT STREAMING)      " -ForegroundColor Black -BackgroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# 1. Buscar todos los CSVs de WizTree en H:\ (incluyendo las carpetas WizTree_*)
$WizTreeCsvs = Get-ChildItem -Path "H:\" -Filter "*.csv" -Recurse | Where-Object { $_.FullName -like "*WizTree*" -or $_.Name -like "*WizTree*" -or $_.FullName -like "*RAW*" }

if ($WizTreeCsvs.Count -eq 0) {
    # Fallback: buscar cualquier CSV pesado en H:\
    $WizTreeCsvs = Get-ChildItem -Path "H:\" -Filter "*.csv" -Recurse | Sort-Object Length -Descending
}

Write-Host ">> Archivos CSV de inventario detectados: $($WizTreeCsvs.Count)" -ForegroundColor Yellow
foreach ($csv in $WizTreeCsvs) {
    Write-Host "   - $($csv.FullName) ($([Math]::Round($csv.Length/1MB, 2)) MB)" -ForegroundColor DarkGray
}

if ($WizTreeCsvs.Count -eq 0) {
    throw "[ERROR CRÍTICO] No se encontró ningún archivo CSV de inventario en H:\"
}

$TargetExtensions = @(".ts", ".tsx", ".json", ".md", ".sql", ".txt", ".docx", ".pdf", ".xmind", ".csv")
$ExcludePatterns = @(
    "\node_modules\", "\.next\", "\.git\", "\$RECYCLE.BIN\", 
    "\AI_MODELS_HUB\", "\AppData\", "\Windows\", "\Cache\", 
    "\dist\", "\build\", "\.vscode\", "\PerfLogs\"
)

# Inicializar archivo de salida unificado
$Writer = New-Object System.IO.StreamWriter($OutputCsv, $false, [System.Text.Encoding]::UTF8)
$Writer.WriteLine("Ruta,TamanoBytes,TamanoKB,Modificado,Extension")

$TotalFilasGlobal = 0
$FilasOroGlobal   = 0
$StatsGlobal      = @{}
foreach ($ext in $TargetExtensions) { $StatsGlobal[$ext] = 0 }

# Usar un HashSet para evitar duplicados absolutos de rutas en diferentes escaneos
$SeenPaths = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

$sw = [System.Diagnostics.Stopwatch]::StartNew()

foreach ($csvFile in $WizTreeCsvs) {
    Write-Host "`n>> Procesando streaming de: $($csvFile.Name)..." -ForegroundColor Cyan
    $Reader = New-Object System.IO.StreamReader($csvFile.FullName, [System.Text.Encoding]::UTF8)
    
    $localFilas = 0
    # Leer primeras líneas para detectar si es formato WizTree y saltar cabeceras
    $line1 = $Reader.ReadLine()
    $line2 = $Reader.ReadLine()
    
    # Si la segunda línea no parece cabecera de WizTree, retroceder o reajustar
    # El formato WizTree típico tiene: 
    # Línea 1: Generado por WizTree...
    # Línea 2: Nombre del archivo,Tamaño,...
    if ($line2 -notlike "*Nombre del archivo*") {
        # Si el formato es diferente, intentamos procesar desde el principio
        $Reader.Close()
        $Reader = New-Object System.IO.StreamReader($csvFile.FullName, [System.Text.Encoding]::UTF8)
        $null = $Reader.ReadLine() # saltar cabecera genérica
    }

    while (($line = $Reader.ReadLine()) -ne $null) {
        $TotalFilasGlobal++
        $localFilas++
        
        if ($line.StartsWith('"')) {
            $firstQuoteEnd = $line.IndexOf('"', 1)
            if ($firstQuoteEnd -gt 1) {
                $filePath = $line.Substring(1, $firstQuoteEnd - 1)
                
                if ($filePath.EndsWith("\")) { continue }
                if ($SeenPaths.Contains($filePath)) { continue }
                
                $dotIdx = $filePath.LastIndexOf('.')
                if ($dotIdx -gt 0) {
                    $ext = $filePath.Substring($dotIdx).ToLower()
                    
                    if ($StatsGlobal.ContainsKey($ext)) {
                        $skip = $false
                        foreach ($pattern in $ExcludePatterns) {
                            if ($filePath.IndexOf($pattern, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
                                $skip = $true
                                break
                            }
                        }
                        
                        if (-not $skip) {
                            $SeenPaths.Add($filePath) | Out-Null
                            
                            $remainder = $line.Substring($firstQuoteEnd + 2)
                            $parts = $remainder.Split(',')
                            $sizeBytes = $parts[0]
                            $modified  = if ($parts.Length -gt 2) { $parts[2] } else { "N/A" }
                            $sizeKB    = [Math]::Round([int64]$sizeBytes / 1024, 2)
                            
                            $Writer.WriteLine("`"$filePath`",$sizeBytes,$sizeKB,`"$modified`",$ext")
                            $StatsGlobal[$ext]++
                            $FilasOroGlobal++
                        }
                    }
                }
            }
        }
    }
    $Reader.Close()
    Write-Host "   [OK] Filas extraídas de este archivo: $localFilas" -ForegroundColor Green
}

$Writer.Close()
$sw.Stop()

Write-Host "`n======================================================================" -ForegroundColor Green
Write-Host "  CONSOLIDACIÓN OMNI-DRIVE COMPLETADA                                  " -ForegroundColor Black -BackgroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host " Tiempo total: $([Math]::Round($sw.Elapsed.TotalSeconds, 2)) segundos" -ForegroundColor Yellow
Write-Host " Total de registros analizados en crudo: $TotalFilasGlobal" -ForegroundColor Yellow
Write-Host " Activos de Oro únicos consolidados: $FilasOroGlobal" -ForegroundColor Green
Write-Host " Archivo maestro global guardado en: $OutputCsv" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Green

Write-Host "`n--- [DESGLOSE GLOBAL DE ACTIVOS EN TODO EL PC] ---" -ForegroundColor Green
$StatsGlobal.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    [PSCustomObject]@{
        Extension = $_.Key
        Cantidad  = $_.Value
    }
} | Format-Table -AutoSize
