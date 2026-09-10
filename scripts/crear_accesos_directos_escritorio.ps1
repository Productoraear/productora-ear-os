# scripts/crear_accesos_directos_escritorio.ps1
# ==============================================================================
# GENERADOR DE ACCESOS DIRECTOS CON ICONO EN EL ESCRITORIO DE WINDOWS
# ==============================================================================
$ErrorActionPreference = 'SilentlyContinue'

$desktopPath = [System.Environment]::GetFolderPath('Desktop')
$wshShell = New-Object -ComObject WScript.Shell

Write-Host "  [+] Generando accesos directos oficiales en: $desktopPath" -ForegroundColor Cyan

# 1. Acceso Directo de Sincronizacion Maestra (Nivel Omega)
$syncLnkPath = Join-Path $desktopPath "SINCRONIZAR_EAR_OS_SCLASS.lnk"
$syncTarget = "H:\EAR_OS_V2\EAR_OS_V2\SINCRONIZAR_EAR_OS_SCLASS.bat"

if (Test-Path $syncTarget) {
    $shortcut1 = $wshShell.CreateShortcut($syncLnkPath)
    $shortcut1.TargetPath = $syncTarget
    $shortcut1.WorkingDirectory = "H:\EAR_OS_V2\EAR_OS_V2"
    $shortcut1.Description = "Sincronizador Maestro EAR OS S-Class (Nivel Omega)"
    # Icono de sistema: engranaje / proceso de shell32.dll
    $shortcut1.IconLocation = "$env:SystemRoot\System32\shell32.dll, 238"
    $shortcut1.Save()
    Write-Host "      [OK] Creado: $syncLnkPath (Con icono de sistema)" -ForegroundColor Green
}

# 2. Acceso Directo de Obsidian EAR OS
$obsidianLnkPath = Join-Path $desktopPath "ABRIR_OBSIDIAN_EAR_OS.lnk"
$obsidianTarget = "H:\EAR_OS_V2\EAR_OS_V2\ABRIR_OBSIDIAN_EAR_OS.bat"

if (Test-Path $obsidianTarget) {
    $shortcut2 = $wshShell.CreateShortcut($obsidianLnkPath)
    $shortcut2.TargetPath = $obsidianTarget
    $shortcut2.WorkingDirectory = "H:\EAR_OS_V2\EAR_OS_V2"
    $shortcut2.Description = "Centro de Mando y Boveda Obsidian - Productora EAR"
    # Icono de sistema: diamante / estrella / documento
    $shortcut2.IconLocation = "$env:SystemRoot\System32\imageres.dll, 114"
    $shortcut2.Save()
    Write-Host "      [OK] Creado: $obsidianLnkPath (Con icono de sistema)" -ForegroundColor Green
}

# 3. Acceso Directo de Saneamiento Purista (5 Carpetas Maestras)
$purgeLnkPath = Join-Path $desktopPath "EJECUTAR_SANEAMIENTO_PURISTA.lnk"
$purgeTarget = "H:\EAR_OS_V2\EAR_OS_V2\EJECUTAR_SANEAMIENTO_PURISTA.bat"

if (Test-Path $purgeTarget) {
    $shortcut3 = $wshShell.CreateShortcut($purgeLnkPath)
    $shortcut3.TargetPath = $purgeTarget
    $shortcut3.WorkingDirectory = "H:\EAR_OS_V2\EAR_OS_V2"
    $shortcut3.Description = "Saneamiento Purista de Boveda y Visor S-Class en Obsidian"
    # Icono de sistema: escoba / limpieza / carpeta limpia
    $shortcut3.IconLocation = "$env:SystemRoot\System32\imageres.dll, 161"
    $shortcut3.Save()
    Write-Host "      [OK] Creado: $purgeLnkPath (Con icono de sistema)" -ForegroundColor Green
}

# 4. Acceso Directo de Optimizacion Hardware IA (RX 7900 XTX)
$optLnkPath = Join-Path $desktopPath "OPTIMIZAR_IA_PC_SCLASS.lnk"
$optTarget = "H:\EAR_OS_V2\EAR_OS_V2\OPTIMIZAR_IA_PC_SCLASS.bat"

if (Test-Path $optTarget) {
    $shortcut4 = $wshShell.CreateShortcut($optLnkPath)
    $shortcut4.TargetPath = $optTarget
    $shortcut4.WorkingDirectory = "H:\EAR_OS_V2\EAR_OS_V2"
    $shortcut4.Description = "Optimizador de Hardware S-Class para IA (RX 7900 XTX 24GB)"
    # Icono de sistema: chip / acelerador
    $shortcut4.IconLocation = "$env:SystemRoot\System32\shell32.dll, 14"
    $shortcut4.Save()
    Write-Host "      [OK] Creado: $optLnkPath (Con icono de sistema)" -ForegroundColor Green
}

