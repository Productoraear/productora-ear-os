@echo off
title EAR OS V2 :: Opportunity Radar S-Class
cd /d "d:\EAR_OS_V2\EAR_OS_V2"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "d:\EAR_OS_V2\EAR_OS_V2\EJECUTAR_RADAR_OPORTUNIDADES.ps1" %*
if errorlevel 1 (
    echo.
    echo [ERROR] El radar reporto un error al ejecutarse.
    pause
)
