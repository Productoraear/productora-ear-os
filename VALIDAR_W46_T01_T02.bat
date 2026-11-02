@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ============================================================
echo  W46_T01 + W46_T02 - CABECERA LIMPIA + RECORRIDO CINEMATICO
echo  (1/3) tsc --noEmit .......................... G-1
echo  (2/3) eslint de los 3 ficheros tocados ....... G-2
echo  (3/3) reinicio limpio del dev 3007 + sonda ... G-6 local
echo ============================================================
echo.

echo [1/3] tsc --noEmit
node ./node_modules/typescript/bin/tsc --noEmit
if errorlevel 1 goto fail

echo.
echo [2/3] eslint (solo ficheros tocados)
node ./node_modules/eslint/bin/eslint.js src/app/components/layout/SovereignNavbar.tsx src/components/otzarreta/EzkertzaCinematicJourney.tsx src/components/otzarreta/EzkertzaVenueLanding.tsx
if errorlevel 1 goto fail

echo.
echo [3/3] scripts/ear_dev_reset.ps1 (mata zombis del 3007, relanza y sondea HTTP)
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\ear_dev_reset.ps1"
if errorlevel 1 goto fail

echo.
echo ============================================================
echo  RESULTADO: EXIT CODE 0 - G-1 y G-2 verdes y 3007 sirviendo
echo  Siguiente: abrir http://localhost:3007/otzarreta y comprobar
echo  la cabecera en 1024 / 1280 / 1536 px. Despues: push a origin
echo  hacia Coolify y sonda G-6 sobre www.productoraear.com/otzarreta
echo ============================================================
pause
exit /b 0

:fail
echo.
echo ============================================================
echo  RESULTADO: FALLO - NO SE CIERRA NI SE DESPLIEGA
echo  Exit Code distinto de 0. Lee la salida superior.
echo ============================================================
pause
exit /b 1
