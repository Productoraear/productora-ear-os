# ============================================================
# DIAGNOSTICO SISTEMA — ESTADO REAL VRAM/RAM/OLLAMA
# ============================================================
$ErrorActionPreference = 'Continue'

Write-Host "================ ENV VARS OLLAMA ================"
$vars = 'OLLAMA_FLASH_ATTENTION','OLLAMA_KV_CACHE_TYPE','OLLAMA_NUM_PARALLEL','OLLAMA_KEEP_ALIVE','OLLAMA_MAX_LOADED_MODELS','OLLAMA_HOST','OLLAMA_NUM_CTX','OLLAMA_CONTEXT_LENGTH','OLLAMA_GPU_OVERHEAD','OLLAMA_SCHED_SPREAD','OLLAMA_MAX_VRAM'
foreach ($n in $vars) {
  $u = [Environment]::GetEnvironmentVariable($n, 'User')
  $m = [Environment]::GetEnvironmentVariable($n, 'Machine')
  Write-Host ("  {0,-26} User=[{1}] Machine=[{2}]" -f $n, $u, $m)
}

Write-Host ""
Write-Host "================ RAM ================"
$os = Get-CimInstance Win32_OperatingSystem
$total = [double]$os.TotalVisibleMemorySize / 1MB
$free  = [double]$os.FreePhysicalMemory / 1MB
$used  = $total - $free
Write-Host ("  Total: {0:N1} GB | Used: {1:N1} GB ({2:N1}%) | Free: {3:N1} GB" -f $total, $used, (($used/$total)*100), $free)

Write-Host ""
Write-Host "================ GPU VRAM (WDDM) ================"
try {
  $gc = Get-Counter '\GPU Adapter Memory(*)\Dedicated Usage' -ErrorAction Stop
  foreach ($c in $gc.CounterSamples) {
    Write-Host ("  [{0}] Dedicated = {1:N2} GB" -f $c.InstanceName, ($c.CookedValue/1GB))
  }
} catch { Write-Host "  [!] Dedicated: $($_.Exception.Message)" }

try {
  $gcs = Get-Counter '\GPU Adapter Memory(*)\Shared Usage' -ErrorAction Stop
  foreach ($c in $gcs.CounterSamples) {
    Write-Host ("  [{0}] Shared    = {1:N2} GB" -f $c.InstanceName, ($c.CookedValue/1GB))
  }
} catch { Write-Host "  [!] Shared: $($_.Exception.Message)" }

try {
  $gcc = Get-Counter '\GPU Adapter Memory(*)\Total Committed' -ErrorAction Stop
  foreach ($c in $gcc.CounterSamples) {
    Write-Host ("  [{0}] Committed = {1:N2} GB" -f $c.InstanceName, ($c.CookedValue/1GB))
  }
} catch { Write-Host "  [!] Committed: $($_.Exception.Message)" }

Write-Host ""
Write-Host "================ GPU LOCAL MEMORY (CIM) ================"
try {
  $gpu = Get-CimInstance Win32_VideoController | Where-Object { $_.Name -match '7900|Radeon' }
  foreach ($g in $gpu) {
    Write-Host ("  {0}" -f $g.Name)
    Write-Host ("  AdapterRAM: {0:N1} GB (reportado)" -f ($g.AdapterRAM/1GB))
    Write-Host ("  Driver: {0}" -f $g.DriverVersion)
  }
} catch { Write-Host "  [!] GPU CIM: $($_.Exception.Message)" }

Write-Host ""
Write-Host "================ OLLAMA PS ================"
ollama ps 2>&1 | Out-String -Width 200

Write-Host "================ OLLAMA LIST ================"
ollama list 2>&1 | Out-String -Width 200

Write-Host "================ PROCESOS OLLAMA/RUNNER ================"
$procs = Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'ollama|llama|server|runner' } | Select-Object ProcessId, Name, @{N='RAM_MB';E={[int]($_.WorkingSetSize/1MB)}}, @{N='Priv_MB';E={[int]($_.PrivatePageCount/1KB)}}
if ($procs) { $procs | Format-Table -AutoSize } else { Write-Host "  (sin procesos)" }

Write-Host "================ GPU ENGAGE/TUNING (registry) ================"
try {
  $pc = Get-CimInstance -Namespace 'root\wmi' -ClassName 'MSA_Property' -Filter "PropertyName='GpuMaxPower' or PropertyName='pplib_powerplay_table'" -ErrorAction SilentlyContinue
  if ($pc) { $pc | Format-List } else { Write-Host "  (sin propiedades de tuning expuestas)" }
} catch { Write-Host "  [!] $($_.Exception.Message)" }

Write-Host "==== FIN DIAG ===="