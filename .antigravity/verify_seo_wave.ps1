param([int]$Port = 3007)
try {
    $r = Invoke-WebRequest -Uri "http://localhost:$Port/api/admin/tasks/inject" -Method GET -UseBasicParsing -TimeoutSec 10
    $j = $r.Content | ConvertFrom-Json
    Write-Output ("QUEUED: " + $j.summary.queued + " | BACKLOG: " + $j.summary.backlog + " | COMPLETED: " + $j.summary.completed)
    $j.tasks | Where-Object { $_.id -like 'seo-*' } | ForEach-Object {
        Write-Output ("  " + $_.id + "  [" + $_.status + "]  " + $_.title)
    }
} catch {
    Write-Output ("ERROR: " + $_.Exception.Message)
}