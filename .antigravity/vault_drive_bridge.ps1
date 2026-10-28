<#
════════════════════════════════════════════════════════════════════════════════
PUENTE DE UNIDAD · VAULT BRIDGE (H: -> D:) — ANTIGRAVITY OMEGA v9.0
════════════════════════════════════════════════════════════════════════════════
Motivo: el árbol del proyecto y la bóveda de datos viven temporalmente en D:
(disco H: físico retirado por avería). Código, docs y manifiestos referencian
`H:\00_PRODUCTORA_EAR\...` y `H:\EAR_OS_V2\...` de forma literal. En lugar de
reescribir 300+ referencias (lo que invalidaría los Exit Codes ya sellados),
se crea un alias de unidad:  H:\  =>  D:\

El alias es IDEMPOTENTE, NO DESTRUCTIVO y NO EXIGE ADMINISTRADOR (subst por usuario).
Si el disco H: físico vuelve y la letra está ocupada, este script ABORTA (Exit 3):
jamás desmonta ni sobrescribe una unidad real.

Uso:
  powershell -NoProfile -File .antigravity/vault_drive_bridge.ps1            # Apply
  powershell -NoProfile -File .antigravity/vault_drive_bridge.ps1 -Mode Status
  powershell -NoProfile -File .antigravity/vault_drive_bridge.ps1 -Mode Remove
  ... -DriveLetter H: -HostRoot 'E:\' -NoPersist

Exit codes:
  0 = puente activo y verificado (o ya lo estaba) · 1 = fallo inesperado
  2 = parámetro inválido · 3 = letra ocupada por OTRA unidad/asignación
  4 = la bóveda no existe en el disco anfitrión
════════════════════════════════════════════════════════════════════════════════
#>
[CmdletBinding()]
param(
    [ValidateSet('Apply', 'Status', 'Remove')]
    [string]$Mode = 'Apply',

    [ValidatePattern('^[A-Za-z]:$')]
    [string]$DriveLetter = 'H:',

    [string]$HostRoot = 'D:\',

    [string]$VaultRelative = '00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT',

    [switch]$NoPersist
)

$ErrorActionPreference = 'Stop'
$RunKeyPath = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
$RunKeyName = 'EAR_VAULT_DRIVE_{0}' -f $DriveLetter.Substring(0, 1).ToUpperInvariant()

function Get-SubstMap {
    $map = @{}
    # `subst` imprime con formato variable: "H:\: => D:\" (barra incluida) o "H: => D:\".
    foreach ($line in (cmd /c subst 2>$null)) {
        if ($line -match '^\s*([A-Za-z]):[^\s=>]*\s*=>\s*(.+?)\s*$') {
            $map[$Matches[1].ToUpperInvariant() + ':'] = $Matches[2].TrimEnd('\') + '\'
        }
    }
    return $map
}

function Get-NormalizedPath([string]$Path) {
    if ([string]::IsNullOrWhiteSpace($Path)) { return '' }
    return $Path.TrimEnd('\') + '\'
}

$letter = $DriveLetter.ToUpperInvariant()
$hostRoot = Get-NormalizedPath $HostRoot
$mapped = Get-SubstMap
$current = $mapped[$letter]
$vaultOnHost = $hostRoot + $VaultRelative

Write-Output ('MODE={0} | LETTER={1} | HOST={2}' -f $Mode, $letter, $hostRoot)

switch ($Mode) {
    'Status' {
        Write-Output ('SUBST_MAP=' + $(if ($current) { "$letter => $current" } else { 'ABSENT' }))
        Write-Output ('LETTER_PATH_OK=' + (Test-Path ($letter + '\')))
        Write-Output ('VAULT_VIA_LETTER=' + (Test-Path ($letter + '\' + $VaultRelative)))
        Write-Output ('VAULT_ON_HOST=' + (Test-Path $vaultOnHost))
        $persisted = (Get-ItemProperty -Path $RunKeyPath -Name $RunKeyName -ErrorAction SilentlyContinue).$RunKeyName
        Write-Output ('PERSISTED_RUN_KEY=' + $(if ($persisted) { $persisted } else { 'ABSENT' }))
        exit 0
    }
    'Remove' {
        if ($current) {
            cmd /c "subst $letter /D" | Out-Null
            Write-Output ("REMOVED_SUBST={0}" -f $letter)
        }
        else {
            Write-Output 'REMOVED_SUBST=NOOP (no había asignación)'
        }
        if (Test-Path $RunKeyPath) {
            $persisted = (Get-ItemProperty -Path $RunKeyPath -Name $RunKeyName -ErrorAction SilentlyContinue).$RunKeyName
            if ($persisted) {
                Remove-ItemProperty -Path $RunKeyPath -Name $RunKeyName -Force
                Write-Output 'REMOVED_RUN_KEY=OK'
            }
            else {
                Write-Output 'REMOVED_RUN_KEY=NOOP'
            }
        }
        Write-Output ('LETTER_PATH_OK_AFTER_REMOVE=' + (Test-Path ($letter + '\')))
        exit 0
    }
}

# ── Modo Apply ────────────────────────────────────────────────────────────────
if (-not (Test-Path $hostRoot)) {
    Write-Output ("FAIL=HOST_ROOT_MISSING ({0})" -f $hostRoot)
    exit 2
}
if (-not (Test-Path $vaultOnHost)) {
    Write-Output ("FAIL=VAULT_MISSING_ON_HOST ({0})" -f $vaultOnHost)
    exit 4
}

if ($current) {
    if ($current -eq $hostRoot) {
        Write-Output ('SUBST={0} => {1} (IDEMPOTENT_OK)' -f $letter, $current)
    }
    else {
        Write-Output ('FAIL=LETTER_OCCUPIED ({0} => {1}, se esperaba {2})' -f $letter, $current, $hostRoot)
        exit 3
    }
}
else {
    if (Test-Path ($letter + '\')) {
        Write-Output ("FAIL=LETTER_IS_REAL_DRIVE ({0} ya es una unidad física o de red)" -f $letter)
        exit 3
    }
    cmd /c "subst $letter $hostRoot" | Out-Null
    $after = (Get-SubstMap)[$letter]
    if ($after -ne $hostRoot) {
        Write-Output ("FAIL=SUBST_NOT_APPLIED ({0} => {1})" -f $letter, $after)
        exit 1
    }
    Write-Output ('SUBST={0} => {1} (APPLIED_OK)' -f $letter, $after)
}

if (-not $NoPersist -and (Test-Path $RunKeyPath)) {
    $persistCmd = 'cmd /c subst {0} {1}' -f $letter, $hostRoot
    $persisted = (Get-ItemProperty -Path $RunKeyPath -Name $RunKeyName -ErrorAction SilentlyContinue).$RunKeyName
    if ($persisted -ne $persistCmd) {
        Set-ItemProperty -Path $RunKeyPath -Name $RunKeyName -Value $persistCmd -Type String
        Write-Output 'PERSISTED_RUN_KEY=SET'
    }
    else {
        Write-Output 'PERSISTED_RUN_KEY=IDEMPOTENT_OK'
    }
}

$bridgeOk = (Test-Path ($letter + '\' + $VaultRelative))
Write-Output ('BRIDGE_VERIFIED=' + $bridgeOk)
Write-Output ('PROJECT_ROOT_VIA_BRIDGE=' + (Test-Path ($letter + '\EAR_OS_V2\EAR_OS_V2\package.json')))

if (-not $bridgeOk) {
    Write-Output 'FAIL=BRIDGE_NOT_RESOLVING'
    exit 1
}

Write-Output 'RESULT=OK'
exit 0
