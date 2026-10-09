# ACCION 1: Punto de restauracion + estado Ollama + plan energia (SEGURO)
$ErrorActionPreference = 'Stop'

try {
  Write-Output '=== ACTIVANDO PROTECCION DEL SISTEMA EN C: ==='
  Enable-ComputerRestore -Drive 'C:\'
  Write-Output 'Protection C: OK'
} catch {
  Write-Output ("Enable-ComputerRestore C: -> " + $_.Exception.Message)
}

Write-Output '=== CREANDO PUNTO DE RESTAURACION ==='
$rpName = "EAR_OS_PuntoRestore_PreOptimizacion_" + (Get-Date -Format 'yyyyMMdd_HHmmss')
Write-Output ("Nombre: " + $rpName)
try {
  Checkpoint-Computer -Description $rpName -RestorePointType 'MODIFY_SETTINGS'
  Write-Output 'CHECKPOINT CREADO: OK'
} catch {
  Write-Output ("Checkpoint-Computer -> " + $_.Exception.Message)
}

Write-Output '=== PUNTOS DE RESTAURACION EXISTENTES ==='
Get-ComputerRestorePoint -ErrorAction SilentlyContinue | Select-Object SequenceNumber, Description, CreationTime | Sort-Object CreationTime -Descending | Select-Object -First 10 | Format-Table -AutoSize | Out-String

Write-Output '=== ESTADO OLLAMA (procesos) ==='
Get-Process -Name 'ollama*','ollama_*' -ErrorAction SilentlyContinue | Select-Object Name, Id, @{n='RAM_MB';e={[math]::Round($_.WorkingSet64/1MB,0)}}, @{n='CPU_s';e={[math]::Round($_.CPU,1)}}, StartTime | Format-Table -AutoSize | Out-String

Write-Output '=== SERVICIO OLLAMA ==='
Get-Service -Name '*ollama*' -ErrorAction SilentlyContinue | Select-Object Name, Status, StartType | Format-Table -AutoSize | Out-String

Write-Output '=== PLAN DE ENERGIA ACTIVO ==='
powercfg /getactivescheme
Write-Output '=== CONFIG VRAM/GPU (variables Ollama) ==='
$env:OLLAMA_FLASH_ATTENTION; $env:OLLAMA_KV_CACHE_TYPE; $env:OLLAMA_NUM_PARALLEL; $env:OLLAMA_MAX_LOADED_MODELS
Get-ChildItem Env: | Where-Object { $_.Name -match 'OLLAMA|HIP|HSA|GPU' } | Format-Table -AutoSize | Out-String

Write-Output '=== FIN ACCION 1 ==='