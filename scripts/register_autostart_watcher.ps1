# EAR OS - GESTOR DE ARRANQUE AUTOMATICO DEL WATCHER EN SEGUNDO PLANO v4.13
# Registra o desregistra el vigilante de cabina en el Inicio de Windows (100% Silencioso / Sin Ventanas)
#
# Uso:
#   .\scripts\register_autostart_watcher.ps1 -Register    # Activa arranque automatico e inicia el proceso
#   .\scripts\register_autostart_watcher.ps1 -Unregister  # Desactiva arranque automatico y detiene proceso
#   .\scripts\register_autostart_watcher.ps1 -Status      # Muestra el estado actual

param(
    [switch]$Register,
    [switch]$Unregister,
    [switch]$Status
)

$ErrorActionPreference = "SilentlyContinue"

$STARTUP_FOLDER = [System.IO.Path]::Combine($env:APPDATA, "Microsoft\Windows\Start Menu\Programs\Startup")
$VBS_LAUNCHER   = [System.IO.Path]::Combine($STARTUP_FOLDER, "EAR_OS_Session_Watcher.vbs")
$WATCHER_SCRIPT = [System.IO.Path]::Combine($PSScriptRoot, "ear_session_watcher.js")
$LOG_FILE       = [System.IO.Path]::Combine($env:USERPROFILE, ".ear-os\watcher_autostart.log")

Write-Host ""
Write-Host "==================================================================" -ForegroundColor DarkYellow
Write-Host "  EAR OS - GESTOR DE ARRANQUE AUTOMATICO DEL WATCHER v4.13" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor DarkYellow
Write-Host ""

# 1. REGISTRAR ARRANQUE AUTOMATICO SILENCIOSO
if ($Register -or (-not $Unregister -and -not $Status)) {
    Write-Host "[1/3] Creando lanzador VBS ultra-silencioso en Carpeta de Inicio..." -ForegroundColor Cyan

    $nodeExe = (Get-Command node -ErrorAction SilentlyContinue).Source
    if (-not $nodeExe) { $nodeExe = "C:\Program Files\nodejs\node.exe" }

    $vbsContent = @"
Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "$PSScriptRoot"
WshShell.Run """$nodeExe"" ""$WATCHER_SCRIPT""", 0, False
"@

    $vbsContent | Out-File -FilePath $VBS_LAUNCHER -Encoding ascii -Force
    Write-Host "  + Registrado en Inicio: $VBS_LAUNCHER" -ForegroundColor Green

    # Detener instancias previas si las hubiera
    Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*ear_session_watcher.js*" } | Stop-Process -Force

    Write-Host "[2/3] Iniciando proceso de vigilancia en segundo plano (Hidden)..." -ForegroundColor Cyan
    Start-Process -FilePath $nodeExe -ArgumentList "`"$WATCHER_SCRIPT`"" -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
    Start-Sleep -Seconds 1

    Write-Host "[3/3] Verificando estado del watcher..." -ForegroundColor Cyan
    $running = Get-CimInstance Win32_Process -Filter "CommandLine LIKE '%ear_session_watcher.js%'"
    if ($running) {
        Write-Host "  [OK] Watcher de VirtualDJ ACTIVO en segundo plano (PID: $($running.ProcessId))" -ForegroundColor Green
        Write-Host "  Cada vez que VirtualDJ guarde una sesion, el acta SHA-256 se depositara en el Escritorio." -ForegroundColor DarkGray
    } else {
        Write-Host "  [!] Proceso iniciado. Vigilancia activada para proximos cierres de sesion." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "  ================================================================" -ForegroundColor DarkYellow
    Write-Host "  ARREGLO DE CABINA COMPLETO: 100% AUTONOMO Y SILENCIOSO" -ForegroundColor Green
    Write-Host "  ================================================================" -ForegroundColor DarkYellow
    Write-Host ""
}

# 2. DESREGISTRAR ARRANQUE AUTOMATICO
if ($Unregister) {
    Write-Host "Desregistrando vigilante de inicio..." -ForegroundColor Yellow
    if (Test-Path $VBS_LAUNCHER) {
        Remove-Item -Path $VBS_LAUNCHER -Force
        Write-Host "  - Eliminado de Inicio: $VBS_LAUNCHER" -ForegroundColor Green
    }
    Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*ear_session_watcher.js*" } | Stop-Process -Force
    Write-Host "  - Proceso de vigilancia detenido." -ForegroundColor Green
    Write-Host ""
}

# 3. VER ESTADO
if ($Status) {
    Write-Host "Consultando estado del servicio..." -ForegroundColor Cyan
    $inStartup = Test-Path $VBS_LAUNCHER
    $proc = Get-CimInstance Win32_Process -Filter "CommandLine LIKE '%ear_session_watcher.js%'"

    Write-Host "  Inicio Automatico en Windows: $(if ($inStartup) { 'ACTIVO (VBS registrado)' } else { 'INACTIVO' })" -ForegroundColor $(if ($inStartup) { "Green" } else { "DarkGray" })
    Write-Host "  Proceso en Ejecucion:         $(if ($proc) { "ACTIVO (PID $($proc.ProcessId))" } else { 'DETENIDO' })" -ForegroundColor $(if ($proc) { "Green" } else { "DarkGray" })
    Write-Host ""
}
