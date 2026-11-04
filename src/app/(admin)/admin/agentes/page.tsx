import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Bot, Terminal, ShieldCheck, AlertTriangle, ArrowLeft, Cpu } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Enjambre de Agentes S-Class · EAR OS',
  description: 'Roster real de agentes y skills leído de disco (.agents/skills). Sin cifras inventadas.',
};

interface AgentSkill {
  id: string;
  name: string;
  description: string;
  phase: string;
  command: string;
  bytes: number;
}

interface RosterRead {
  skills: AgentSkill[];
  rules: number;
  dir: string;
  exists: boolean;
}

/** Lee el roster real desde .agents/skills (sin listas tecleadas). */
function readRoster(): RosterRead {
  const dir = path.join(process.cwd(), '.agents', 'skills');
  const rulesDir = path.join(process.cwd(), '.agents', 'rules');
  const rules = fs.existsSync(rulesDir)
    ? fs.readdirSync(rulesDir, { withFileTypes: true }).filter((entry) => entry.isFile()).length
    : 0;

  if (!fs.existsSync(dir)) {
    return { skills: [], rules, dir, exists: false };
  }

  const skills = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap<AgentSkill>((entry) => {
      const skillFile = path.join(dir, entry.name, 'SKILL.md');
      if (!fs.existsSync(skillFile)) return [];
      try {
        const raw = fs.readFileSync(skillFile, 'utf-8');
        const front = raw.split('---')[1] ?? '';
        const field = (key: string): string => {
          const match = front.match(new RegExp('^' + key + ':\\s*(.+)$', 'm'));
          return match ? match[1].trim() : '';
        };
        return [
          {
            id: entry.name,
            name: field('name') || entry.name,
            description: field('description') || 'Sin descripción declarada en su SKILL.md',
            phase: field('lifecycle_phase') || 'sin fase declarada',
            command: field('command') || '—',
            bytes: Buffer.byteLength(raw, 'utf-8'),
          },
        ];
      } catch {
        return [];
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  return { skills, rules, dir, exists: true };
}

export default function AdminAgentesPage() {
  const roster = readRoster();
  const total = roster.skills.length;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
            <Bot className="w-3.5 h-3.5 text-[#ecb613]" /> Agente &amp; Enjambre de Respaldo
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-syne mt-1">
            Roster real de agentes ({total} en disco)
          </h1>
          <p className="text-neutral-400 text-sm mt-1 max-w-3xl">
            Esta página no declara cifras: lee <code className="text-[#ecb613]">.agents/skills/*/SKILL.md</code> en cada
            petición. Si el disco tiene 12, dice 12. Si tiene 0, lo dice y da el comando exacto para reconstruirlo.
          </p>
        </div>
        <Link
          href="/agent-skills"
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#ecb613] text-xs font-mono text-neutral-200 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Ciclo de vida Agent Skills
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#09090d] border border-white/10">
          <div className="text-[10px] font-mono text-neutral-500 uppercase">Skills instaladas</div>
          <div className="text-2xl font-bold text-white font-mono">{total}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#09090d] border border-white/10">
          <div className="text-[10px] font-mono text-neutral-500 uppercase">Reglas (.agents/rules)</div>
          <div className="text-2xl font-bold text-white font-mono">{roster.rules}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#09090d] border border-white/10">
          <div className="text-[10px] font-mono text-neutral-500 uppercase">Fuente</div>
          <div className="text-[11px] text-neutral-300 font-mono break-all">{roster.dir}</div>
        </div>
      </div>

      {!roster.exists && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/50 text-amber-200 text-xs font-mono space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4" /> 0 AGENTES: el directorio no existe en este equipo
          </div>
          <p>
            Reconstrucción (PowerShell, en la raíz del repo):{' '}
            <code className="text-[#ecb613]">INSTALAR_AGENT_SKILLS.bat</code>
          </p>
        </div>
      )}

      {total > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#09090d] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 text-neutral-500 font-mono uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Agente</th>
                <th className="px-4 py-2.5">Fase</th>
                <th className="px-4 py-2.5">Comando</th>
                <th className="px-4 py-2.5">SKILL.md</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {roster.skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-white/5 transition-colors align-top">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{skill.name}</div>
                    <div className="text-neutral-500 mt-0.5 leading-relaxed">{skill.description}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-sky-300 whitespace-nowrap">{skill.phase}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#ecb613] whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <Terminal className="w-3 h-3" /> {skill.command}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-neutral-400 whitespace-nowrap">
                    {(skill.bytes / 1024).toFixed(1)} KB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-[#09090d] border border-white/10 text-[11px] font-mono text-neutral-400 space-y-1.5">
        <div className="flex items-center gap-2 text-neutral-200 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Trazabilidad
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5" /> Cada fila corresponde a un archivo real en disco (AF-5: sin sondeo no hay verde).
        </div>
        <div>
          El panel NO lista agentes que no existan. Si esperabas más, ejecuta el bootstrap: el script escribía en una
          ruta fija <code className="text-[#ecb613]">H:\EAR_OS_V2\EAR_OS_V2</code> mientras este equipo trabaja en{' '}
          <code className="text-[#ecb613]">D:</code>, por lo que la sincronización no llegaba al repositorio activo.
        </div>
      </div>
    </div>
  );
}