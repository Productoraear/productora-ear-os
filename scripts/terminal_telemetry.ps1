<#
.SYNOPSIS
    EAR OS S-CLASS DIGITAL TELEMETRY & PROGRESS HUD
    Módulo universal de telemetría de consola con barra digital animada y estados del sistema.
#>

function Show-DigitalProgress {
    param (
        [string]$Activity = "Procesando Tarea",
        [string]$Status = "Ejecutando",
        [int]$Current = 0,
        [int]$Total = 100,
        [string]$ItemName = ""
    )

    if ($Total -le 0) { $Total = 1 }
    $percent = [math]::Min(100, [math]::Max(0, [math]::Round(($Current / $Total) * 100)))
    
    # Barra digital S-Class de 30 bloques
    $barWidth = 30
    $filled = [math]::Round(($percent / 100) * $barWidth)
    $empty = $barWidth - $filled
    $bar = ("█" * $filled) + ("░" * $empty)
    
    # Estado Digital con color
    $stateTag = if ($percent -eq 100) { "[COMPLETED]" } else { "[ACTIVE]" }
    
    $line = "`r  [$stateTag] $Activity: [$bar] $percent% ($Current/$Total) | $Status $ItemName"
    
    # Renderizado en línea sin salto de carro para animación fluida
    Write-Host -NoNewline $line
    
    if ($Current -ge $Total) {
        Write-Host "`n  [SUCCESS] Proceso culminado con éxito. Exit Code 0." -ForegroundColor Cyan
    }
}

function Show-SystemBadge {
    param (
        [string]$Title = "EAR OS CORE V2",
        [string]$Subtitle = "MODO CEO ACTIVO"
    )
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║  🔱 $Title - $Subtitle" -ForegroundColor Cyan
    Write-Host "  ║  TELEMETRÍA DIGITAL S-CLASS EN TIEMPO REAL // BARE-METAL ABOS        ║" -ForegroundColor DarkCyan
    Write-Host "  ╚══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

Export-ModuleMember -Function Show-DigitalProgress, Show-SystemBadge -ErrorAction SilentlyContinue
