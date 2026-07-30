@echo off
title LANZADOR OMEGA GOLD v2026
:: Entrar en la carpeta donde está este archivo
cd /d "%~dp0"
cls
echo 🔱 INICIANDO SECUENCIA OMEGA - MODO DEPURACION
echo ------------------------------------------
echo [*] Ubicacion: %~dp0
echo.
:: Ejecutar el PS1 en la misma ventana para ver los errores
PowerShell -NoProfile -ExecutionPolicy Bypass -File "Dominancia_EAR_SClass.ps1"
echo.
echo ------------------------------------------
echo [!] Si ves errores arriba, copia el texto y pasamelo.
echo [!] Si el sistema abrio todo, ya puedes cerrar esta ventana.
pause