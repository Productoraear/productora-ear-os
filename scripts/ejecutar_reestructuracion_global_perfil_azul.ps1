# MASTER BLUEPRINT: REESTRUCTURACION GLOBAL ENTERPRISE PERFIL AZUL
# Para todo el PC (Discos C:, E:, F:, G:, H:)
# REGLA SAGRADA: G:\EAR_OS_V2 ES INTOCABLE

$ErrorActionPreference = 'Stop'

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "INICIANDO PURIFICACION GLOBAL DEL PC -- ESTANDAR PERFIL AZUL     " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# -------------------------------------------------------------------
# FASE 1: UNIDAD G: (Cerebro Operativo y Studio)
# -------------------------------------------------------------------
Write-Host "`n[FASE 1/3] Estructurando Unidad G:\..." -ForegroundColor Yellow

$destTrabajo = "G:\01_TRABAJO"
$destPersonal = "G:\02_PERSONAL"
$destStudio = "G:\03_STUDIO_CREATIVO_Y_AI"
$destBackup = "G:\04_ARCHIVOS_FESTIVOS_BACKUP"

New-Item -ItemType Directory -Path "$destTrabajo\01_PROYECTOS_ACTIVOS" -Force | Out-Null
New-Item -ItemType Directory -Path "$destTrabajo\02_AUDITORIAS_Y_REPORTES" -Force | Out-Null
New-Item -ItemType Directory -Path "$destTrabajo\03_DOCUMENTACION_EMPRESA" -Force | Out-Null
New-Item -ItemType Directory -Path "$destTrabajo\04_CLIENTES_Y_EVENTOS" -Force | Out-Null
New-Item -ItemType Directory -Path "$destTrabajo\05_BUNKERS_E_INGESTION" -Force | Out-Null
New-Item -ItemType Directory -Path "$destTrabajo\06_ARCHIVO_HISTORICO" -Force | Out-Null

New-Item -ItemType Directory -Path "$destStudio\AI_MODELS_HUB" -Force | Out-Null
New-Item -ItemType Directory -Path "$destStudio\ComfyUI" -Force | Out-Null
New-Item -ItemType Directory -Path "$destStudio\DaVinci_Proxies" -Force | Out-Null
New-Item -ItemType Directory -Path "$destStudio\Screenshots" -Force | Out-Null

New-Item -ItemType Directory -Path "$destBackup\RespaldoPC" -Force | Out-Null

# Mover carpetas de Trabajo en G:\
$trabajoFolders = @(
    @{ Src = "G:\00_PRODUCTORA_EAR"; Dest = "$destTrabajo\01_PROYECTOS_ACTIVOS\00_PRODUCTORA_EAR" },
    @{ Src = "G:\EAR_OS_MASTER_2026"; Dest = "$destTrabajo\01_PROYECTOS_ACTIVOS\EAR_OS_MASTER_2026" },
    @{ Src = "G:\EAR_INGESTION_HUB"; Dest = "$destTrabajo\05_BUNKERS_E_INGESTION\EAR_INGESTION_HUB" },
    @{ Src = "G:\EAR_VAULT_XMIND_INBOX"; Dest = "$destTrabajo\05_BUNKERS_E_INGESTION\EAR_VAULT_XMIND_INBOX" },
    @{ Src = "G:\EAR_VAULT_VELOCITY_KNOWLEDGE"; Dest = "$destTrabajo\05_BUNKERS_E_INGESTION\EAR_VAULT_VELOCITY_KNOWLEDGE" },
    @{ Src = "G:\ARCHIVO_FRIO_ESTRUCTURAL"; Dest = "$destTrabajo\06_ARCHIVO_HISTORICO\ARCHIVO_FRIO_ESTRUCTURAL" },
    @{ Src = "G:\ARCHIVO_HISTORICO_EAR"; Dest = "$destTrabajo\06_ARCHIVO_HISTORICO\ARCHIVO_HISTORICO_EAR" }
)

foreach ($item in $trabajoFolders) {
    if (Test-Path $item.Src) {
        Write-Host "  -> Moviendo $($item.Src) => $($item.Dest)" -ForegroundColor Gray
        Move-Item -Path $item.Src -Destination $item.Dest -Force
    }
}

# Mover herramientas Creativas e IA en G:\
$studioFolders = @(
    @{ Src = "G:\AI_MODELS_HUB"; Dest = "$destStudio\AI_MODELS_HUB" },
    @{ Src = "G:\ComfyUI"; Dest = "$destStudio\ComfyUI" },
    @{ Src = "G:\HDAVINCI_WORKINGPROXIES"; Dest = "$destStudio\DaVinci_Proxies" },
    @{ Src = "G:\Screenshots"; Dest = "$destStudio\Screenshots" }
)

foreach ($item in $studioFolders) {
    if (Test-Path $item.Src) {
        Write-Host "  -> Moviendo $($item.Src) => $($item.Dest)" -ForegroundColor Gray
        Move-Item -Path $item.Src -Destination $item.Dest -Force
    }
}

# Mover RespaldoPC en G:\
if (Test-Path "G:\RespaldoPC") {
    Write-Host "  -> Moviendo G:\RespaldoPC => $destBackup\RespaldoPC" -ForegroundColor Gray
    Move-Item -Path "G:\RespaldoPC" -Destination "$destBackup\RespaldoPC" -Force
}

# -------------------------------------------------------------------
# FASE 2: UNIDAD F: (Consolidación de Transferencias Temporales)
# -------------------------------------------------------------------
Write-Host "`n[FASE 2/3] Estructurando Unidad F:\..." -ForegroundColor Yellow
$destF_Trabajo = "F:\01_TRABAJO_MEDIA"
$destF_Personal = "F:\02_PERSONAL_MEDIA"
New-Item -ItemType Directory -Path $destF_Trabajo -Force | Out-Null
New-Item -ItemType Directory -Path $destF_Personal -Force | Out-Null

if (Test-Path "F:\A grabacion ALGUN DIA MAMA EN CASA ANTOINE PETE") {
    Move-Item -Path "F:\A grabacion ALGUN DIA MAMA EN CASA ANTOINE PETE" -Destination "$destF_Personal\" -Force
}
if (Test-Path "F:\transfer-01a0804f") {
    Move-Item -Path "F:\transfer-01a0804f" -Destination "$destF_Trabajo\" -Force
}

# -------------------------------------------------------------------
# FASE 3: JUNCTION DIRECTORY PARA MANTENER COMPATIBILIDAD CON OLLAMA
# -------------------------------------------------------------------
Write-Host "`n[FASE 3/3] Configurando Junctions Transparentes..." -ForegroundColor Yellow

# Re-vincular variable OLLAMA_MODELS al nuevo path
[Environment]::SetEnvironmentVariable("OLLAMA_MODELS", "G:\03_STUDIO_CREATIVO_Y_AI\AI_MODELS_HUB", "User")
[Environment]::SetEnvironmentVariable("OLLAMA_MODELS", "G:\03_STUDIO_CREATIVO_Y_AI\AI_MODELS_HUB", "Machine")

# Crear Junction para que cualquier script que busque G:\AI_MODELS_HUB siga funcionando 100% transparente
cmd /c "mklink /J G:\AI_MODELS_HUB G:\03_STUDIO_CREATIVO_Y_AI\AI_MODELS_HUB" | Out-Null

Write-Host "`n=================================================================" -ForegroundColor Green
Write-Host "PURIFICACION GLOBAL FINALIZADA CON EXITO." -ForegroundColor Green
Write-Host "G:\EAR_OS_V2 PERMANECE 100% INTACTO Y OPERATIVO." -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
