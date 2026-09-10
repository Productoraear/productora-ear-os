@echo off
title OPTIMIZAR PC PARA IA S-CLASS (i9 + RX 7900 XTX 24GB)
color 0B
echo ======================================================================
echo    OPTIMIZADOR DE HARDWARE S-CLASS PARA IA (NIVEL OMEGA)
echo    Hardware: Intel Core i9 + AMD Radeon RX 7900 XTX (24GB VRAM)
echo    Modelos : Qwen 2.5 Coder 32B (100%% en VRAM) y Modelos 70B/72B
echo ======================================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0..\..\scripts\optimizar_entorno_ia_sclass.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [AVISO] Revisa los mensajes anteriores.
)
pause
