# ACCION 5: Optimizacion defensiva Ollama/VRAM RX 7900 XTX (Reduce picos de potencia)
$ErrorActionPreference = 'Continue'

Write-Output '=== VALORES PREVIOS ==='
'OLLAMA_FLASH_ATTENTION=' + [Environment]::GetEnvironmentVariable('OLLAMA_FLASH_ATTENTION','User')
'OLLAMA_KV_CACHE_TYPE  =' + [Environment]::GetEnvironmentVariable('OLLAMA_KV_CACHE_TYPE','User')
'OLLAMA_MAX_VRAM       =' + [Environment]::GetEnvironmentVariable('OLLAMA_MAX_VRAM','User')
'OLLAMA_KEEP_ALIVE     =' + [Environment]::GetEnvironmentVariable('OLLAMA_KEEP_ALIVE','User')

Write-Output '=== APLICANDO CONFIG DEFENSIVA (margen seguro 4 GB) ==='
setx OLLAMA_FLASH_ATTENTION "1"
setx OLLAMA_KV_CACHE_TYPE "q8_0"
setx OLLAMA_MAX_VRAM "20480"
setx OLLAMA_KEEP_ALIVE "15m"
setx OLLAMA_NUM_PARALLEL "1"
setx OLLAMA_MAX_LOADED_MODELS "1"

Write-Output '=== VALORES POST (se activan en nuevas sesiones/terminales) ==='
'OLLAMA_FLASH_ATTENTION=' + [Environment]::GetEnvironmentVariable('OLLAMA_FLASH_ATTENTION','User')
'OLLAMA_KV_CACHE_TYPE  =' + [Environment]::GetEnvironmentVariable('OLLAMA_KV_CACHE_TYPE','User')
'OLLAMA_MAX_VRAM       =' + [Environment]::GetEnvironmentVariable('OLLAMA_MAX_VRAM','User')
'OLLAMA_KEEP_ALIVE     =' + [Environment]::GetEnvironmentVariable('OLLAMA_KEEP_ALIVE','User')

Write-Output '=== ESTADO DISCO C: / PAGEFILE (contexto optimizacion) ==='
Get-PSDrive C | Select-Object @{n='UsedGB';e={[math]::Round($_.Used/1GB,1)}}, @{n='FreeGB';e={[math]::Round($_.Free/1GB,1)}} | Format-List | Out-String

Write-Output '=== PLAN ENERGIA: forzar Alto Rendimiento (evita throttling CPU/GPU) ==='
powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 2>&1
powercfg /getactivescheme

Write-Output '=== FIN ACCION 5 ==='