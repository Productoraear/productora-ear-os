@echo off
title Sincronizacion Maestra Nivel Omega - Productora EAR OS
color 0D
echo ======================================================================
echo    SINCRONIZACION MAESTRA NIVEL OMEGA S-CLASS - PRODUCTORA EAR OS
echo ======================================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0ejecutar_sincronizacion_sclass.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [AVISO] Revisa los mensajes de consola.
)
pause
