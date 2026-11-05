const fs = require('fs');
const filePath = 'src/app/(admin)/admin/compiler/page.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Añadir estados para los 3 selectores de la Guía Maestra
if (!code.includes('selectedObjective')) {
  code = code.replace(
    "const [oraclePersona, setOraclePersona] = useState<OraclePersona>('CEO');",
    `const [oraclePersona, setOraclePersona] = useState<OraclePersona>('CEO');
  const [selectedObjective, setSelectedObjective] = useState<string>('VENTAS');
  const [selectedTactic, setSelectedTactic] = useState<string>('SOBREDEMANDA');
  const [selectedTargetAgent, setSelectedTargetAgent] = useState<string>('CLINE');`
  );
}

// 2. Modificar handleCompile para enviar o enriquecer con los 3 selectores
if (code.includes('intent: prompt,')) {
  code = code.replace(
    'intent: prompt,',
    `intent: [
          \`[OBJETIVO]: \${selectedObjective}\`,
          \`[TÁCTICA VELOCITY]: \${selectedTactic}\`,
          \`[DESTINATARIO]: \${selectedTargetAgent}\`,
          \`[ORDEN DEL CEO]: \${prompt}\`
        ].join('\\n'),`
  );
}

// 3. Crear el componente visual de los selectores rápidos en la columna izquierda
const visualSelectors = `
            {/* 🧭 SELECTORES DE LA GUÍA MAESTRA (DOCTRINA DAVID HURTADO & VELOCITY MEDIA) */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-[#ecb613]/25 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#ecb613] font-bold flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-[#ecb613]" /> Guía Maestra S-Class
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Doctrina Exit Code 0</span>
              </div>

              {/* Selector 1: Objetivo de Negocio */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">1. Objetivo de Negocio</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'VENTAS', label: '💰 Ventas (Depósito 100€)', hint: 'Stripe Price-Lock deducible' },
                    { id: 'FINCAS', label: '🏰 Alianzas Fincas & Venues', hint: 'Modelo Eduardo / Otzarreta' },
                    { id: 'B2G', label: '🏛️ B2G (<14.250€ LCSP)', hint: 'Contratos menores sin concurso' },
                    { id: 'ARQUITECTURA', label: '⚡ Código & Backend', hint: '0 fachadas, tsc Exit Code 0' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedObjective(item.id)}
                      className={'p-2 rounded-xl text-left border text-xs font-mono transition ' + (selectedObjective === item.id ? 'bg-[#ecb613]/15 border-[#ecb613] text-[#ecb613] font-bold' : 'bg-black/40 border-zinc-800/80 text-zinc-400 hover:text-white')}
                    >
                      <div className="truncate">{item.label}</div>
                      <div className="text-[9px] text-zinc-500 truncate">{item.hint}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 2: Táctica de la Bóveda Velocity Media */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">2. Táctica Velocity Media</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'SOBREDEMANDA', label: '🔥 Sobredemanda', hint: 'Exclusividad & Escasez' },
                    { id: 'VENTA_ELEGANTE', label: '✨ Venta Elegante', hint: 'Alivio & Transparencia' },
                    { id: 'MIDAS_SPLIT', label: '🛡️ Midas (Split 80/10/10)', hint: 'Dividendo social VIMUME' },
                    { id: 'CAMALEON_GEO', label: '🎯 Camaleón Neural', hint: 'Pre-landings por intención' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedTactic(item.id)}
                      className={'p-2 rounded-xl text-left border text-xs font-mono transition ' + (selectedTactic === item.id ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold' : 'bg-black/40 border-zinc-800/80 text-zinc-400 hover:text-white')}
                    >
                      <div className="truncate">{item.label}</div>
                      <div className="text-[9px] text-zinc-500 truncate">{item.hint}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 3: Destinatario del Prompt */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">3. ¿A qué IA o Agente se lo entregarás?</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'CLINE', label: '🤖 Obrero Cline', hint: 'Para picar código' },
                    { id: 'N8N', label: '⚡ Flujo n8n', hint: 'Automatización' },
                    { id: 'WHATSAPP', label: '💬 WhatsApp', hint: 'Cierre directo' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedTargetAgent(item.id)}
                      className={'p-2 rounded-xl text-center border text-xs font-mono transition ' + (selectedTargetAgent === item.id ? 'bg-[#FF2B44]/15 border-[#FF2B44] text-[#FF2B44] font-bold' : 'bg-black/40 border-zinc-800/80 text-zinc-400 hover:text-white')}
                    >
                      <div className="truncate">{item.label}</div>
                      <div className="text-[9px] text-zinc-500 truncate">{item.hint}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
`;

if (!code.includes('SELECTORES DE LA GUÍA MAESTRA')) {
  code = code.replace('<textarea', visualSelectors + '\n            <textarea');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('SUCCESS_INJECT_GUIDE_INTO_COMPILER');
} else {
  console.log('ALREADY_INJECTED');
}

