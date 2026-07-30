# ===========================================================================
# PROTOCOLO GRAVITACIONAL V3.0 - "S-CLASS FORENSIC" EDITION
# Misión: Recuperación Atómica con Sidecar Metadata para Triaje
# ===========================================================================
$ErrorActionPreference = "SilentlyContinue"
$ProjectRoot = "C:\EAR_OS_V2"
$RecoveryRoot = Join-Path $ProjectRoot "ARCHIVE_RECOVERY"
$ConfirmadoPath = Join-Path $RecoveryRoot "CONFIRMED_ADN"
$ScrapingVault = Join-Path $RecoveryRoot "SCRAPING_INTELLIGENCE"

# 1. Marcadores de ADN Propios y Competencia
$HighMarkers = @("AuraWallet", "Edwin Agudelo", "rankArtist", "Astra AI", "DominanceScore")
$ScrapingMarkers = @("bodas.net", "zankyou", "celebrate")
$Extensions = @("*.ts", "*.tsx", "*.js", "*.json", "*.md", "*.env*", "*.htm", "*.html")

# Preparar carpetas
foreach ($p in @($ConfirmadoPath, $ScrapingVault)) { if (!(Test-Path $p)) { New-Item -ItemType Directory -Force -Path $p | Out-Null } }

Clear-Host
Write-Host "🔱 LANZANDO POZO GRAVITACIONAL V3.0 - MODO FORENSE" -ForegroundColor Cyan
Write-Host "--- CADA BIT RECUPERADO TENDRÁ SU IDENTIDAD PRESERVADA ---" -ForegroundColor Yellow

$Drives = Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Free -gt 0 -and $_.Root -notmatch "A:|B:" }

foreach ($Drive in $Drives) {
    Write-Host "`n[🚀] Succionando en $($Drive.Root)..." -ForegroundColor Gray
    
    Get-ChildItem -Path $Drive.Root -Include $Extensions -Recurse -File -Attributes !ReparsePoint -ErrorAction SilentlyContinue | 
    Where-Object { $_.FullName -notlike "$ProjectRoot*" -and $_.Length -lt 10MB } | ForEach-Object {
        $File = $_
        $Confidence = "NONE"
        
        # Clasificación
        if ($File.Extension -match "htm|html") {
            $Confidence = "INTEL_SCRAPING"
        } else {
            $Content = Get-Content $File.FullName -TotalCount 50 -ErrorAction SilentlyContinue
            foreach ($m in $HighMarkers) { if ($Content -match $m) { $Confidence = "HIGH_ADN"; break } }
            if ($Confidence -eq "NONE") {
                foreach ($s in $ScrapingMarkers) { if ($Content -match $s) { $Confidence = "COMPETITOR_INTEL"; break } }
            }
        }

        # Si hay coincidencia, ejecutar Protocolo Forense
        if ($Confidence -ne "NONE") {
            $TargetDir = if ($Confidence -eq "HIGH_ADN") { $ConfirmadoPath } else { $ScrapingVault }
            $UniqueName = "REC_$(Get-Date -Format 'yyyyMMdd_HHmmss')_$($File.Name)"
            $DestFile = Join-Path $TargetDir $UniqueName

            try {
                # 1. Copiar el archivo original
                Copy-Item -Path $File.FullName -Destination $DestFile -Force
                
                # 2. Generar el Sidecar Metadata (HUELLA FORENSE)
                $MetaData = @{
                    ArchivoRecuperado = $UniqueName
                    NombreOriginal    = $File.Name
                    RutaOriginal      = $File.FullName
                    CarpetaDeOrigen   = $File.DirectoryName
                    FechaCreacion     = $File.CreationTime
                    FechaModificacion = $File.LastWriteTime
                    TamanoBytes       = $File.Length
                    HashMD5           = (Get-FileHash $File.FullName -Algorithm MD5).Hash
                    RazonRecuperacion = $Confidence
                }
                $MetaData | ConvertTo-Json | Out-File "$DestFile.meta.json"

                # Mostrar progreso
                $Color = if ($Confidence -eq "HIGH_ADN") { "Green" } else { "Magenta" }
                Write-Host "[+] $Confidence : $($File.Name)" -ForegroundColor $Color
            } catch {
                Write-Host "[!] Error en: $($File.Name)" -ForegroundColor Red
            }
        }
    }
}

Write-Host "`n🏆 MISIÓN DE RECUPERACIÓN V3.0 FINALIZADA." -ForegroundColor Cyan
Write-Host "Consulte la carpeta ARCHIVE_RECOVERY para iniciar el triaje." -ForegroundColor White