$ErrorActionPreference = 'SilentlyContinue'
$hub = 'H:\AI_MODELS_HUB'

Write-Output '=== ACTIVE OLLAMA MODELS (manifests -> blobs referenced) ==='
$manDir = Join-Path $hub 'manifests'
if (Test-Path $manDir) {
    $referenced = @{}
    Get-ChildItem $manDir -Recurse -File -Filter '*' | ForEach-Object {
        $rel = $_.FullName.Substring($manDir.Length).TrimStart('\','/')
        try {
            $json = Get-Content $_.FullName -Raw | ConvertFrom-Json
            $layers = @()
            $json.layers | ForEach-Object {
                if ($_.digest -match 'sha256:(.+)') { $layers += $Matches[1] }
            }
            $layers | ForEach-Object { $referenced[$_] = $true }
            Write-Output ('MODEL: ' + $rel + '  ->  layers ' + ($layers -join ', '))
        } catch {
            Write-Output ('SKIP (no json): ' + $rel)
        }
    }
    Write-Output ''
    Write-Output ('TOTAL referenced digest:layers = ' + $referenced.Count)
    Write-Output ''
}

Write-Output '=== BLOBS ON DISK (>100MB) with referenced flag ==='
$blobDir = Join-Path $hub 'blobs'
if (Test-Path $blobDir) {
    Get-ChildItem $blobDir -Recurse -File | Where-Object { $_.Length -gt 100MB } | Sort-Object Length -Descending | ForEach-Object {
        $digest = 'sha256-' + $_.Name
        $ref = 'ORPHAN'
        if ($referenced.ContainsKey($_.Name)) { $ref = 'ACTIVE' }
        '{0,8:N2} GB  [{1}]  {2}' -f ($_.Length/1GB), $ref, $_.FullName
    }
}

Write-Output ''
Write-Output '=== STANDALONE GGUF FILES (qwen + LM_STUDIO) ==='
foreach ($root in @((Join-Path $hub 'qwen'), (Join-Path $hub 'LM_STUDIO_MODELS'))) {
    if (Test-Path $root) {
        Get-ChildItem $root -Recurse -File -Filter '*.gguf' | Sort-Object Length -Descending | ForEach-Object {
            '{0,8:N2} GB  {1}' -f ($_.Length/1GB), $_.FullName
        }
    }
}

Write-Output ''
Write-Output '=== OTHER HUB DIRS sizes ==='
Get-ChildItem $hub -Directory -Force | ForEach-Object {
    $s = (Get-ChildItem $_.FullName -Recurse -File -Force | Measure-Object Length -Sum).Sum
    '{0,8:N2} GB  {1}' -f ($s/1GB), $_.Name
} | Sort-Object -Descending
Write-Output 'DONE'