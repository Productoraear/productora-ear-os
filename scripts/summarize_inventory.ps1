# Summarize forensic scan results
$jsonPath = "C:\EAR_OS_V2\docs\release\COMPREHENSIVE_FORENSIC_INVENTORY.json"
if (Test-Path -LiteralPath $jsonPath) {
    $raw = Get-Content -LiteralPath $jsonPath -Raw | ConvertFrom-Json
    Write-Output "========================================================="
    Write-Output "   AUDITORÍA FORENSE S-CLASS // MANIFIESTO CONSOLIDADO   "
    Write-Output "========================================================="
    Write-Output "Total de Archivos Indexados: $($raw.TotalFiles)"
    Write-Output "Fecha de Indexación (UTC): $($raw.GeneratedAtUtc)"
    Write-Output ""
    Write-Output "--- DESGLOSE POR EXTENSIÓN ---"
    $raw.Files | Group-Object Extension | Sort-Object Count -Descending | Select-Object Name, Count | Format-Table -AutoSize
    
    Write-Output "--- TOP 20 COMPONENTES / ACTIVOS MONOLÍTICOS (>30KB) ---"
    $raw.Files | Where-Object { $_.SizeBytes -gt 30000 -and ($_.Extension -eq ".tsx" -or $_.Extension -eq ".ts" -or $_.Extension -eq ".json") } | 
        Sort-Object SizeBytes -Descending | 
        Select-Object Name, @{N='SizeKB';E={[math]::Round($_.SizeBytes/1KB, 1)}}, FullPath -First 20 | 
        Format-Table -AutoSize
}
