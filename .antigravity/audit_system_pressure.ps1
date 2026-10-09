# ============================================================================
# AUDITORÍA FORENSE DE PRESIÓN DEL SISTEMA (RAM / CPU / GPU / OLLAMA)
# ============================================================================
$ErrorActionPreference = 'SilentlyContinue'

Write-Host "=============================================================="
Write-Host " 1. MEMORIA RAM GLOBAL"
Write-Host "=============================================================="
$os = Get-CimInstance Win32_OperatingSystem
$total = [double]$os.TotalVisibleMemorySize / 1MB
$free  = [double]$os.FreePhysicalMemory / 1MB
$used  = $total - $free
$pct   = ($used / $total) * 100
Write-Host ("  Total : {0:N2} GB" -f $total)
Write-Host ("  EnUso : {0:N2} GB" -f $used)
Write-Host ("  Libre : {0:N2} GB" -f $free)
Write-Host ("  Use % : {0:N1}" -f $pct)
Write-Host ""

Write-Host "=============================================================="
Write-Host " 2. CPU GLOBAL"
Write-Host "=============================================================="
$cpuLoad = (Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average
Write-Host ("  Load % : {0}" -f $cpuLoad)
Write-Host ""

Write-Host "=============================================================="
Write-Host " 3. TOP 30 PROCESOS POR USO DE RAM (Working Set)"
Write-Host "=============================================================="
$procs = Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 30
$i = 0
foreach ($p in $procs) {
  $i++
  $ramMb = [int]($p.WorkingSet64 / 1MB)
  $privMb = [int]($p.PrivateMemorySize64 / 1MB)
  $cpu = [math]::Round($p.CPU, 1)
  Write-Host ("  {0,2}. {1,-28} RAM={2,6} MB  Priv={3,6} MB  CPU={4,8}s" -f $i, $p.ProcessName, $ramMb, $privMb, $cpu)
}
Write-Host ""

Write-Host "=============================================================="
Write-Host " 4. PROCESOS NODE.JS CONSUMO (DAEMONS / SERVIDORES)"
Write-Host "=============================================================="
$nodes = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | Select-Object ProcessId, CommandLine, @{N='RAM_MB';E={[int]($_.WorkingSetSize/1MB)}}
if ($nodes) {
  foreach ($n in $nodes) {
    $cl = $n.CommandLine
    if ($cl.Length -gt 130) { $cl = $cl.Substring(0,130) + '...' }
    Write-Host ("  PID {0,-7} RAM={1,6} MB  {2}" -f $n.ProcessId, $n.RAM_MB, $cl)
  }
} else {
  Write-Host "  (sin procesos node.exe)"
}
Write-Host ""

Write-Host "=============================================================="
Write-Host " 5. PROCESOS OLLAMA (modelos residentes)"
Write-Host "=============================================================="
$ollamas = Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'ollama' } | Select-Object ProcessId, Name, CommandLine, @{N='RAM_MB';E={[int]($_.WorkingSetSize/1MB)}}
if ($ollamas) {
  foreach ($o in $ollamas) {
    $cl = $o.CommandLine
    if ($cl.Length -gt 160) { $cl = $cl.Substring(0,160) + '...' }
    Write-Host ("  PID {0,-7} {1,-20} RAM={2,6} MB  {3}" -f $o.ProcessId, $o.Name, $o.RAM_MB, $cl)
  }
} else {
  Write-Host "  (sin procesos ollama)"
}
Write-Host ""

Write-Host "=============================================================="
Write-Host " 6. GPU (VRAM) - TARJETA GRAFICA"
Write-Host "=============================================================="
try {
  $gpus = Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion, VideoModeDescription
  foreach ($g in $gpus) {
    $vramGb = [double]$g.AdapterRAM / 1GB
    Write-Host ("  GPU: {0}" -f $g.Name)
    Write-Host ("  VRAM nominal: {0:N2} GB" -f $vramGb)
    Write-Host ("  Driver: {0}" -f $g.DriverVersion)
    Write-Host ("  Modo: {0}" -f $g.VideoModeDescription)
  }
} catch {
  Write-Host "  No se pudo leer Win32_VideoController"
}
Write-Host ""

Write-Host "=============================================================="
Write-Host " 7. PROCESO CON MAYOR CONSUMO DE GPU (si hay nvidia-smi)"
Write-Host "=============================================================="
try {
  $nvsmi = & nvidia-smi --query-gpu=name,memory.total,memory.used,memory.free,utilization.gpu,utilization.memory,temperature.gpu --format=csv,noheader,nounits 2>$null
  if ($nvsmi) {
    foreach ($line in $nvsmi) {
      Write-Host ("  $line")
    }
    Write-Host ""
    $nvsmi2 = & nvidia-smi --query-compute-apps=pid,used_memory,name --format=csv,noheader,nounits 2>$null
    if ($nvsmi2) {
      Write-Host "  Procesos compute:"
      foreach ($line2 in $nvsmi2) { Write-Host ("    $line2") }
    }
  } else {
    Write-Host "  nvidia-smi no disponible (posiblemente GPU AMD)."
  }
} catch {
  Write-Host "  nvidia-smi no disponible (posiblemente GPU AMD)."
}
Write-Host ""

Write-Host "==== FIN DE AUDITORIA ===="