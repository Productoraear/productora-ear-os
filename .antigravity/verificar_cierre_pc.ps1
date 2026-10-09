# VERIFICACION FINAL - estado del arranque y optimizaciones aplicadas (SOLO LECTURA)
$ErrorActionPreference = 'SilentlyContinue'

Write-Output '=== 1. SAFEBOOT ATASCADO (debe estar AUSENTE) ==='
$opt = Get-Item 'HKLM:\SYSTEM\CurrentControlSet\Control\SafeBoot\Option' -ErrorAction SilentlyContinue
if ($opt) { Write-Output ("ALERTA: SafeBoot\Option existe -> " + (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\SafeBoot\Option').OptionValue) }
else { Write-Output 'OK: SafeBoot\Option AUSENTE -> arranque NORMAL configurado' }

Write-Output '=== 2. FAST STARTUP (debe ser 0) ==='
Write-Output ("HiberbootEnabled = " + (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power').HiberbootEnabled)

Write-Output '=== 3. VARIABLES OLLAMA (nuevas sesiones) ==='
Write-Output ("OLLAMA_FLASH_ATTENTION = " + [Environment]::GetEnvironmentVariable('OLLAMA_FLASH_ATTENTION','User'))
Write-Output ("OLLAMA_KV_CACHE_TYPE   = " + [Environment]::GetEnvironmentVariable('OLLAMA_KV_CACHE_TYPE','User'))
Write-Output ("OLLAMA_MAX_VRAM        = " + [Environment]::GetEnvironmentVariable('OLLAMA_MAX_VRAM','User'))
Write-Output ("OLLAMA_KEEP_ALIVE      = " + [Environment]::GetEnvironmentVariable('OLLAMA_KEEP_ALIVE','User'))

Write-Output '=== 4. PLAN ENERGIA ==='
powercfg /getactivescheme

Write-Output '=== 5. DISCO C: (presion de arranque) ==='
Get-PSDrive C | Select-Object @{n='UsedGB';e={[math]::Round($_.Used/1GB,1)}}, @{n='FreeGB';e={[math]::Round($_.Free/1GB,1)}} | Format-List | Out-String

Write-Output '=== 6. TEMP / LIMPIEZA POTENCIAL (no se borra, solo medicion) ==='
$paths = @("$env:TEMP", 'C:\Windows\Temp', "$env:LOCALAPPDATA\Microsoft\Windows\INetCache")
foreach ($p in $paths) {
  try {
    $size = (Get-ChildItem $p -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    Write-Output ("  {0} : {1:N2} GB" -f $p, ($size/1GB))
  } catch { Write-Output ("  {0} : (no accesible)" -f $p) }
}

Write-Output '=== 7. ULTIMO ARRANQUE ==='
Write-Output ((Get-CimInstance Win32_OperatingSystem).LastBootUpTime)

Write-Output '=== FIN VERIFICACION ==='