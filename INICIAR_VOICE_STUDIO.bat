@echo off
title VOICE STUDIO AI - PRODUCTORA EAR OS
echo ======================================================================
echo    OPEN SOURCE AI VOICE STUDIO - LOCAL VOICE CLONING & DUBBING
echo    Productora EAR :: Personalizacion de Canciones y Videos con IA
echo ======================================================================

where voicestudio >nul 2>nul
if %errorlevel% neq 0 (
    echo [VOICE STUDIO] No detectado en el sistema. Iniciando instalador oficial...
    echo Descargando e instalando VoiceStudio desde https://voicestudio.sh...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://voicestudio.sh/install | iex"
) else (
    echo [VOICE STUDIO] Binario detectado en el sistema.
)

echo [VOICE STUDIO] Arrancando servidor local y abriendo interfaz...
start "" "https://voicestudio.sh" 2>nul
voicestudio serve --port 8080 || voicestudio || echo Abriendo aplicacion VoiceStudio...
pause
