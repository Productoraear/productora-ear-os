# CENTINELA SOBERANO ANTI-VERTEDERO DIGITAL (ESTANDAR PERFIL AZUL)
# Auditor de Anomalias Espaciales y Guardian de Pureza Big Data

param(
    [switch]$AutoTriage = $false
)

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "  CENTINELA SOBERANO ANTI-VERTEDERO DIGITAL -- AUDITORIA HEURISTICA     " -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""

$anomalies = @()

# 1. ZONA DE PELIGRO: ESCRITORIO
$desktopPath = [Environment]::GetFolderPath('Desktop')
Write-Host "[1/4] Auditando Escritorio ($desktopPath)..." -ForegroundColor Yellow
$desktopFiles = Get-ChildItem -Path $desktopPath -File -ErrorAction SilentlyContinue | Where-Object {
    $_.Extension -notin @('.lnk', '.ini')
}
foreach ($f in $desktopFiles) {
    $anomalies += [PSCustomObject]@{
        Origen = "Escritorio"
        Ruta = $f.FullName
        Nombre = $f.Name
        Tipo = $f.Extension
        TamanoKB = [math]::Round($f.Length / 1KB, 1)
        Diagnostico = "Archivo suelto en zona cero"
        DestinoSugerido = "G:\01_TRABAJO\INBOX o G:\02_PERSONAL\INBOX"
    }
}

# 2. ZONA DE PELIGRO: DESCARGAS
$downloadsPath = [Environment]::GetFolderPath('UserProfile') + "\Downloads"
Write-Host "[2/4] Auditando Descargas ($downloadsPath)..." -ForegroundColor Yellow
$downloadFiles = Get-ChildItem -Path $downloadsPath -File -ErrorAction SilentlyContinue
foreach ($f in $downloadFiles) {
    $anomalies += [PSCustomObject]@{
        Origen = "Descargas"
        Ruta = $f.FullName
        Nombre = $f.Name
        Tipo = $f.Extension
        TamanoKB = [math]::Round($f.Length / 1KB, 1)
        Diagnostico = "Archivo acumulado en buffer de descargas"
        DestinoSugerido = "G:\01_TRABAJO\INBOX o G:\02_PERSONAL\INBOX"
    }
}

# 3. ZONA DE ANOMALIA: DISCO H: (FONOGRAMAS Y AUDIO)
Write-Host "[3/4] Auditando Boveda H:\ (Deteccion de documentos en disco de musica)..." -ForegroundColor Yellow
if (Test-Path "H:\") {
    $docExtensions = @('.doc', '.docx', '.pdf', '.txt', '.xlsx', '.csv', '.ppt', '.pptx')
    $misplacedDocs = Get-ChildItem -Path "H:\" -File -ErrorAction SilentlyContinue | Where-Object {
        $_.Extension -in $docExtensions
    }
    foreach ($f in $misplacedDocs) {
        $anomalies += [PSCustomObject]@{
            Origen = "Disco H: (Raiz)"
            Ruta = $f.FullName
            Nombre = $f.Name
            Tipo = $f.Extension
            TamanoKB = [math]::Round($f.Length / 1KB, 1)
            Diagnostico = "Documento ofimatico en disco de musica/fonogramas"
            DestinoSugerido = "G:\01_TRABAJO\03_DOCUMENTACION_EMPRESA"
        }
    }
}

# 4. ZONA DE ANOMALIA: RAIZ DISCO G:
Write-Host "[4/4] Auditando Raiz G:\..." -ForegroundColor Yellow
$looseRootG = Get-ChildItem -Path "G:\" -File -ErrorAction SilentlyContinue | Where-Object {
    $_.Extension -ne '.ini'
}
foreach ($f in $looseRootG) {
    $anomalies += [PSCustomObject]@{
        Origen = "Raiz G:"
        Ruta = $f.FullName
        Nombre = $f.Name
        Tipo = $f.Extension
        TamanoKB = [math]::Round($f.Length / 1KB, 1)
        Diagnostico = "Archivo suelto en raiz del disco de gestion"
        DestinoSugerido = "G:\01_TRABAJO\INBOX"
    }
}

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "  RESULTADO DE LA AUDITORIA FORENSE                                     " -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan

if ($anomalies.Count -eq 0) {
    Write-Host "[PASS] PUREZA 100%: Cero anomalias espaciales detectadas." -ForegroundColor Green
    Write-Host "       El sistema cumple el estandar analitico Perfil Azul." -ForegroundColor Green
} else {
    Write-Host "[WARN] Se detectaron $($anomalies.Count) anomalias espaciales:" -ForegroundColor Red
    $anomalies | Format-Table Origen, Nombre, Tipo, TamanoKB, Diagnostico -AutoSize

    if ($AutoTriage) {
        Write-Host "Iniciando auto-triaje hacia G:\01_TRABAJO\INBOX..." -ForegroundColor Cyan
        foreach ($item in $anomalies) {
            $dest = "G:\01_TRABAJO\INBOX\" + $item.Nombre
            Move-Item -Path $item.Ruta -Destination $dest -Force -ErrorAction SilentlyContinue
            Write-Host "  -> Movido: $($item.Nombre) => G:\01_TRABAJO\INBOX" -ForegroundColor Gray
        }
        Write-Host "Triaje completado. Escritorio y Descargas purificados." -ForegroundColor Green
    } else {
        Write-Host "Para clasificar automaticamente hacia INBOX ejecute:" -ForegroundColor Yellow
        Write-Host "powershell -ExecutionPolicy Bypass -File scripts\centinela_perfil_azul_auditor.ps1 -AutoTriage" -ForegroundColor Yellow
    }
}
Write-Host "========================================================================" -ForegroundColor Cyan
