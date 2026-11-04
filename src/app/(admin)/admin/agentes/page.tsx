import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Bot, Terminal, ShieldCheck, Cpu, ArrowLeft } from 'lucide-react';
import { OMEGA_FLEET_ROSTER } from '@/lib/agents/omegaFleet';
import { isKillSwitchActive } from '@/lib/agents/killSwitch';
import { OmniAgentRosterClient } from '@/components/admin/OmniAgentRosterClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Enjambre de 48 Agentes S-Class · EAR OS Admin',
  description: 'Flota operativa de 48 agentes S-Class en 6 divisiones interconectadas y consola conversacional.',
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

/** Lee las skills de desarrollo desde .agents/skills */
function readDevSkills(): RosterRead {
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

function getDlqDepth(): number {
  const dlqPath = path.join(process.cwd(), '.antigravity', 'dlq.jsonl');
  try {
    if (fs.existsSync(dlqPath)) {
      return fs.readFileSync(dlqPath, 'utf8').split('\n').filter((l) => l.trim().length > 0).length;
    }
  } catch {
    return -1;
  }
  return 0;
}

export default function AdminAgentesPage() {
  const devRoster = readDevSkills();
  const killSwitch = isKillSwitchActive();
  const dlqDepth = getDlqDepth();

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Encabezado */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
            <Bot className="w-3.5 h-3.5 text-[#ecb613]" /> Orquestación Omega S-Class · Modo CEO
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-syne mt-1">
            Enjambre de 48 Agentes Autónomos
          </h1>
          <p className="text-neutral-400 text-sm mt-1 max-w-3xl">
            Flota de 6 divisiones de choque interconectadas por <code className="text-[#ecb613]">AgentBus</code> con
            despacho a n8n, cálculo SSOT en tiempo real y consola conversacional integrada.
          </p>
        </div>
        <Link
          href="/agent-skills"
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#ecb613] text-xs font-mono text-neutral-200 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Ciclo de vida Agent Skills
        </Link>
      </div>

      {/* Roster Interactivo de los 48 Agentes */}
      <OmniAgentRosterClient
        fleet={OMEGA_FLEET_ROSTER}
        totalSkills={devRoster.skills.length}
        totalRules={devRoster.rules}
        killSwitchActive={killSwitch}
        dlqDepth={dlqDepth}
      />

      {/* Sección Inferior: Skills de Desarrollo e Ingeniería */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Herramientas de Ingeniería ({devRoster.skills.length} skills en disco)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">
            Fuente: <code className="text-neutral-400">.agents/skills</code>
          </span>
        </div>

        {devRoster.skills.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#09090d] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/60 text-neutral-500 font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">Skill</th>
                  <th className="px-4 py-2.5">Fase</th>
                  <th className="px-4 py-2.5">Comando</th>
                  <th className="px-4 py-2.5">Peso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {devRoster.skills.map((skill) => (
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
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Trazabilidad &amp; Sello Omega
          </div>
          <div>
            Todos los agentes de la flota S-Class tienen registro canónico en{' '}
            <code className="text-[#ecb613]">src/lib/agents/omegaFleet.ts</code> y cuentan con handlers activos en{' '}
            <code className="text-[#ecb613]">agentBus.ts</code>. Cero huérfanos y cero fachadas.
          </div>
        </div>
      </div>
    </div>
  );
}
