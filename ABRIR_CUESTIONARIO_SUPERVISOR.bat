@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

set "HTML=%~dp0dashboard_cuestionario_supervisor.html"
set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"

if exist "%EDGE%" (
    start "" "%EDGE%" "%HTML%"
) else (
    start "" "%HTML%"
)
endlocal