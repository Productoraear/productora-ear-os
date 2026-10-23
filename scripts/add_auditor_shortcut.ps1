$WshShell = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')

$shortcut = $WshShell.CreateShortcut("$desktop\AUDITAR_PUREZA_PC.lnk")
$shortcut.TargetPath = 'G:\EAR_OS_V2\EAR_OS_V2\AUDITAR_PUREZA_SISTEMA.bat'
$shortcut.WorkingDirectory = 'G:\EAR_OS_V2\EAR_OS_V2'
$shortcut.Description = 'Auditor Heurístico Anti-Vertedero Perfil Azul'
$shortcut.Save()

Write-Host "Acceso directo AUDITAR_PUREZA_PC creado en Escritorio."
