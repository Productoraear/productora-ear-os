$ErrorActionPreference = 'SilentlyContinue'
Write-Output '=== AppData\Local top-level ==='
Get-ChildItem 'C:\Users\M2-W10\AppData\Local' -Directory -Force | ForEach-Object {
    $s = (Get-ChildItem $_.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
    '{0,9:N2} GB  {1}' -f ($s/1GB), $_.Name
} | Sort-Object -Descending | Select-Object -First 30

Write-Output ''
Write-Output '=== AppData\Local files (non-dir) ==='
Get-ChildItem 'C:\Users\M2-W10\AppData\Local' -File -Force -ErrorAction SilentlyContinue |
    Sort-Object Length -Descending | Select-Object -First 10 |
    ForEach-Object { '{0:N2} GB  {1}' -f ($_.Length/1GB), $_.Name }

Write-Output ''
Write-Output '=== Ollama default models dir (C:) ==='
$od = 'C:\Users\M2-W10\AppData\Local\Programs\Ollama'
if (Test-Path $od) {
    $s = (Get-ChildItem $od -Recurse -File -Force | Measure-Object Length -Sum).Sum
    Write-Output ('Ollama install: {0:N2} GB' -f ($s/1GB))
}
$om = 'C:\Users\M2-W10\.ollama'
if (Test-Path $om) {
    $s = (Get-ChildItem $om -Recurse -File -Force | Measure-Object Length -Sum).Sum
    Write-Output ('.ollama (default models): {0:N2} GB' -f ($s/1GB))
}

Write-Output ''
Write-Output '=== DRIVE TOP-LEVEL (dirs only, names) ==='
foreach ($drive in @('D:\','E:\','G:\','H:\')) {
    Write-Output ('--- ' + $drive + ' ---')
    Get-ChildItem $drive -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
        $s = (Get-ChildItem $_.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
        '{0,9:N2} GB  {1}' -f ($s/1GB), $_.Name
    } | Sort-Object -Descending
}
Write-Output 'DONE'