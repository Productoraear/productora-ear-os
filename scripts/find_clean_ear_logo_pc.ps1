# scripts/find_clean_ear_logo_pc.ps1
# BARE-METAL GLOBAL SEARCH FOR CLEAN PRODUCTORA EAR LOGO (ALL DRIVES)

Write-Host '============================================================' -ForegroundColor Cyan
Write-Host '🔍 BÚSQUEDA EXHAUSTIVA DE LOGOTIPO LIMPIO PRODUCTORA EAR' -ForegroundColor Cyan
Write-Host '============================================================' -ForegroundColor Cyan

Add-Type -AssemblyName System.Drawing

$candidatesDir = 'H:\EAR_OS_V2\EAR_OS_V2\public\brand_assets_ear\candidates'
if (!(Test-Path $candidatesDir)) {
    New-Item -ItemType Directory -Path $candidatesDir -Force | Out-Null
}

$extensions = @('.png', '.jpg', '.jpeg', '.svg', '.webp')
$discovered = @()
$skipFolders = 'Windows|node_modules|\.next|\.git|AppData\\Local|AppData\\LocalLow|AppData\\Roaming\\npm|\$Recycle\.Bin|Program Files|ProgramData'

# Rutas prioritarias usando comillas simples para evitar escape de barra invertida
$priorityPaths = @(
    'L:\A IMPORTAR ORIGINALES PARA PHOTOSHOP',
    'L:\',
    'D:\USUARIO_DATOS\Imagenes',
    'D:\USUARIO_DATOS',
    'D:\COPIAS_DE_SEGURIDAD',
    'D:\Migracion_C',
    'H:\00_PRODUCTORA_EAR',
    'C:\Users\M2-W10\Desktop',
    'C:\Users\M2-W10\Downloads',
    'C:\Users\M2-W10\Pictures',
    'C:\Users\M2-W10\Documents',
    'E:\',
    'G:\',
    'I:\'
)

$checkedPaths = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

function Scan-Folder([string]$folderPath) {
    if (!(Test-Path $folderPath) -or $checkedPaths.Contains($folderPath)) { return }
    $checkedPaths.Add($folderPath) | Out-Null
    
    Write-Host "📂 Buscando en: $folderPath..." -ForegroundColor DarkYellow
    try {
        $files = Get-ChildItem -Path $folderPath -Recurse -File -ErrorAction SilentlyContinue | Where-Object {
            $fullName = $_.FullName
            if ($fullName -match $skipFolders) { return $false }
            
            $ext = $_.Extension.ToLower()
            if ($extensions -notcontains $ext) { return $false }
            
            $baseName = $_.BaseName.ToLower()
            return ($baseName -match 'ear' -and ($baseName -match 'logo|isotipo|marca|productora|diamante|simbolo|clean|limpio')) -or
                   ($baseName -match 'productora.*ear') -or
                   ($fullName -match 'LOGO PRODUCTORA EAR')
        }

        foreach ($f in $files) {
            $dim = 'N/A'
            if ($f.Extension -match '\.png|\.jpg|\.jpeg') {
                try {
                    $bmp = [System.Drawing.Bitmap]::FromFile($f.FullName)
                    $dim = "$($bmp.Width)x$($bmp.Height)"
                    $bmp.Dispose()
                } catch {}
            }

            $candidateNum = $discovered.Count + 1
            $safeName = "cand_${candidateNum}_" + ($f.Name -replace '[^a-zA-Z0-9_\.-]', '_')
            $copiedPath = Join-Path $candidatesDir $safeName
            Copy-Item -Path $f.FullName -Destination $copiedPath -Force

            $item = [PSCustomObject]@{
                ID = $candidateNum
                Name = $f.Name
                FullPath = $f.FullName
                SizeKB = [math]::Round($f.Length / 1KB, 2)
                Dimensions = $dim
                Extension = $f.Extension
                LastModified = $f.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss')
                CandidateCopy = "public/brand_assets_ear/candidates/$safeName"
            }
            $discovered += $item

            Write-Host "   💎 [#$candidateNum] $($f.Name) | Dim: $dim | $([math]::Round($f.Length/1KB, 1)) KB" -ForegroundColor Green
            Write-Host "      Origen: $($f.FullName)" -ForegroundColor DarkGray
        }
    } catch {
        Write-Host "   ⚠️ Excepción en $folderPath" -ForegroundColor DarkGray
    }
}

foreach ($p in $priorityPaths) {
    Scan-Folder $p
}

# Reporte final
$reportDir = 'H:\EAR_OS_V2\EAR_OS_V2\scripts\reports'
if (!(Test-Path $reportDir)) { New-Item -ItemType Directory -Path $reportDir -Force | Out-Null }
$reportPath = "$reportDir\discovered_clean_logos.json"
$discovered | ConvertTo-Json -Depth 4 | Out-File -FilePath $reportPath -Encoding utf8

Write-Host ''
Write-Host '============================================================' -ForegroundColor Cyan
Write-Host "🎯 TOTAL DE LOGOTIPOS CANDIDATOS HALLADOS: $($discovered.Count)" -ForegroundColor Green
Write-Host '📁 Copiados a: public/brand_assets_ear/candidates/' -ForegroundColor Green
Write-Host "📄 Manifiesto: $reportPath" -ForegroundColor Green
Write-Host '============================================================' -ForegroundColor Cyan
