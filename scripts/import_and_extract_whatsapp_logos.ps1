# scripts/import_and_extract_whatsapp_logos.ps1
# PROTOCOLO SOBERANO DE ABSORCIÓN CROMÁTICA - PRODUCTORA EAR

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🎨 ABSORBIENDO LOGOTIPO DE PRODUCTORA EAR DESDE WHATSAPP" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

Add-Type -AssemblyName System.Drawing

$sourceFiles = @(
    "D:\USUARIO_DATOS\Imagenes\WhatsApp Image 2026-09-07 at 16.37.07.jpeg",
    "D:\USUARIO_DATOS\Imagenes\WhatsApp Image 2026-09-07 at 16.37.07 22 .jpeg"
)

$destFolder = "H:\EAR_OS_V2\EAR_OS_V2\public\brand_assets_ear"
if (!(Test-Path $destFolder)) {
    New-Item -ItemType Directory -Path $destFolder -Force | Out-Null
}

$results = @{}

$index = 1
foreach ($src in $sourceFiles) {
    if (Test-Path $src) {
        $destFile = "$destFolder\ear_logo_whatsapp_ref_$index.jpeg"
        Copy-Item -Path $src -Destination $destFile -Force
        Write-Host "✅ Copiado con éxito: $destFile" -ForegroundColor Green

        # Analizar colores dominantes usando System.Drawing
        try {
            $bmp = [System.Drawing.Bitmap]::FromFile($destFile)
            $w = $bmp.Width
            $h = $bmp.Height
            Write-Host "   Resolución: ${w}x${h} px" -ForegroundColor Gray

            # Muestreo de píxeles
            $colorCounts = @{}
            $stepX = [math]::Max(1, [math]::Floor($w / 100))
            $stepY = [math]::Max(1, [math]::Floor($h / 100))

            for ($x = 0; $x -lt $w; $x += $stepX) {
                for ($y = 0; $y -lt $h; $y += $stepY) {
                    $pixel = $bmp.GetPixel($x, $y)
                    # Excluir blancos puros o negros de fondo plano si se desea, o cuantizar a múltiplos de 16
                    $r = [math]::Round($pixel.R / 16) * 16
                    $g = [math]::Round($pixel.G / 16) * 16
                    $b = [math]::Round($pixel.B / 16) * 16
                    $r = [math]::Min(255, $r)
                    $g = [math]::Min(255, $g)
                    $b = [math]::Min(255, $b)
                    
                    $hex = "#{0:X2}{1:X2}{2:X2}" -f $r, $g, $b
                    if ($colorCounts.ContainsKey($hex)) {
                        $colorCounts[$hex]++
                    } else {
                        $colorCounts[$hex] = 1
                    }
                }
            }
            $bmp.Dispose()

            # Ordenar los colores más frecuentes
            $topColors = $colorCounts.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10 | ForEach-Object {
                [PSCustomObject]@{
                    Hex = $_.Key
                    Count = $_.Value
                }
            }

            $results["ref_$index"] = @{
                Original = $src
                SavedAs = $destFile
                Dimensions = "${w}x${h}"
                TopColors = $topColors
            }

            Write-Host "   🎨 Colores Dominantes Detectados:" -ForegroundColor Yellow
            foreach ($c in $topColors) {
                Write-Host "      HEX: $($c.Hex) (Muestras: $($c.Count))" -ForegroundColor Cyan
            }

        } catch {
            Write-Host "   ⚠️ Error analizando píxeles: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Archivo no encontrado: $src" -ForegroundColor Red
    }
    $index++
}

$outReport = "H:\EAR_OS_V2\EAR_OS_V2\scripts\reports\whatsapp_logo_colors.json"
$results | ConvertTo-Json -Depth 4 | Out-File -FilePath $outReport -Encoding utf8
Write-Host ""
Write-Host "📄 Reporte de colores guardado en: $outReport" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
