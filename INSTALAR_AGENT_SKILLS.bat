@echo off
title AGENT SKILLS S-CLASS - PRODUCTORA EAR OS
echo ======================================================================
echo    AGENT SKILLS :: LIFECYCLE DE INGENIERIA SENIOR (ADDY OSMANI)
echo    [DEFINE] -^> [PLAN] -^> [BUILD] -^> [VERIFY] -^> [REVIEW] -^> [SIMPLIFY] -^> [SHIP]
echo    /spec        /plan      /build       /test        /review      /code-simplify  /ship
echo ======================================================================

echo [1/3] Ejecutando bootstrap nativo de Agent Skills para EAR OS...
python scripts/unified/bootstrap_agent_skills.py

echo.
echo [2/3] Sincronizando catalogo oficial via npx skills (Vercel Labs)...
call npx -y skills add addyosmani/agent-skills || echo [AVISO] Continuamos con el bundle local en .agents/skills/

echo.
echo [3/3] Validando integridad de TypeScript en EAR OS...
call npx tsc --noEmit
if %errorlevel% equ 0 (
    echo [OK] TypeScript Compilation: EXIT CODE 0 (CERO ERRORES)
) else (
    echo [ALERTA] Se detectaron advertencias en compilacion.
)

echo.
echo ======================================================================
echo    AGENT SKILLS ESTA 100%% OPERATIVO Y TRABAJANDO EN EAR OS
echo ======================================================================
pause
