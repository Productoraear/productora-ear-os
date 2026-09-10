# scripts/ejecutar_sincronizacion_sclass.ps1
# ==============================================================================
# ORQUESTADOR MAESTRO NIVEL OMEGA S-CLASS - PRODUCTORA EAR OS
# ==============================================================================
# 1. Enriquecimiento profundo de 53.631 proveedores (Fotos HD, GPS, Telefonos)
# 2. Destilacion cognitiva de TODOS los chats historicos para NotebookLM y Obsidian
# 3. Sincronizacion del Centro de Mando en el Vault
# ==============================================================================

$ErrorActionPreference = 'SilentlyContinue'

Write-Host "`n"
Write-Host "======================================================================" -ForegroundColor Magenta
Write-Host "    ORQUESTADOR MAESTRO NIVEL OMEGA BARE-METAL - PRODUCTORA EAR OS    " -ForegroundColor Magenta
Write-Host "======================================================================" -ForegroundColor Magenta
Write-Host "  Modo: Soberania Kernel Clase-S (Zero-Token Memory & High-Signal)`n" -ForegroundColor DarkGray

# 1. PASO 1: Absorber Chat de Perplexity sobre Hardware (i9 + RX 7900 XTX 24GB)
Write-Host "[PASO 1/5] Absorbiendo y Analizando Chat de Perplexity (Hardware S-Class)..." -ForegroundColor Cyan
python "$PSScriptRoot\unified\absorb_perplexity_chat.py"

# 2. PASO 2: Enriquecimiento Profundo de Proveedores SOTA
Write-Host "`n[PASO 2/5] Ejecutando Extraccion Profunda de Fotos HD, GPS y Telefonos..." -ForegroundColor Cyan
python "$PSScriptRoot\unified\deep_provider_extractor.py"

# 3. PASO 3: Absorber los 4 Pilares (Mapas Mentales XMind, B2G Alumbrado, Cátedra Whisper)
Write-Host "`n[PASO 3/5] Absorbiendo Mapas Mentales, Licitaciones B2G y Catedra Whisper..." -ForegroundColor Cyan
python "$PSScriptRoot\unified\master_pc_knowledge_absorber.py"

# 4. PASO 4: Destilacion Cognitiva Total de Chats para NotebookLM y Obsidian
Write-Host "`n[PASO 4/5] Ejecutando Destilacion Cognitiva de TODOS los Chats Historicos..." -ForegroundColor Cyan
python "$PSScriptRoot\unified\historic_chat_distiller.py" --all

# 5. PASO 5: Saneamiento Purista de Bóveda (5 Carpetas Maestras y Visor de Proveedores)
Write-Host "`n[PASO 5/6] Ejecutando Saneamiento Purista de Bóveda y Generando Visor Visual..." -ForegroundColor Cyan
python "$PSScriptRoot\unified\purist_vault_sanitizer.py"

# 6. PASO 6: Sincronizar Centro de Mando en el Vault
Write-Host "`n[PASO 6/6] Sincronizando Centro de Mando en Boveda Obsidian..." -ForegroundColor Cyan
$docSource = "H:\EAR_OS_V2\EAR_OS_V2\docs\00_CENTRO_DE_MANDO_SCLASS.md"
$vaultTarget = "H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\00_CENTRO_DE_MANDO_SCLASS.md"

if (Test-Path $docSource) {
    Copy-Item -Path $docSource -Destination $vaultTarget -Force
    Write-Host "  [OK] Portada y Dashboard sincronizados en Vault: $vaultTarget" -ForegroundColor Green
}

Write-Host "`n  ======================================================================" -ForegroundColor Green
Write-Host "  [EXIT CODE 0] SINCRONIZACION MAESTRA NIVEL OMEGA COMPLETADA" -ForegroundColor Green
Write-Host "  ======================================================================" -ForegroundColor Green
Write-Host "  > Proveedores Enriquecidos : H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\Providers\vampirized-providers-deep-sclass.json" -ForegroundColor DarkGray
Write-Host "  > Compilado NotebookLM     : H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\HISTORIC_AI_CHATS\NOTEBOOKLM_DESTILADO_TOTAL_SCLASS.md" -ForegroundColor DarkGray
Write-Host "  > Boveda Obsidian          : H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\" -ForegroundColor DarkGray
Write-Host ""
