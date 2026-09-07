# ==============================================================================
# EXTRACTOR FORENSE Y AUTOPURGA INMEDIATA DE GOOGLE SEARCH CONSOLE - EAR OS V2
# ==============================================================================
$ErrorActionPreference = 'SilentlyContinue'

$ZipPath = "D:\Migracion_C\M2-W10\Downloads\https___www.productoraear.com_-Coverage-2026-09-07.zip"
$ExtractPath = "D:\Migracion_C\M2-W10\Downloads\GSC_Extracted"

if (Test-Path $ZipPath) {
    Write-Host ">> Descomprimiendo reporte de cobertura de GSC..." -ForegroundColor Cyan
    if (-not (Test-Path $ExtractPath)) { New-Item -ItemType Directory -Path $ExtractPath -Force | Out-Null }
    Expand-Archive -Path $ZipPath -DestinationPath $ExtractPath -Force
    
    # Analizar y mostrar las URLs afectadas por los errores detectados
    Get-ChildItem -Path $ExtractPath -Recurse -Filter "*.csv" | ForEach-Object {
        Write-Host ">> Analizando informe: $($_.Name)" -ForegroundColor Green
        Import-Csv $_.FullName | Select-Object -First 15 | Format-Table -AutoSize
    }

    # EJECUCIÓN DEL MANDATO EXTREMO: Eliminación inmediata y segura del ZIP procesado
    Remove-Item -Path $ZipPath -Force
    Write-Host ">> [PURGA EXECUTED] El archivo ZIP de origen ha sido eliminado permanentemente de la ruta de descargas." -ForegroundColor Yellow
} else {
    Write-Host ">> [!] El archivo ZIP no se encuentra en la ruta especificada. Verifique si ya fue purgado anteriormente." -ForegroundColor Red
}
