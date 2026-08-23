# EAR OS - INSTALADOR DE 1 CLIC PARA DJS
# Universal Cue Bridge - Deteccion Automatica y Watcher de Sesiones
# Ejecucion: PowerShell -ExecutionPolicy Bypass -File .\scripts\install-ear-cue-bridge.ps1

param(
    [string]$DjName = "",
    [string]$DjNif  = "",
    [switch]$SkipWatcher
)

$ErrorActionPreference = "SilentlyContinue"

$EAR_CONFIG_DIR   = Join-Path $env:USERPROFILE ".ear-os"
$EAR_CONFIG_FILE  = Join-Path $EAR_CONFIG_DIR "ear-dj-config.json"
$EAR_HISTORY_DIR  = Join-Path $EAR_CONFIG_DIR "session-history"
$EAR_CERTS_DIR    = Join-Path $EAR_CONFIG_DIR "certificates"
$EAR_WATCHER_SCRIPT = Join-Path $EAR_CONFIG_DIR "ear-session-watcher.ps1"

# BANNER
Write-Host ""
Write-Host "==================================================================" -ForegroundColor DarkYellow
Write-Host "  EAR OS - UNIVERSAL CUE BRIDGE - INSTALADOR DJ 1-CLIC" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor DarkYellow
Write-Host ""

# 1. CREAR ESTRUCTURA DE DIRECTORIOS
Write-Host "[1/5] Creando estructura de directorios EAR OS..." -ForegroundColor Cyan

foreach ($dir in @($EAR_CONFIG_DIR, $EAR_HISTORY_DIR, $EAR_CERTS_DIR)) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  + Creado: $dir" -ForegroundColor Green
    } else {
        Write-Host "  . Ya existe: $dir" -ForegroundColor DarkGray
    }
}

# 2. DETECCION AUTOMATICA DE SOFTWARE DJ
Write-Host ""
Write-Host "[2/5] Escaneando software DJ instalado..." -ForegroundColor Cyan

$djSoftware = @{}

# VirtualDJ
$vdjPaths = @(
    (Join-Path $env:USERPROFILE "Documents\VirtualDJ"),
    (Join-Path $env:APPDATA "VirtualDJ"),
    (Join-Path $env:LOCALAPPDATA "VirtualDJ"),
    (Join-Path ${env:ProgramFiles} "VirtualDJ")
)
foreach ($p in $vdjPaths) {
    if (Test-Path $p) {
        $djSoftware["VirtualDJ"] = @{
            path = $p
            historyDir = Join-Path $p "History"
            extensions = @(".m3u", ".m3u8")
            detected = $true
        }
        Write-Host "  [OK] VirtualDJ detectado: $p" -ForegroundColor Green
        break
    }
}
if (-not $djSoftware.ContainsKey("VirtualDJ")) {
    Write-Host "  [ ] VirtualDJ no encontrado" -ForegroundColor DarkGray
}

# Serato DJ
$seratoPaths = @(
    (Join-Path $env:USERPROFILE "Music\_Serato_"),
    (Join-Path $env:LOCALAPPDATA "Serato"),
    (Join-Path $env:APPDATA "Serato"),
    (Join-Path ${env:ProgramFiles} "Serato")
)
foreach ($p in $seratoPaths) {
    if (Test-Path $p) {
        $djSoftware["SeratoDJ"] = @{
            path = $p
            historyDir = Join-Path $p "History"
            extensions = @(".csv", ".txt")
            detected = $true
        }
        Write-Host "  [OK] Serato DJ detectado: $p" -ForegroundColor Green
        break
    }
}
if (-not $djSoftware.ContainsKey("SeratoDJ")) {
    Write-Host "  [ ] Serato DJ no encontrado" -ForegroundColor DarkGray
}

# Rekordbox
$rekordboxPaths = @(
    (Join-Path $env:APPDATA "Pioneer\rekordbox"),
    (Join-Path $env:LOCALAPPDATA "Pioneer\rekordbox"),
    (Join-Path ${env:ProgramFiles} "Pioneer\rekordbox")
)
foreach ($p in $rekordboxPaths) {
    if (Test-Path $p) {
        $djSoftware["Rekordbox"] = @{
            path = $p
            historyDir = $p
            extensions = @(".xml", ".txt")
            detected = $true
        }
        Write-Host "  [OK] Rekordbox detectado: $p" -ForegroundColor Green
        break
    }
}
if (-not $djSoftware.ContainsKey("Rekordbox")) {
    Write-Host "  [ ] Rekordbox no encontrado" -ForegroundColor DarkGray
}

# Traktor Pro
$traktorPaths = @(
    (Join-Path $env:USERPROFILE "Documents\Native Instruments\Traktor"),
    (Join-Path $env:APPDATA "Native Instruments\Traktor Pro 3"),
    (Join-Path $env:LOCALAPPDATA "Native Instruments\Traktor Pro 3"),
    (Join-Path ${env:ProgramFiles} "Native Instruments\Traktor Pro 3")
)
foreach ($p in $traktorPaths) {
    if (Test-Path $p) {
        $djSoftware["TraktorPro"] = @{
            path = $p
            historyDir = Join-Path $p "History"
            extensions = @(".nml")
            detected = $true
        }
        Write-Host "  [OK] Traktor Pro detectado: $p" -ForegroundColor Green
        break
    }
}
if (-not $djSoftware.ContainsKey("TraktorPro")) {
    Write-Host "  [ ] Traktor Pro no encontrado" -ForegroundColor DarkGray
}

# Denon Engine
$denonPaths = @(
    (Join-Path $env:USERPROFILE "Music\Engine Library"),
    (Join-Path ${env:ProgramFiles} "Engine DJ"),
    (Join-Path $env:LOCALAPPDATA "Engine DJ")
)
foreach ($p in $denonPaths) {
    if (Test-Path $p) {
        $djSoftware["DenonEngine"] = @{
            path = $p
            historyDir = Join-Path $p "History"
            extensions = @(".csv")
            detected = $true
        }
        Write-Host "  [OK] Denon Engine DJ detectado: $p" -ForegroundColor Green
        break
    }
}
if (-not $djSoftware.ContainsKey("DenonEngine")) {
    Write-Host "  [ ] Denon Engine no encontrado" -ForegroundColor DarkGray
}

$detectedCount = $djSoftware.Keys.Count
Write-Host ""
Write-Host "  Total software DJ detectado: $detectedCount" -ForegroundColor White

# 3. CREAR CONFIGURACION ear-dj-config.json
Write-Host ""
Write-Host "[3/5] Generando configuracion ear-dj-config.json..." -ForegroundColor Cyan

$softwareEntries = @{}
foreach ($key in $djSoftware.Keys) {
    $sw = $djSoftware[$key]
    $softwareEntries[$key] = @{
        installPath = $sw.path
        historyDirectory = $sw.historyDir
        supportedExtensions = $sw.extensions
        autoDetected = $true
    }
}

$djNameVal = if ($DjName) { $DjName } else { "DJ_NOMBRE_ARTISTICO" }
$djNifVal  = if ($DjNif) { $DjNif } else { "TU_NIF_O_DNI" }

$config = @{
    _schema         = "ear-os-dj-config-v1"
    _generatedAt    = (Get-Date -Format "o")
    _generatedBy    = "EAR OS Universal Cue Bridge Installer v4.8"
    
    djProfile = @{
        artisticName      = $djNameVal
        legalName         = ""
        nifDni            = $djNifVal
        sgaeCode          = "SGAE-XXXX"
        aieCode           = "AIE-XXXX"
        isrcPrefix        = "ES-EAR-"
        currency          = "EUR"
        paymentMethod     = "stripe_connect"
        stripeAccountId   = ""
        email             = ""
        phone             = ""
    }
    
    defaultVenue = @{
        venueName        = "NOMBRE_DEL_LOCAL"
        venueNif         = "NIF_DEL_LOCAL"
        address          = "DIRECCION_COMPLETA"
        city             = "CIUDAD"
        gpsCoordinates   = "LAT,LNG"
        ownerEmail       = "EMAIL_PROPIETARIO"
        maxCapacity      = 0
        licenseNumber    = "LIC-SGAE-XXXX"
    }
    
    detectedSoftware = $softwareEntries
    
    watcherSettings = @{
        enabled          = $true
        pollIntervalMs   = 30000
        autoGenerateCert = $true
        autoEmailVenue   = $false
        certOutputDir    = $EAR_CERTS_DIR
        historyArchiveDir = $EAR_HISTORY_DIR
    }
    
    legalCompliance = @{
        jurisdiction     = "ES"
        applicableLaws   = @(
            "Real Decreto Legislativo 1-1996 Ley de Propiedad Intelectual",
            "SGAE - Tarifas Generales para comunicacion publica",
            "AIE - Derechos conexos de artistas interpretes"
        )
        dataProtection   = "RGPD EU 2016-679"
        consentGiven     = $false
        consentDate      = $null
    }
} | ConvertTo-Json -Depth 10

$config | Out-File -FilePath $EAR_CONFIG_FILE -Encoding utf8 -Force
Write-Host "  + Configuracion guardada: $EAR_CONFIG_FILE" -ForegroundColor Green

# 4. CREAR WATCHER DE SESIONES
Write-Host ""
Write-Host "[4/5] Creando watcher de sesiones..." -ForegroundColor Cyan

if (-not $SkipWatcher) {
    $watcherLines = @(
        '# EAR OS Session Watcher'
        '# Monitorea carpetas de historial DJ y procesa sesiones automaticamente.'
        '$configPath = Join-Path $env:USERPROFILE ".ear-os\ear-dj-config.json"'
        'if (-not (Test-Path $configPath)) {'
        '    Write-Host "ERROR: ear-dj-config.json no encontrado." -ForegroundColor Red'
        '    exit 1'
        '}'
        ''
        '$config = Get-Content $configPath | ConvertFrom-Json'
        '$watchDirs = @()'
        ''
        'foreach ($sw in $config.detectedSoftware.PSObject.Properties) {'
        '    $histDir = $sw.Value.historyDirectory'
        '    if ($histDir -and (Test-Path $histDir)) {'
        '        $watchDirs += $histDir'
        '    }'
        '}'
        ''
        'if ($watchDirs.Count -eq 0) {'
        '    Write-Host "No se encontraron directorios de historial." -ForegroundColor Yellow'
        '    exit 0'
        '}'
        ''
        'Write-Host "EAR OS Watcher activo. Monitoreando directorios..." -ForegroundColor Cyan'
        ''
        'foreach ($dir in $watchDirs) {'
        '    $watcher = New-Object System.IO.FileSystemWatcher'
        '    $watcher.Path = $dir'
        '    $watcher.Filter = "*.*"'
        '    $watcher.EnableRaisingEvents = $true'
        '    $action = {'
        '        $filePath = $Event.SourceEventArgs.FullPath'
        '        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()'
        '        if ($ext -in @(".m3u", ".m3u8", ".csv", ".xml", ".nml", ".txt")) {'
        '            Write-Host "[EAR OS] Nuevo historial detectado: $filePath" -ForegroundColor Green'
        '            $destDir = Join-Path $env:USERPROFILE ".ear-os\session-history"'
        '            $timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"'
        '            $destName = $timestamp + "_" + [System.IO.Path]::GetFileName($filePath)'
        '            $destFile = Join-Path $destDir $destName'
        '            Copy-Item $filePath $destFile -Force'
        '            Write-Host "[EAR OS] Historial archivado: $destFile" -ForegroundColor Cyan'
        '        }'
        '    }'
        '    Register-ObjectEvent $watcher "Created" -Action $action | Out-Null'
        '}'
        ''
        'Write-Host "Presiona Ctrl+C para detener el watcher." -ForegroundColor DarkGray'
        'while ($true) { Start-Sleep -Seconds 5 }'
    )
    $watcherLines -join "`r`n" | Out-File -FilePath $EAR_WATCHER_SCRIPT -Encoding utf8 -Force
    Write-Host "  + Watcher script creado: $EAR_WATCHER_SCRIPT" -ForegroundColor Green
    Write-Host "  Para activar: PowerShell -File $EAR_WATCHER_SCRIPT" -ForegroundColor DarkGray
} else {
    Write-Host "  Watcher omitido por parametro -SkipWatcher" -ForegroundColor DarkGray
}

# 5. RESUMEN FINAL
Write-Host ""
Write-Host "==================================================================" -ForegroundColor DarkYellow
Write-Host "  INSTALACION COMPLETADA - EAR OS UNIVERSAL CUE BRIDGE" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "  Configuracion:  $EAR_CONFIG_FILE" -ForegroundColor White
Write-Host "  Certificados:   $EAR_CERTS_DIR" -ForegroundColor White
Write-Host "  Historial:      $EAR_HISTORY_DIR" -ForegroundColor White
Write-Host "  Software DJ:    $detectedCount motores detectados" -ForegroundColor White
Write-Host ""
Write-Host "  PROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "  1. Edita ear-dj-config.json con tus datos reales" -ForegroundColor DarkGray
Write-Host "  2. Activa el watcher con PowerShell" -ForegroundColor DarkGray
Write-Host "  3. Pincha una sesion y el certificado SHA-256 se generara al cerrar." -ForegroundColor DarkGray
Write-Host ""
Write-Host "  2026 Productora EAR S.L. - edwinagudelo.es" -ForegroundColor DarkGray
Write-Host ""
