# DIAGNOSTICO FORENSE PC - SOLO LECTURA (no modifica nada)
$ErrorActionPreference = 'SilentlyContinue'

Write-Output '=== 1. CONFIG ARRANQUE ACTUAL (safe boot?) ==='
bcdedit /enum '{current}' | Out-String

Write-Output '=== 2. FAST STARTUP / HIBERNACION ==='
$h = Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power' -ErrorAction SilentlyContinue
Write-Output ("HiberbootEnabled = " + $h.HiberbootEnabled)
$hyb = Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Power' -ErrorAction SilentlyContinue
Write-Output ("HibernateEnabled = " + $hyb.HibernateEnabled)

Write-Output '=== 3. APAGADOS INESPERADOS (EventLog 6008) 14 dias ==='
Get-WinEvent -FilterHashtable @{LogName='System'; Id=6008} -MaxEvents 20 -ErrorAction SilentlyContinue | ForEach-Object { ($_.TimeCreated.ToString('yyyy-MM-dd HH:mm:ss') + " | " + $_.Message) }

Write-Output '=== 4. KERNEL-POWER 41 (CRITICO) 14 dias ==='
Get-WinEvent -FilterHashtable @{LogName='System'; Id=41} -MaxEvents 25 -ErrorAction SilentlyContinue | ForEach-Object {
  $props = $_.Properties
  ("{0} | BugcheckCode={1} PowerButtonTimestamp={2} SleepInProgress={3}" -f $_.TimeCreated.ToString('yyyy-MM-dd HH:mm:ss'), $props[4].Value, $props[1].Value, $props[9].Value)
}

Write-Output '=== 5. BLUE SCREENS (BugCheck 1001 + 1005) 30 dias ==='
Get-WinEvent -FilterHashtable @{LogName='System'; Id=1001,1005} -MaxEvents 20 -ErrorAction SilentlyContinue | ForEach-Object { ($_.TimeCreated.ToString('yyyy-MM-dd HH:mm:ss') + "`n" + $_.Message + "`n-----") }

Write-Output '=== 6. MINIDUMPS ==='
Get-ChildItem 'C:\Windows\Minidump' -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 12 Name, LastWriteTime, Length | Format-Table -AutoSize | Out-String
Write-Output '=== MEMORY.DMP ==='
Get-Item 'C:\Windows\MEMORY.DMP' -ErrorAction SilentlyContinue | Select-Object Name, LastWriteTime, Length | Format-List | Out-String

Write-Output '=== 7. SALUD DISCOS ==='
Get-PhysicalDisk | Select-Object FriendlyName, MediaType, BusType, HealthStatus, OperationalStatus, @{n='SizeGB';e={[math]::Round($_.Size/1GB,1)}} | Format-Table -AutoSize | Out-String

Write-Output '=== 8. PAGE FILE ==='
Get-CimInstance Win32_PageFileUsage -ErrorAction SilentlyContinue | Select-Object Name, AllocatedBaseSize, CurrentUsage, PeakUsage | Format-List | Out-String
Get-CimInstance Win32_ComputerSystem | Select-Object AutomaticManagedPagefile | Format-List | Out-String

Write-Output '=== 9. ULTIMO ARRANQUE ==='
(Get-CimInstance Win32_OperatingSystem).LastBootUpTime

Write-Output '=== 10. DRIVER GPU AMD (PnP firmado) ==='
Get-CimInstance Win32_PnPSignedDriver | Where-Object { $_.DeviceName -match 'AMD|Radeon|7900' } | Select-Object DeviceName, DriverVersion, DriverDate, IsSigned | Format-Table -AutoSize | Out-String

Write-Output '=== 11. CONTADOR ERRORES SISTEMA 7 DIAS (top fuentes) ==='
Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddDays(-7)} -ErrorAction SilentlyContinue | Group-Object ProviderName | Sort-Object Count -Descending | Select-Object -First 18 Count, Name | Format-Table -AutoSize | Out-String

Write-Output '=== 12. ERRORES HARDWARE WHEA ==='
Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Microsoft-Windows-WHEA-Logger'} -MaxEvents 10 -ErrorAction SilentlyContinue | ForEach-Object { ($_.TimeCreated.ToString('yyyy-MM-dd HH:mm:ss') + " | " + $_.Message) }

Write-Output '=== 13. MODULOS RAM ==='
Get-CimInstance Win32_PhysicalMemory | Select-Object DeviceLocator, Capacity, ConfiguredClockSpeed, Manufacturer | Format-Table -AutoSize | Out-String

Write-Output '=== 14. TDR / GPU (Display) errores 7 dias ==='
Get-WinEvent -FilterHashtable @{LogName='System'; StartTime=(Get-Date).AddDays(-7)} -ErrorAction SilentlyContinue | Where-Object { $_.ProviderName -match 'Display|dxgkrnl|nvlddmkm|amdkmdag' -or $_.Message -match 'TDR|display driver' } | Select-Object -First 15 TimeCreated, ProviderName, Id, LevelDisplayName | Format-Table -AutoSize | Out-String

Write-Output '=== FIN DIAGNOSTICO ==='