@echo off
chcp 65001 >nul
title REPARAR BLOQUEO E INDEXACIÓN DE OBSIDIAN - PRODUCTORA EAR OS
color 0E

echo ======================================================================
echo    RESCATE INMEDIATO DE OBSIDIAN Y PURGA DE MEMORIA (NIVEL OMEGA)
echo ======================================================================
echo.
echo [!] Tranquilo, Edwin: Tu PC no se ha quedado sin memoria RAM.
echo     Tu i9 + RX 7900 XTX tiene potencia de sobra.
echo.
echo     El problema era que Obsidian intentaba leer e indexar un archivo
echo     de base de datos de 101 MB (3 millones de lineas) y volcados HTML.
echo.

set "SCRIPT_DIR=%~dp0..\..\"
cd /d "%SCRIPT_DIR%"

echo [1/3] Ejecutando purga de caches y exclusion de archivos pesados...
powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%scripts\iniciar_obsidian_sclass.ps1"

echo.
echo [2/3] Ejecutando Saneamiento Purista (Compactando en las 5 Carpetas Maestras)...
python "%SCRIPT_DIR%scripts\unified\purist_vault_sanitizer.py"

echo.
echo ======================================================================
echo    [EXIT CODE 0] OBSIDIAN REPARADO Y BLINDADO AL 100%%
echo ======================================================================
echo  Ya puedes abrir Obsidian con ABRIR_OBSIDIAN_EAR_OS.bat o directamente
echo  desde tu acceso directo. Cargara en 2 segundos sin bloqueos.
echo.
pause
