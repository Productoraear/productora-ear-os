@echo off
title MEMANTO AGENTIC MEMORY UI - PRODUCTORA EAR OS
echo ======================================================================
echo    MEMANTO AGENTIC MEMORY BRIDGE - ZERO-TOKEN MEMORY (ZTM)
echo ======================================================================
echo Inicializando servidor y abriendo panel visual de memoria...
memanto ui
if %errorlevel% neq 0 (
    echo Memanto no encontrado. Ejecutando bootstrap...
    python scripts\unified\bootstrap_memanto_ear_os.py
    memanto ui
)
pause
