const fs = require('fs');
const path = require('path');

const paths = [
  'C:/Users/M2-W10/AppData/Roaming/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json',
  'C:/Users/M2-W10/AppData/Roaming/Code/User/globalStorage/zhucan.debug-cline/settings/cline_mcp_settings.json',
  'C:/Users/M2-W10/AppData/Roaming/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/mcp_settings.json'
];

const action = process.argv[2] || 'disable'; // 'disable' or 'enable'
const shouldDisable = action === 'disable';

console.log(`[MCP MANAGER] Estableciendo estado de MCP Servers: ${shouldDisable ? 'DESACTIVADOS (disabled: true)' : 'ACTIVADOS (disabled: false)'}`);

paths.forEach(p => {
  if (fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (data.mcpServers) {
        for (const s in data.mcpServers) {
          data.mcpServers[s].disabled = shouldDisable;
        }
        fs.writeFileSync(p, JSON.stringify(data, null, 2));
        console.log(`✓ Actualizado: ${path.basename(path.dirname(path.dirname(p)))} -> ${Object.keys(data.mcpServers).join(', ')}`);
      }
    } catch (e) {
      console.error(`Error procesando ${p}:`, e.message);
    }
  }
});

console.log(`[MCP MANAGER] ¡Completado con éxito!`);
