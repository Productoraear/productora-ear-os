@echo off
chcp 65001 >nul
title PROCESADOR S-CLASS: MANUAL STAGE COLOR 48 (ESPAÑOL DE ESPAÑA)
color 0E

echo ======================================================================
echo    PROCESADOR Y TRADUCTOR TÉCNICO S-CLASS (ESPAÑOL DE ESPAÑA)
echo    Equipo: Foco Profesional Stage Color 48 (Iluminación y DMX)
echo ======================================================================
echo.

set "SCRIPT_DIR=%~dp0..\..\"
cd /d "%SCRIPT_DIR%"

echo [1/3] Extrayendo y editando el manual desde D:\Migracion_C\M2-W10\Downloads...
python "%SCRIPT_DIR%scripts\unified\procesar_manual_stage_color_48.py"

echo.
echo [2/3] Sincronizando en H:\EAR_OS_V2...
if exist "H:\EAR_OS_V2" (
    copy /y "%SCRIPT_DIR%PROCESAR_MANUAL_STAGE_COLOR_48.bat" "H:\EAR_OS_V2\PROCESAR_MANUAL_STAGE_COLOR_48.bat" >nul
)

echo.
echo [3/3] Abriendo el manual editado en Markdown...
if exist "%SCRIPT_DIR%docs\MANUAL_STAGE_COLOR_48_ESPANOL_SCLASS.md" (
    start notepad "%SCRIPT_DIR%docs\MANUAL_STAGE_COLOR_48_ESPANOL_SCLASS.md"
)

echo.
echo ======================================================================
echo    [EXIT CODE 0] MANUAL STAGE COLOR 48 GENERADO EN ESPAÑOL
echo ======================================================================
echo  Archivos creados:
echo  - docs\MANUAL_STAGE_COLOR_48_ESPANOL_SCLASS.md
echo  - H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\05_CODIGO_Y_SISTEMA\
echo  - H:\00_PRODUCTORA_EAR\NOTEBOOKLM_299_FUENTES_SCLASS\
echo.
pause
