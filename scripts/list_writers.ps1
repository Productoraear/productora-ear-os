$ErrorActionPreference = 'SilentlyContinue'
$procs = Get-CimInstance Win32_Process | Where-Object {
    $_.Name -match 'node|python|py' -and $_.CommandLine
}
foreach ($p in $procs) {
    $cl = $p.CommandLine
    if ($cl -match 'providers|vampire|nightcrawler|sync|build_purified|build-netlify|next|omega|finca|bodas') {
        $short = $cl
        if ($short.Length -gt 400) { $short = $short.Substring(0, 400) + '...' }
        Write-Output ("PID={0} NAME={1}`n  CMD={2}" -f $p.ProcessId, $p.Name, $short)
        Write-Output "  ---"
    }
}