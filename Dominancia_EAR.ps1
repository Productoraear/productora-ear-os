# ==========================================================
# OMEGA IGNITION SCRIPT v2026 - EAR OS SYSTEM
# ==========================================================
$ProjectDir = "C:\EAR_OS_V2"
$SSOT_Path = "$ProjectDir\01_SSOT_Y_KERNELS\EAR_OS_STRATEGIC_ORCHESTRATOR_PLAN.md"
$AnythingLLM_Path = "$env:LOCALAPPDATA\Programs\anythingllm-desktop\AnythingLLM.exe"
$Auditor_Script = "$ProjectDir\auditor_omega.ps1"

Clear-Host
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   HOLA, VAMOS A TRABAJAR HOY EN: EAR OS v2026 GOLD" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verificar Directorio
if (!(Test-Path $ProjectDir)) {
    Write-Host "[!] ERROR: No se encuentra la carpeta del proyecto en $ProjectDir" -ForegroundColor Red
    pause
    exit
}

# 2. Buscar la última tarea pendiente del Genoma
Write-Host "[*] Escaneando el Genoma en busca de tareas..." -ForegroundColor Gray
$plan = Get-Content $SSOT_Path
$nextTask = $plan | Select-String "- \[ \]" | Select-Object -First 1

if ($nextTask) {
    $taskText = $nextTask.ToString().Trim().Replace("- [ ] ", "")
    Write-Host "[>] TAREA PENDIENTE DETECTADA:" -ForegroundColor Yellow
    Write-Host "    $taskText" -ForegroundColor White
} else {
    Write-Host "[!] No hay tareas pendientes en el SSOT. ¡Dominancia total alcanzada!" -ForegroundColor Gold
    $taskText = "Revisión general de integridad"
}

# 3. Abrir Visual Studio Code
Write-Host "`n[*] Abriendo Visual Studio Code..." -ForegroundColor Cyan
Start-Process "code" -ArgumentList $ProjectDir

# 4. Abrir AnythingLLM
if (Test-Path $AnythingLLM_Path) {
    Write-Host "[*] Abriendo AnythingLLM (Cerebro de Consulta)..." -ForegroundColor Cyan
    Start-Process $AnythingLLM_Path
}

# 5. Lanzar el Orquestador Omega en una nueva ventana
Write-Host "[*] Iniciando Orquestador de Bucle Cerrado..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-File", "$Auditor_Script"

# 6. Preparar el Portapapeles para Cline
$FirstPrompt = "Cline, el Comandante ha iniciado el sistema. 
ESTADO: Ignición S-Class completada.
MISIÓN ACTUAL: $taskText.
Confirma integridad y procede átomo a átomo."
$FirstPrompt | Set-Clipboard

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "   SISTEMA ACTIVO. ORDEN COPIADA AL PORTAPAPELES." -ForegroundColor White
Write-Host "   Ve a Cline y pulsa CTRL + V para comenzar." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green

Start-Sleep -Seconds 5