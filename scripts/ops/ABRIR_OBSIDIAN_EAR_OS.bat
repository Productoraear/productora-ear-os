@echo off
title ABRIR OBSIDIAN EAR OS S-CLASS
color 0B
echo ======================================================================
echo    LANZADOR DEFINITIVO DE OBSIDIAN EAR OS - MODO S-CLASS
echo ======================================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0..\..\scripts\iniciar_obsidian_sclass.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [AVISO] Revisa los mensajes anteriores.
    pause
)
