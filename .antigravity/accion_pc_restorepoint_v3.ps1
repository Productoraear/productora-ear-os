# ACCION 3: Reparar cadena de servicios VSS/SystemRestore y crear punto de restauracion
$ErrorActionPreference = 'Continue'

Write-Output '=== 1. INSPECCION srservice ==='
sc.exe qc srservice 2>&1
sc.exe queryex srservice 2>&1
Get-Service -Name 'srservice' -ErrorAction SilentlyContinue | Select-Object Name, Status, StartType | Format-List | Out-String

Write-Output '=== 2. ARRANCAR TASK SCHEDULER (Schedule) ==='
try {
  Set-Service -Name 'Schedule' -StartupType Automatic -ErrorAction SilentlyContinue
  Start-Service -Name 'Schedule'
  Write-Output ("Schedule -> " + (Get-Service Schedule).Status + " / " + (Get-Service Schedule).StartType)
} catch { Write-Output ("Schedule ERROR: " + $_.Exception.Message) }

Write-Output '=== 3. ARRANCAR VSS / SDRSVC / swprv ==='
foreach ($svc in 'VSS','SDRSVC','swprv') {
  try {
    $s = Get-Service -Name $svc -ErrorAction SilentlyContinue
    if ($s) {
      if ($s.StartType -eq 'Disabled') { Set-Service -Name $svc -StartupType Manual }
      if ((Get-Service $svc).Status -ne 'Running') { Start-Service $svc -ErrorAction SilentlyContinue }
      Write-Output ("  $svc : " + (Get-Service $svc).Status)
    } else { Write-Output ("  $svc : (no existe)") }
  } catch { Write-Output ("  $svc ERROR: " + $_.Exception.Message) }
}

Write-Output '=== 4. ENABLE SYSTEM RESTORE (WMI) ==='
try {
  $en = Invoke-CimMethod -Namespace 'root/default' -ClassName 'SystemRestore' -MethodName 'Enable' -Arguments @{ Drive = 'C:\' }
  Write-Output ("Enable ReturnValue=" + $en.ReturnValue + " (0=OK)")
} catch { Write-Output ("Enable ERROR: " + $_.Exception.Message) }

Write-Output '=== 5. CREAR PUNTO DE RESTAURACION (tipos uint32) ==='
$rpName = "EAR_OS_RestorePoint_PreOptimizacion_" + (Get-Date -Format 'yyyyMMdd_HHmmss')
Write-Output ("Nombre: " + $rpName)
try {
  $res = Invoke-CimMethod -Namespace 'root/default' -ClassName 'SystemRestore' -MethodName 'CreateRestorePoint' -Arguments @{
    Description = [string]$rpName
    RestorePointType = [uint32]12
    EventType = [uint32]100
  }
  Write-Output ("CreateRestorePoint ReturnValue=" + $res.ReturnValue + " (0=OK)")
} catch { Write-Output ("CreateRestorePoint ERROR: " + $_.Exception.Message) }

Start-Sleep -Seconds 5

Write-Output '=== 6. LISTA PUNTOS RESTAURACION ==='
Get-ComputerRestorePoint -ErrorAction SilentlyContinue | Select-Object SequenceNumber, Description, CreationTime | Sort-Object CreationTime -Descending | Select-Object -First 8 | Format-Table -AutoSize | Out-String

Write-Output '=== 7. VERIFICACION ESTADO FINAL ==='
Write-Output ("Fast Startup HiberbootEnabled = " + (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power').HiberbootEnabled)
Write-Output ("DisableSR = " + (Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore').DisableSR)
Write-Output ("System Restore habilitado via cmdlet: ")
Get-ComputerRestorePoint -ErrorAction SilentlyContinue | Measure-Object | Select-Object Count | Format-List | Out-String

Write-Output '=== FIN ACCION 3 ==='