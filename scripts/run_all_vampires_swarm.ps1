# ==============================================================================
# DISPARADOR DEL ENJAMBRE DE VAMPIROS PARALELOS - EAR OS V2
# ==============================================================================
$ErrorActionPreference = 'Stop'
Set-Location "H:\EAR_OS_V2\EAR_OS_V2"

Write-Host "`n>> [IGNICIÓN BARE-METAL] Desplegando Enjambre de Vampiros en Paralelo..." -ForegroundColor Cyan
Write-Host ">> [INFO] 7 Unidades de Ingesta Simultánea coordinadas..." -ForegroundColor Yellow

# Ejecución del orquestador de vampiros
python scripts\vampire_swarm_orchestrator.py

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[!] Falló la ejecución del enjambre vampírico (Exit Code $LASTEXITCODE)." -ForegroundColor Red
    exit 1
}

Write-Host "`n>> [VALIDACIÓN] Verificando compilación estricta de TypeScript..." -ForegroundColor Cyan
npx tsc --noEmit

if ($LASTEXITCODE -eq 0) {
    Write-Host ">> [+] TypeScript validado: Exit Code 0. Estado inmaculado." -ForegroundColor Green
} else {
    Write-Host "[!] Advertencia: Errores detectados en la verificación TypeScript." -ForegroundColor Red
    exit 1
}

Write-Host "`n>> [COMPLETADO] Ciclo de vampirización paralelo concluido y sellado." -ForegroundColor Green
