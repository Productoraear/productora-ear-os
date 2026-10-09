$ErrorActionPreference = 'SilentlyContinue'

Write-Output '====== STOP OMEGA DAEMON ======'

$targets = Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
    Where-Object { $_.CommandLine -match 'omega_autonomous_daemon|omega\.js' }

if (-not $targets) {
    Write-Output 'No se detectó ningún daemon Omega activo.'
    exit 0
}

foreach ($t in $targets) {
    $pid = $t.ProcessId
    $cmd = $t.CommandLine
    Write-Output ("[DETECTADO] PID {0} -> {1}" -f $pid, $cmd.Substring(0, [Math]::Min(120, $cmd.Length)))
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Write-Output ("[OK] Daemon PID {0} terminado." -f $pid)
}

Write-Output 'Daemon Omega detenido.'