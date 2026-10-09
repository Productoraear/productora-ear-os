# Sondeo: ruta del Escritorio + programas creativos/edición de terceros
$ErrorActionPreference = 'SilentlyContinue'

$d = [Environment]::GetFolderPath('Desktop')
Write-Output ('DESKTOP=' + $d)

Write-Output ''
Write-Output '=== PROGRAMAS DE TERCEROS (creativos/edicion/audio/3D) ==='
$roots = @(
    'C:\Program Files',
    'C:\Program Files (x86)',
    ($env:LOCALAPPDATA + '\Programs'),
    $env:LOCALAPPDATA,
    $env:APPDATA,
    'D:\',
    'E:\',
    'H:\'
)
$names = @(
    'Adobe Premiere','Adobe After Effects','Adobe Audition','Adobe Media Encoder',
    'Adobe Photoshop','Adobe Lightroom','DaVinci Resolve','DaVinci','Blackmagic',
    'Audacity','CapCut','Ableton','FL Studio','Reaper','OBS','Cakewalk','WaveLab',
    'iZotope','Waves','GarageBand','Studio One','Cubase','Pro Tools','Topaz',
    'Blender','Cinema 4D','Unreal','Unity','ffmpeg','HandBrake','Whisper'
)
$seen = @{}
foreach ($r in $roots) {
    if (-not (Test-Path $r)) { continue }
    Get-ChildItem $r -Directory -ErrorAction SilentlyContinue |
        ForEach-Object {
            $n = $_.Name
            foreach ($pat in $names) {
                if ($n -like ('*' + $pat + '*')) {
                    if (-not $seen.ContainsKey($_.FullName)) {
                        $seen[$_.FullName] = $true
                        Write-Output $_.FullName
                    }
                    break
                }
            }
        }
}

Write-Output ''
Write-Output '=== LLAMA.CPP / OLLAMA / LM STUDIO BINARIOS ==='
$binNames = @('llama-cli.exe','llama-server.exe','ollama.exe','LM Studio.exe','lmstudio.exe','koboldcpp.exe','llama.cpp')
foreach ($r in $roots) {
    if (-not (Test-Path $r)) { continue }
    Get-ChildItem $r -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $binNames -contains $_.Name } |
        ForEach-Object { Write-Output $_.FullName }
}
Write-Output 'DONE'