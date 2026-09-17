# Auditoría anti-bloat: verifica que ningún archivo stageado (ACMR) supera 1 MB.
$ErrorActionPreference = 'Stop'

$files = git diff --cached --name-only --diff-filter=ACMR
$overLimit = @()

foreach ($f in $files) {
    if (Test-Path -LiteralPath $f) {
        $s = (Get-Item -LiteralPath $f).Length
        if ($s -gt 1048576) {
            $overLimit += "{0} = {1} bytes" -f $f, $s
        }
    }
}

if ($overLimit.Count -gt 0) {
    Write-Output "OVER_1MB_DETECTED:"
    $overLimit | ForEach-Object { Write-Output $_ }
}
else {
    Write-Output "AUDIT_OK: ningun archivo stageado supera 1 MB"
}