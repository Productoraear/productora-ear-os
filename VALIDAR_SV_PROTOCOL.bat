@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

REM ============================================================
REM  VALIDAR_SV_PROTOCOL.bat  --  EAR OS · SV-PROTOCOL-2026-11-04
REM  15 puertas reales en un solo clic. NO cierra tareas: solo mide.
REM  Salida completa -> .antigravity\reports\gate_output.log
REM  Ese .log es el unico documento que vale como evidencia (EP-1).
REM  Motivo: el terminal del agente (Cline) no devuelve Exit Code
REM  (incidente TOOLING-CLINE-TERMINAL). El humano pulsa, el agente lee.
REM ============================================================

set "LOGDIR=.antigravity\reports"
if not exist "%LOGDIR%" mkdir "%LOGDIR%"
set "LOG=%LOGDIR%\gate_output.log"
set "FAILED="

> "%LOG%" echo EAR OS - gate_output.log
>> "%LOG%" echo Generado por VALIDAR_SV_PROTOCOL.bat
>> "%LOG%" echo Fecha: %DATE% %TIME%
>> "%LOG%" echo Host: %COMPUTERNAME%   Directorio: %CD%
>> "%LOG%" echo ============================================================
>> "%LOG%" echo.

echo ============================================================
echo  EAR OS - VALIDACION SV-PROTOCOL (15 puertas)
echo  Todo se escribe en: %LOG%
echo  Al terminar, di a Cline: "lee el log" - el resto es suyo.
echo ============================================================
echo.

call :run npm run verify:pricing
call :run npm run audit:ssot
call :run npm run verify:logistics
call :run npm run verify:budget
call :run npm run verify:confianza
call :run npm run audit:cta-matrix
call :run npm run verify:provider-ctas
call :run npm run audit:phone
call :run npm run audit:admin
call :run npm run audit:http
call :run npm run audit:tariff-copy
call :run npm run audit:gates
call :run node scripts/verify_sonometro_pwa.cjs
call :run npm run lint
call :run npm run typecheck

echo. >> "%LOG%"
echo ============================================================ >> "%LOG%"
>> "%LOG%" echo RESUMEN
if defined FAILED goto :resumen_fallo

>> "%LOG%" echo TODAS LAS 15 PUERTAS: EXIT CODE 0
>> "%LOG%" echo VEREDICTO: nucleo duro superado. Falta G-6, sondeo HTTP en produccion.
echo.
echo ============================================================
echo  RESULTADO: 15/15 EXIT CODE 0
echo  Log completo: %LOG%
echo  Siguiente: sondeo G-6 sobre https://www.productoraear.com
echo ============================================================
echo.
pause
exit /b 0

:resumen_fallo
>> "%LOG%" echo PUERTAS QUE FALLARON:!FAILED!
>> "%LOG%" echo VEREDICTO: NO se puede sellar VERIFICADO. Los huecos quedan a la vista.
echo.
echo ============================================================
echo  RESULTADO: HAY FALLOS - bloque NO sellable como VERIFICADO
echo  Fallaron:!FAILED!
echo  Log completo: %LOG%
echo ============================================================
echo.
pause
exit /b 1

:run
echo. >> "%LOG%"
>> "%LOG%" echo === %* ===
echo [RUN] %*
call %* >> "%LOG%" 2>&1
set "RC=!ERRORLEVEL!"
>> "%LOG%" echo EXIT_CODE=!RC!
if not "!RC!"=="0" set "FAILED=!FAILED! ; %* -- exit code !RC!"
goto :eof

