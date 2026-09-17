@echo off
chcp 65001 > nul
echo ========================================================
echo  ACTIVANDO SERVIDORES MCP EN CLINE / ROO
echo ========================================================
node scripts/manage_mcp.cjs enable
echo.
echo Listo. Los MCP servers estan activados.
echo ========================================================
pause
