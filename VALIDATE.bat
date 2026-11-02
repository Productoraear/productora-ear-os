@echo off
REM Validador desatendido: node -v, tsc y eslint con Exit Codes reales.
REM tsc/eslint se invocan con node directo (node_modules\.bin incompleto: npx no resuelve).
set "PATH=C:\Users\Productora Ear\Downloads\node-lts\node-v26.12.1-win-x64;C:\Users\Productora Ear\Downloads\git-portable\cmd;%PATH%"
cd /d "%~dp0"
for /f %%v in ('node -v') do echo NODE_VERSION=%%v
call node .\node_modules\typescript\bin\tsc --noEmit > .antigravity\last_tsc.log 2>&1
set TSC=%ERRORLEVEL%
echo TSC_EXIT=%TSC%
set ESL_FILES=%*
if "%~1"=="" set ESL_FILES=src\
call node .\node_modules\eslint\bin\eslint.js %ESL_FILES% > .antigravity\last_eslint.log 2>&1
set ESL=%ERRORLEVEL%
call echo ESLINT_EXIT=%%ESL%%
echo.
echo [*] Logs: .antigravity\last_tsc.log y .antigravity\last_eslint.log
if not "%TSC%"=="0" exit /b 1
if not "%ESL%"=="0" exit /b 2
echo [*] VALIDATE_OK
pause
exit /b 0

