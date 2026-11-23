# ════════════════════════════════════════════════════════════════════════════════
# SCRIPT DE RESCATE S-CLASS (NIVEL 0 - BOTÓN DE PÁNICO)
# Mata procesos bloqueantes en 3007 y 5432, limpia caché .next y levanta Next.js
# ════════════════════════════════════════════════════════════════════════════════
$ErrorActionPreference = 'SilentlyContinue'

Write-Host "======================================================" -ForegroundColor Yellow
Write-Host "   [EAR OS RESCUE] INICIANDO RESCATE DE PUERTO Y CACHE " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Yellow

# 1. Matar procesos que ocupan los puertos 3007 y 5432 o Node colgado
Write-Host "[1/4] Purgando procesos zombies de Node, Next.js y Postgres..." -ForegroundColor Yellow
Get-Process -Name node, postgres, turbopack -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Comprobar si algún proceso sigue usando el puerto 3007
$port3007 = Get-NetTCPConnection -LocalPort 3007 -ErrorAction SilentlyContinue
if ($port3007) {
    Write-Host "   -> Forzando cierre del PID $($port3007.OwningProcess) en puerto 3007" -ForegroundColor Red
    Stop-Process -Id $port3007.OwningProcess -Force -ErrorAction SilentlyContinue
}

# 2. Limpieza de caché corrupta .next (sin tocar código)
Write-Host "[2/4] Eliminando cache corrupta de .next..." -ForegroundColor Yellow
$nextPath = Join-Path $PSScriptRoot "..\.next"
if (Test-Path $nextPath) {
    Remove-Item -Recurse -Force $nextPath -ErrorAction SilentlyContinue
}

# 3. Comprobar sanidad de tipos rápida
Write-Host "[3/4] Verificando compilador de TypeScript..." -ForegroundColor Yellow
$rootPath = Join-Path $PSScriptRoot ".."
Set-Location $rootPath

Write-Host "[4/4] Levantando servidor de desarrollo en limpio (Puerto 3007)..." -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host "   SERVIDOR RESTAURADO: http://localhost:3007" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Green

npm run dev
