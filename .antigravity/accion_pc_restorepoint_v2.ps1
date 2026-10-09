# ACCION 2: Habilitar System Restore (registro + VSS) y crear punto de restauracion
$ErrorActionPreference = 'Continue'

Write-Output '=== 1. ESTADO SERVICIOS VSS / SR ==='
Get-Service -Name 'VSS','swprv','srservice','Schedule','SDRSVC' -ErrorAction SilentlyContinue | Select-Object Name, Status, StartType | Format-Table -AutoSize | Out-String

Write-Output '=== 2. REGISTRO SYSTEMRESTORE ACTUAL ==='
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore' -ErrorAction SilentlyContinue | Select-Object DisableSR, RPSessionInterval, SystemRestorePointCreationFrequency | Format-List | Out-String
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore\Cfg' -ErrorAction SilentlyContinue | Select-Object DiskPercent | Format-List | Out-String

Write-Output '=== 3. HABILITANDO SERVICIOS (VSS, swprv, Schedule, srservice) ==='
foreach ($svc in 'VSS','swprv','Schedule','srservice','SDRSVC') {
  try {
    $s = Get-Service -Name $svc -ErrorAction SilentlyContinue
    if ($s) {
      if ($s.StartType -eq 'Disabled') { Set-Service -Name $svc -StartupType Manual; Write-Output ("  $svc : Disabled -> Manual") }
      if ($s.Status -ne 'Running') { Start-Service -Name $svc -ErrorAction SilentlyContinue }
      Write-Output ("  $svc : " + (Get-Service -Name $svc).Status)
    } else { Write-Output "  $svc : (no existe)" }
  } catch { Write-Output ("  $svc : ERROR " + $_.Exception.Message) }
}

Write-Output '=== 4. HABILITANDO PROTECCION SISTEMA VIA REGISTRO ==='
$sr = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore'
New-Item -Path $sr -Force | Out-Null
Set-ItemProperty -Path $sr -Name 'RPSessionInterval' -Value 1 -Type DWord
Set-ItemProperty -Path $sr -Name 'DisableSR' -Value 0 -Type DWord
Set-ItemProperty -Path $sr -Name 'SystemRestorePointCreationFrequency' -Value 0 -Type DWord
New-Item -Path "$sr\Cfg" -Force | Out-Null
Set-ItemProperty -Path "$sr\Cfg" -Name 'DiskPercent' -Value 10 -Type DWord
Write-Output 'Registro actualizado: DisableSR=0, RPSessionInterval=1, DiskPercent=10'

Write-Output '=== 5. HABILITANDO VIA WMI SystemRestore.Enable ==='
try {
  $en = Invoke-CimMethod -Namespace 'root/default' -ClassName 'SystemRestore' -MethodName 'Enable' -Arguments @{ Drive = 'C:\' }
  Write-Output ("Enable -> ReturnValue=" + $en.ReturnValue)
} catch { Write-Output ("WMI Enable ERROR: " + $_.Exception.Message) }

Write-Output '=== 6. CREANDO PUNTO DE RESTAURACION POR WMI ==='
$rpName = "EAR_OS_RestorePoint_PreOptimizacion_" + (Get-Date -Format 'yyyyMMdd_HHmmss')
Write-Output ("Nombre: " + $rpName)
try {
  $res = Invoke-CimMethod -Namespace 'root/default' -ClassName 'SystemRestore' -MethodName 'CreateRestorePoint' -Arguments @{ Description = $rpName; RestorePointType = 12; EventType = 100 }
  Write-Output ("CreateRestorePoint ReturnValue=" + $res.ReturnValue + " (0 = exito)")
} catch { Write-Output ("WMI CreateRestorePoint ERROR: " + $_.Exception.Message) }

Start-Sleep -Seconds 3

Write-Output '=== 7. LISTA PUNTOS DE RESTAURACION ==='
Get-ComputerRestorePoint -ErrorAction SilentlyContinue | Select-Object SequenceNumber, Description, CreationTime | Sort-Object CreationTime -Descending | Select-Object -First 8 | Format-Table -AutoSize | Out-String

Write-Output '=== 8. DESACTIVANDO FAST STARTUP (Hiberboot) ==='
try {
  Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power' -Name 'HiberbootEnabled' -Value 0 -Type DWord
  Write-Output ("HiberbootEnabled = " + (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power').HiberbootEnabled)
} catch { Write-Output ("Hiberboot: " + $_.Exception.Message) }

Write-Output '=== FIN ACCION 2 ==='