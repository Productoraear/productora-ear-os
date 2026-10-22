@echo off
REM Validador desatendido: node -v, tsc y eslint (sobre archivos opcionales). Devuelve Exit Codes reales.
set "PATH=C:\Users\Productora Ear\Downloads\node-lts\node-v26.12.1-win-x64;C:\Users\Productora Ear\Downloads\git-portable\cmd;%PATH%"
cd /d "%~dp0"
for /f %%v in ('node -v') do echo NODE_VERSION=%%v
call npx tsc --noEmit > .antigravity\last_tsc.log 2>&1
set TSC=%ERRORLEVEL%
echo TSC_EXIT=%TSC%
set ESL=0
if not "%~1"=="" (
  call npx eslint %* > .antigravity\last_eslint.log 2>&1
  set ESL=%ERRORLEVEL%
)
call echo ESLINT_EXIT=%%ESL%%
if not "%TSC%"=="0" exit /b 1
if not "%ESL%"=="0" exit /b 2
exit /b 0
