$ErrorActionPreference = 'SilentlyContinue'
$hub = 'H:\AI_MODELS_HUB'
$blobDir = Join-Path $hub 'blobs'
$reclaimed = 0

Write-Output '=== 1) DEDUPE: standalone GGUF whose SHA-256 already exists as an Ollama blob ==='
# NOTE: qwen3.5-35b-a3b (freshly downloaded) is KEPT on disk per CEO request.
$targets = @(
    'H:\AI_MODELS_HUB\qwen\qwen3.8-27b\Qwen3.8-27B-Q4_K_M.gguf',
    'H:\AI_MODELS_HUB\LM_STUDIO_MODELS\local\Qwen2.5-Coder-32B-Instruct-Q4_K_M\Qwen2.5-Coder-32B-Instruct-Q4_K_M.gguf',
    'H:\AI_MODELS_HUB\LM_STUDIO_MODELS\local\Qwen2.5-Coder-14B-Instruct-Q4_K_M\Qwen2.5-Coder-14B-Instruct-Q4_K_M.gguf'
)
foreach ($t in $targets) {
    if (Test-Path $t) {
        $size = (Get-Item $t).Length
        Write-Output ('Hashing: ' + $t)
        $hash = (Get-FileHash $t -Algorithm SHA256).Hash.ToLower()
        $blobFile = Join-Path $blobDir ('sha256-' + $hash)
        if (Test-Path $blobFile) {
            Remove-Item $t -Force
            $reclaimed += $size
            Write-Output ('  DELETED (duplicate of blob ' + $hash.Substring(0,12) + '...)  ' + [math]::Round($size/1GB,2) + ' GB  ' + $t)
        } else {
            Write-Output ('  KEPT (unique, no matching blob)  ' + $t)
        }
    } else {
        Write-Output ('  SKIP (not found)  ' + $t)
    }
}

Write-Output ''
Write-Output '=== 2) LM_STUDIO_CACHE (regenerable) ==='
$c = Join-Path $hub 'LM_STUDIO_CACHE'
if (Test-Path $c) {
    $s = (Get-ChildItem $c -Recurse -File | Measure-Object Length -Sum).Sum
    Remove-Item $c -Recurse -Force
    $reclaimed += $s
    Write-Output ('  DELETED  ' + [math]::Round($s/1GB,2) + ' GB  ' + $c)
}

Write-Output ''
Write-Output '=== 3) EMPTY / JUNK DIRS + desktop.ini ==='
$junkDirs = @('gguf_models','huggingface_cache','lm_studio','Modelfiles','ollama_models')
foreach ($d in $junkDirs) {
    $p = Join-Path $hub $d
    if (Test-Path $p) {
        $s = (Get-ChildItem $p -Recurse -File | Measure-Object Length -Sum).Sum
        if ($s -eq 0) {
            Remove-Item $p -Recurse -Force
            Write-Output ('  DELETED (empty)  ' + $p)
        } else {
            Write-Output ('  KEPT (non-empty, ' + [math]::Round($s/1MB,1) + ' MB)  ' + $p)
        }
    }
}
$di = Join-Path $hub 'desktop.ini'
if (Test-Path $di) { Remove-Item $di -Force -EA SilentlyContinue; Write-Output '  DELETED desktop.ini' }

Write-Output ''
Write-Output ('TOTAL RECLAIMED: ' + [math]::Round($reclaimed/1GB,2) + ' GB')
Write-Output 'DONE'