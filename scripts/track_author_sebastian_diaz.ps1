# scripts/track_author_sebastian_diaz.ps1
# BARE-METAL FORENSIC TRACKER: SEBASTIAN DIAZ (VIMUME ASSETS & METADATA)
# Jurisdiction: C:, D:, H:, L:

$ErrorActionPreference = 'SilentlyContinue'

$outputReport = "H:\EAR_OS_V2\EAR_OS_V2\docs\SEBASTIAN_DIAZ_AUTHOR_INTEL.json"
$docsDir = "H:\EAR_OS_V2\EAR_OS_V2\docs"
if (-not (Test-Path $docsDir)) { New-Item -ItemType Directory -Path $docsDir -Force | Out-Null }

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ">>> RASTREO FORENSE DE METADATOS: AUTOR SEBASTIAN DIAZ" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Analisis de los 3 archivos PNG de VIMUME
$targetBrandPngs = @(
    "H:\EAR_OS_V2\EAR_OS_V2\public\images\brand\colibri_isotipo.png",
    "H:\EAR_OS_V2\EAR_OS_V2\public\images\brand\colibri_logo_completo.png",
    "H:\EAR_OS_V2\EAR_OS_V2\public\images\brand\colibri_logo_white.png"
)

$pngAnalysis = @()

foreach ($png in $targetBrandPngs) {
    if (Test-Path $png) {
        $item = Get-Item $png
        $bytes = [System.IO.File]::ReadAllBytes($png)
        $textDump = [System.Text.Encoding]::ASCII.GetString($bytes)
        
        $metaMatch = @{}
        if ($textDump -match 'Software\0([^\0]+)') { $metaMatch['Software'] = $matches[1] }
        if ($textDump -match 'Author\0([^\0]+)') { $metaMatch['Author'] = $matches[1] }
        if ($textDump -match 'Creator\0([^\0]+)') { $metaMatch['Creator'] = $matches[1] }
        if ($textDump -match 'Adobe Photoshop|Illustrator|Figma|Canva|Corel') { $metaMatch['ToolDetected'] = $matches[0] }
        if ($textDump -match '<xmp:CreatorTool>([^<]+)</xmp:CreatorTool>') { $metaMatch['XMP_Tool'] = $matches[1] }
        if ($textDump -match '<dc:creator>[^<]*<rdf:li>([^<]+)</rdf:li>') { $metaMatch['XMP_Creator'] = $matches[1] }

        $entry = @{
            path = $png
            name = $item.Name
            sizeBytes = $item.Length
            lastModified = $item.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
            extractedMeta = $metaMatch
        }
        $pngAnalysis += $entry

        Write-Host "[+] PNG Analizado: $($item.Name) ($([math]::Round($item.Length/1024, 1)) KB)" -ForegroundColor Green
        if ($metaMatch.Keys.Count -gt 0) {
            foreach ($k in $metaMatch.Keys) {
                Write-Host "    -> $k : $($metaMatch[$k])" -ForegroundColor DarkYellow
            }
        } else {
            Write-Host "    -> Chunks limpios (PNG optimizado para web)" -ForegroundColor DarkGray
        }
    }
}

# 2. Rastreo Profundo en Rutas Clave de PC
$searchLocations = @(
    "D:\BACKUPS",
    "D:\USUARIO_DATOS",
    "H:\00_PRODUCTORA_EAR",
    "H:\EAR_OS_V2\EAR_OS_V2\public",
    "C:\Users\M2-W10\Documents",
    "C:\Users\M2-W10\Pictures",
    "C:\Users\M2-W10\Desktop"
)

Write-Host "`n[*] Escaneando directorios en busca de activos de Sebastian Diaz..." -ForegroundColor Cyan

$discoveredFiles = @()
$count = 0

foreach ($loc in $searchLocations) {
    if (Test-Path $loc) {
        Write-Host "  [-] Rastreando: $loc ..." -ForegroundColor DarkGray
        $matches = Get-ChildItem -Path $loc -Recurse -File -Include "*sebastian*", "*sebastián*", "*colibri*", "*colibrí*", "*vimume*" -ErrorAction SilentlyContinue | Where-Object {
            $_.FullName -notmatch 'node_modules|\.next|\.git|AppData|temp'
        }
        
        foreach ($f in $matches) {
            $count++
            $isAuthorFolder = $f.FullName -match 'Sebastian Diaz|Agencia.*Sebastian'
            
            $discoveredFiles += @{
                id = $count
                name = $f.Name
                path = $f.FullName
                sizeBytes = $f.Length
                lastModified = $f.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
                authorFolderMatch = $isAuthorFolder
            }

            if ($count -le 35) {
                Write-Host "    [#$count] $($f.Name)" -ForegroundColor Yellow
                Write-Host "       Ruta: $($f.FullName)" -ForegroundColor DarkGray
            }
        }
    }
}

$summary = @{
    scanDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    targetPngs = $pngAnalysis
    totalDiscoveredAssets = $count
    sampleAssets = $discoveredFiles
}

$summary | ConvertTo-Json -Depth 6 | Out-File -FilePath $outputReport -Encoding UTF8

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "[OK] RASTREO COMPLETADO: $count activos identificados." -ForegroundColor Yellow
Write-Host "[OK] Informe forense guardado en: docs/SEBASTIAN_DIAZ_AUTHOR_INTEL.json" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
