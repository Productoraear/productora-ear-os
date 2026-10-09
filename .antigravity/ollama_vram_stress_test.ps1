# ============================================================================
# OLLAMA VRAM STRESS TEST - RUGE EN VRAM SIN TOCAR RAM/CPU
# ============================================================================
$ErrorActionPreference = 'Continue'

function Get-RamPct {
  $os = Get-CimInstance Win32_OperatingSystem
  $total = [double]$os.TotalVisibleMemorySize / 1MB
  $free  = [double]$os.FreePhysicalMemory / 1MB
  $used  = $total - $free
  return [math]::Round(($used / $total) * 100, 1)
}

function Get-CpuPct {
  return (Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average
}

function Get-OllamaRamMb {
  $proc = Get-Process -Name "ollama*" -ErrorAction SilentlyContinue
  if ($proc) {
    $total = ($proc | Measure-Object -Property WorkingSet64 -Sum).Sum
    return [int]($total / 1MB)
  }
  return 0
}

Write-Host "================================================================"
Write-Host " 0. OLLAMA ENV VARS (User / Machine)"
Write-Host "================================================================"
$vars = 'OLLAMA_FLASH_ATTENTION','OLLAMA_KV_CACHE_TYPE','OLLAMA_NUM_PARALLEL','OLLAMA_KEEP_ALIVE','OLLAMA_MAX_LOADED_MODELS','OLLAMA_HOST','OLLAMA_NUM_CTX','OLLAMA_CONTEXT_LENGTH'
foreach ($n in $vars) {
  $u = [Environment]::GetEnvironmentVariable($n, 'User')
  $m = [Environment]::GetEnvironmentVariable($n, 'Machine')
  Write-Host ("  {0,-26} User=[{1}] Machine=[{2}]" -f $n, $u, $m)
}
Write-Host ""

Write-Host "================================================================"
Write-Host " 1. ESTADO INICIAL (antes de arrancar Ollama)"
Write-Host "================================================================"
Write-Host ("  RAM Use : {0} %" -f (Get-RamPct))
Write-Host ("  CPU Load: {0} %" -f (Get-CpuPct))
Write-Host ("  Ollama RAM: {0} MB" -f (Get-OllamaRamMb))
Write-Host ""

Write-Host "================================================================"
Write-Host " 2. ARRANCANDO OLLAMA APP"
Write-Host "================================================================"
$ollamaPath = "$env:LOCALAPPDATA\Programs\Ollama\ollama app.exe"
if (Test-Path $ollamaPath) {
  Start-Process -FilePath $ollamaPath
  Write-Host "  [OK] Ollama app lanzada desde $ollamaPath"
} else {
  Write-Host "  [?] Ruta default no existe, intentando 'ollama app.exe' en PATH"
  ollama app.exe 2>$null
}
Start-Sleep -Seconds 8
Write-Host ""

Write-Host "================================================================"
Write-Host " 3. VERIFICANDO CONEXION Y FLOTA DE MODELOS"
Write-Host "================================================================"
ollama list 2>&1 | Out-String -Width 120
Write-Host ""

Write-Host "================================================================"
Write-Host " 4. INFERENCIA EXIGENTE - MODELO 32B ARQUITECTO"
Write-Host "     (ctx 16k + KV q4_0, debe residir 100% en VRAM)"
Write-Host "================================================================"
$payload = '{"model":"ear-32b-arquitecto-sclass:latest","prompt":"Write a strict TypeScript data contract for a financial engine for booking live music shows with base rate 350 EUR, split 80/10/10, deposit 100 EUR deductible, and logistics 1.50 EUR/km from km 50. Use exact types and zero implicit any. Include the acoustic rider by context and atomic date lock. Return the full code.","stream":false,"options":{"num_ctx":16384,"num_keep":512,"num_predict":4096,"temperature":0.15}}'

Write-Host "  Enviando request... (puede tardar 1-3 min)"
$sw = [System.Diagnostics.Stopwatch]::StartNew()

$job = Start-Job -ScriptBlock {
  param($p)
  $r = Invoke-RestMethod -Uri 'http://localhost:11434/api/generate' -Method Post -Body $p -ContentType 'application/json' -TimeoutSec 600
  $r | ConvertTo-Json -Depth 2
} -ArgumentList $payload

Start-Sleep -Seconds 5
Write-Host ""
Write-Host "  --- MEDICION DURANTE CARGA/INFERENCIA (t=5s) ---"
Write-Host ("  RAM Use : {0} %" -f (Get-RamPct))
Write-Host ("  CPU Load: {0} %" -f (Get-CpuPct))
Write-Host ("  Ollama RAM: {0} MB" -f (Get-OllamaRamMb))
Write-Host ""

Write-Host "  Esperando respuesta del modelo 32B..."
$result = Receive-Job -Job $job -Wait -AutoRemoveJob
$sw.Stop()
Write-Host ""
Write-Host ("  Tiempo total: {0:N1} s" -f $sw.Elapsed.TotalSeconds)
Write-Host ""

Write-Host "================================================================"
Write-Host " 5. ESTADO FINAL (post-inferencia)"
Write-Host "================================================================"
Write-Host ("  RAM Use : {0} %" -f (Get-RamPct))
Write-Host ("  CPU Load: {0} %" -f (Get-CpuPct))
Write-Host ("  Ollama RAM: {0} MB" -f (Get-OllamaRamMb))
Write-Host ""
Write-Host "  Ollama ps (modelo residente y contexto):"
ollama ps 2>&1 | Out-String -Width 120
Write-Host ""

Write-Host "================================================================"
Write-Host " 6. EXTRACTO DE LA RESPUESTA (primeras lineas)"
Write-Host "================================================================"
try {
  $resp = $result | ConvertFrom-Json
  $txt = $resp.response
  if ($txt.Length -gt 2000) { $txt = $txt.Substring(0,2000) + '...' }
  Write-Host $txt
} catch {
  Write-Host "  (respuesta no parseable, mostrando crudo limitado)"
  $raw = ($result | Out-String)
  if ($raw.Length -gt 2000) { $raw = $raw.Substring(0,2000) + '...' }
  Write-Host $raw
}
Write-Host ""
Write-Host "==== FIN DE PRUEBA ===="