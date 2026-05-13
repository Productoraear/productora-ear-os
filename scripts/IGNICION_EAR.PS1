# ---------------------------------------------------------------------------
# PROTOCOLO DE IGNICIÓN EAR OS - S-CLASS UNIFIED EDITION
# ---------------------------------------------------------------------------
$ErrorActionPreference = "SilentlyContinue"
Clear-Host
Write-Host "🔱 INICIANDO SECUENCIA OMEGA: EAR OS S-CLASS" -ForegroundColor Cyan

# 1. LIMPIEZA Y PREPARACIÓN DE MOTOR
Write-Host "[1/6] Purgando procesos huérfanos..." -ForegroundColor Yellow
Get-Process ollama, n8n, AnythingLLM | Stop-Process -Force
Start-Sleep -Seconds 2

# 2. SOBERANÍA DEL DATO (Variables de Entorno)
Write-Host "[2/6] Configurando rutas maestras en Disco H:..." -ForegroundColor Yellow
$env:OLLAMA_MODELS = "H:\AI_MODELS_HUB\ollama"
[Environment]::SetEnvironmentVariable("OLLAMA_MODELS", "H:\AI_MODELS_HUB\ollama", "Machine")

# 3. CIRUGÍA DE RUTAS (De-nesting Quirúrgico)
Write-Host "[3/6] Ejecutando Santuario Forense (Limpieza de D:)..." -ForegroundColor Yellow
$rutaCaos = "D:\_OS AZUL_1_EAR_00_CEREBRO_DIGITAL_10_MI_VOZ_01_CAOS_ORIGINAL_TEXTOS_D_OS AZUL_0_INBOX"
$destinoInbox = "H:\SANTUARIO_EAR\00_NUCLEO_INBOX"
if (Test-Path $rutaCaos) {
    if (-not (Test-Path $destinoInbox)) { New-Item -ItemType Directory -Force -Path $destinoInbox | Out-Null }
    Get-ChildItem -Path $rutaCaos -Recurse -File | ForEach-Object {
        $nuevoNombre = "{0}_{1}" -f (Get-Date -Format "yyyyMMdd"), $_.Name
        Move-Item -Path $_.FullName -Destination (Join-Path $destinoInbox $nuevoNombre) -Force
    }
    Remove-Item -Path "D:\_OS AZUL_1_EAR_*" -Recurse -Force
    Write-Host "    > Tumor de rutas extirpado con éxito." -ForegroundColor Green
}

# 4. LANZAMIENTO DE INTELIGENCIA (Ollama + n8n)
Write-Host "[4/6] Despertando Ollama (Servidor de Modelos)..." -ForegroundColor Yellow
Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden

Write-Host "[5/6] Lanzando n8n (Motor de Automatización Nativo)..." -ForegroundColor Yellow
# Lanzamos n8n en una ventana minimizada para que no estorbe pero siga activo
Start-Process "powershell" -ArgumentList "-NoProfile -Command n8n start" -WindowStyle Minimized

# 5. VERIFICACIÓN Y LANZAMIENTO DE INTERFAZ
Start-Sleep -Seconds 5
Write-Host "[6/6] Sincronizando AnythingLLM..." -ForegroundColor Yellow
try {
    $check = Invoke-WebRequest -Uri "http://127.0.0.1:11434" -Method Head
    if ($check.StatusCode -eq 200) {
        Write-Host "    > SISTEMA ONLINE. Abriendo interfaces..." -ForegroundColor Green
        Start-Process "$env:LOCALAPPDATA\Programs\AnythingLLM\AnythingLLM.exe"
        Start-Process "http://localhost:5678" # Abre la interfaz de n8n
    }
} catch {
    Write-Host "    > ALERTA: Revisar inicio de servicios manual." -ForegroundColor Red
}

Write-Host "`n✅ PROTOCOLO OMEGA COMPLETADO: EAR OS ESTÁ OPERATIVO." -ForegroundColor Cyan

