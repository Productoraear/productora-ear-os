$setup = "$env:TEMP\OllamaSetup.exe"
Write-Host "Descargando OllamaSetup.exe oficial con curl..."
& curl.exe -L "https://ollama.com/download/OllamaSetup.exe" -o $setup
Write-Host "Instalando Ollama silenciosamente en espacio de usuario..."
Start-Process -FilePath $setup -ArgumentList "/silent" -Wait
Remove-Item $setup -Force -ErrorAction SilentlyContinue

$ollamaExe = "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe"
if (Test-Path $ollamaExe) {
    Write-Host "OLLAMA INSTALADO CON EXITO en $ollamaExe"
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $ollamaDir = "$env:LOCALAPPDATA\Programs\Ollama"
    if ($userPath -notlike "*$ollamaDir*") {
        [Environment]::SetEnvironmentVariable("Path", "$userPath;$ollamaDir", "User")
    }
} else {
    Write-Host "OllamaSetup termino. Verificando ejecutable..."
}
