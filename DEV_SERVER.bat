@echo off
set "PATH=C:\Users\Productora Ear\Downloads\node-lts\node-v26.12.1-win-x64;%PATH%"
cd /d "%~dp0"
echo Levantando servidor Next.js en puerto 3007...
call npm run dev
