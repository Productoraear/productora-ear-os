# ============================================================
# VALIDACION DE BLINDAJE 32B — carga controlada + lectura VRAM
# Contexto: 8192 (el fijado en Modelfile). Promt pequeño.
# ============================================================
$ErrorActionPreference = 'Continue'

function Get-Dedicated {
  try {
    $gc = Get-Counter '\GPU Adapter Memory(*)\Dedicated Usage' -ErrorAction Stop
    $sum = 0.0
    foreach ($c in $gc.CounterSamples) { $sum += [double]$c.CookedValue }
    return [math]::Round($sum / 1GB, 2)
  } catch { return -1 }
}

function Get-Shared {
  try {
    $gc = Get-Counter '\GPU Adapter Memory(*)\Shared Usage' -ErrorAction Stop
    $sum = 0.0
    foreach ($c in $gc.CounterSamples) { $sum += [double]$c.CookedValue }
    return [math]::Round($sum / 1GB, 2)
  } catch { return -1 }
}

function Get-RamUsedPct {
  $os = Get-CimInstance Win32_OperatingSystem
  $total = [double]$os.TotalVisibleMemorySize / 1MB
  $free  = [double]$os.FreePhysicalMemory / 1MB
  return [math]::Round((($total - $free) / $total) * 100, 1)
}

Write-Host "==== VALIDACION BLINDAJE 32B (num_ctx 8192) ===="
Write-Host ("  VRAM dedicada (inicio) : {0} GB" -f (Get-Dedicated))
Write-Host ("  VRAM shared   (inicio) : {0} GB" -f (Get-Shared))
Write-Host ("  RAM en uso    (inicio) : {0} %" -f (Get-RamUsedPct))
Write-Host ""

$payload = '{"model":"ear-32b-arquitecto-sclass:latest","prompt":"Responde unicamente con: OK blindaje correcto","stream":false,"options":{"num_ctx":8192,"num_keep":512,"num_predict":32,"temperature":0.1}}'

$job = Start-Job -ScriptBlock {
  param($p)
  Invoke-RestMethod -Uri 'http://localhost:11434/api/generate' -Method Post -Body $p -ContentType 'application/json' -TimeoutSec 300
} -ArgumentList $payload

Start-Sleep -Seconds 8
Write-Host "  --- MEDICION DURANTE CARGA (t=8s) ---"
Write-Host ("  VRAM dedicada : {0} GB" -f (Get-Dedicated))
Write-Host ("  VRAM shared   : {0} GB" -f (Get-Shared))
Write-Host ("  RAM en uso    : {0} %" -f (Get-RamUsedPct))

Start-Sleep -Seconds 8
Write-Host "  --- MEDICION DURANTE CARGA/INFERENCIA (t=16s) ---"
Write-Host ("  VRAM dedicada : {0} GB" -f (Get-Dedicated))
Write-Host ("  VRAM shared   : {0} GB" -f (Get-Shared))
Write-Host ("  RAM en uso    : {0} %" -f (Get-RamUsedPct))

Write-Host "  Esperando respuesta..."
$result = Receive-Job -Job $job -Wait -AutoRemoveJob
Write-Host ""

try {
  $resp = $result | ConvertFrom-Json
  $txt = $resp.response
  if ($txt.Length -gt 200) { $txt = $txt.Substring(0,200) }
  Write-Host ("  RESPUESTA: {0}" -f $txt)
  Write-Host ("  eval_count: {0}" -f $resp.eval_count)
} catch {
  Write-Host "  (respuesta no parseable o nula)"
}

Start-Sleep -Seconds 2
Write-Host ""
Write-Host "  --- MEDICION FINAL (post-inferencia, modelo aun residente) ---"
Write-Host ("  VRAM dedicada : {0} GB" -f (Get-Dedicated))
Write-Host ("  VRAM shared   : {0} GB" -f (Get-Shared))
Write-Host ("  RAM en uso    : {0} %" -f (Get-RamUsedPct))
Write-Host ""

Write-Host "==== OLLAMA PS ===="
ollama ps 2>&1 | Out-String -Width 200

Write-Host "==== FIN VALIDACION ===="