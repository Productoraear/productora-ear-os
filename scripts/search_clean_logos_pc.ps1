# scripts/search_clean_logos_pc.ps1
# BARE-METAL ULTRA-CLEAN SEARCH FOR PRODUCTORA EAR LOGO

$searchLocations = @(
    'L:\',
    'D:\USUARIO_DATOS',
    'D:\COPIAS_DE_SEGURIDAD',
    'H:\00_PRODUCTORA_EAR',
    'C:\Users\M2-W10\Desktop',
    'C:\Users\M2-W10\Downloads',
    'C:\Users\M2-W10\Pictures'
)

$targetFolder = 'H:\EAR_OS_V2\EAR_OS_V2\public\brand_assets_ear\candidates'
if (-not (Test-Path $targetFolder)) { 
    New-Item -ItemType Directory -Path $targetFolder -Force | Out-Null 
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ">>> RASTREANDO LOGOTIPOS LIMPIOS DE PRODUCTORA EAR..." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$count = 0
foreach ($loc in $searchLocations) {
    if (Test-Path $loc) {
        Write-Host "[*] Escaneando: $loc ..." -ForegroundColor DarkYellow
        $files = Get-ChildItem -Path $loc -Recurse -File -Include '*logo*ear*.png', '*logo*ear*.jpg', '*logo*ear*.jpeg', '*ear*logo*.png', '*ear*logo*.jpg', '*ear*logo*.jpeg', '*productora*ear*.png', '*productora*ear*.jpg', '*productora*ear*.jpeg', '*diamante*.png', '*diamante*.jpg' -ErrorAction SilentlyContinue | Where-Object { 
            $_.FullName -notmatch 'node_modules|\.next|\.git|AppData' 
        }
        foreach ($f in $files) {
            $count++
            $cleanName = $f.Name -replace '[^a-zA-Z0-9_\.-]', '_'
            $safeName = "cand_" + $count + "_" + $cleanName
            $dest = Join-Path $targetFolder $safeName
            Copy-Item -Path $f.FullName -Destination $dest -Force
            $sizeKb = [math]::Round($f.Length / 1024, 1)
            Write-Host "   [+] (#$count) $($f.Name) ($sizeKb KB)" -ForegroundColor Green
            Write-Host "       Ruta: $($f.FullName)" -ForegroundColor DarkGray
        }
    }
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "[OK] TOTAL DE LOGOTIPOS ENCONTRADOS Y COPIADOS: $count" -ForegroundColor Yellow
Write-Host "Directorio de candidatos: public/brand_assets_ear/candidates/" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

