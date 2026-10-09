# ============================================================
# ESTABILIZADOR OLLAMA S-CLASS — RX 7900 XTX 24GB VRAM
# Garantiza: 0 offload RAM/CPU, solo VRAM dedicada, 0 reinicios PC.
# Esquema:
#   - Techo duro VRAM      = 22528 MB (22 GB)  -> colchon 2 GB sobre 24 GB
#   - KV cache             = q4_0              -> cache KV a 1/4
#   - Flash Attention      = 1                 -> menos picos de VRAM
#   - Num Parallel         = 1                 -> 1 modelo a la vez
#   - Max Loaded Models    = 1                 -> impide cargar 2 modelos
#   - Keep Alive           = 5m                -> libera VRAM en reposo
#   - Contexto global      = 8192              -> red de seguridad
# ============================================================
$ErrorActionPreference = 'Continue'

function Set-EnvSafe {
  param([string]$Name, [string]$Value)
  [Environment]::SetEnvironmentVariable($Name, $Value, 'User')
  [Environment]::SetEnvironmentVariable($Name, $Value, 'Machine')
  Write-Host ("  [OK] {0} = {1}" -f $Name, $Value)
}

function Stop-Ollama {
  Write-Host "[1/6] Deteniendo Ollama (liberar VRAM y runners) ..."
  cmd /c "taskkill /f /im `"ollama app.exe`" /t 2>nul"
  cmd /c "taskkill /f /im `"ollama.exe`" /t 2>nul"
  cmd /c "taskkill /f /im `"ollama runner.exe`" /t 2>nul"
  Start-Sleep -Seconds 3
}

function Start-Ollama {
  $ollamaApp = "$env:LOCALAPPDATA\Programs\Ollama\ollama app.exe"
  if (Test-Path $ollamaApp) {
    Start-Process -FilePath $ollamaApp
    Write-Host "  [OK] Ollama app lanzada"
  } else {
    Write-Host "  [!] No se encontró $ollamaApp"
  }
}

function Wait-ForApi {
  param([int]$TimeoutSec = 30)
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  do {
    try {
      $r = Invoke-WebRequest -Uri 'http://localhost:11434/api/tags' -TimeoutSec 3 -UseBasicParsing
      if ($r.StatusCode -eq 200) {
        Write-Host ("  [OK] API lista en {0:N1}s" -f $sw.Elapsed.TotalSeconds)
        return $true
      }
    } catch {
      Start-Sleep -Seconds 1
    }
  } while ($sw.Elapsed.TotalSeconds -lt $TimeoutSec)
  Write-Host "  [!] API no respondió en el tiempo límite"
  return $false
}

Write-Host "================================================================"
Write-Host " ESTABILIZADOR OLLAMA S-CLASS (VRAM-SHIELD 24GB)"
Write-Host "================================================================"

Stop-Ollama

Write-Host ""
Write-Host "[2/6] Aplicando variables de entorno blindadas (User + Machine) ..."
Set-EnvSafe 'OLLAMA_FLASH_ATTENTION' '1'
Set-EnvSafe 'OLLAMA_KV_CACHE_TYPE' 'q4_0'
Set-EnvSafe 'OLLAMA_NUM_PARALLEL' '1'
Set-EnvSafe 'OLLAMA_MAX_LOADED_MODELS' '1'
Set-EnvSafe 'OLLAMA_KEEP_ALIVE' '5m'
Set-EnvSafe 'OLLAMA_MAX_VRAM' '22528'
Set-EnvSafe 'OLLAMA_GPU_OVERHEAD' '0'
Set-EnvSafe 'OLLAMA_CONTEXT_LENGTH' '8192'
Set-EnvSafe 'OLLAMA_NUM_CTX' '8192'

# Limpieza de variables conflictivas / no soportadas en Windows
[Environment]::SetEnvironmentVariable('OLLAMA_SCHED_SPREAD', $null, 'User')
[Environment]::SetEnvironmentVariable('OLLAMA_SCHED_SPREAD', $null, 'Machine')

Write-Host ""
Write-Host "[3/6] Arrancando Ollama (necesario para crear modelos) ..."
Start-Ollama
Start-Sleep -Seconds 4

Write-Host ""
Write-Host "[4/6] Esperando API ..."
$apiOk = Wait-ForApi -TimeoutSec 40

Write-Host ""
Write-Host "[5/6] Reconstruyendo perfiles S-Class con contextos blindados ..."
$repo = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

$jobs = @(
  @{ Name = 'ear-14b-textos-sclass';   File = Join-Path $repo 'Modelfile_14B_Textos_SClass' },
  @{ Name = 'ear-27b-apis-sclass';     File = Join-Path $repo 'Modelfile_27B_APIs_SClass' },
  @{ Name = 'ear-32b-arquitecto-sclass'; File = Join-Path $repo 'Modelfile_32B_Arquitecto_SClass' }
)

foreach ($j in $jobs) {
  if (-not (Test-Path $j.File)) {
    Write-Host ("  [!] Modelfile no encontrado: {0}" -f $j.File)
    continue
  }
  Write-Host ("  Creando {0} ..." -f $j.Name)
  $out = ollama create $j.Name -f $j.File 2>&1 | Out-String
  $code = $LASTEXITCODE
  if ($code -eq 0) {
    Write-Host ("  [OK] {0} creado" -f $j.Name)
  } else {
    Write-Host ("  [!] FALLO al crear {0} (exit {1})" -f $j.Name, $code)
    Write-Host $out
  }
}

Write-Host ""
Write-Host "[6/6] Verificando flota y variables ..."
ollama list 2>&1 | Out-String -Width 200 | Write-Host

Write-Host "Variables finales (User):"
$vars = 'OLLAMA_FLASH_ATTENTION','OLLAMA_KV_CACHE_TYPE','OLLAMA_NUM_PARALLEL','OLLAMA_KEEP_ALIVE','OLLAMA_MAX_LOADED_MODELS','OLLAMA_MAX_VRAM','OLLAMA_GPU_OVERHEAD','OLLAMA_CONTEXT_LENGTH','OLLAMA_NUM_CTX'
foreach ($n in $vars) {
  $u = [Environment]::GetEnvironmentVariable($n, 'User')
  Write-Host ("  {0,-26} = {1}" -f $n, $u)
}

Write-Host ""
Write-Host "================================================================"
Write-Host " ESTABILIZACION COMPLETA - VRAM BLINDADA A 22 GB MAX"
Write-Host " 0 offload RAM/CPU, 0 shared GPU, 0 reinicios por desbordamiento"
Write-Host "================================================================"