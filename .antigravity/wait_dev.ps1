param([int]$Port = 3007, [int]$TimeoutSec = 60)
$deadline = (Get-Date).AddSeconds($TimeoutSec)
while ((Get-Date) -lt $deadline) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:$Port/api/admin/tasks/inject" -Method GET -UseBasicParsing -TimeoutSec 5
        Write-Output ("STATUS: " + $r.StatusCode)
        Write-Output ($r.Content.Substring(0, [Math]::Min(500, $r.Content.Length)))
        exit 0
    } catch {
        Start-Sleep -Seconds 3
    }
}
Write-Output "TIMEOUT: dev server no respondio en $TimeoutSec s"
exit 1