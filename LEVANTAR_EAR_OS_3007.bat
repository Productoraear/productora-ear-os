@echo off
title PRODUCTORA EAR OS · DEV SERVER (PUERTO 3007)
color 0E

echo =====================================================================
echo  PRODUCTORA EAR OS · INICIANDO SERVIDOR LOCAL S-CLASS (PUERTO 3007)
echo =====================================================================

:: Configurar rutas portables de Node y Git
set "PATH=C:\Users\Productora Ear\Downloads\node-lts\node-v26.12.1-win-x64;C:\Users\Productora Ear\Downloads\git-portable\cmd;%PATH%"

:: Asignar 4GB de RAM a Node para evitar caidas por falta de memoria (OOM)
set "NODE_OPTIONS=--max-old-space-size=4096"
set "PORT=3007"

echo [*] Memoria ampliada: 4096 MB asignados a Node.js
echo [*] Probando ejecucion en http://localhost:3007
echo [*] Si deseas detener el servidor, presiona Ctrl + C
echo.

npx next dev -p 3007
pause
