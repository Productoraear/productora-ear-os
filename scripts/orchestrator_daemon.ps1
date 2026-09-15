$queuePath = ".antigravity/tasks_queue.json"
if (-not (Test-Path $queuePath)) {
    Write-Host "[ERROR] No se encontró $queuePath" -ForegroundColor Red
    exit 1
}

Write-Host "[ORCHESTRATOR] Daemon S-Class activo. GPU RX 7900 XTX asignada..." -ForegroundColor Cyan
$content = Get-Content $queuePath -Raw -Encoding UTF8 | ConvertFrom-Json

foreach ($task in $content.tasks) {
    if ($task.status -eq "COMPLETED") {
        Write-Host "   [SKIP] Tarea ya completada: $($task.id)" -ForegroundColor DarkGray
        continue
    }

    Write-Host "`n======================================================================" -ForegroundColor Yellow
    Write-Host " EJECUTANDO TAREA: $($task.id) - $($task.title)" -ForegroundColor Yellow
    Write-Host "======================================================================" -ForegroundColor Yellow

    $files = if ($task.scaffold -and $task.scaffold.files_to_touch) { $task.scaffold.files_to_touch -join ", " } else { "N/A" }
    $macroScript = if ($task.scaffold -and $task.scaffold.macro_script) { $task.scaffold.macro_script } else { $task.description }

    Write-Host "[EXEC] Invocando Ollama (Qwen) local para Tarea: $($task.id)..." -ForegroundColor Green
    
    # Prompt estructurado enviado a Ollama directamente
    $promptPayload = @{
        model = "qwen2.5:latest"
        prompt = "Tarea ID: $($task.id)`nInstrucciones: $macroScript`nArchivos: $files`nRequisito: Genera código TypeScript válido y asegúrate de que 'npx tsc --noEmit' devuelva 0."
        stream = $false
    } | ConvertTo-Json -Depth 5 -Compress

    try {
        $response = Invoke-RestMethod -Uri "http://127.0.0.1:11434/api/generate" -Method Post -Body $promptPayload -ContentType "application/json" -TimeoutSec 120
        Write-Host "[OK] Respuesta recibida del modelo local." -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Fallo al comunicar con Ollama: $_" -ForegroundColor Red
    }
}
