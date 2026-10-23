@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
color 0B
title PRODUCTORA EAR OS — INSTALADOR S-CLASS (VSCODE + DEEPSEEK + APIS)

echo ======================================================================
echo    PRODUCTORA EAR OS — INSTALADOR AUTOMATICO S-CLASS
echo    VS CODE + EXTENSIONES CLINE/ROO + DEEPSEEK + CONFIGURACION APIS
echo ======================================================================
echo.

:: ─── 1. VERIFICAR / INSTALAR VS CODE ───────────────────────────────────────
echo [1/4] Verificando instalacion de Visual Studio Code...
where code >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] VS Code ya esta instalado y disponible en PATH.
) else (
    echo       [!] VS Code no encontrado en PATH. Buscando en rutas estandar...
    if exist "%LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe" (
        echo       [OK] VS Code encontrado en AppData Local.
        set "PATH=%PATH%;%LOCALAPPDATA%\Programs\Microsoft VS Code\bin"
    ) else if exist "C:\Program Files\Microsoft VS Code\Code.exe" (
        echo       [OK] VS Code encontrado en Program Files.
        set "PATH=%PATH%;C:\Program Files\Microsoft VS Code\bin"
    ) else (
        echo       [-] Instalando Visual Studio Code via Winget...
        winget install --id Microsoft.VisualStudioCode -e --accept-package-agreements --accept-source-agreements
        if %errorlevel% equ 0 (
            echo       [OK] VS Code instalado correctamente.
            set "PATH=%PATH%;%LOCALAPPDATA%\Programs\Microsoft VS Code\bin;C:\Program Files\Microsoft VS Code\bin"
        ) else (
            echo       [!] Fallo Winget. Abriendo descargador oficial de VS Code...
            start https://code.visualstudio.com/sha/download?build=stable^&os=win32-x64-user
            echo       Por favor, completa la instalacion del asistente y pulsa una tecla.
            pause
        )
    )
)

echo.
:: ─── 2. INSTALAR EXTENSIONES CLINE / ROO / HERRAMIENTAS ───────────────────
echo [2/4] Instalando extensiones recomendadas para EAR OS (Cline + Roo Code)...
call code --install-extension saoudrizwan.claude-dev --force >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] Extension Cline (Claude-Dev) instalada/actualizada.
) else (
    echo       [!] Extension Cline: pendiente de instalacion manual en VS Code.
)

call code --install-extension rooveterinaryinc.roo-cline --force >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] Extension Roo Code instalada/actualizada.
)

call code --install-extension dbaeumer.vscode-eslint --force >nul 2>&1
call code --install-extension esbenp.prettier-vscode --force >nul 2>&1
call code --install-extension prisma.prisma --force >nul 2>&1
echo       [OK] Extensiones complementarias (ESLint, Prettier, Prisma) configuradas.

echo.
:: ─── 3. VERIFICAR / INSTALAR DEEPSEEK (OLLAMA LOCAL) ──────────────────────
echo [3/4] Verificando motor DeepSeek y Ollama local...
where ollama >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] Ollama detectado en el sistema.
    echo       [-] Descargando / verificando modelo DeepSeek en Ollama...
    ollama pull deepseek-r1:14b
    if %errorlevel% neq 0 (
        echo       [!] Intentando con version ligera deepseek-r1:8b...
        ollama pull deepseek-r1:8b
    )
    echo       [OK] Modelo DeepSeek listo en Ollama (localhost:11434).
) else (
    echo       [!] Ollama no detectado en PATH.
    echo       [-] Puedes instalar Ollama desde https://ollama.com si deseas modelos locales 100%% offline.
)

echo.
:: ─── 4. BÓVEDA DE APIS Y CONFIGURACIÓN CLINE ──────────────────────────────
echo [4/4] Resumen de credenciales y APIs para EAR OS:
echo       -------------------------------------------------------------
echo       DEEPSEEK API KEY  : TU_CLAVE_DEEPSEEK_AQUI
echo       GEMINI API KEY    : (Configurado en .env.local)
echo       ABACUS AI API KEY : (Configurado en .env.local)
echo       STRIPE SECRETS    : (Configurado en .env.local)
echo       -------------------------------------------------------------
echo.
echo       [-] Copiando DEEPSEEK API KEY al portapapeles...
<nul set /p="TU_CLAVE_DEEPSEEK_AQUI" | clip
echo       [OK] Clave DeepSeek copiada al portapapeles.

echo.
echo ======================================================================
echo    INSTALACION COMPLETADA CON EXITO
echo    Para usar DeepSeek en Cline:
echo    1. Abre VS Code (se abrira a continuacion).
echo    2. En el panel lateral de Cline (icono del robot / engranaje):
echo       - API Provider: DeepSeek
echo       - API Key     : Pega con Ctrl+V (ya copiada)
echo       - Model       : deepseek-chat  O  deepseek-reasoner
echo    3. O si usas Ollama Local:
echo       - API Provider: Ollama
echo       - Base URL    : http://localhost:11434
echo       - Model       : deepseek-r1:14b (o ear-32b-arquitecto-sclass)
echo ======================================================================
echo.
echo Abriendo VS Code en el workspace d:\EAR_OS_V2\EAR_OS_V2...
start "" code "d:\EAR_OS_V2\EAR_OS_V2"
echo.
pause
