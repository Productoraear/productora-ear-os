@echo off
title OpenCode AI - Productora EAR OS (DeepSeek Activo)
cd /d "d:\EAR_OS_V2\EAR_OS_V2"
echo ========================================================
echo  Iniciando OpenCode AI en Productora EAR OS (v2.2.5)
echo  Directorio: d:\EAR_OS_V2\EAR_OS_V2
echo  Motor IA: DeepSeek + Gemini (Desde Variables de Entorno)
echo  Reglas inyectadas: AGENTS.md + .clinerules
echo ========================================================
echo.

REM Cargar variables de entorno locales si no existen en sesion
for /f "usebackq tokens=1,* delims==" %%A in (`findstr /v "^#" .env.local 2^>nul`) do (
    if "%%A"=="DEEPSEEK_API_KEY" if not defined DEEPSEEK_API_KEY set "DEEPSEEK_API_KEY=%%B"
    if "%%A"=="GEMINI_API_KEY" if not defined GEMINI_API_KEY set "GEMINI_API_KEY=%%B"
    if "%%A"=="GOOGLE_GENERATIVE_AI_API_KEY" if not defined GOOGLE_GENERATIVE_AI_API_KEY set "GOOGLE_GENERATIVE_AI_API_KEY=%%B"
)

"%APPDATA%\ai.opencode.desktop\cli\2.2.5-x64\opencode-cli.exe" "d:\EAR_OS_V2\EAR_OS_V2"
pause
