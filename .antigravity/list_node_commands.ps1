$ErrorActionPreference = 'SilentlyContinue'

$procs = Get-CimInstance Win32_Process -Filter "Name='node.exe'"

foreach ($p in $procs) {
    $cmd = $p.CommandLine
    $mb = [math]::Round($p.WorkingSetSize / 1MB, 1)
    Write-Output ("PID {0} | {1} MB | {2}" -f $p.ProcessId, $mb, $cmd)
}