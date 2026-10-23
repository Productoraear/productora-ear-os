# MIGRACION Y PURGA ESTRUCTURADA DE G:\RespaldoPC HACIA TAXONOMIA SOBERANA

$ErrorActionPreference = 'SilentlyContinue'

Write-Host "Iniciando clasificacion de documentos clave desde G:\RespaldoPC..." -ForegroundColor Cyan

# 1. Documentacion Estrategica hacia 01_TRABAJO
$docsDest = "G:\01_TRABAJO\03_DOCUMENTACION_EMPRESA"
$reportsDest = "G:\01_TRABAJO\02_AUDITORIAS_Y_REPORTES"

Copy-Item -Path "G:\RespaldoPC\Desktop\presentacion-ear-os-incubadora.pdf" -Destination "$docsDest\presentacion-ear-os-incubadora.pdf" -Force
Copy-Item -Path "G:\RespaldoPC\Desktop\MANUAL_FLOTA_IA_LOCAL_SCLASS.md" -Destination "$docsDest\MANUAL_FLOTA_IA_LOCAL_SCLASS.md" -Force
Copy-Item -Path "G:\RespaldoPC\Desktop\OMNI_ROUTER_SCLASS.md" -Destination "$docsDest\OMNI_ROUTER_SCLASS.md" -Force
Copy-Item -Path "G:\RespaldoPC\Desktop\ANTIGRAVITY_OMEGA_v9.0_BARE-METAL_FORENSIC_GOVERNANCE.md" -Destination "$docsDest\ANTIGRAVITY_OMEGA_v9.0_BARE-METAL_FORENSIC_GOVERNANCE.md" -Force
Copy-Item -Path "G:\RespaldoPC\Desktop\EAR_OS_PROGRESO_ZTM_2026-10-09.md" -Destination "$reportsDest\EAR_OS_PROGRESO_ZTM_2026-10-09.md" -Force

if (Test-Path "G:\RespaldoPC\Projects\INVENTARIO_PC") {
    Copy-Item -Path "G:\RespaldoPC\Projects\INVENTARIO_PC" -Destination "$docsDest\INVENTARIO_PC" -Recurse -Force
}

if (Test-Path "G:\RespaldoPC\Desktop\EAR_OS_NEURAL_KNOWLEDGE_BASE") {
    Copy-Item -Path "G:\RespaldoPC\Desktop\EAR_OS_NEURAL_KNOWLEDGE_BASE" -Destination "$docsDest\EAR_OS_NEURAL_KNOWLEDGE_BASE" -Recurse -Force
}

Write-Host "Documentos clave migrados a G:\01_TRABAJO con exito." -ForegroundColor Green
