@echo off
chcp 65001 > nul
title 🦇 EAR OS — TRANSCRIPTOR DE AUDIO SOBERANO S-CLASS

echo ==============================================================================
echo 🦇 ANTIGRAVITY OMEGA v7.0 — TRANSCRIPTOR DE AUDIO SOBERANO (WHISPER)
echo Absorbiendo y transcribiendo palabra por palabra con Whisper
echo Bóveda Media:     D:\00_VELOCITY_MEDIA_VAULT
echo Bóveda Obsidian:  H:\EAR_VAULT_VELOCITY_KNOWLEDGE
echo ==============================================================================
echo.

set PYTHONIOENCODING=utf-8
python scripts/ops/velocity_vampire_transcriber.py 10

echo.
echo Presiona cualquier tecla para salir...
pause > nul