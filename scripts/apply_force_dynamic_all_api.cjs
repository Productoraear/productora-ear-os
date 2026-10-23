const fs = require('fs');
const path = require('path');

function findRoutes(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findRoutes(full, list);
    } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
      list.push(full);
    }
  }
  return list;
}

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
const apiRoutes = findRoutes(apiDir);

let updatedCount = 0;

for (const r of apiRoutes) {
  let content = fs.readFileSync(r, 'utf8');
  const hasDynamic = content.includes("export const dynamic = 'force-dynamic'") || content.includes('export const dynamic = "force-dynamic"');
  const hasRuntime = content.includes("export const runtime = 'nodejs'") || content.includes('export const runtime = "nodejs"') || content.includes("export const runtime = 'edge'") || content.includes('export const runtime = "edge"');

  if (hasDynamic && hasRuntime) continue;

  let additions = '';
  if (!hasDynamic) {
    additions += "export const dynamic = 'force-dynamic';\n";
  }
  if (!hasRuntime) {
    additions += "export const runtime = 'nodejs';\n";
  }

  // Insert after the first import block or top of file (after 'use client' or 'use server' if present)
  let lines = content.split('\n');
  let insertIndex = 0;

  // Find last import line or line 0
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ') || lines[i].startsWith('} from ')) {
      insertIndex = i + 1;
    }
  }

  lines.splice(insertIndex, 0, '\n' + additions.trim());
  fs.writeFileSync(r, lines.join('\n'), 'utf8');
  updatedCount++;
  console.log(`✅ Injected force-dynamic in: ${path.relative(path.join(__dirname, '..'), r)}`);
}

console.log(`\n🎉 Total API routes updated with force-dynamic: ${updatedCount}`);
