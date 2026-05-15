@echo off
:: =============================================================================
:: ANTIGRAVITY OMEGA - AI OPTIMIZATION SCRIPT FOR RX 7900 XTX (RDNA3)
:: Este script configura el entorno para maximizar la compatibilidad y 
:: estabilidad de cargas de trabajo de IA en GPUs Radeon 7000 Series.
:: =============================================================================

echo [INFO] Aplicando optimizaciones de entorno para RX 7900 XTX...

:: 1. Forzar identificación de arquitectura RDNA3 (Navi 31)
:: Esto permite que librerías que no reconocen nativamente la 7900 XTX usen el kernel GFX11.
setx HSA_OVERRIDE_GFX_VERSION 11.0.0 /M

:: 2. Desactivar SDMA (System Direct Memory Access)
:: Previene crasheos en ciertas implementaciones de ROCm/DirectML al gestionar VRAM.
setx HSA_ENABLE_SDMA 0 /M

:: 3. Optimización de Memoria DirectML
:: Evita el sobreuso de memoria compartida (RAM) y fuerza el uso de la VRAM dedicada.
setx DX_ENABLE_DIRECTML_MEM_POOLING 1 /M
setx DML_MANAGED_RESOURCES_MAX_MB 24576 /M

:: 4. Evitar recompilación de kernels en cada ejecución (Shader Cache)
setx ROC_ENABLE_PRE_COMPILED_BINARIES 1 /M

echo.
echo [OK] Variables de entorno configuradas exitosamente a nivel de sistema.
echo [ADVERTENCIA] Debes REINICIAR cualquier terminal o aplicacion (Ollama, VS Code)
echo               para que los cambios surtan efecto.
echo.
echo [RECORDATORIO] No olvides desactivar HAGS en la configuracion de Windows
echo               y activar Re-Size BAR en la BIOS para el "Punto Dulce".
echo.
pause
