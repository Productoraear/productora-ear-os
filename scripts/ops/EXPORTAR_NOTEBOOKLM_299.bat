@echo off
chcp 65001 >nul
title EXPORTADOR S-CLASS: 299 FUENTES PARA NOTEBOOKLM
color 0B

echo ======================================================================
echo    EXPORTADOR S-CLASS — 299 FUENTES MAESTRAS PARA NOTEBOOKLM
echo    Productora EAR - Destilado Cognitivo 360 Grados Sin Friccion
echo ======================================================================
echo.

set "SCRIPT_DIR=%~dp0..\..\"
cd /d "%SCRIPT_DIR%"

echo [1/3] Extrayendo y destilando las 299 fuentes de oro de todo el PC...
echo       > Purgando codigo residual y volcados de consola
echo       > Estructurando Filosofia, SSOT, B2G, Proveedores y Ventas
echo.
python "%SCRIPT_DIR%scripts\unified\exportar_299_fuentes_notebooklm.py"

echo.
echo [2/3] Sincronizando lanzador en H:\EAR_OS_V2...
if exist "H:\EAR_OS_V2" (
    copy /y "%SCRIPT_DIR%EXPORTAR_NOTEBOOKLM_299.bat" "H:\EAR_OS_V2\EXPORTAR_NOTEBOOKLM_299.bat" >nul
)

echo.
echo [3/3] Abriendo la carpeta con las 299 fuentes listas para NotebookLM...
if exist "H:\00_PRODUCTORA_EAR\NOTEBOOKLM_299_FUENTES_SCLASS" (
    explorer "H:\00_PRODUCTORA_EAR\NOTEBOOKLM_299_FUENTES_SCLASS"
)

echo.
echo ======================================================================
echo    [EXIT CODE 0] 299 FUENTES LISTAS PARA SUBIR A NOTEBOOKLM
echo ======================================================================
echo  1. Se ha abierto la carpeta:
echo     H:\00_PRODUCTORA_EAR\NOTEBOOKLM_299_FUENTES_SCLASS\
echo  2. Abre en tu navegador: https://notebooklm.google.com
echo  3. Crea una nueva libreta llamada "EAR OS MAESTRO"
echo  4. Pulsa "Subir fuentes", pulsa Ctrl+E (seleccionar todo) en la carpeta
echo     y arrastra todos los archivos directamente a NotebookLM.
echo.
pause
