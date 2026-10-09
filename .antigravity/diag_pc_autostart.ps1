# DIAGNOSTICO AUTOSTART - busca que se lanza al arranque (NO MODIFICA)
$ErrorActionPreference = 'SilentlyContinue'

Write-Output '=== 1. REGISTRY RUN KEYS ==='
$paths = @(
  'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run',
  'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce',
  'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run',
  'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\RunOnce',
  'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run',
  'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce'
)
foreach ($p in $paths) {
  $k = Get-Item $p -ErrorAction SilentlyContinue
  if ($k) {
    Write-Output ("--- $p ---")
    $k.Property | ForEach-Object { Write-Output ("  {0} = {1}" -f $_, (Get-ItemProperty $p).$_) }
  }
}

Write-Output '=== 2. STARTUP FOLDERS ==='
Get-ChildItem "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup" -ErrorAction SilentlyContinue | Select-Object Name | Format-Table -AutoSize | Out-String
Get-ChildItem "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\Startup" -ErrorAction SilentlyContinue | Select-Object Name | Format-Table -AutoSize | Out-String

Write-Output '=== 3. TAREAS PROGRAMADAS (clave: ollama, anti, omega, daemon, vram, stress, sclass, ollama) ==='
Get-ScheduledTask -ErrorAction SilentlyContinue | Where-Object {
  $_.TaskName -match 'ollama|anti|omega|daemon|vram|stress|sclass|ear|node' -or
  ($_.Actions | Out-String) -match 'ollama|antigravity|omega|vram|stress'
} | Select-Object TaskName, TaskPath, State | Format-Table -AutoSize | Out-String

Write-Output '=== 4. TAREAS PROGRAMADAS ALPHA (que arrancan con logon/boot) ==='
Get-ScheduledTask -ErrorAction SilentlyContinue | Where-Object { $_.State -ne 'Disabled' } | ForEach-Object {
  $triggers = $_.Triggers | Out-String
  if ($triggers -match 'Logon|Boot|AtStartup') {
    $act = ($_.Actions | Out-String)
    if ($act -match 'ollama|antigravity|omega|node|pwsh|powershell|\.bat|\.ps1|\.cmd') {
      [PSCustomObject]@{ Task = $_.TaskName; Action = (($_.Actions | Select-Object -First 1 | ForEach-Object { $_.Execute + ' ' + $_.Arguments }) -join ' ') }
    }
  }
} | Format-List | Out-String

Write-Output '=== 5. SERVICIOS que arrancan OLLAMA / NODE ==='
Get-CimInstance Win32_Service -ErrorAction SilentlyContinue | Where-Object { $_.PathName -match 'ollama|node|antigravity' } | Select-Object Name, State, StartMode, PathName | Format-List | Out-String

Write-Output '=== FIN DIAG AUTOSTART ==='