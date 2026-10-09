$ErrorActionPreference = "Continue"
$sw = [System.Diagnostics.Stopwatch]::StartNew()
npm run build *>&1 | Tee-Object -FilePath .antigravity/build.log
$code = $LASTEXITCODE
$sw.Stop()
Set-Content -Path .antigravity/build.exit -Value ($code.ToString() + "," + $sw.ElapsedMilliseconds.ToString())
Write-Output ("BUILD_EXIT_CODE=" + $code)
Write-Output ("BUILD_DURATION_MS=" + $sw.ElapsedMilliseconds)
exit $code