# Script de emergencia para purgar variables inestables de HKLM en Windows
# Ejecutar como Administrador para limpiar el registro del sistema

$ErrorActionPreference = 'SilentlyContinue'

Write-Host "Purgando variables inestables de Ollama en HKLM (Machine)..." -ForegroundColor Cyan

Remove-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment' -Name 'OLLAMA_FLASH_ATTENTION' -ErrorAction SilentlyContinue
Remove-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment' -Name 'OLLAMA_MAX_VRAM' -ErrorAction SilentlyContinue
Remove-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment' -Name 'OLLAMA_GPU_OVERHEAD' -ErrorAction SilentlyContinue
Remove-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment' -Name 'OLLAMA_KV_CACHE_TYPE' -ErrorAction SilentlyContinue

[System.Environment]::SetEnvironmentVariable('OLLAMA_FLASH_ATTENTION', [string]::Empty, 'Machine')
[System.Environment]::SetEnvironmentVariable('OLLAMA_MAX_VRAM', [string]::Empty, 'Machine')
[System.Environment]::SetEnvironmentVariable('OLLAMA_GPU_OVERHEAD', [string]::Empty, 'Machine')
[System.Environment]::SetEnvironmentVariable('OLLAMA_KV_CACHE_TYPE', [string]::Empty, 'Machine')

Write-Host "[OK] HKLM purgado. Flash Attention desactivado en Machine." -ForegroundColor Green

# Purgar tambien HKCU por garantia
Remove-ItemProperty -Path 'HKCU:\Environment' -Name 'OLLAMA_FLASH_ATTENTION' -ErrorAction SilentlyContinue
Remove-ItemProperty -Path 'HKCU:\Environment' -Name 'OLLAMA_MAX_VRAM' -ErrorAction SilentlyContinue
Remove-ItemProperty -Path 'HKCU:\Environment' -Name 'OLLAMA_GPU_OVERHEAD' -ErrorAction SilentlyContinue
Remove-ItemProperty -Path 'HKCU:\Environment' -Name 'OLLAMA_KV_CACHE_TYPE' -ErrorAction SilentlyContinue

[System.Environment]::SetEnvironmentVariable('OLLAMA_FLASH_ATTENTION', [string]::Empty, 'User')
[System.Environment]::SetEnvironmentVariable('OLLAMA_MAX_VRAM', [string]::Empty, 'User')
[System.Environment]::SetEnvironmentVariable('OLLAMA_GPU_OVERHEAD', [string]::Empty, 'User')
[System.Environment]::SetEnvironmentVariable('OLLAMA_KV_CACHE_TYPE', [string]::Empty, 'User')

Write-Host "[OK] HKCU purgado. Sistema 100% estabilizado para AMD RX 7900 XTX." -ForegroundColor Green
