$ErrorActionPreference = 'SilentlyContinue'
Write-Output '=== QWEN FOLDER (top files) ==='
Get-ChildItem 'H:\AI_MODELS_HUB\qwen' -Recurse -File | Sort-Object Length -Descending | Select-Object -First 40 |
    ForEach-Object { '{0:N2} GB  {1}' -f ($_.Length/1GB), $_.FullName }

Write-Output '=== LM_STUDIO_MODELS ==='
Get-ChildItem 'H:\AI_MODELS_HUB\LM_STUDIO_MODELS' -Recurse -File | Sort-Object Length -Descending | Select-Object -First 30 |
    ForEach-Object { '{0:N2} GB  {1}' -f ($_.Length/1GB), $_.FullName }

Write-Output '=== blobs (Ollama) ==='
Get-ChildItem 'H:\AI_MODELS_HUB\blobs' -Recurse -File | Sort-Object Length -Descending | Select-Object -First 30 |
    ForEach-Object { '{0:N2} GB  {1}' -f ($_.Length/1GB), $_.FullName }

Write-Output '=== ORG/CLASSIFY SCRIPTS in EAR_OS scripts ==='
Get-ChildItem 'H:\EAR_OS_V2\EAR_OS_V2\scripts' -File |
    Where-Object { $_.Name -match 'organiz|classif|archiv|big_data|purist|condens|inventar|etiquet|clean|move|consolid' } |
    Select-Object -ExpandProperty Name

Write-Output '=== ALL .ps1/.py/.cjs scripts that look personal/business related ==='
Get-ChildItem 'H:\EAR_OS_V2\EAR_OS_V2\scripts' -File |
    Where-Object { $_.Name -match 'personal|empres|vault|absorb|boveda|gestion|orden|mover|separ' } |
    Select-Object -ExpandProperty Name
Write-Output 'DONE'