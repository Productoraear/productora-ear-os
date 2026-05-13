# 🏛️ S-CLASS CTA REPAIR ENGINE (LEY DE LA HOJA DESÉRTICA) - V2 COMPATIBLE
$TargetDir = "C:\EAR_OS_V2\src"
$LogFile = "C:\EAR_OS_V2\cta_repair_log.txt"

Write-Host "Iniciando Soldadura de CTAs en $TargetDir..."

$Mapping = @{
    'href="#"' = 'href="/arsenal"'
    'href="javascript:void(0)"' = 'href="/arsenal"'
}

Get-ChildItem -Path $TargetDir -Recurse -Include *.tsx, *.js, *.jsx | ForEach-Object {
    $filePath = $_.FullName
    try {
        $content = [System.IO.File]::ReadAllText($filePath)
        $changed = $false

        foreach ($key in $Mapping.Keys) {
            if ($content.Contains($key)) {
                $content = $content.Replace($key, $Mapping[$key])
                $changed = $true
            }
        }

        if ($changed) {
            [System.IO.File]::WriteAllText($filePath, $content)
            Write-Host "REPARADO: $($_.Name)"
            Add-Content -Path $LogFile -Value "REPARADO: $($_.Name)"
        }
    } catch {
        Write-Host "ERROR EN: $($_.Name)"
    }
}

Write-Host "Auditoria Atomica Completada."
