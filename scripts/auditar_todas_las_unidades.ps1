$drives = Get-PSDrive -PSProvider FileSystem
foreach ($d in $drives) {
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host "UNIDAD: $($d.Root) [Libre: $([math]::Round($d.Free/1GB, 2)) GB / Usado: $([math]::Round($d.Used/1GB, 2)) GB]" -ForegroundColor Yellow
    Write-Host "====================================================" -ForegroundColor Cyan
    Get-ChildItem -Path $d.Root -Directory -Force -ErrorAction SilentlyContinue | 
        Select-Object Name, Attributes, LastWriteTime | 
        Format-Table -AutoSize
}
