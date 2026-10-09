# ═══════════════════════════════════════════════════════════════════
# ARRANQUE LOTE 10 — CEO-side orchestration unificada (una sola orden)
# Uso (PowerShell 7):  pwsh -File .antigravity/arranque_obrero_lote10.ps1
# ═══════════════════════════════════════════════════════════════════
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

Write-Host '════════ 1/3 · BASELINE GIT (debe estar limpio) ════════' -ForegroundColor Cyan
git -C $root diff --stat
Write-Host ''

Write-Host '════════ 2/3 · PRECARGA EJECUTOR 27B EN VRAM ════════' -ForegroundColor Cyan
ollama run ear-27b-apis-sclass:latest ""
Write-Host ''

Write-Host '════════ 3/3 · EMITIENDO PROMPT ATOMICO DE LA 1a MISION ════════' -ForegroundColor Cyan
node "$PSScriptRoot\omega.js" next
Write-Host ''
Write-Host '>>> Copia el PROMPT de arriba en la nueva tarea de Cline (backend ear-27b) <<<' -ForegroundColor Yellow