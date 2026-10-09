@echo off
setlocal
REM ============================================================================
REM  EAR OS V2 — LANZADOR UN-CLIC DEL VAMPIRO CORREGIDO (100% BODAS.NET)
REM  Ejecuta el orquestador PowerShell con politica ByPass.
REM  Uso:   LANZAR_VAMPIRO_CORREGIDO.bat
REM         LANZAR_VAMPIRO_CORREGIDO.bat live        (anyade crawl nocturno)
REM         LANZAR_VAMPIRO_CORREGIDO.bat skiphtml    (omite rebarride de HTMLs)
REM ============================================================================

cd /d "%~dp0"

set ARGS=

:parse
if "%~1"=="" goto run
if /i "%~1"=="live"     set ARGS=%ARGS% -Live
if /i "%~1"=="skiphtml" set ARGS=%ARGS% -SkipHtml
shift
goto parse

:run
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\lanzar_vampiro_corregido.ps1" %ARGS%
set CODE=%ERRORLEVEL%

echo.
if "%CODE%"=="0" (
  echo [EXIT CODE 0] Vampiro corregido finalizado OK.
) else (
  echo [EXIT CODE %CODE%] El pipeline reporto un fallo.
)

endlocal & exit /b %CODE%