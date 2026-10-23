@echo off
set "PATH=C:\Users\Productora Ear\Downloads\node-lts\node-v26.12.1-win-x64;%PATH%"
cd /d "%~dp0.."
node node_modules\typescript\bin\tsc --noEmit > .antigravity\tsc_o2.log 2>&1
echo %ERRORLEVEL% > .antigravity\tsc_exit.txt
