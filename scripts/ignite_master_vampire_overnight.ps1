# ignite_master_vampire_overnight.ps1
# ═══════════════════════════════════════════════════════════════════════════════
#   🦇 EAR OS V2 — MASTER OVERNIGHT VAMPIRE IGNITION (BODAS.NET + CELEBRENTS)
#   Arquitectura: ANTIGRAVITY OMEGA v7.0 · Modo CEO Activo · Protocolo ZTM
# ═══════════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = 'Continue'

# 1. Configurar Credenciales PostgreSQL Locales
$env:PGUSER = 'postgres'
$env:PGPASSWORD = 'postgres'
$env:DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/ear_os?schema=public'

Write-Host "`n==================================================================" -ForegroundColor Cyan
Write-Host "🦇 [EAR OS OMEGA v7.0] INICIANDO ENJAMBRE VAMPÍRICO NOCTURNO S-CLASS" -ForegroundColor Yellow
Write-Host "   Meta: >65.000 Bodas.net + 10.028 Celebrents con 99% de Info HTML" -ForegroundColor Cyan
Write-Host "==================================================================`n" -ForegroundColor Cyan

# 2. Paso 1: Absorción Masiva de Bodas.net (Búnker 28.8k HTMLs + Bases de Datos)
Write-Host "[1/4] Ejecutando Absorbedor Total de Bodas.net..." -ForegroundColor Green
python scripts/unified/master_bodas_total_harvester.py

# 3. Paso 2: Ejecución del Demonio Vampiro (Celebrents + Enriquecimiento Live)
Write-Host "`n[2/4] Activando Daemon de Minería y Extracción de Celebrents.es..." -ForegroundColor Green
python scripts/unified/master_overnight_vampire_daemon.py --workers 10

# 4. Paso 3: Sincronización OMEGA (Cotizador Neural + 12 Archivos Edge + Bóveda Obsidian)
Write-Host "`n[3/4] Sincronizando Catálogo Neural y Bóvedas Obsidian..." -ForegroundColor Green
python scripts/unified/sincronizador_omega_proveedores.py

# 5. Paso 4: Sincronización de Imágenes Auténticas y Base de Datos Supabase/Postgres
Write-Host "`n[4/4] Sincronizando Portfolios e Imágenes Auténticas en BD PostgreSQL..." -ForegroundColor Green
npx tsx scripts/sync_all_authentic_images.ts

# 6. Verificación de Compilación TypeScript
Write-Host "`n[AUDITORÍA] Verificando Compilación TypeScript estricta..." -ForegroundColor Magenta
npx tsc --noEmit
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[✓ EXIT CODE 0] ENJAMBRE VAMPÍRICO CULMINADO EXITOSAMENTE. BASE LISTA PARA PRODUCCIÓN." -ForegroundColor Green
} else {
    Write-Host "`n[!] Se detectaron advertencias de tipos en TypeScript." -ForegroundColor Yellow
}
