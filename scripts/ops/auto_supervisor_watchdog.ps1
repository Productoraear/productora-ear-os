# ==============================================================================
# S-CLASS AUTO-SUPERVISOR WATCHDOG v3.0 - EAR OS BARE-METAL
# ==============================================================================
# Monitorea la cola de tareas, poda tareas completadas en lotes,
# elimina procesos zombies huérfanos y libera memoria RAM/VRAM.
# ==============================================================================
$Host.UI.RawUI.WindowTitle = "EAR OS // SUPERVISOR S-CLASS & ZOMBIE PURGER"
Set-Location "H:\EAR_OS_V2\EAR_OS_V2"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  EAR OS // SUPERVISOR S-CLASS ACTIVO (AUTO-PURGA Y ANTI-ZOMBIE)" -ForegroundColor Black -BackgroundColor DarkCyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ">> Monitoreando .antigravity\tasks_queue.json cada 15 segundos..." -ForegroundColor Gray

function Purge-ZombieProcesses {
    try {
        # 1. Detectar y cerrar procesos duplicados de MCP que quedaron huérfanos
        $mcpProcs = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | Where-Object {
            $_.CommandLine -match "chrome-devtools-mcp|server-perplexity-ask|server-sequential-thinking|mcp-remote"
        }

        # Agrupar por línea de comandos y mantener sólo 1 de cada uno si son recientes
        $grouped = $mcpProcs | Group-Object -Property CommandLine
        foreach ($group in $grouped) {
            if ($group.Count -gt 1) {
                # Matar los más antiguos y dejar sólo el más reciente
                $sorted = $group.Group | Sort-Object CreationDate
                for ($i = 0; $i -lt ($sorted.Count - 1); $i++) {
                    $pidToKill = $sorted[$i].ProcessId
                    Write-Host "[PURGA ZOMBIE] Terminando proceso MCP duplicado (PID: $pidToKill)..." -ForegroundColor Yellow
                    Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
                }
            }
        }

        # 2. Forzar recolección de basura de memoria en .NET
        [System.GC]::Collect()
        [System.GC]::WaitForPendingFinalizers()
    } catch {
        # Ignorar fallos de acceso
    }
}

while ($true) {
    # 1. Poda de tareas completadas / archivado en tasks_history.json
    try {
        python scripts/ops/queue_auto_gardener.py
    } catch {
        Write-Host "[WARN] Error al ejecutar queue_auto_gardener: $_" -ForegroundColor Red
    }

    # 2. Matar zombies y fugas de VRAM
    Purge-ZombieProcesses

    # 3. Pausa de 15 segundos
    Start-Sleep -Seconds 15
}
