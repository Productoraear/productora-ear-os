# ===========================================================================
# PROTOCOLO DE IGNICION EAR OS - OMEGA GOLD EDITION v2.4 (STABLE)
# ===========================================================================
$ErrorActionPreference = "SilentlyContinue"
$ProjectDir = "C:\EAR_OS_V2"
$SSOT_Path = "$ProjectDir\01_SSOT_Y_KERNELS\EAR_OS_STRATEGIC_ORCHESTRATOR_PLAN.md"
$H_Drive_Models = "H:\AI_MODELS_HUB\ollama"
$AnythingLLM_Path = "$env:LOCALAPPDATA\Programs\AnythingLLM\AnythingLLM.exe"

Clear-Host
Write-Host "--- INICIANDO LANZADOR OMEGA v2.4 ---" -ForegroundColor Cyan

# 1. PREPARACION DE HARDWARE Y VARIABLES
$env:OLLAMA_MODELS = $H_Drive_Models
[Environment]::SetEnvironmentVariable("OLLAMA_MODELS", $H_Drive_Models, "Machine")

# 2. PURGA DE PROCESOS (Limpieza de VRAM)
Write-Host "[*] Purgando procesos previos..." -ForegroundColor Gray
Stop-Process -Name ollama, n8n, AnythingLLM, Code, node -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 3. LANZAR MOTORES (Cerebro y Automatizacion)
Write-Host "[*] Despertando Ollama y n8n..." -ForegroundColor Gray
Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden
Start-Process "powershell" -ArgumentList "-NoProfile -Command n8n start" -WindowStyle Minimized

# 4. LANZAR VS CODE (Construccion)
Write-Host "[*] Abriendo VS Code..." -ForegroundColor Gray
if (Test-Path $ProjectDir) {
    Start-Process "code" -ArgumentList "`"$ProjectDir`""
}

# 5. LANZAR ANYTHINGLLM (Oraculo)
if (Test-Path $AnythingLLM_Path) {
    Write-Host "[*] Abriendo AnythingLLM..." -ForegroundColor Gray
    Start-Process $AnythingLLM_Path
}

# 6. EXTRACCION DE TAREA (SSOT)
Write-Host "[*] Sincronizando con el Genoma..." -ForegroundColor Gray
$taskText = "Mantenimiento General S-Class"
if (Test-Path $SSOT_Path) {
    $plan = Get-Content $SSOT_Path -Raw
    # Buscamos la primera tarea pendiente de forma ultra-simple
    if ($plan -match "- \[ \] (.*)") {
        $taskText = $Matches[1].Trim()
    }
}

# 7. CONFIGURACION DE ANYTHINGLLM (Nota en Escritorio)
$ConfigNote = "CONFIGURACION ANYTHINGLLM:`n1. Workspace: EAR_OS_V2`n2. LLM: Ollama (qwen3.6)`n3. Context: 32768"
$ConfigNote | Out-File "$env:USERPROFILE\Desktop\CONFIG_IA.txt" -Encoding ascii

# FINAL: COPIAR ORDEN A CLINE (Portapapeles)
$FinalPrompt = "Cline, Comandante detectado. ESTADO: Ignicion v2.4 OK. HARDWARE: 7900 XTX activa. MISION: $taskText. Ejecuta bajo protocolo OMEGA."
$FinalPrompt | Set-Clipboard

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "   SISTEMA LISTO. ORDEN COPIADA AL PORTAPAPELES." -ForegroundColor White
Write-Host "   PULSA CTRL + V EN CLINE PARA COMENZAR." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green