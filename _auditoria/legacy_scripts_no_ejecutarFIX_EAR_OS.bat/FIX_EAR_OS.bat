@echo off
:: Protocolo de Elevación de Privilegios
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Solicitando permisos de Administrador...
    goto UACPrompt
) else ( goto gotAdmin )
:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B
:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"

:: --- INICIO DEL SCRIPT DE ORGANIZACIÓN ---
set "BASE_PATH=H:\AI_MODELS_HUB"
set "DEST_PATH=H:\AI_MODELS_HUB\hub\models\imported"

echo INICIANDO ORGANIZACIÓN S-CLASS EN DISCO H:...
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; $src='%BASE_PATH%'; $dst='%DEST_PATH%'; if(!(Test-Path $dst)){New-Item -ItemType Directory -Path $dst -Force}; Get-ChildItem -Path $src -Filter '*.gguf' -Recurse | Where-Object { $_.FullName -notlike '*\hub\models\*' } | ForEach-Object { $mDir = Join-Path $dst $_.BaseName; if(!(Test-Path $mDir)){New-Item -ItemType Directory -Path $mDir -Force}; Move-Item -Path $_.FullName -Destination $mDir -Force; Write-Host 'Movido: ' $_.Name -ForegroundColor Green }"

echo.
echo --- PROCESO COMPLETADO ---
echo Abre LM Studio y refresca 'My Models'.
pause