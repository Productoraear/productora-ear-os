# Verificación estricta de tipos TypeScript con captura explícita de Exit Code.
$ErrorActionPreference = 'Continue'

npx tsc --noEmit
$code = $LASTEXITCODE

Write-Output "TSC_EXIT_CODE=$code"

if ($code -eq 0) {
    Write-Output "TSC_OK: TypeScript compila sin errores"
}
else {
    Write-Output "TSC_FAIL: TypeScript reporta errores (Exit Code $code)"
}

exit $code