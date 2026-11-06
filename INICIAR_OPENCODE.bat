@echo off
title OpenCode AI - Productora EAR OS
cd /d "d:\EAR_OS_V2\EAR_OS_V2"
echo ========================================================
echo  Iniciando OpenCode AI en Productora EAR OS (v2.2.5)
echo  Directorio: d:\EAR_OS_V2\EAR_OS_V2
echo  Reglas inyectadas: AGENTS.md + .clinerules
echo ========================================================
echo.
"%APPDATA%\ai.opencode.desktop\cli\2.2.5-x64\opencode-cli.exe" "d:\EAR_OS_V2\EAR_OS_V2"
pause
