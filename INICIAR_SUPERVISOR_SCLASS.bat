@echo off
title EAR OS - SUPERVISOR S-CLASS & PURGA ZOMBIE
color 0b
echo ======================================================================
echo   INICIANDO SUPERVISOR S-CLASS (PURGA DE COLA Y ANTI-ZOMBIE EN BUCLE)
echo ======================================================================
cd /d "H:\EAR_OS_V2\EAR_OS_V2"
powershell -ExecutionPolicy Bypass -File "scripts\ops\auto_supervisor_watchdog.ps1"
pause
