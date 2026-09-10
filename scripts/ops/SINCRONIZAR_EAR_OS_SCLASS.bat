@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title SINCRONIZAR EAR OS S-CLASS - NIVEL OMEGA
color 0D

echo ======================================================================
echo    ORQUESTADOR MAESTRO NIVEL OMEGA - PRODUCTORA EAR OS
echo ======================================================================
echo.

set "BASE_DIR=%~dp0..\..\"
if exist "%BASE_DIR%scripts\ejecutar_sincronizacion_sclass.ps1" (
    set "WORKSPACE_ROOT=%BASE_DIR%"
) else if exist "%BASE_DIR%EAR_OS_V2\scripts\ejecutar_sincronizacion_sclass.ps1" (
    set "WORKSPACE_ROOT=%BASE_DIR%EAR_OS_V2\"
) else (
    set "WORKSPACE_ROOT=H:\EAR_OS_V2\EAR_OS_V2\"
)
set "SCRIPTS_DIR=%WORKSPACE_ROOT%scripts"

cd /d "%WORKSPACE_ROOT%"

echo [1/4] Creando accesos directos oficiales en tu Escritorio de Windows...
if exist "%SCRIPTS_DIR%\crear_accesos_directos_escritorio.ps1" (
    powershell -ExecutionPolicy Bypass -File "%SCRIPTS_DIR%\crear_accesos_directos_escritorio.ps1"
) else (
    echo       - Accesos directos omitidos (archivo ps1 no encontrado en %SCRIPTS_DIR%).
)

echo.
echo [2/4] Ejecutando sincronizacion maestra de datasets (53.631 Proveedores, Fotos HD y Obsidian)...
if exist "%SCRIPTS_DIR%\unified\sincronizador_omega_proveedores.py" (
    python "%SCRIPTS_DIR%\unified\sincronizador_omega_proveedores.py"
) else (
    echo       - Error: No se encontro sincronizador_omega_proveedores.py en %SCRIPTS_DIR%\unified.
)

echo.
echo [3/4] Sincronizando copias maestras en H:\EAR_OS_V2...
if exist "H:\EAR_OS_V2" (
    copy /y "%WORKSPACE_ROOT%SINCRONIZAR_EAR_OS_SCLASS.bat" "H:\EAR_OS_V2\SINCRONIZAR_EAR_OS_SCLASS.bat" >nul 2>&1
    copy /y "%WORKSPACE_ROOT%SINCRONIZAR_PROVEEDORES_OMEGA.bat" "H:\EAR_OS_V2\SINCRONIZAR_PROVEEDORES_OMEGA.bat" >nul 2>&1
)

echo.
echo [4/4] Abriendo catalogo enriquecido en http://localhost:3007/proveedores...
start http://localhost:3007/proveedores

echo.
echo ======================================================================
echo    [EXIT CODE 0] PROCESO CULMINADO CON EXITO
echo ======================================================================
echo.
pause
