$ErrorActionPreference = 'SilentlyContinue'
Write-Output '=== DOWNLOADED FILE ==='
$f = 'H:\AI_MODELS_HUB\qwen\qwen3.5-35b-a3b\Qwen3.5-35B-A3B-Q4_K_M.gguf'
if (Test-Path $f) {
    $item = Get-Item $f
    Write-Output ('EXISTS  {0:N2} GB  {1}' -f ($item.Length/1GB), $item.FullName)
    # expected 21587638912 bytes
    if ($item.Length -eq 21587638912) { Write-Output 'SIZE OK (matches HuggingFace metadata)' }
    else { Write-Output ('SIZE MISMATCH: got ' + $item.Length + ' expected 21587638912') }
} else {
    Write-Output 'FILE NOT FOUND'
}

Write-Output ''
Write-Output '=== OLLAMA MODELS ENV (User + Machine) ==='
Write-Output ('User    OLLAMA_MODELS = ' + [Environment]::GetEnvironmentVariable('OLLAMA_MODELS','User'))
Write-Output ('Machine OLLAMA_MODELS = ' + [Environment]::GetEnvironmentVariable('OLLAMA_MODELS','Machine'))

Write-Output ''
Write-Output '=== OLLAMA REGISTRY KEYS ==='
Get-ChildItem 'HKCU:\Environment','HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment' -ErrorAction SilentlyContinue |
    ForEach-Object { $_.GetValueNames() | ForEach-Object { if ($_ -match 'OLLAMA') { Write-Output ($_.PSPath + '\' + $_ + ' = ' + (Get-ItemProperty $_.PSPath).$_) } } }

Write-Output ''
Write-Output '=== H:\AI_MODELS_HUB subdirs quick sizes ==='
Get-ChildItem 'H:\AI_MODELS_HUB' -Directory -Force | ForEach-Object {
    $s = (Get-ChildItem $_.FullName -Recurse -File -Force | Measure-Object Length -Sum).Sum
    '{0,8:N2} GB  {1}' -f ($s/1GB), $_.Name
} | Sort-Object -Descending
Write-Output 'DONE'