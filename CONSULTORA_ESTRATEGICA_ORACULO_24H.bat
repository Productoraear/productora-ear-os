@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

title 🧠 ORÁCULO ESTRATÉGICO EAR OS 24H - CONSULTORA ESTRATÉGICA S-CLASS

echo ==============================================================================
echo 🏛️ ANTIGRAVITY OMEGA v7.0 — ORÁCULO ESTRATÉGICO EAR OS 24H (CONSULTORA ESTRATÉGICA)
echo Bóveda de Conocimiento: H:\EAR_VAULT_VELOCITY_KNOWLEDGE
echo Bóveda Multimedia:     D:\00_VELOCITY_MEDIA_VAULT
echo ==============================================================================
echo.

if "%~1"=="" (
    set /p "PREGUNTA=Escribe tu consulta de estrategia, marketing, ventas o alumnos: "
) else (
    set "PREGUNTA=%*"
)

set PYTHONIOENCODING=utf-8
python scripts/ops/velocity_oracle.py "!PREGUNTA!"

echo.
pause