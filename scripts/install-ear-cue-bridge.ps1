# EAR OS - INSTALADOR MULTI-MARCA DE 1 CLIC PARA DJS v4.10
# Universal Cue Bridge - Selector de Marca + Generico + Watcher de Sesiones
# Ejecucion: PowerShell -ExecutionPolicy Bypass -File .\scripts\install-ear-cue-bridge.ps1
# Con marca:  .\install-ear-cue-bridge.ps1 -Brand VirtualDJ -DjName "DJ Edwin"

param(
    [string]$DjName = "",
    [string]$DjNif  = "",
    [ValidateSet("Auto","VirtualDJ","Rekordbox","Serato","Traktor","Denon","Generic","")]
    [string]$Brand  = "",
    [string]$GenericPath = "",
    [switch]$SkipWatcher
)

$ErrorActionPreference = "SilentlyContinue"

$EAR_CONFIG_DIR     = Join-Path $env:USERPROFILE ".ear-os"
$EAR_CONFIG_FILE    = Join-Path $EAR_CONFIG_DIR "ear-dj-config.json"
$EAR_HISTORY_DIR    = Join-Path $EAR_CONFIG_DIR "session-history"
$EAR_CERTS_DIR      = Join-Path $EAR_CONFIG_DIR "certificates"
$EAR_WATCHER_SCRIPT = Join-Path $EAR_CONFIG_DIR "ear-session-watcher.ps1"

# ===== BANNER =====
Write-Host ""
Write-Host "==================================================================" -ForegroundColor DarkYellow
Write-Host "  EAR OS - UNIVERSAL CUE BRIDGE v4.10 - INSTALADOR DJ S-CLASS" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor DarkYellow
Write-Host ""

# ===== STEP 0: MENU INTERACTIVO DE SELECCION DE MARCA =====
if (-not $Brand) {
    Write-Host "[0/6] Selecciona tu software DJ principal:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  [1] VirtualDJ" -ForegroundColor White
    Write-Host "  [2] Pioneer Rekordbox" -ForegroundColor White
    Write-Host "  [3] Serato DJ Pro" -ForegroundColor White
    Write-Host "  [4] Native Instruments Traktor" -ForegroundColor White
    Write-Host "  [5] Denon Engine DJ" -ForegroundColor White
    Write-Host "  [6] Generico - Carpeta personalizada / Watcher M3U, CSV, TXT" -ForegroundColor Yellow
    Write-Host "  [A] Auto-detectar todos los instalados" -ForegroundColor Green
    Write-Host ""
    $selection = Read-Host "  Tu eleccion [1-6 / A]"

    switch ($selection) {
        "1" { $Brand = "VirtualDJ" }
        "2" { $Brand = "Rekordbox" }
        "3" { $Brand = "Serato" }
        "4" { $Brand = "Traktor" }
        "5" { $Brand = "Denon" }
        "6" { $Brand = "Generic" }
        "A" { $Brand = "Auto" }
        "a" { $Brand = "Auto" }
        default { $Brand = "Auto" }
    }
    Write-Host ""
    Write-Host "  >> Modo seleccionado: $Brand" -ForegroundColor Green
    Write-Host ""
}

# ===== STEP 1: CREAR ESTRUCTURA DE DIRECTORIOS =====
Write-Host "[1/6] Creando estructura de directorios EAR OS..." -ForegroundColor Cyan

foreach ($dir in @($EAR_CONFIG_DIR, $EAR_HISTORY_DIR, $EAR_CERTS_DIR)) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  + Creado: $dir" -ForegroundColor Green
    } else {
        Write-Host "  . Ya existe: $dir" -ForegroundColor DarkGray
    }
}

# ===== STEP 2: DETECCION DE SOFTWARE DJ (Segun seleccion) =====
Write-Host ""
Write-Host "[2/6] Escaneando software DJ..." -ForegroundColor Cyan

$djSoftware = @{}

# ----- Funciones de deteccion por marca -----
function Detect-VirtualDJ {
    $paths = @(
        (Join-Path $env:USERPROFILE "Documents\VirtualDJ"),
        (Join-Path $env:APPDATA "VirtualDJ"),
        (Join-Path $env:LOCALAPPDATA "VirtualDJ"),
        (Join-Path ${env:ProgramFiles} "VirtualDJ")
    )
    foreach ($p in $paths) {
        if (Test-Path $p) { return $p }
    }
    return $null
}

function Detect-Rekordbox {
    $paths = @(
        (Join-Path $env:APPDATA "Pioneer\rekordbox"),
        (Join-Path $env:LOCALAPPDATA "Pioneer\rekordbox"),
        (Join-Path ${env:ProgramFiles} "Pioneer\rekordbox")
    )
    foreach ($p in $paths) {
        if (Test-Path $p) { return $p }
    }
    return $null
}

function Detect-Serato {
    $paths = @(
        (Join-Path $env:USERPROFILE "Music\_Serato_"),
        (Join-Path $env:LOCALAPPDATA "Serato"),
        (Join-Path $env:APPDATA "Serato"),
        (Join-Path ${env:ProgramFiles} "Serato")
    )
    foreach ($p in $paths) {
        if (Test-Path $p) { return $p }
    }
    return $null
}

function Detect-Traktor {
    $paths = @(
        (Join-Path $env:USERPROFILE "Documents\Native Instruments\Traktor"),
        (Join-Path $env:APPDATA "Native Instruments\Traktor Pro 3"),
        (Join-Path $env:LOCALAPPDATA "Native Instruments\Traktor Pro 3"),
        (Join-Path ${env:ProgramFiles} "Native Instruments\Traktor Pro 3")
    )
    foreach ($p in $paths) {
        if (Test-Path $p) { return $p }
    }
    return $null
}

function Detect-Denon {
    $paths = @(
        (Join-Path $env:USERPROFILE "Music\Engine Library"),
        (Join-Path ${env:ProgramFiles} "Engine DJ"),
        (Join-Path $env:LOCALAPPDATA "Engine DJ")
    )
    foreach ($p in $paths) {
        if (Test-Path $p) { return $p }
    }
    return $null
}

function Register-Software {
    param($Name, $Path, $HistSubDir, $Exts)
    if ($Path) {
        $histDir = if ($HistSubDir) { Join-Path $Path $HistSubDir } else { $Path }
        $script:djSoftware[$Name] = @{
            path = $Path
            historyDir = $histDir
            extensions = $Exts
            detected = $true
        }
        Write-Host "  [OK] $Name detectado: $Path" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  [ ] $Name no encontrado en el sistema" -ForegroundColor DarkGray
        return $false
    }
}

# ----- Ejecutar segun modo -----
if ($Brand -eq "Auto") {
    $vdj = Detect-VirtualDJ; Register-Software "VirtualDJ" $vdj "History" @(".m3u",".m3u8") | Out-Null
    $rek = Detect-Rekordbox;  Register-Software "Rekordbox" $rek $null @(".xml",".txt") | Out-Null
    $ser = Detect-Serato;     Register-Software "SeratoDJ" $ser "History" @(".csv",".txt") | Out-Null
    $trk = Detect-Traktor;    Register-Software "TraktorPro" $trk "History" @(".nml") | Out-Null
    $den = Detect-Denon;      Register-Software "DenonEngine" $den "History" @(".csv") | Out-Null
}
elseif ($Brand -eq "VirtualDJ") {
    $p = Detect-VirtualDJ; Register-Software "VirtualDJ" $p "History" @(".m3u",".m3u8") | Out-Null
}
elseif ($Brand -eq "Rekordbox") {
    $p = Detect-Rekordbox; Register-Software "Rekordbox" $p $null @(".xml",".txt") | Out-Null
}
elseif ($Brand -eq "Serato") {
    $p = Detect-Serato; Register-Software "SeratoDJ" $p "History" @(".csv",".txt") | Out-Null
}
elseif ($Brand -eq "Traktor") {
    $p = Detect-Traktor; Register-Software "TraktorPro" $p "History" @(".nml") | Out-Null
}
elseif ($Brand -eq "Denon") {
    $p = Detect-Denon; Register-Software "DenonEngine" $p "History" @(".csv") | Out-Null
}
elseif ($Brand -eq "Generic") {
    Write-Host ""
    Write-Host "  MODO GENERICO - Carpeta personalizada de historiales" -ForegroundColor Yellow

    if (-not $GenericPath) {
        $GenericPath = Read-Host "  Introduce la ruta completa de tu carpeta de historiales DJ"
    }

    if ($GenericPath -and (Test-Path $GenericPath)) {
        $djSoftware["Generic"] = @{
            path = $GenericPath
            historyDir = $GenericPath
            extensions = @(".m3u", ".m3u8", ".csv", ".xml", ".nml", ".txt")
            detected = $true
        }
        Write-Host "  [OK] Carpeta generica registrada: $GenericPath" -ForegroundColor Green
    }
    elseif ($GenericPath) {
        Write-Host "  [!] Ruta no encontrada: $GenericPath" -ForegroundColor Red
        Write-Host "  Creando la carpeta..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $GenericPath -Force | Out-Null
        $djSoftware["Generic"] = @{
            path = $GenericPath
            historyDir = $GenericPath
            extensions = @(".m3u", ".m3u8", ".csv", ".xml", ".nml", ".txt")
            detected = $true
        }
        Write-Host "  [OK] Carpeta generica creada y registrada: $GenericPath" -ForegroundColor Green
    }
    else {
        # Fallback: crear carpeta generica en .ear-os
        $fallbackDir = Join-Path $EAR_CONFIG_DIR "generic-history"
        New-Item -ItemType Directory -Path $fallbackDir -Force | Out-Null
        $djSoftware["Generic"] = @{
            path = $fallbackDir
            historyDir = $fallbackDir
            extensions = @(".m3u", ".m3u8", ".csv", ".xml", ".nml", ".txt")
            detected = $true
        }
        Write-Host "  [OK] Carpeta generica fallback: $fallbackDir" -ForegroundColor Yellow
    }
}

$detectedCount = $djSoftware.Keys.Count
Write-Host ""
Write-Host "  Total motores configurados: $detectedCount" -ForegroundColor White

# ===== STEP 3: CREAR CONFIGURACION ear-dj-config.json =====
Write-Host ""
Write-Host "[3/6] Generando configuracion ear-dj-config.json..." -ForegroundColor Cyan

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
    _schema         = "ear-os-dj-config-v4.10"
    _generatedAt    = (Get-Date -Format "o")
    _generatedBy    = "EAR OS Universal Cue Bridge Installer v4.10"
    _brandMode      = $Brand

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
        enabled           = $true
        pollIntervalMs    = 30000
        autoGenerateCert  = $true
        autoEmailVenue    = $false
        certOutputDir     = $EAR_CERTS_DIR
        historyArchiveDir = $EAR_HISTORY_DIR
    }

    ollamaOffloading = @{
        enabled       = $true
        endpoint      = "http://localhost:11434"
        preferredModel = "qwen2.5-coder:32b"
        fallbackModel  = "llama3.1:latest"
        useCases       = @(
            "RAG indexing and semantic extraction",
            "Log parsing and batch file processing",
            "Off-context data mining ZTM protocol"
        )
        hardwareNote  = "AMD Radeon RX 7900 XTX 24GB VRAM"
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

# ===== STEP 4: CREAR WATCHER DE SESIONES =====
Write-Host ""
Write-Host "[4/6] Creando watcher de sesiones..." -ForegroundColor Cyan

if (-not $SkipWatcher) {
    $watcherLines = @(
        '# EAR OS Session Watcher v4.10'
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
        'Write-Host "EAR OS Watcher v4.10 activo. Monitoreando directorios..." -ForegroundColor Cyan'
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

# ===== STEP 5: VERIFICAR OLLAMA LOCAL =====
Write-Host ""
Write-Host "[5/6] Verificando Ollama local para offloading GPU..." -ForegroundColor Cyan

$ollamaReady = $false
try {
    $ollamaTest = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -TimeoutSec 3 -ErrorAction Stop
    if ($ollamaTest) {
        $modelNames = $ollamaTest.models | ForEach-Object { $_.name }
        $ollamaReady = $true
        Write-Host "  [OK] Ollama activo en localhost:11434" -ForegroundColor Green
        Write-Host "  Modelos disponibles: $($modelNames -join ', ')" -ForegroundColor DarkGray
    }
} catch {
    Write-Host "  [ ] Ollama no detectado en localhost:11434" -ForegroundColor DarkGray
    Write-Host "  Para activar: ollama serve" -ForegroundColor DarkGray
}

# ===== STEP 6: RESUMEN FINAL =====
Write-Host ""
Write-Host "==================================================================" -ForegroundColor DarkYellow
Write-Host "  INSTALACION COMPLETADA - EAR OS UNIVERSAL CUE BRIDGE v4.10" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "  Modo:           $Brand" -ForegroundColor White
Write-Host "  Configuracion:  $EAR_CONFIG_FILE" -ForegroundColor White
Write-Host "  Certificados:   $EAR_CERTS_DIR" -ForegroundColor White
Write-Host "  Historial:      $EAR_HISTORY_DIR" -ForegroundColor White
Write-Host "  Software DJ:    $detectedCount motores configurados" -ForegroundColor White
$ollamaStatus = if ($ollamaReady) { "ACTIVO - GPU Offloading habilitado" } else { "NO DETECTADO" }
Write-Host "  Ollama Local:   $ollamaStatus" -ForegroundColor White
Write-Host ""
Write-Host "  PROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "  1. Edita ear-dj-config.json con tus datos reales" -ForegroundColor DarkGray
Write-Host "  2. Activa el watcher con PowerShell" -ForegroundColor DarkGray
Write-Host "  3. Pincha una sesion y el certificado SHA-256 se generara al cerrar." -ForegroundColor DarkGray
Write-Host ""
Write-Host "  2026 Productora EAR S.L. - edwinagudelo.es" -ForegroundColor DarkGray
Write-Host ""
