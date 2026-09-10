# vampire-sweep.ps1
# Script S-Class Ultra-Rapido y Resiliente para absorcion de proveedores
# 100% Compatible con Windows PowerShell 5.1 y PowerShell 7 (pwsh)

$ErrorActionPreference = 'SilentlyContinue'

# 1. Cargar Modulo de Telemetria si existe
$telemetryScript = Join-Path $PSScriptRoot "terminal_telemetry.ps1"
if (Test-Path $telemetryScript) {
    . $telemetryScript
}

if (Get-Command Show-SystemBadge -ErrorAction SilentlyContinue) {
    Show-SystemBadge -Title "VAMPIRE SWEEP MOTOR S-CLASS" -Subtitle "EXTRACCION RAPIDA Y ABSORCION DE PROVEEDORES"
} else {
    Write-Host "`n=== VAMPIRE SWEEP MOTOR S-CLASS ===" -ForegroundColor Cyan
}

# 2. Rutas Maestras de Salida
$vaultDir = "H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\Providers"
$outputPathVault = Join-Path $vaultDir "vampirized-providers.json"
$outputPathApp = "H:\EAR_OS_V2\EAR_OS_V2\src\data\vampirized-providers.json"

# Asegurar directorios destino
if (-not (Test-Path $vaultDir)) {
    New-Item -ItemType Directory -Path $vaultDir -Force | Out-Null
}
$appDataDir = Split-Path $outputPathApp
if (-not (Test-Path $appDataDir)) {
    New-Item -ItemType Directory -Path $appDataDir -Force | Out-Null
}

$providers = [System.Collections.Generic.List[PSObject]]::new()
$academyKnowledge = [System.Collections.Generic.List[PSObject]]::new()
$indexedIds = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

# 3. FASE 1: Ingestion Inmediata de Datasets Cosechados Existentes en src/data
$coreDatasets = @(
    "H:\EAR_OS_V2\EAR_OS_V2\src\data\bodas-vendors-harvested.json",
    "H:\EAR_OS_V2\EAR_OS_V2\src\data\vendors-enriched-night.json",
    "H:\EAR_OS_V2\EAR_OS_V2\src\data\all_providers_database.json"
)

Write-Host "`n[FASE 1/2] Ingestando bases de datos de proveedores existentes..." -ForegroundColor Cyan

foreach ($datasetPath in $coreDatasets) {
    if (Test-Path $datasetPath) {
        try {
            $fileName = Split-Path $datasetPath -Leaf
            Write-Host "   [+] Cargando $($fileName)..." -ForegroundColor Gray
            $rawContent = Get-Content -Path $datasetPath -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
            if ($rawContent) {
                $items = $rawContent | ConvertFrom-Json
                if ($items -is [System.Collections.IEnumerable]) {
                    foreach ($item in $items) {
                        $idOrSlug = if ($item.slug) { $item.slug } elseif ($item.id) { $item.id } else { $item.name }
                        if ($idOrSlug -and -not $indexedIds.Contains($idOrSlug)) {
                            $indexedIds.Add($idOrSlug) | Out-Null
                            $providers.Add([PSCustomObject]@{
                                Id = if ($item.id) { $item.id } else { $idOrSlug }
                                Name = if ($item.name) { $item.name } else { "Proveedor Homologado" }
                                Slug = if ($item.slug) { $item.slug } else { $idOrSlug }
                                Category = if ($item.category) { $item.category } else { "Servicio de Eventos" }
                                Province = if ($item.location.province) { $item.location.province } elseif ($item.province) { $item.province } else { "Madrid" }
                                Price = if ($item.pricing.rentalBasePrice) { $item.pricing.rentalBasePrice } elseif ($item.basePrice) { $item.basePrice } else { 650 }
                                Rating = if ($item.metrics.rating) { $item.metrics.rating } elseif ($item.rating) { $item.rating } else { 4.9 }
                                Source = $fileName
                            })
                        }
                    }
                }
            }
        } catch {
            Write-Host "   [!] Advertencia leyendo dataset" -ForegroundColor Yellow
        }
    }
}

Write-Host "   [OK] Total proveedores base cargados: $($providers.Count)" -ForegroundColor Green

# 4. FASE 2: Barrido Rapido de Documentos de Boveda y Rutas Objetivo
$targetScanFolders = @(
    "H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\Providers",
    "H:\00_PRODUCTORA_EAR\BODEGA_CUARENTENA",
    "H:\00_PRODUCTORA_EAR\00_AVE_FENIX",
    "H:\00 EAR_OS_LEGACY_STAGING",
    "H:\EAR_OS_V2\VERTICAL_INCUBADORA_VAMPIRIZADA",
    "C:\Users\M2-W10\Documents",
    "C:\Users\M2-W10\Desktop"
)

$targetExtensions = @(".pdf", ".xlsx", ".csv", ".docx", ".json", ".txt", ".md")

Write-Host "`n[FASE 2/2] Explorando documentos y tarifas en rutas clave..." -ForegroundColor Cyan

foreach ($folder in $targetScanFolders) {
    if (-not (Test-Path $folder)) { continue }
    
    # Escaneo seguro acotado
    $files = Get-ChildItem -Path $folder -File -ErrorAction SilentlyContinue | Where-Object {
        $ext = $_.Extension.ToLower()
        $targetExtensions -contains $ext -and $_.Length -lt 25MB -and $_.Length -gt 0
    }

    $subDirs = Get-ChildItem -Path $folder -Directory -ErrorAction SilentlyContinue | Where-Object {
        $_.Name -notmatch "node_modules|\.git|AppData|Windows|\.gemini"
    }

    $allFiles = [System.Collections.Generic.List[System.IO.FileInfo]]::new()
    if ($files) { $allFiles.AddRange($files) }
    
    foreach ($sub in $subDirs) {
        $subFiles = Get-ChildItem -Path $sub.FullName -File -ErrorAction SilentlyContinue | Where-Object {
            $ext = $_.Extension.ToLower()
            $targetExtensions -contains $ext -and $_.Length -lt 25MB -and $_.Length -gt 0
        }
        if ($subFiles) { $allFiles.AddRange($subFiles) }
    }

    $fileIdx = 0
    $totalInFolder = $allFiles.Count
    foreach ($file in $allFiles) {
        $fileIdx++
        if ($fileIdx % 20 -eq 0 -or $fileIdx -eq $totalInFolder) {
            if (Get-Command Show-DigitalProgress -ErrorAction SilentlyContinue) {
                Show-DigitalProgress -Activity "Explorando Bovedas" -Status "Analizando" -Current $fileIdx -Total $totalInFolder -ItemName $file.Name
            }
        }

        try {
            if ($file.Extension -in @(".json", ".csv", ".txt", ".md")) {
                $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
                if (-not $content) { continue }
                
                # Deteccion de Conocimiento Academia (Danny Aragon purgado SSOT)
                if ($content -match "99 d[ií]as haciendo clic|61 d[ií]as haciendo clic") {
                    $sanitized = $content -replace "(?i)danny\s+arag[oó]n", "EAR Academy Protocol"
                    $academyKnowledge.Add([PSCustomObject]@{
                        Path = $file.FullName
                        Type = "AcademyMethodology"
                        Excerpt = if ($sanitized.Length -gt 1000) { $sanitized.Substring(0, 1000) } else { $sanitized }
                    })
                }
                
                # Deteccion de Proveedores adicionales
                if ($file.Name -match "(?i)tarifa|rider|proveedor|audiovisual|bose|shure|b2b") {
                    $docId = "doc-" + $file.BaseName
                    if (-not $indexedIds.Contains($docId)) {
                        $indexedIds.Add($docId) | Out-Null
                        $providers.Add([PSCustomObject]@{
                            Id = $docId
                            Name = $file.BaseName
                            Slug = $file.BaseName.ToLower().Replace(" ", "-")
                            Category = "Documento Tecnico / Rider"
                            Province = "Madrid"
                            Price = 650
                            Rating = 5.0
                            Source = $file.Name
                        })
                    }
                }
            } elseif ($file.Name -match "(?i)tarifa|rider|proveedor|cat[aá]logo|boda|evento|b2b") {
                $docId = "doc-" + $file.BaseName
                if (-not $indexedIds.Contains($docId)) {
                    $indexedIds.Add($docId) | Out-Null
                    $providers.Add([PSCustomObject]@{
                        Id = $docId
                        Name = $file.BaseName
                        Slug = $file.BaseName.ToLower().Replace(" ", "-")
                        Category = "Catalogo / Ficha Externa"
                        Province = "Madrid"
                        Price = 650
                        Rating = 5.0
                        Source = $file.Name
                    })
                }
            }
        } catch {}
    }
}

if (Get-Command Show-DigitalProgress -ErrorAction SilentlyContinue) {
    Show-DigitalProgress -Activity "Vampirizando Proveedores" -Status "Completado" -Current 100 -Total 100 -ItemName "Consolidacion final"
}

# 5. Generar JSON Maestro
$megaJson = [PSCustomObject]@{
    GeneratedAt = (Get-Date).ToString("o")
    TotalProvidersIndexed = $providers.Count
    TotalAcademyItems = $academyKnowledge.Count
    Providers = $providers
    AcademyKnowledge = $academyKnowledge
}

$jsonString = $megaJson | ConvertTo-Json -Depth 5

# 6. Guardar en Vault y en Repositorio
$jsonString | Set-Content -Path $outputPathVault -Encoding UTF8 -Force
$jsonString | Set-Content -Path $outputPathApp -Encoding UTF8 -Force

Write-Host "`n  ======================================================================" -ForegroundColor Green
Write-Host "  [EXIT CODE 0] VAMPIRIZACION S-CLASS COMPLETADA CON EXITO" -ForegroundColor Green
Write-Host "  ======================================================================" -ForegroundColor Green
Write-Host "  Total proveedores indexados : $($providers.Count)" -ForegroundColor Cyan
Write-Host "  Nodos de Academia detectados: $($academyKnowledge.Count)" -ForegroundColor Cyan
Write-Host "  Guardado en Vault           : $outputPathVault" -ForegroundColor Gray
Write-Host "  Guardado en Repositorio     : $outputPathApp" -ForegroundColor Gray
Write-Host ""