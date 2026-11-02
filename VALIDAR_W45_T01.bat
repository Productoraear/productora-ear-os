@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ============================================================
echo  W45_T01 - MOTOR MAGIA NEGRA - VALIDACION S-CLASS
echo  (1/3) Reparto presupuestario al centimo (10.000 casos)
echo  (2/3) Guardia de integridad del SSOT (ZONA CERO)
echo  (3/3) omega.js complete: tsc + eslint + prueba + cierre
echo ============================================================
echo.

echo [1/3] scripts/verify_budget_allocator.ts
node ./node_modules/tsx/dist/cli.mjs scripts/verify_budget_allocator.ts
if errorlevel 1 goto fail

echo.
echo [2/3] npm run audit:ssot
call npm run audit:ssot
if errorlevel 1 goto fail

echo.
echo [3/3] node .antigravity/omega.js complete W45_T01
node .antigravity/omega.js complete W45_T01
if errorlevel 1 goto fail

echo.
echo ============================================================
echo  RESULTADO: EXIT CODE 0 - W45_T01 CERRADA
echo  Pacto ZTM: detente y abre Start New Task (+)
echo ============================================================
pause
exit /b 0

:fail
echo.
echo ============================================================
echo  RESULTADO: FALLO - LA TAREA NO SE CIERRA
echo  Exit Code distinto de 0. Lee la salida superior.
echo ============================================================
pause
exit /b 1
