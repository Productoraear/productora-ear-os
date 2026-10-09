$ErrorActionPreference = 'SilentlyContinue'
$f = 'H:\AI_MODELS_HUB\qwen\qwen3.5-35b-a3b\Qwen3.5-35B-A3B-Q4_K_M.gguf'
$fs = [System.IO.File]::OpenRead($f)
try {
    $buf = New-Object byte[] 16
    [void]$fs.Read($buf, 0, 4)
    $magic = [System.Text.Encoding]::ASCII.GetString($buf, 0, 4)
    # GGUF version is uint32 little-endian at offset 4
    [void]$fs.Read($buf, 4, 4)
    $ver = [BitConverter]::ToUInt32($buf, 4)
    Write-Output ("MAGIC  = " + $magic)
    Write-Output ("VERSION = " + $ver)
    if ($magic -eq 'GGUF') { Write-Output 'VALID GGUF HEADER' }
    else { Write-Output 'NOT A GGUF FILE' }
} finally {
    $fs.Close()
}
Write-Output ''
Write-Output '=== LM Studio executable present? ==='
$lm = @(
    'C:\Users\M2-W10\AppData\Local\Programs\LM Studio\LM Studio.exe',
    'C:\Users\M2-W10\AppData\Local\LM Studio\LM Studio.exe'
)
foreach ($p in $lm) { if (Test-Path $p) { Write-Output ('YES  ' + $p) } }
Get-ChildItem 'C:\Users\M2-W10\AppData\Local\Programs' -Directory -Force -EA SilentlyContinue | Where-Object { $_.Name -match 'LM|Ollama' } | Select-Object -ExpandProperty FullName
Write-Output 'DONE'