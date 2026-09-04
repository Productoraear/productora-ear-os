# ==============================================================================
# BARE-METAL TASK DISPATCHER & GOVERNANCE DAEMON v2.1 - EAR OS V2
# ==============================================================================
$ErrorActionPreference = 'Stop'
Set-Location "H:\EAR_OS_V2\EAR_OS_V2"

$QueueFile = ".antigravity\tasks_queue.json"
if (-not (Test-Path $QueueFile)) {
    Write-Host "[!] Archivo de cola $QueueFile no encontrado." -ForegroundColor Red
    exit 1
}

$QueueRaw = Get-Content $QueueFile -Raw -Encoding UTF8
$Queue = $QueueRaw | ConvertFrom-Json

Write-Host ">> [ORCHESTRATOR] Daemon S-Class activo. GPU RX 7900 XTX asignada..." -ForegroundColor Cyan

foreach ($task in $Queue.tasks) {
    if ($task.status -eq "COMPLETED") {
        Write-Host "   [SKIP] Tarea ya completada: $($task.id)" -ForegroundColor Gray
        continue
    }

    Write-Host "`n======================================================================" -ForegroundColor Magenta
    Write-Host " EJECUTANDO TAREA: $($task.id) - $($task.title)" -ForegroundColor White -BackgroundColor DarkBlue
    Write-Host "======================================================================" -ForegroundColor Magenta

    $startTime = Get-Date

    $cmdToRun = $null
    if ($task.PSObject.Properties['command'] -and $task.command) {
        $cmdToRun = $task.command
    } elseif ($task.PSObject.Properties['execution_command'] -and $task.execution_command) {
        $cmdToRun = $task.execution_command
    }

    if ([string]::IsNullOrWhiteSpace($cmdToRun)) {
        Write-Host "[VETO] No se localizó comando de ejecución para la tarea $($task.id)." -ForegroundColor Red
        exit 1
    }

    try {
        Write-Host ">> [1/3] Ejecutando: $cmdToRun" -ForegroundColor Cyan
        Invoke-Expression $cmdToRun
        if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne $null) {
            throw "El comando devolvió un código de error de proceso: $LASTEXITCODE"
        }

        Write-Host ">> [2/3] Verificando compilación estricta (TypeScript)..." -ForegroundColor Cyan
        npx tsc --noEmit
        if ($LASTEXITCODE -ne 0) {
            throw "Error de compilación de TypeScript tras ejecutar la tarea $($task.id)."
        }
        Write-Host "   [+] TypeScript validado: Exit Code 0." -ForegroundColor Green

        if (-not $task.PSObject.Properties['completed_at']) {
            $task | Add-Member -NotePropertyName completed_at -NotePropertyValue $null -Force
        }
        $task.status = "COMPLETED"
        $task.completed_at = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        
        $Queue | ConvertTo-Json -Depth 6 | Set-Content $QueueFile -Encoding UTF8

        $elapsed = (Get-Date) - $startTime
        Write-Host ">> [3/3] TAREA $($task.id) SELLADA CON ÉXITO en $([Math]::Round($elapsed.TotalSeconds, 2))s." -ForegroundColor Green

    } catch {
        Write-Host "`n[VETO_ESTRATÉGICO_ACTIVADO] Falló la tarea $($task.id): $_" -ForegroundColor Red
        
        if (-not $task.PSObject.Properties['error']) {
            $task | Add-Member -NotePropertyName error -NotePropertyValue $null -Force
        }
        $task.status = "FAILED"
        $task.error = $_.ToString()
        $Queue | ConvertTo-Json -Depth 6 | Set-Content $QueueFile -Encoding UTF8
        
        Write-Host "[PARADA DE EMERGENCIA] El daemon se ha detenido para evitar corrupción. Revisa el código." -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "`n>> [CICLO FINALIZADO] Todas las tareas del manifiesto han sido ejecutadas." -ForegroundColor Green
