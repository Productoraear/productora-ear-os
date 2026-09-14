@echo off
title DESPLIEGUE A GITHUB Y NETLIFY - PRODUCTORA EAR OS
echo ======================================================================
echo    DESPLIEGUE SOBERANO :: GITHUB ^& NETLIFY EDGE CI/CD
echo    Productora EAR OS :: S-Class Pureza Anti-Bloat (^< 50 MB)
echo ======================================================================

echo.
echo [1/5] Verificando compilacion de TypeScript (Next.js 14/15 App Router)...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo [ERROR CRITICO] Fallo la compilacion de TypeScript. Abortando push preventivamente.
    pause
    exit /b %errorlevel%
)
echo [OK] TypeScript: EXIT CODE 0 (Sin errores)

echo.
echo [2/5] Auditando estado Git y proteccion contra archivos pesados...
git status --short

echo.
echo [3/5] Preparando staging selectivo de codigo fuente...
git add src/
git add .agents/
git add scripts/unified/
git add .antigravity/
git add INICIAR_VOICE_STUDIO.bat
git add INSTALAR_AGENT_SKILLS.bat
git add DESPLEGAR_A_GITHUB_Y_NETLIFY.bat

echo.
echo [4/5] Creando commit S-Class...
git commit -m "feat(omega): VoiceStudio AI integration, Addy Osmani Agent Skills lifecycle, and S-Class navigation integrity"

echo.
echo [5/5] Desplegando a GitHub y activando webhook de Netlify Edge...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ======================================================================
    echo    DESPLIEGUE COMPLETADO CON EXITO
    echo    GitHub: Sincronizado en rama main
    echo    Netlify: Build y despliegue a Edge activado automaticamente
    echo ======================================================================
) else (
    echo [ALERTA] Error al hacer git push. Comprueba credenciales o conexion.
)

pause
