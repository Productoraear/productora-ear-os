@echo off
set "PATH=C:\Users\Productora Ear\Downloads\node-lts\node-v26.12.1-win-x64;%PATH%"
cd /d "%~dp0.."
node node_modules\eslint\bin\eslint.js src\ > .antigravity\eslint_o.log 2>&1
echo %ERRORLEVEL% > .antigravity\eslint_exit.txt
