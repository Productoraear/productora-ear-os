@echo off
chcp 65001 > nul
echo ========================================================
echo  DESACTIVANDO TODOS LOS SERVIDORES MCP EN CLINE / ROO
echo  Eliminando inyeccion de esquemas JSON (Ahorro de tokens)
echo ========================================================
node scripts/manage_mcp.cjs disable
echo.
echo Listo. Los MCP servers estan desactivados.
echo ========================================================
pause
