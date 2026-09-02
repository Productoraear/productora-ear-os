# ==============================================================================
# RASTREADOR FORENSE MULTI-DISCO DE ALTA VELOCIDAD (PILOTO NAVALCARNERO)
# ==============================================================================

$ErrorActionPreference = 'SilentlyContinue'

Write-Host "======================================================================" -ForegroundColor Magenta
Write-Host "   ESCANEANDO DISCOS EN BUSCA DE HERRAMIENTAS Y PARAMETROS NAVALCARNERO" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "======================================================================" -ForegroundColor Magenta

# Directorios de prospeccion prioritarios
$SearchPaths = @(
    "H:\EAR_OS_V2",
    "H:\EAR_ABSORBED_VAULT",
    "H:\AI_MODELS_HUB",
    "G:\",
    "D:\",
    "$env:USERPROFILE\Desktop",
    "$env:USERPROFILE\Documents",
    "$env:USERPROFILE\Downloads"
)

# Extensiones relevantes para herramientas y datos
$TargetExtensions = @(".ts", ".tsx", ".json", ".js", ".py", ".md", ".env", ".txt", ".sql")

# Terminos clave de busqueda
$KeyPatterns = @("navalcarnero", "mentrida", "ayuntamiento", "b2g", "festejos", "licitacion")

$Results = [System.Collections.Generic.List[PSObject]]::new()

foreach ($path in $SearchPaths) {
    if (Test-Path $path) {
        Write-Host ">> Inspeccionando unidad/directorio: $path ..." -ForegroundColor Cyan
        
        Get-ChildItem -Path $path -Recurse -File -ErrorAction SilentlyContinue | Where-Object {
            $_.FullName -notmatch "node_modules" -and
            $_.FullName -notmatch "\.next" -and
            $_.FullName -notmatch "\.git" -and
            $_.FullName -notmatch "AppData" -and
            $_.FullName -notmatch "\`$Recycle\.Bin" -and
            $_.FullName -notmatch "System Volume Information" -and
            $TargetExtensions -contains $_.Extension
        } | ForEach-Object {
            $file = $_
            $nameMatch = $false
            
            # 1. Comprobacion por nombre de archivo
            foreach ($pattern in $KeyPatterns) {
                if ($file.Name -like "*$pattern*") {
                    $nameMatch = $true
                    $Results.Add([PSCustomObject]@{
                        Tipo = "Coincidencia de Nombre"
                        Patron = $pattern
                        Archivo = $file.Name
                        Ruta = $file.FullName
                        TamanoKB = [Math]::Round($file.Length / 1KB, 2)
                        Modificado = $file.LastWriteTime
                    })
                    break
                }
            }
            
            # 2. Comprobacion de contenido (solo en archivos menores a 2MB)
            if (-not $nameMatch -and $file.Length -lt 2MB) {
                $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
                if ($content -match "navalcarnero" -or $content -match "Navalcarnero") {
                    $Results.Add([PSCustomObject]@{
                        Tipo = "Contenido Interno"
                        Patron = "Navalcarnero"
                        Archivo = $file.Name
                        Ruta = $file.FullName
                        TamanoKB = [Math]::Round($file.Length / 1KB, 2)
                        Modificado = $file.LastWriteTime
                    })
                }
            }
        }
    }
}

Write-Host "`n======================================================================" -ForegroundColor Green
Write-Host "   RESULTADOS FORENSES OBTENIDOS: $($Results.Count) ELEMENTOS LOCALIZADOS" -ForegroundColor Black -BackgroundColor Green
Write-Host "======================================================================" -ForegroundColor Green

if ($Results.Count -gt 0) {
    $Results | Select-Object Tipo, Archivo, TamanoKB, Ruta | Format-Table -AutoSize
    
    $ReportPath = "H:\EAR_OS_V2\EAR_OS_V2\auditoria_navalcarnero.json"
    $Results | ConvertTo-Json -Depth 4 | Set-Content -Path $ReportPath -Encoding UTF8
    Write-Host ">> [INFO] Informe consolidado exportado para Cline en:" -ForegroundColor Cyan
    Write-Host "   $ReportPath" -ForegroundColor Yellow
} else {
    Write-Host "[!] No se localizaron archivos coincidentes con los patrones solicitados." -ForegroundColor Yellow
}