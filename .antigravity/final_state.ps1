$ErrorActionPreference = 'SilentlyContinue'
Write-Output '=== H: AI_MODELS_HUB top-level sizes ==='
Get-ChildItem 'H:\AI_MODELS_HUB' -Directory | ForEach-Object {
    $s = (Get-ChildItem $_.FullName -Recurse -File -EA SilentlyContinue | Measure-Object Length -Sum).Sum
    '{0,7:N2} GB  {1}' -f ($s/1GB), $_.Name
} | Sort-Object -Descending

Write-Output ''
Write-Output '=== DRIVES (final) ==='
Get-CimInstance Win32_LogicalDisk | ForEach-Object {
    '{0}  Total {1:N0} GB  Free {2:N1} GB  ({3:N1}% used)' -f $_.DeviceID, ($_.Size/1GB), ($_.FreeSpace/1GB), ((($_.Size-$_.FreeSpace)/$_.Size)*100)
}
Write-Output 'DONE'