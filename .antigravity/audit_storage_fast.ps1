$ErrorActionPreference = 'SilentlyContinue'
function DirGB {
    param([string]$Path, [int]$Depth)
    if (Test-Path $Path -PathType Container) {
        if ($Depth -le 0) {
            # top-level only, no recursion
            $s = (Get-ChildItem $Path -File -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
            return [math]::Round($s/1GB,2)
        }
        $s = (Get-ChildItem $Path -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
        return [math]::Round($s/1GB,2)
    }
    return -1
}

Write-Output '=== C: ROOT BIG FILES (pagefile/hiberfil) ==='
Get-ChildItem 'C:\' -Force -File -ErrorAction SilentlyContinue |
    Sort-Object Length -Descending | Select-Object -First 8 |
    ForEach-Object { '{0:N2} GB  {1}' -f ($_.Length/1GB), $_.Name }

Write-Output ''
Write-Output '=== M2-W10 USER CONTENT FOLDERS ==='
$u = 'C:\Users\M2-W10'
foreach ($n in @('Desktop','Documents','Downloads','Music','Pictures','Videos')) {
    $p = Join-Path $u $n
    $gb = DirGB -Path $p -Depth 1
    Write-Output ('{0,8} GB  {1}' -f $gb, $p)
}

Write-Output ''
Write-Output '=== APPDATA (separated, likely not user-content) ==='
foreach ($n in @('AppData\Local','AppData\Roaming','AppData\LocalLow')) {
    $p = Join-Path $u $n
    $gb = DirGB -Path $p -Depth 1
    Write-Output ('{0,8} GB  {1}' -f $gb, $p)
}

Write-Output ''
Write-Output '=== D: FLAC COLLECTION ==='
$flac = 'D:\MUSICA_PERSONAL_(Coleccion_FLAC)'
if (Test-Path $flac) {
    $files = Get-ChildItem $flac -Recurse -File -Force -ErrorAction SilentlyContinue
    $gb = [math]::Round(($files | Measure-Object Length -Sum).Sum/1GB,2)
    Write-Output ('SIZE = {0} GB | FILES = {1}' -f $gb, $files.Count)
} else {
    Write-Output 'FLAC folder NOT at D:\MUSICA_PERSONAL_(Coleccion_FLAC)'
    Write-Output 'D:\ top-level dirs:'
    Get-ChildItem 'D:\' -Directory -Force | ForEach-Object { $s=(Get-ChildItem $_.FullName -Recurse -File -Force -EA SilentlyContinue|Measure-Object Length -Sum).Sum; '{0,8:N2} GB  {1}' -f ($s/1GB), $_.Name }
}

Write-Output ''
Write-Output '=== D: and G: and E: and H: TOP-LEVEL (where bulk data lives) ==='
foreach ($drive in @('D:\','E:\','G:\','H:\')) {
    Write-Output ('--- ' + $drive + ' ---')
    Get-ChildItem $drive -Directory -Force -ErrorAction SilentlyContinue |
        ForEach-Object {
            $s = (Get-ChildItem $_.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
            '{0,9:N2} GB  {1}' -f ($s/1GB), $_.FullName
        } | Sort-Object -Descending | Select-Object -First 25
}
Write-Output 'DONE'