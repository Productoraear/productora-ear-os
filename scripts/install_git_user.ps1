$ErrorActionPreference = 'Stop'
$targetDir = "$env:LOCALAPPDATA\Programs\Git"
$zipPath = "$env:TEMP\MinGit.zip"

Write-Host "Verificando si Git ya existe en $targetDir..."
if (Test-Path "$targetDir\cmd\git.exe") {
    Write-Host "Git ya está instalado en $targetDir."
} else {
    Write-Host "Descargando MinGit oficial desde GitHub..."
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    $url = "https://github.com/git-for-windows/git/releases/download/v2.48.1.windows.1/MinGit-2.48.1-64-bit.zip"
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $url -OutFile $zipPath -UseBasicParsing
    Write-Host "Extrayendo MinGit en $targetDir..."
    Expand-Archive -Path $zipPath -DestinationPath $targetDir -Force
    Remove-Item $zipPath -Force
}

Write-Host "Configurando Git en el PATH del usuario..."
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$targetDir\cmd*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$targetDir\cmd;$targetDir\bin", "User")
    Write-Host "Ruta agregada al PATH del usuario."
}

Write-Host "Validando ejecutable Git..."
$gitExe = "$targetDir\cmd\git.exe"
if (Test-Path $gitExe) {
    & $gitExe --version
    Write-Host "GIT INSTALADO CON ÉXITO."
} else {
    Write-Error "No se pudo localizar $gitExe"
}
