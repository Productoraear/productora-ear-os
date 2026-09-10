param (
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Prompt,
    
    [Parameter(Mandatory=$false)]
    [string]$SystemPrompt = "Eres el Asistente Ejecutivo S-Class de EAR OS. Respondes con datos concretos, esquemas tecnicos, codigo estricto y rigor numerico. Prohibida la cortesia, la auto-presentacion y el relleno textual.",
    
    [Parameter(Mandatory=$false)]
    [string]$Model = "qwen2.5-coder-32b-local",

    [Parameter(Mandatory=$false)]
    [int]$ContextWindow = 16384,

    [Parameter(Mandatory=$false)]
    [double]$Temperature = 0.1
)

# Validar que Ollama esta en ejecucion
$ollamaUrl = "http://localhost:11434/api/generate"
try {
    $null = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 2 -ErrorAction Stop
} catch {
    Write-Error "[EAR OS FATAL] El servicio de Ollama no responde en el puerto 11434. Arrancalo con 'ollama serve'."
    return
}

# Construccion del Payload rigido
$bodyObject = @{
    model = $Model
    system = $SystemPrompt
    prompt = $Prompt
    stream = $false
    options = @{
        temperature = $Temperature
        num_ctx = $ContextWindow
    }
}

$jsonBody = $bodyObject | ConvertTo-Json -Depth 5

try {
    $startTime = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-RestMethod -Uri $ollamaUrl -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($jsonBody)) -ContentType "application/json; charset=utf-8" -TimeoutSec 120
    $startTime.Stop()
    
    $elapsedSec = [math]::Round($startTime.Elapsed.TotalSeconds, 2)
    Write-Host "[EAR OS AI - ${elapsedSec}s]" -ForegroundColor DarkGray
    return $response.response
} catch {
    Write-Error "[EAR OS ERROR] Error en la generacion: $($_.Exception.Message)"
}
