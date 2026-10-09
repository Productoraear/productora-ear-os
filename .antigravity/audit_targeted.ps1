# Targeted fast probe — avoids full C:\ recursion
$ErrorActionPreference = 'SilentlyContinue'
$sec = '=' * 70

function SizeGB($p) {
    if (Test-Path $p -PathType Container) {
        return [math]::Round(((Get-ChildItem $p -Recurse -File | Measure-Object Length -Sum).Sum)/1GB,2)
    }
    return 0
}

Write-Output "$sec`n1) H:\AI_MODELS_HUB`n$sec"
if (Test-Path 'H:\AI_MODELS_HUB') {
    Get-ChildItem 'H:\AI_MODELS_HUB' -Force | Sort-Object Name | ForEach-Object {
        if ($_.PSIsContainer) {
            $s = (Get-ChildItem $_.FullName -Recurse -File | Measure-Object Length -Sum).Sum
            Write-Output ("DIR   " + [math]::Round($s/1GB,2).ToString('0.00') + " GB  " + $_.Name)
        } else {
            Write-Output ("FILE  " + [math]::Round($_.Length/1GB,3).ToString('0.000') + " GB  " + $_.Name)
        }
    }
} else { Write-Output "NOT FOUND" }

Write-Output "$sec`n2) LLAMA.CPP / llamafile / LM Studio / etc`n$sec"
$paths = @(
    'C:\llama.cpp','C:\llama','C:\tools\llama','C:\AI',
    'H:\llama.cpp','H:\llama','H:\AI_MODELS_HUB\llama.cpp',
    'D:\llama.cpp','D:\llama'
)
foreach ($p in $paths) { if (Test-Path $p) { Write-Output ("EXISTS: " + $p) } }
Write-Output "--- llama*.exe shallow ---"
Get-ChildItem -Path 'C:\Program Files','C:\Program Files (x86)','C:\Users\M2-W10\Desktop','H:\','D:\' -Recurse -File -Include 'llama*.exe','llamafile*.exe','koboldcpp*.exe','lmstudio*.exe' -Depth 3 | Select-Object -ExpandProperty FullName -Unique

Write-Output "$sec`n3) C:\Users breakdown (top-level)`n$sec"
Get-ChildItem 'C:\Users' -Directory -Force | ForEach-Object {
    $s = (Get-ChildItem $_.FullName -Recurse -File | Measure-Object Length -Sum).Sum
    Write-Output ([math]::Round($s/1GB,2).ToString('0.00') + " GB  C:\Users\" + $_.Name)
} | Sort-Object -Descending

Write-Output "$sec`n4) Key user folders (M2-W10)`n$sec"
$u = 'C:\Users\M2-W10'
foreach ($n in @('Desktop','Documents','Downloads','Music','Pictures','Videos','OneDrive')) {
    $p = Join-Path $u $n
    if (Test-Path $p) {
        $s = (Get-ChildItem $p -Recurse -File | Measure-Object Length -Sum).Sum
        Write-Output ([math]::Round($s/1GB,2).ToString('0.00') + " GB  " + $p)
    }
}

Write-Output "$sec`n5) D:\FLAC collection`n$sec"
$flac = 'D:\MUSICA_PERSONAL_(Coleccion_FLAC)'
if (Test-Path $flac) {
    $f = Get-ChildItem $flac -Recurse -File
    Write-Output ("SIZE = " + [math]::Round(($f | Measure-Object Length -Sum).Sum/1GB,2) + " GB | FILES = " + $f.Count)
} else {
    Write-Output "FLAC folder not at expected path; listing D:\ root:"
    Get-ChildItem 'D:\' -Directory -Force | ForEach-Object { Write-Output $_.Name }
}

Write-Output "$sec`n6) Big files/folders on C: (top 25 by size, quick)`n$sec"
Write-Output "Note: pagefile/hiberfil handled separately."
Get-ChildItem 'C:\' -Force -File | Sort-Object Length -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Output ([math]::Round($_.Length/1GB,2).ToString('0.00') + " GB  C:\" + $_.Name)
}
Write-Output "DONE"