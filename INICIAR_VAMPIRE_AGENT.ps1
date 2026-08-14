# =====================================================================
# EAR OS V2 — VAMPIRE QA AGENT & IMMUNITY LOOP RUNNER (POWERSHELL 7)
# =====================================================================
[CmdletBinding()]
param (
    [Parameter(Mandatory=$false)]
    [ValidateSet("Background", "Foreground", "Status", "Stop")]
    [string]$Mode = "Foreground"
)

$AgentDir = "H:\EAR_OS_BUNKER_CONSOLIDADO\EAR_OS_INTEL_BUNKER"
$ScriptPath = Join-Path -Path $AgentDir -ChildPath "vampire_qa_agent.py"
$LogPath = Join-Path -Path $AgentDir -ChildPath "vampire_agent.log"
$EnvPath = Join-Path -Path $AgentDir -ChildPath ".env"

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🦇 EAR OS V2 — VAMPIRE QA AGENT (OPERACIÓN VAMPIRE)" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

# 1. Verificación de Python
$PythonExe = (Get-Command python -ErrorAction SilentlyContinue).Source
if (-not $PythonExe) {
    $PythonExe = (Get-Command py -ErrorAction SilentlyContinue).Source
}

if (-not $PythonExe) {
    Write-Error "❌ Python no se encuentra en el PATH del sistema. Instala o expón Python 3.x."
    exit 1
}

Write-Host "🐍 Python Detectado: $PythonExe" -ForegroundColor Gray
Write-Host "📂 Directorio Agente: $AgentDir" -ForegroundColor Gray
Write-Host "📜 Script Objetivo: $ScriptPath" -ForegroundColor Gray

# 2. Verificación de .env
if (-not (Test-Path -LiteralPath $EnvPath)) {
    Write-Host "⚠️ AVISO: No se detectó archivo .env en $EnvPath" -ForegroundColor Yellow
    Write-Host "ℹ️ Crea el archivo con: TELEGRAM_BOT_TOKEN=tu_token_aqui" -ForegroundColor DarkYellow
}

# 3. Modos de Ejecución
switch ($Mode) {
    "Status" {
        $Running = Get-Process python -ErrorAction SilentlyContinue | Where-Object {
            try {
                $cmd = (Get-CimInstance Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine
                $cmd -like "*vampire_qa_agent.py*"
            } catch { $false }
        }
        if ($Running) {
            Write-Host "✅ Vampire QA Agent está ACTIVO (PID: $($Running.Id))." -ForegroundColor Green
            Write-Host "📄 Últimas 15 líneas del log ($LogPath):" -ForegroundColor Cyan
            if (Test-Path -LiteralPath $LogPath) {
                Get-Content -LiteralPath $LogPath -Tail 15
            }
        } else {
            Write-Host "⚪ Vampire QA Agent NO está en ejecución." -ForegroundColor Yellow
        }
    }
    
    "Stop" {
        $Processes = Get-Process python -ErrorAction SilentlyContinue | Where-Object {
            try {
                $cmd = (Get-CimInstance Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine
                $cmd -like "*vampire_qa_agent.py*"
            } catch { $false }
        }
        if ($Processes) {
            $Processes | ForEach-Object {
                Stop-Process -Id $_.Id -Force
                Write-Host "🛑 Proceso Vampire QA (PID: $($_.Id)) detenido." -ForegroundColor Red
            }
        } else {
            Write-Host "ℹ️ No se encontraron instancias activas de vampire_qa_agent.py." -ForegroundColor Gray
        }
    }

    "Background" {
        Write-Host "🚀 Iniciando Vampire QA Agent en SEGUNDO PLANO PERPETUO..." -ForegroundColor Green
        
        $StartInfo = New-Object System.Diagnostics.ProcessStartInfo
        $StartInfo.FileName = $PythonExe
        $StartInfo.Arguments = "-u `"$ScriptPath`""
        $StartInfo.WorkingDirectory = $AgentDir
        $StartInfo.RedirectStandardOutput = $true
        $StartInfo.RedirectStandardError = $true
        $StartInfo.UseShellExecute = $false
        $StartInfo.CreateNoWindow = $true

        $Process = New-Object System.Diagnostics.Process
        $Process.StartInfo = $StartInfo

        # Redirigir salida a log
        Register-ObjectEvent -InputObject $Process -EventName OutputDataReceived -Action {
            if ($EventArgs.Data) {
                $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                "[$timestamp] $($EventArgs.Data)" | Out-File -FilePath $using:LogPath -Append -Encoding utf8
            }
        } | Out-Null

        Register-ObjectEvent -InputObject $Process -EventName ErrorDataReceived -Action {
            if ($EventArgs.Data) {
                $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                "[$timestamp] [STDERR] $($EventArgs.Data)" | Out-File -FilePath $using:LogPath -Append -Encoding utf8
            }
        } | Out-Null

        $Process.Start() | Out-Null
        $Process.BeginOutputReadLine()
        $Process.BeginErrorReadLine()

        Write-Host "✅ Proceso desacoplado con éxito. PID: $($Process.Id)" -ForegroundColor Green
        Write-Host "📝 Registro continuo en: $LogPath" -ForegroundColor Cyan
        Write-Host "🔍 Para monitorizar: Get-Content -Wait '$LogPath'" -ForegroundColor Gray
    }

    "Foreground" {
        Write-Host "⚡ Iniciando Vampire QA Agent en MODO INTERACTIVO (Consola directa)..." -ForegroundColor Green
        Push-Location -LiteralPath $AgentDir
        try {
            & $PythonExe -u $ScriptPath
        } finally {
            Pop-Location
        }
    }
}
