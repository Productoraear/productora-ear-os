Write-Host "--- INICIANDO PROTOCOLO DE DESPLIEGUE S-CLASS ---" -ForegroundColor Cyan

# Limpieza de VRAM y CPU
taskkill /F /IM "AnythingLLM.exe" /T 2>$null
taskkill /F /IM "ollama.exe" /T 2>$null

# Despliegue con compresión forzada
vercel --prod --archive=tgz --yes

Write-Host "--- DESPLIEGUE FINALIZADO ---" -ForegroundColor Yellow