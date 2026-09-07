# scripts/find_ear_logo_and_palette.ps1
# BARE-METAL DISCOVERY PROTOCOL FOR PRODUCTORA EAR LOGO & BRAND ASSETS

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🔍 RASTREO FORENSE GLOBAL DE LOGOTIPO PRODUCTORA EAR (TODOS LOS DISCOS)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$searchDrives = @(
    "L:\A IMPORTAR ORIGINALES PARA PHOTOSHOP",
    "L:\",
    "D:\COPIAS_DE_SEGURIDAD",
    "D:\Migracion_C",
    "H:\00_PRODUCTORA_EAR",
    "H:\EAR_OS_V2\EAR_OS_V2\public",
    "C:\Users\M2-W10\Downloads"
)

$results = @()

foreach ($drivePath in $searchDrives) {
    if (Test-Path $drivePath) {
        Write-Host "📂 Escaneando: $drivePath..." -ForegroundColor Yellow
        try {
            $files = Get-ChildItem -Path $drivePath -Recurse -Include "*logo*ear*", "*productora*ear*", "*manual*marca*", "*identidad*ear*", "*colibri*" -File -ErrorAction SilentlyContinue | Where-Object {
                $_.FullName -notmatch "node_modules|\.next|\.git"
            }
            foreach ($f in $files) {
                $results += [PSCustomObject]@{
                    Name = $f.Name
                    FullPath = $f.FullName
                    SizeKB = [math]::Round($f.Length / 1KB, 2)
                    Extension = $f.Extension
                    LastModified = $f.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
                }
                Write-Host "   🎯 Hallazgo: $($f.Name) ($([math]::Round($f.Length / 1KB, 2)) KB) en $($f.DirectoryName)" -ForegroundColor Green
            }
        } catch {
            Write-Host "   ⚠️ Error accediendo a $drivePath" -ForegroundColor DarkGray
        }
    }
}

$reportDir = "H:\EAR_OS_V2\EAR_OS_V2\scripts\reports"
if (!(Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}

$outPath = "$reportDir\ear_logo_search_manifest.json"
$results | ConvertTo-Json -Depth 4 | Out-File -FilePath $outPath -Encoding utf8

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "✅ TOTAL DE ACTIVOS ENCONTRADOS: $($results.Count)" -ForegroundColor Green
Write-Host "📄 Manifiesto exportado a: $outPath" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
