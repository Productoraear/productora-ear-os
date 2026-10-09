# ACCION 4: Limpiar SafeBoot atascado y garantizar arranque normal (SEGURO/REVERSIBLE)
$ErrorActionPreference = 'Continue'
$log = Join-Path $PSScriptRoot 'safeboot_state_before.txt'

Write-Output '=== ESTADO PREVIO (guardado en safeboot_state_before.txt) ==='
$before = @()
$before += '--- BCD {current} ---'
$before += (bcdedit /enum '{current}' | Out-String)
$before += '--- BCD todas entradas (busqueda safeboot) ---'
$before += (bcdedit /enum | Out-String)
$before += '--- Registro SafeBoot (arbol) ---'
$before += (Get-ChildItem 'HKLM:\SYSTEM\CurrentControlSet\Control\SafeBoot' -Recurse -ErrorAction SilentlyContinue | Out-String)
$before += '--- Option ---'
$before += (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\SafeBoot\Option' -ErrorAction SilentlyContinue | Format-List | Out-String)
$before += '--- msconfig BootState ---'
$before += (Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved' -ErrorAction SilentlyContinue | Out-String)
$before | Set-Content -Path $log -Encoding UTF8
Write-Output $before

Write-Output '=== 1. ELIMINAR BANDERA safeboot DEL BCD (si existe) ==='
bcdedit /deletevalue '{current}' safeboot 2>&1
bcdedit /deletevalue '{current}' safebootalternateshell 2>&1
bcdedit /deletevalue '{current}' safebootnetwork 2>&1

Write-Output '=== 2. LIMPIAR SafeBoot\Option ATASCADO (registro) ==='
Remove-Item 'HKLM:\SYSTEM\CurrentControlSet\Control\SafeBoot\Option' -Force -ErrorAction SilentlyContinue
Remove-Item 'HKLM:\SYSTEM\CurrentControlSet\Control\SafeBoot\OptionValue' -Force -ErrorAction SilentlyContinue
Write-Output 'SafeBoot\Option eliminado (si existia)'

Write-Output '=== 3. VERIFICACION POST-LIMPIEZA ==='
Write-Output '--- BCD {current} tras limpieza ---'
bcdedit /enum '{current}' | Out-String
$opt = Get-Item 'HKLM:\SYSTEM\CurrentControlSet\Control\SafeBoot\Option' -ErrorAction SilentlyContinue
if ($opt) { Write-Output ("SafeBoot\Option AUN EXISTE -> " + (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\SafeBoot\Option').OptionValue) }
else { Write-Output 'SafeBoot\Option AUSENTE (correcto: arranque normal)' }

Write-Output '=== 4. ASEGURAR QUE NO HAY SAFEBOOT EN NINGUNA ENTRADA ==='
$sb = bcdedit /enum | Select-String -Pattern 'safeboot' -SimpleMatch
if ($sb) { Write-Output ('ATENCION: aun hay safeboot en: ' + $sb) } else { Write-Output 'OK: ninguna entrada con safeboot' }

Write-Output '=== FIN ACCION 4 ==='