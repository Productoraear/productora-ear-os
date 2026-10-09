# ============================================================================
# GPU VRAM PROBE - VERIFICACION REAL DE VRAM DEDICADA + DESGLOSE RAM
# ============================================================================
$ErrorActionPreference = 'Continue'

Write-Host "================================================================"
Write-Host " 1. DESGLOSE DETALLADO DE MEMORIA RAM (ahora)."
Write-Host "================================================================"
$os = Get-CimInstance Win32_OperatingSystem
$total = [double]$os.TotalVisibleMemorySize / 1MB
$free  = [double]$os.FreePhysicalMemory / 1MB
$used  = $total - $free

$perf = Get-CimInstance Win32_PerfFormattedData_PerfOS_Memory
Write-Host ("  Total        : {0:N2} GB" -f $total)
Write-Host ("  EnUso        : {0:N2} GB  ({1:N1} %)" -f $used, (($used/$total)*100))
Write-Host ("  Libre        : {0:N2} GB" -f $free)
Write-Host ("  Cache bytes  : {0:N2} GB" -f ($perf.CacheBytes / 1GB))
Write-Host ("  Committed    : {0:N2} GB" -f ($perf.CommittedBytes / 1GB))
Write-Host ("  CommitLimit  : {0:N2} GB" -f ($perf.CommitLimit / 1GB))
Write-Host ("  PoolPaged    : {0:N2} GB" -f ($perf.PoolPagedBytes / 1GB))
Write-Host ("  PoolNonPaged : {0:N2} GB" -f ($perf.PoolNonpagedBytes / 1GB))
Write-Host ("  Available    : {0:N2} GB" -f ($perf.AvailableBytes / 1GB))
Write-Host ""

Write-Host "================================================================"
Write-Host " 2. VRAM DEDICADA (contadores GPU de Windows - WDDM)"
Write-Host "================================================================"
try {
  $gc = Get-Counter '\GPU Adapter Memory(*)\Dedicated Usage' -ErrorAction Stop
  foreach ($c in $gc.CounterSamples) {
    $instance = $c.InstanceName
    $bytes = [double]$c.CookedValue
    $gb = $bytes / 1GB
    Write-Host ("  [{0}] Dedicated = {1:N2} GB" -f $instance, $gb)
  }
} catch {
  Write-Host ("  [!] No se pudo leer GPU Adapter Memory: {0}" -f $_.Exception.Message)
}

try {
  $gcm = Get-Counter '\GPU Adapter Memory(*)\Shared Usage' -ErrorAction Stop
  foreach ($c in $gcm.CounterSamples) {
    Write-Host ("  [{0}] Shared    = {1:N2} GB" -f $c.InstanceName, ($c.CookedValue/1GB))
  }
} catch {
  Write-Host "  [!] No se pudo leer Shared Usage"
}

try {
  $gct = Get-Counter '\GPU Adapter Memory(*)\Total Committed' -ErrorAction Stop
  foreach ($c in $gct.CounterSamples) {
    Write-Host ("  [{0}] Committed  = {1:N2} GB" -f $c.InstanceName, ($c.CookedValue/1GB))
  }
} catch {
  Write-Host "  [!] No se pudo leer Total Committed"
}
Write-Host ""

Write-Host "================================================================"
Write-Host " 3. PROCESOS OLLAMA Y RUNNERS (consumo RAM por proceso)"
Write-Host "================================================================"
$procs = Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'ollama|llama|server|runner' } | Select-Object ProcessId, Name, @{N='RAM_MB';E={[int]($_.WorkingSetSize/1MB)}}, @{N='Priv_MB';E={[int]($_.PrivatePageCount/1KB)}}
if ($procs) {
  foreach ($p in $procs) {
    Write-Host ("  PID {0,-7} {1,-24} RAM={2,6} MB  Priv={3,6} MB" -f $p.ProcessId, $p.Name, $p.RAM_MB, $p.Priv_MB)
  }
} else {
  Write-Host "  (sin procesos relacionados)"
}
Write-Host ""

Write-Host "================================================================"
Write-Host " 4. TOP 12 PROCESOS POR RAM (ahora)"
Write-Host "================================================================"
$top = Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 12
$i = 0
foreach ($t in $top) {
  $i++
  Write-Host ("  {0,2}. {1,-22} RAM={2,6} MB  Priv={3,6} MB" -f $i, $t.ProcessName, [int]($t.WorkingSet64/1MB), [int]($t.PrivateMemorySize64/1MB))
}
Write-Host ""
Write-Host "==== FIN PROBE ===="