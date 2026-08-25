@echo off
title Monitor EAR OS - Whisper GPU
color 0A
mode con: cols=85 lines=25
cd /d "H:\EAR_OS_V2\EAR_OS_V2"
python scripts\whisper_live_hud.py
pause
