# Lista completa de modelos Ollama (limpia, sin colgar)
$ErrorActionPreference = 'Continue'
Write-Host "=== OLLAMA LIST (completo) ==="
ollama list 2>&1 | Out-String -Width 300

Write-Host "=== BACKEND / DLLs ROCm vs Vulkan ==="
$ollamaDir = "$env:LOCALAPPDATA\Programs\Ollama"
if (Test-Path $ollamaDir) {
  Get-ChildItem -Path $ollamaDir -Recurse -Include *.dll -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match 'hip|roc|vulkan|hsa|amd|llama|ggml' } |
    Select-Object Name, @{N='MB';E={[math]::Round($_.Length/1MB,2)}} |
    Sort-Object Name -Unique |
    Format-Table -AutoSize
} else {
  Write-Host "  [!] No se encontró $ollamaDir"
}

Write-Host "=== OLLAMA VERSION ==="
ollama --version 2>&1

Write-Host "==== FIN LIST ===="