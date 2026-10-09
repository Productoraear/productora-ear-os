$conns = Get-NetTCPConnection -LocalPort 3010 -State Listen -ErrorAction SilentlyContinue
$conns | Format-Table -AutoSize
$pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) {
    foreach ($p in $pids) {
        Stop-Process -Id $p -Force
        Write-Output ("Killed PID " + $p)
    }
} else {
    Write-Output "No listener on 3010"
}