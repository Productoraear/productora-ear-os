# EAR OS - LANZADOR VISUAL DE CONFIGURACION DJ v4.11
# Abre el Editor Visual S-Class en el navegador predeterminado y conecta con ear-dj-config.json

$ErrorActionPreference = "SilentlyContinue"

$PORT = 3008
$URL = "http://127.0.0.1:$PORT"
$SERVER_SCRIPT = Join-Path $PSScriptRoot "config_server.js"

Write-Host ""
Write-Host "==================================================================" -ForegroundColor DarkYellow
Write-Host "  EAR OS - APERTURA DE INTERFAZ VISUAL DE CONFIGURACION DJ" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor DarkYellow
Write-Host ""

# Verificar si el servidor local ya responde
$serverRunning = $false
try {
    $test = Invoke-WebRequest -Uri "$URL/api/config" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
    if ($test.StatusCode -eq 200 -or $test.StatusCode -eq 404) {
        $serverRunning = $true
    }
} catch {
    $serverRunning = $false
}

if (-not $serverRunning) {
    Write-Host "[1/2] Iniciando micro-servidor local de configuracion (Node.js)..." -ForegroundColor Cyan
    Start-Process -FilePath "node" -ArgumentList "`"$SERVER_SCRIPT`"" -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
    Start-Sleep -Seconds 1
} else {
    Write-Host "[1/2] Servidor local ya activo en $URL" -ForegroundColor Green
}

Write-Host "[2/2] Abriendo interfaz en el navegador: $URL" -ForegroundColor Cyan
Start-Process $URL

Write-Host ""
Write-Host "  [OK] Interfaz visual abierta con exito." -ForegroundColor Green
Write-Host "  Edita tus datos y pulsa 'Guardar Configuracion S-Class'." -ForegroundColor DarkGray
Write-Host ""
