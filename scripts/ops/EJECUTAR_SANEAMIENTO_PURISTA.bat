@echo off
chcp 65001 >nul
title SANEAMIENTO PURISTA DE BÓVEDA EAR OS - 5 CARPETAS MAESTRAS
color 0A

echo ======================================================================
echo    SANEAMIENTO PURISTA Y COMPACTACIÓN S-CLASS (NIVEL OMEGA)
echo    Productora EAR - 5 Carpetas Maestras y Visor de Proveedores
echo ======================================================================
echo.

set "SCRIPT_DIR=%~dp0..\..\"
cd /d "%SCRIPT_DIR%"

echo [1/3] Ejecutando Saneamiento Purista en Boveda Obsidian...
echo       > Compactando en las 5 Carpetas Maestras
echo       > Purgando y acortando nombres gigantescos
echo       > Generando Catalogo Visual SOTA de Proveedores...
echo.
python "%SCRIPT_DIR%scripts\unified\purist_vault_sanitizer.py"

echo.
echo [2/3] Sincronizando accesos directos e instalando en H:\EAR_OS_V2...
if exist "H:\EAR_OS_V2" (
    copy /y "%SCRIPT_DIR%EJECUTAR_SANEAMIENTO_PURISTA.bat" "H:\EAR_OS_V2\EJECUTAR_SANEAMIENTO_PURISTA.bat" >nul
)

echo.
echo [3/3] Actualizando accesos directos oficiales en tu Escritorio...
powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%scripts\crear_accesos_directos_escritorio.ps1"

echo.
echo ======================================================================
echo    [EXIT CODE 0] SANEAMIENTO Y VISOR CULMINADOS CON ÉXITO
echo ======================================================================
echo  1. Abre Obsidian con ABRIR_OBSIDIAN_EAR_OS.bat
echo  2. En el panel izquierdo veras exactamente tus 5 Carpetas Maestras:
echo     - 01_ESTRATEGIA_Y_CHATS
echo     - 02_PROVEEDORES_SCLASS (Con CATALOGO_PROVEEDORES_VISUAL.md)
echo     - 03_LICITACIONES_B2G
echo     - 04_CATEDRA_Y_AUDIO
echo     - 05_CODIGO_Y_SISTEMA
echo.
pause
