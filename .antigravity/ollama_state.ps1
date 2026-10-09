# ============================================================
# OLLAMA STATE PROBE — procesos + API health (rápido, sin colgar)
# ============================================================
$ErrorActionPreference = 'Continue'

Write-Host "=== PROCESOS OLLAMA ==="
$p = Get-Process -Name 'ollama*' -ErrorAction SilentlyContinue
if ($p) {
  $p | Select-Object Id, ProcessName, @{N='RAM_MB';E={[int]($_.WorkingSet64/1MB)}}, StartTime | Format-Table -AutoSize
} else {
  Write-Host "  (no hay procesos ollama)"
}

Write-Host "=== RUNNERS / SERVIDORES (CIM) ==="
$r = Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'runner|llama|server|ollama' } | Select-Object ProcessId, Name, @{N='RAM_MB';E={[int]($_.WorkingSetSize/1MB)}}
if ($r) { $r | Format-Table -AutoSize } else { Write-Host "  (sin runners)" }

Write-Host "=== API /api/tags (timeout 4s) ==="
$sw = [System.Diagnostics.Stopwatch]::StartNew()
try {
  $resp = Invoke-WebRequest -Uri 'http://localhost:11434/api/tags' -TimeoutSec 4 -UseBasicParsing
  $sw.Stop()
  Write-Host ("  HTTP {0} en {1:N1}s" -f $resp.StatusCode, $sw.Elapsed.TotalSeconds)
  $txt = $resp.Content
  if ($txt.Length -gt 800) { $txt = $txt.Substring(0,800) }
  Write-Host $txt
} catch {
  $sw.Stop()
  Write-Host ("  API ERROR tras {0:N1}s: {1}" -f $sw.Elapsed.TotalSeconds, $_.Exception.Message)
}

Write-Host "=== PUERTO 11434 (Test-NetConnection) ==="
try {
  $tnc = Test-NetConnection -ComputerName 'localhost' -Port 11434 -WarningAction SilentlyContinue
  Write-Host ("  TcpTestSucceeded: {0}" -f $tnc.TcpTestSucceeded)
} catch {
  Write-Host ("  Test-NetConnection ERROR: {0}" -f $_.Exception.Message)
}

Write-Host "==== FIN STATE ===="