# Se ejecuta UNA vez tras el reinicio NORMAL (RunOnce). Crea el punto de restauracion con VSS ya operativo.
$ErrorActionPreference = 'Continue'
Start-Sleep -Seconds 30

Write-Output '=== HABILITANDO PROTECCION SISTEMA C: ==='
try { Enable-ComputerRestore -Drive 'C:\' -ErrorAction SilentlyContinue } catch {}
Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore' -Name 'DisableSR' -Value 0 -Type DWord
Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore\Cfg' -Name 'DiskPercent' -Value 10 -Type DWord

Write-Output '=== ARRANCANDO SERVICIOS VSS / PROGRAMADOR ==='
foreach ($svc in 'VSS','swprv','Schedule','SDRSVC') {
  try {
    $s = Get-Service -Name $svc -ErrorAction SilentlyContinue
    if ($s -and $s.StartType -eq 'Disabled') { Set-Service -Name $svc -StartupType Manual }
    if ($s -and $s.Status -ne 'Running') { Start-Service -Name $svc -ErrorAction SilentlyContinue }
  } catch {}
}

Write-Output '=== CREANDO PUNTO DE RESTAURACION ==='
$rpName = "EAR_OS_RestorePoint_PostOptimizacion_" + (Get-Date -Format 'yyyyMMdd_HHmmss')
try {
  $res = Invoke-CimMethod -Namespace 'root/default' -ClassName 'SystemRestore' -MethodName 'CreateRestorePoint' -Arguments @{
    Description = [string]$rpName
    RestorePointType = [uint32]12
    EventType = [uint32]100
  }
  Write-Output ("CreateRestorePoint ReturnValue=" + $res.ReturnValue + " (0=OK)")
} catch {
  Write-Output ("WMI fallo: " + $_.Exception.Message)
  try { Checkpoint-Computer -Description $rpName -RestorePointType 'MODIFY_SETTINGS' -ErrorAction SilentlyContinue; Write-Output 'Checkpoint-Computer intentado' } catch {}
}

# Limpiar la entrada RunOnce para no repetir
Remove-ItemProperty -Path 'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce' -Name 'EAR_OS_RestorePoint' -ErrorAction SilentlyContinue
Write-Output '=== FIN (RunOnce consumido) ==='