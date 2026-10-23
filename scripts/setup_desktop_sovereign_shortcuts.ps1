$WshShell = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')

New-Item -ItemType Directory -Path 'G:\01_TRABAJO\INBOX' -Force | Out-Null
New-Item -ItemType Directory -Path 'G:\02_PERSONAL\INBOX' -Force | Out-Null

$shortcut1 = $WshShell.CreateShortcut("$desktop\01_TRABAJO.lnk")
$shortcut1.TargetPath = 'G:\01_TRABAJO'
$shortcut1.Description = 'Raíz Soberana de Trabajo y Proyectos'
$shortcut1.Save()

$shortcut2 = $WshShell.CreateShortcut("$desktop\02_PERSONAL.lnk")
$shortcut2.TargetPath = 'G:\02_PERSONAL'
$shortcut2.Description = 'Raíz Soberana de Archivos Personales'
$shortcut2.Save()

Write-Host 'Accesos directos soberanos creados en el Escritorio con éxito.'
