@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
color 0B
echo ===============================================================
echo    EAR OS S-CLASS — CONSTRUCTOR DE PERFILES VRAM-SHIELD
echo    AMD RX 7900 XTX 24GB | PROHIBIDO DESBORDAR A RAM/CPU
echo ===============================================================
echo.

set "MODEL_DIR=H:\AI_MODELS_HUB"

echo [1/6] Blindando variables de entorno Ollama (RDNA3)...
setx OLLAMA_FLASH_ATTENTION "1" >nul
setx OLLAMA_KV_CACHE_TYPE "q4_0" >nul
setx OLLAMA_NUM_PARALLEL "1" >nul
setx OLLAMA_KEEP_ALIVE "5m" >nul
setx OLLAMA_MAX_LOADED_MODELS "1" >nul
echo       FlashAttention=1 | KV=q4_0 | Parallel=1 | KeepAlive=5m | MaxLoaded=1

echo.
echo [2/6] Creando perfil 14B TEXTOS (ctx 16k, ~10.5GB)...
ollama create ear-14b-textos-sclass -f "%~dp0Modelfile_14B_Textos_SClass"
if errorlevel 1 (
  echo   [!] FALLO al crear ear-14b-textos-sclass
) else (
  echo   [OK] ear-14b-textos-sclass creado y blindado
)

echo.
echo [3/6] Creando perfil 27B APIs (ctx 16k, ~16.5GB, KV q4_0)...
ollama create ear-27b-apis-sclass -f "%~dp0Modelfile_27B_APIs_SClass"
if errorlevel 1 (
  echo   [!] FALLO al crear ear-27b-apis-sclass
) else (
  echo   [OK] ear-27b-apis-sclass creado y blindado
)

echo.
echo [4/6] Creando perfil 32B ARQUITECTO (ctx 16k, ~19GB, KV q4_0)...
ollama create ear-32b-arquitecto-sclass -f "%~dp0Modelfile_32B_Arquitecto_SClass"
if errorlevel 1 (
  echo   [!] FALLO al crear ear-32b-arquitecto-sclass
) else (
  echo   [OK] ear-32b-arquitecto-sclass creado y blindado
)

echo.
echo [5/6] Reiniciando Ollama para aplicar el escudo...
taskkill /f /im ollama.exe /t >nul 2>&1
taskkill /f /im "ollama app.exe" /t >nul 2>&1
timeout /t 2 /nobreak >nul
start "" "%LOCALAPPDATA%\Programs\Ollama\ollama app.exe"
timeout /t 3 /nobreak >nul

echo.
echo [6/6] Estado final de la flota:
ollama list

echo.
echo ===============================================================
echo    PERFILES DISPONIBLES (elige en Cline segun tarea)
echo      ear-14b-textos-sclass     : copy, textos, micro-ediciones (ctx 16k)
echo      ear-27b-apis-sclass       : APIs, rutas Next.js, endpoints (ctx 16k)
echo      ear-32b-arquitecto-sclass : arquitectura, contratos, TS (ctx 16k)
echo.
echo    DOCTRINA VRAM-SHIELD: KV q4_0 + FlashAttention + NumKeep 512
echo    = MARGEN GARANTIZADO EN 24GB. NUNCA OFFLOAD A RAM/CPU.
echo ===============================================================
echo.
pause