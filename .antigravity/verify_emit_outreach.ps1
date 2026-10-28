# ════════════════════════════════════════════════════════════════════════════════
# BATERÍA DE VERIFICACIÓN · EMISOR DE ENLACES DE LA RED DE MARIACHIS
# ════════════════════════════════════════════════════════════════════════════════
# Ejercita TODOS los caminos del emisor sin depender de la lista real de grupos:
#   uso/ayuda · autotest · fichero ausente · JSON roto · raíz no-array · array
#   vacío · lista válida · filtro de plaza sin coincidencias · CSV · CSV ilegible.
# Devuelve Exit 0 solo si los 11 casos coinciden con el Exit Code esperado.
# Uso:  powershell -NoProfile -File .antigravity\verify_emit_outreach.ps1
# ════════════════════════════════════════════════════════════════════════════════
$ErrorActionPreference = 'Stop'
$root = 'D:\EAR_OS_V2\EAR_OS_V2'
Set-Location -LiteralPath $root

$tsx = './node_modules/tsx/dist/cli.mjs'
$tool = 'scripts/emit_mariachi_outreach.ts'
$tmp = Join-Path $env:TEMP ('ear_emit_' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tmp | Out-Null

$valid = Join-Path $tmp 'valid.json'
$toledo = Join-Path $tmp 'toledo.json'
$empty = Join-Path $tmp 'empty.json'
$bad = Join-Path $tmp 'bad.json'
$object = Join-Path $tmp 'object.json'
$unroutable = Join-Path $tmp 'unroutable.json'
$csv = Join-Path $tmp 'outreach.csv'

# Teléfono sintético '000000000': 9 dígitos que no marcan a nadie. Solo en %TEMP%.
@'
[
  { "groupName": "Agrupacion Sintetica Toledo", "province": "Toledo", "phone": "099000000" },
  { "groupName": "Agrupacion Sin Telefono", "province": "Toledo", "phone": "" },
  { "groupName": "Agrupacion Plaza Invalida", "province": "Atlantida", "phone": "099000001" }
]
'@ | Set-Content -LiteralPath $valid -Encoding UTF8

@'
[
  { "groupName": "Agrupacion Sintetica Toledo", "province": "Toledo", "phone": "099000000" }
]
'@ | Set-Content -LiteralPath $toledo -Encoding UTF8

# Prefijo `00`: 9 dígitos en bruto, pero wa.me sólo recibiría 7 → enlace muerto.
@'
[
  { "groupName": "Agrupacion Enlace Muerto", "province": "Toledo", "phone": "000000000" }
]
'@ | Set-Content -LiteralPath $unroutable -Encoding UTF8

'[]' | Set-Content -LiteralPath $empty -Encoding UTF8
'{ esto no es json' | Set-Content -LiteralPath $bad -Encoding UTF8
'{ "groupName": "no soy un array" }' | Set-Content -LiteralPath $object -Encoding UTF8

$results = @()

function Invoke-Case {
    param([string]$Name, [string[]]$Argv, [int]$Expected)
    # PS 5.1 convierte el stderr de un ejecutable nativo en ErrorRecord: con
    # $ErrorActionPreference='Stop' abortaría el arnés. Se aísla aquí.
    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    $out = (& node $tsx $tool @Argv 2>&1 | Out-String)
    $code = $LASTEXITCODE
    $ErrorActionPreference = $previous
    $first = ($out -split "`r?`n" | Where-Object { $_.Trim() -ne '' } | Select-Object -First 1)
    $script:results += [pscustomobject]@{
        Caso     = $Name
        Exit     = $code
        Esperado = $Expected
        Veredicto = if ($code -eq $Expected) { 'PASS' } else { 'FAIL' }
        Salida   = if ($first) { $first.Trim().Substring(0, [Math]::Min(72, $first.Trim().Length)) } else { '' }
    }
}

Invoke-Case 'template'        @('--template')                            0
Invoke-Case 'help'            @('--help')                                0
Invoke-Case 'selftest'        @('--selftest')                            0
Invoke-Case 'sin-targets'     @()                                        2
Invoke-Case 'fichero-ausente' @("--targets=$tmp\NO_EXISTE.json")         2
Invoke-Case 'json-roto'       @("--targets=$bad")                        2
Invoke-Case 'raiz-no-array'   @("--targets=$object")                     2
Invoke-Case 'array-vacio'     @("--targets=$empty")                      1
Invoke-Case 'lista-valida'    @("--targets=$valid")                      0
Invoke-Case 'telefono-no-enrutable' @("--targets=$unroutable")           1
Invoke-Case 'filtro-sin-plaza' @("--targets=$toledo", '--province=madrid') 1
Invoke-Case 'csv-generado'    @("--targets=$valid", "--out=$csv")        0
Invoke-Case 'csv-ilegible'    @("--targets=$valid", "--out=$tmp\no\such\dir\x.csv") 2

$results | Format-Table -AutoSize | Out-String -Width 200 | Write-Host

$csvOk = (Test-Path -LiteralPath $csv) -and ((Get-Content -LiteralPath $csv -Encoding UTF8 | Measure-Object -Line).Lines -ge 2)
$selftestOk = $false
$selftestOut = (& node $tsx $tool --selftest 2>&1 | Out-String)
if ($selftestOut -match 'SELFTEST_OK') { $selftestOk = $true }

$failed = @($results | Where-Object { $_.Veredicto -ne 'PASS' }).Count
$csvLine = if ($csvOk) { 'CSV_ROWS_OK' } else { 'CSV_MISSING' }
$selfLine = if ($selftestOk) { 'SELFTEST_SIGNAL_OK' } else { 'SELFTEST_SIGNAL_MISSING' }
Write-Host "RESUMEN fallos=$failed/12 csv=$csvLine selftest=$selfLine"

Remove-Item -LiteralPath $tmp -Recurse -Force

if ($failed -eq 0 -and $csvOk -and $selftestOk) { exit 0 }
exit 1
