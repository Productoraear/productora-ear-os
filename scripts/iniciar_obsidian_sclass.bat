@echo off
title Obsidian S-Class Launcher - Productora EAR
color 0B
echo ======================================================================
echo    INICIANDO OBSIDIAN EN MODO S-CLASS (PURGA DE CACHE Y RESCATE)
echo ======================================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0iniciar_obsidian_sclass.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Hubo un problema ejecutando el script de PowerShell.
    pause
)
