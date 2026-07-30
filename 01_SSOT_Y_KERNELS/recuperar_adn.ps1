$Files = Get-ChildItem -Path $Drive.Root -Include $Extensions -Recurse -File -ErrorAction SilentlyContinue | 
         Where-Object { $_.FullName -notlike "$ProjectRoot*" } # No buscar dentro del proyecto actual

foreach ($File in $Files) {
    $IsMatch = $false
    $Confidence = "NONE"
    
    # Filtrar por tamaño para no saturar (evitar archivos > 5MB de texto)
    if ($File.Length -gt 5MB) { continue }

    # Leer contenido para buscar ADN
    $Content = Get-Content $File.FullName -TotalCount 50 -ErrorAction SilentlyContinue
    
    # Prueba de Confianza Alta
    foreach ($Marker in $HighConfidenceMarkers) {
        if ($Content -match $Marker) {
            $IsMatch = $true
            $Confidence = "HIGH"
            break
        }
    }

    # Si no hay match alto, probar Confianza Baja o nombre de archivo
    if ($Confidence -eq "NONE") {
        foreach ($Marker in $LowConfidenceMarkers) {
            if ($Content -match $Marker -or $File.Name -match $Marker) {
                $IsMatch = $true
                $Confidence = "LOW"
                break
            }
        }
    }

    # 4. Procesar Hallazgo
    if ($IsMatch) {
        $Timestamp = $File.LastWriteTime.ToString("yyyyMMdd_HHmm")
        $TargetDir = if ($Confidence -eq "HIGH") { $ConfirmadoPath } else { $SospechosoPath }
        $NewName = "REC_${Timestamp}_$($File.Name)"
        $DestFile = Join-Path $TargetDir $NewName

        try {
            Copy-Item -Path $File.FullName -Destination $DestFile -Force
            $LogEntry = "[$Confidence] ATRAIDO: $($File.FullName) -> $NewName"
            Write-Host $LogEntry -ForegroundColor (if ($Confidence -eq "HIGH") { "Green" } else { "Yellow" })
            $LogEntry | Out-File $LogPath -Append
        } catch {
            Write-Host "[!] Error copiando $($File.Name)" -ForegroundColor Red
        }
    }
}