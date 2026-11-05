# ============================================================================
# EAR OS :: scripts/ear_dev_reset.ps1
# Proposito: matar procesos zombi del dev server (puerto 3007) y relanzarlo
#            desacoplado, con sondeo HTTP final. Ley anti-fachada AF-1/AF-5:
#            solo se declara OK si el sondeo devolvio HTTP 200 de verdad.
# Uso       : powershell -NoProfile -ExecutionPolicy Bypass -File scripts\ear_dev_reset.ps1
# Modo rapido (sin sonda, mata + relanza y sale):  ... -File scripts\ear_dev_reset.ps1 -NoProbe
# Doble clic : REINICIAR_EAR_OS_3007.bat (raiz del repo)
# Salida    : .antigravity\dev_status_live.txt (append) | Exit 0 = HTTP 200 visto
# Seguridad : nunca mata al proceso que lo ejecuta ni a sus ancestros;
#             solo node.exe/cmd.exe cuyo command line pertenece al dev server.
#             RUN_OMEGA.bat (node .antigravity/omega.js) queda SIEMPRE protegido.
# ============================================================================
param([switch]$NoProbe)

$ErrorActionPreference = 'Continue'
$root         = 'D:\EAR_OS_V2\EAR_OS_V2'
$port         = 3007
$statusLog    = Join-Path $root '.antigravity\dev_status_live.txt'
$outLog       = Join-Path $root '.antigravity\dev_out_live.txt'
$errLog       = Join-Path $root '.antigravity\dev_err_live.txt'
$nodePortable = 'C:\Users\Productora Ear\Downloads\node-lts\node-v26.12.1-win-x64'

function Write-Status([string]$msg) {
    $line = ('[{0:yyyy-MM-ddTHH:mm:sszzz}] {1}' -f (Get-Date), $msg)
    Add-Content -LiteralPath $statusLog -Value $line -Encoding UTF8
    Write-Host $line
}

function Get-AncestorPids([int]$startPid) {
    $anc = @(); $cur = $startPid
    for ($d = 0; $d -lt 12; $d++) {
        $p = Get-CimInstance Win32_Process -Filter "ProcessId = $cur" -ErrorAction SilentlyContinue
        if (-not $p) { break }
        $anc += $cur
        $cur = [int]$p.ParentProcessId
        if ($cur -le 4) { break }
    }
    return $anc
}

Write-Status '==== EAR_DEV_RESET START ===='

# ---- FASE 0: ancestros protegidos (anti-suicidio) ----
$protected = @(Get-AncestorPids $PID)
Write-Status ('PROTECTED pids=' + ($protected -join ','))

# ---- FASE 1: matar zombis del puerto ----
Write-Status '-- FASE 1: matando zombis del puerto 3007 --'
$pids = @()
$listeners = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($listeners) {
    $pids += $listeners | Select-Object -ExpandProperty OwningProcess -Unique
    Write-Status ('LISTENERS pids=' + (($listeners.OwningProcess | Sort-Object -Unique) -join ','))
} else {
    Write-Status 'LISTENERS none (puerto ya libre)'
}
$candidates = Get-CimInstance Win32_Process -Filter "Name = 'node.exe' OR Name = 'cmd.exe'" -ErrorAction SilentlyContinue
foreach ($proc in $candidates) {
    $cl = [string]$proc.CommandLine
    $hit = $false
    if ($proc.Name -eq 'node.exe') {
        if ($cl -match 'next dev|next-router-worker|router-worker| -p 3007|--port 3007') { $hit = $true }
    } elseif ($proc.Name -eq 'cmd.exe') {
        if ($cl -match 'next dev|npm run dev|npx next') { $hit = $true }
    }
    if ($hit) { $pids += [int]$proc.ProcessId }
}
$pids = $pids | Where-Object { $protected -notcontains $_ } | Sort-Object -Unique
foreach ($procId in $pids) {
    try {
        Stop-Process -Id $procId -Force -ErrorAction Stop
        Write-Status ('KILLED pid=' + $procId)
    } catch {
        Write-Status ('KILL_FAIL pid=' + $procId + ' err=' + $_.Exception.Message)
    }
}
$freed = $false
for ($i = 0; $i -lt 60; $i++) {
    $still = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if (-not $still) { $freed = $true; break }
    Start-Sleep -Milliseconds 500
}
Write-Status ('PORT_FREED=' + $freed)

# ---- FASE 2: relanzar dev server desacoplado ----
Write-Status '-- FASE 2: relanzando dev server (desacoplado) --'
$nodeDir = if (Test-Path (Join-Path $nodePortable 'node.exe')) { $nodePortable } else { '' }
if ($nodeDir) { $env:Path = "$nodeDir;$env:Path"; Write-Status ('NODE portable=' + $nodeDir) }
else { Write-Status 'NODE portable no encontrado: se usa el node del PATH actual' }
$env:NODE_OPTIONS = '--max-old-space-size=4096'
$env:PORT = '3007'
Remove-Item -LiteralPath $outLog -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $errLog -ErrorAction SilentlyContinue
$nodeExe = 'node.exe'
if ($nodeDir) {
    $candidate = Join-Path $nodeDir 'node.exe'
    if (Test-Path $candidate) { $nodeExe = $candidate }
}
$nextBin = Join-Path $root 'node_modules\next\dist\bin\next'
$spawn = $null
if ((Test-Path $nextBin) -and ($nodeExe -ne 'node.exe' -or (Get-Command node.exe -ErrorAction SilentlyContinue))) {
    # PRIMARIO: node directo sobre el binario de Next (no depende de node_modules\.bin
    # ni de la resolucion de npx; causa raiz del fallo del 2026-10-31: falta next.cmd)
    $spawn = Start-Process -FilePath $nodeExe -ArgumentList ('"' + $nextBin + '"', 'dev', '-p', '3007') -WorkingDirectory $root -WindowStyle Hidden -RedirectStandardOutput $outLog -RedirectStandardError $errLog -PassThru
    Write-Status 'SPAWN_MODE=node-direct'
} else {
    # PLAN B: npx next dev -p 3007 (metodo probado en LEVANTAR_EAR_OS_3007.bat)
    $spawn = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'npx next dev -p 3007' -WorkingDirectory $root -WindowStyle Hidden -RedirectStandardOutput $outLog -RedirectStandardError $errLog -PassThru
    Write-Status 'SPAWN_MODE=npx-fallback'
}
Write-Status ('SPAWNED launcher pid=' + $spawn.Id)

if ($NoProbe) {
    Write-Status 'NO_PROBE: modo rapido, se omite el sondeo HTTP'
    Write-Status '==== EAR_DEV_RESET END (no-probe) ===='
    exit 0
}

# ---- FASE 3: sondeo HTTP (solo 200 real cuenta) ----
Write-Status '-- FASE 3: sondeo http://localhost:3007/ (max 180 s) --'
$ok = $false; $httpStatus = -1; $bytes = 0; $sha = 'n/a'; $elapsed = 0
for ($i = 0; $i -lt 36; $i++) {
    Start-Sleep -Seconds 5
    $elapsed = ($i + 1) * 5
    try {
        $r = Invoke-WebRequest -Uri ("http://localhost:" + $port + "/") -UseBasicParsing -TimeoutSec 8 -ErrorAction Stop
        $httpStatus = [int]$r.StatusCode
    } catch {
        # PS 5.1 lanza excepcion con status != 2xx: recuperar el codigo real
        $resp = $_.Exception.Response
        if ($resp -and $null -ne $resp.StatusCode) { $httpStatus = [int]$resp.StatusCode }
        else { $httpStatus = -1 }
    }
    if ($httpStatus -eq 200) {
        $ok = $true
        try {
            $bytes = $r.RawContentLength
            $contentBytes = $null
            if ($r.RawContentStream) { $contentBytes = $r.RawContentStream.ToArray() }
            elseif ($r.RawContent) { $contentBytes = $r.RawContent }
            elseif ($r.Content -is [byte[]]) { $contentBytes = $r.Content }
            elseif ($null -ne $r.Content) { $contentBytes = [System.Text.Encoding]::UTF8.GetBytes([string]$r.Content) }
            if ($contentBytes) {
                $bytes = $contentBytes.Length
                $sha256 = [System.Security.Cryptography.SHA256]::Create()
                $sha = -join ($sha256.ComputeHash($contentBytes) | ForEach-Object { $_.ToString('x2') })
            }
        } catch {
            # 200 ya visto: el hash es accesorio, no se castiga el arranque
            $bytes = -1
            $sha = 'unreadable'
        }
        break
    }
    if ($i -in 1, 6, 11, 21) { Write-Status ('PROBE intento=' + ($i + 1) + ' status=' + $httpStatus + ' (compilando?)') }
}
Write-Status ('PROBE status=' + $httpStatus + ' bytes=' + $bytes + ' sha256=' + $sha + ' after=' + $elapsed + 's')
Write-Status ('RESULT=' + $(if ($ok) { 'OK' } else { 'FAIL' }))
if (-not $ok) {
    Write-Status '-- ultimas lineas del log de error --'
    if (Test-Path $errLog) { Get-Content -LiteralPath $errLog -Tail 20 -ErrorAction SilentlyContinue | ForEach-Object { Write-Status ('ERR> ' + $_) } }
}
Write-Status '==== EAR_DEV_RESET END ===='
if ($ok) { exit 0 } else { exit 1 }

