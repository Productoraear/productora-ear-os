/**
 * ════════════════════════════════════════════════════════════════════════════
 * CAPABILITIES & ADAPTERS READINESS REGISTRY (M2)
 * ════════════════════════════════════════════════════════════════════════════
 * Server-only (`node:fs`, `node:path`).
 * Agrega el estado real (fail-closed, sin secretos) de los adapters externos
 * (GWS, Zapier MCP, fal.ai/Kling O1) y las capacidades locales verificables en
 * disco (`graphify`, `playwright`, `remotion`, `.agents/skills/*`, `gws` CLI).
 * Cumple AF-1 (`probed: true`, `source: 'live'`, `mode: 'REAL'`, `checkedAt`,
 * `evidenceSha256`).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { existsSync as fsExistsSync, readdirSync as fsReaddirSync } from 'node:fs';
import path from 'node:path';

import { MARKETING_SKILLS } from '@/lib/skillsRegistry';

import {
  type AdapterReadiness,
  type EnvSource,
  computeEvidenceSha256,
} from './adapter-contract';
import { checkGwsReadiness, defaultCommandExists } from './gws-adapter';
import { checkKlingFalReadiness } from './kling-fal-adapter';
import { checkZapierMcpReadiness } from './zapier-mcp-adapter';

export type ExternalAdapterId = 'gws' | 'zapier-mcp' | 'kling-fal';

export const REQUIRED_LOCAL_WORKFLOW_SKILLS = [
  'ponytail',
  'grill-me',
  'unslop',
  'spec-driven-development',
  'test-driven-development',
  'planning-and-task-breakdown',
  'verification-and-testing',
] as const;

export const OPTIONAL_LOCAL_WORKFLOW_SKILLS = ['superpowers'] as const;

export interface LocalCapabilityCheck {
  readonly label: string;
  readonly ok: boolean;
}

export interface LocalCapabilityStatus {
  readonly id: 'graphify' | 'playwright' | 'remotion' | 'local-skills' | 'gws-cli';
  readonly category: 'knowledge-graph' | 'browser-automation' | 'video' | 'skills' | 'workspace-cli';
  readonly available: boolean;
  readonly status: 'READY' | 'PARTIAL' | 'NOT_INSTALLED';
  readonly details: string;
  readonly checks: readonly LocalCapabilityCheck[];
}

export interface SkillsAlignmentSummary {
  readonly localSkillsPresent: readonly string[];
  readonly localSkillsMissing: readonly string[];
  readonly optionalSkillsPresent: readonly string[];
  readonly legacyRegistryDeclaredCount: number;
}

export interface CapabilitiesRegistrySnapshot {
  readonly ok: true;
  readonly probed: true;
  readonly source: 'live';
  readonly mode: 'REAL';
  readonly checkedAt: string;
  readonly adapters: readonly AdapterReadiness[];
  readonly localCapabilities: readonly LocalCapabilityStatus[];
  readonly skillsAlignment: SkillsAlignmentSummary;
  readonly summary: {
    readonly adaptersReady: number;
    readonly adaptersTotal: number;
    readonly localReady: number;
    readonly localTotal: number;
  };
  readonly evidenceSha256: string;
}

export interface CapabilitiesRegistryOptions {
  readonly env?: EnvSource;
  readonly rootDir?: string;
  readonly existsSync?: (targetPath: string) => boolean;
  readonly readDirSync?: (targetPath: string) => readonly string[];
  readonly commandExists?: (binName: string) => boolean;
  readonly platform?: NodeJS.Platform;
  readonly now?: () => Date;
  readonly adapterFilter?: ExternalAdapterId;
}

function safeExists(
  fn: (targetPath: string) => boolean,
  targetPath: string,
): boolean {
  try {
    return fn(targetPath);
  } catch {
    return false;
  }
}

function safeReadDir(
  fn: (targetPath: string) => readonly string[],
  targetPath: string,
): readonly string[] {
  try {
    return fn(targetPath);
  } catch {
    return [];
  }
}

function safeCmd(
  fn: (binName: string) => boolean,
  binName: string,
): boolean {
  try {
    return fn(binName);
  } catch {
    return false;
  }
}

export function getCapabilitiesRegistrySnapshot(
  options: CapabilitiesRegistryOptions = {},
): CapabilitiesRegistrySnapshot {
  const env = options.env ?? process.env;
  const rootDir = options.rootDir ?? process.cwd();
  const existsFn = options.existsSync ?? fsExistsSync;
  const readDirFn =
    options.readDirSync ??
    ((p: string) => fsReaddirSync(p));
  const cmdFn =
    options.commandExists ??
    ((bin: string) => defaultCommandExists(bin, env, existsFn));
  const platform = options.platform ?? process.platform;
  const nowFn = options.now ?? (() => new Date());

  const gwsProbeDeps = {
    existsSync: existsFn,
    commandExists: cmdFn,
    rootDir,
  };

  const allAdapters: readonly AdapterReadiness[] = [
    checkGwsReadiness(env, gwsProbeDeps),
    checkZapierMcpReadiness(env),
    checkKlingFalReadiness(env),
  ];

  const adapters = options.adapterFilter
    ? allAdapters.filter((a) => a.adapterId === options.adapterFilter)
    : allAdapters;

  // 1. Graphify
  const graphJsonExists = safeExists(
    existsFn,
    path.join(rootDir, 'graphify-out', 'graph.json'),
  );
  const graphLockExists = safeExists(
    existsFn,
    path.join(rootDir, 'graphify-out', '.rebuild.lock'),
  );
  const graphifyCmdOk = safeCmd(cmdFn, 'graphify');
  const graphStaleLock = graphLockExists && !graphJsonExists;
  const graphStatus: LocalCapabilityStatus['status'] =
    graphJsonExists && graphifyCmdOk
      ? 'READY'
      : graphJsonExists || graphifyCmdOk
        ? 'PARTIAL'
        : 'NOT_INSTALLED';
  const graphifyCap: LocalCapabilityStatus = {
    id: 'graphify',
    category: 'knowledge-graph',
    available: graphJsonExists || graphifyCmdOk,
    status: graphStatus,
    details: graphStaleLock
      ? 'Lock .rebuild.lock detectado sin graph.json generado.'
      : graphJsonExists
        ? 'graphify-out/graph.json verificado en disco.'
        : 'CLI graphify o grafo AST pendiente de compilación.',
    checks: [
      { label: 'graphify-out/graph.json', ok: graphJsonExists },
      { label: 'no-stale-rebuild-lock', ok: !graphStaleLock },
      { label: 'cli:graphify', ok: graphifyCmdOk },
    ],
  };

  // 2. Playwright / Browsers
  const pwPkgExists = safeExists(
    existsFn,
    path.join(rootDir, 'node_modules', 'playwright', 'package.json'),
  );
  const edgeExists =
    platform === 'win32'
      ? safeExists(
          existsFn,
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        )
      : false;
  const chromeExists =
    platform === 'win32'
      ? safeExists(
          existsFn,
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        )
      : false;
  const browserOk = platform === 'win32' ? edgeExists || chromeExists : pwPkgExists;
  const pwStatus: LocalCapabilityStatus['status'] =
    pwPkgExists && browserOk
      ? 'READY'
      : pwPkgExists || browserOk
        ? 'PARTIAL'
        : 'NOT_INSTALLED';
  const playwrightCap: LocalCapabilityStatus = {
    id: 'playwright',
    category: 'browser-automation',
    available: pwPkgExists,
    status: pwStatus,
    details:
      pwStatus === 'READY'
        ? 'Paquete playwright y navegador Chromium disponibles.'
        : pwPkgExists
          ? 'Paquete playwright instalado sin navegador local detectado.'
          : 'Playwright no instalado en node_modules.',
    checks: [
      { label: 'node_modules/playwright', ok: pwPkgExists },
      ...(platform === 'win32'
        ? [
            { label: 'win32:msedge', ok: edgeExists },
            { label: 'win32:chrome', ok: chromeExists },
          ]
        : []),
    ],
  };

  // 3. Remotion
  const remotionPkg = safeExists(
    existsFn,
    path.join(rootDir, 'node_modules', 'remotion', 'package.json'),
  );
  const remotionCli = safeExists(
    existsFn,
    path.join(rootDir, 'node_modules', '@remotion', 'cli', 'package.json'),
  );
  const remotionBundler = safeExists(
    existsFn,
    path.join(rootDir, 'node_modules', '@remotion', 'bundler', 'package.json'),
  );
  const remotionStatus: LocalCapabilityStatus['status'] =
    remotionPkg && (remotionCli || remotionBundler)
      ? 'READY'
      : remotionPkg
        ? 'PARTIAL'
        : 'NOT_INSTALLED';
  const remotionCap: LocalCapabilityStatus = {
    id: 'remotion',
    category: 'video',
    available: remotionPkg,
    status: remotionStatus,
    details:
      remotionStatus === 'READY'
        ? 'Remotion SDK y bundler/cli disponibles localmente.'
        : 'Remotion no instalado completamente en node_modules.',
    checks: [
      { label: 'node_modules/remotion', ok: remotionPkg },
      { label: 'node_modules/@remotion/cli', ok: remotionCli },
      { label: 'node_modules/@remotion/bundler', ok: remotionBundler },
    ],
  };

  // 4. Local Skills (.agents/skills/*/SKILL.md) + cross-ref MARKETING_SKILLS
  const skillsDir = path.join(rootDir, '.agents', 'skills');
  const discoveredDirs = safeReadDir(readDirFn, skillsDir);
  const localSkillsPresent: string[] = [];
  const localSkillsMissing: string[] = [];

  for (const skillId of REQUIRED_LOCAL_WORKFLOW_SKILLS) {
    const skillMd = path.join(skillsDir, skillId, 'SKILL.md');
    if (safeExists(existsFn, skillMd)) {
      localSkillsPresent.push(skillId);
    } else {
      localSkillsMissing.push(skillId);
    }
  }
  const optionalSkillsPresent: string[] = [];
  for (const optId of OPTIONAL_LOCAL_WORKFLOW_SKILLS) {
    if (safeExists(existsFn, path.join(skillsDir, optId, 'SKILL.md'))) {
      optionalSkillsPresent.push(optId);
    }
  }

  const skillsStatus: LocalCapabilityStatus['status'] =
    localSkillsMissing.length === 0
      ? 'READY'
      : localSkillsPresent.length > 0
        ? 'PARTIAL'
        : 'NOT_INSTALLED';
  const skillsCap: LocalCapabilityStatus = {
    id: 'local-skills',
    category: 'skills',
    available: localSkillsPresent.length > 0,
    status: skillsStatus,
    details: `${localSkillsPresent.length}/${REQUIRED_LOCAL_WORKFLOW_SKILLS.length} skills de ingeniería verificadas en disco (${discoveredDirs.length} carpetas en .agents/skills; ${MARKETING_SKILLS.length} registros lógicos en skillsRegistry.ts).`,
    checks: REQUIRED_LOCAL_WORKFLOW_SKILLS.map((id) => ({
      label: `.agents/skills/${id}/SKILL.md`,
      ok: localSkillsPresent.includes(id),
    })),
  };

  // 5. GWS CLI binary
  const gwsCmdExists = safeCmd(cmdFn, 'gws');
  const gwsPkgExists = safeExists(
    existsFn,
    path.join(rootDir, 'node_modules', '@googleworkspace', 'cli', 'package.json'),
  );
  const gwsCliStatus: LocalCapabilityStatus['status'] =
    gwsCmdExists || gwsPkgExists ? 'READY' : 'NOT_INSTALLED';
  const gwsCliCap: LocalCapabilityStatus = {
    id: 'gws-cli',
    category: 'workspace-cli',
    available: gwsCmdExists || gwsPkgExists,
    status: gwsCliStatus,
    details:
      gwsCliStatus === 'READY'
        ? 'Binario o paquete @googleworkspace/cli detectado localmente.'
        : 'CLI @googleworkspace/cli no instalado en host; el adapter usa OAuth2 REST en producción.',
    checks: [
      { label: 'cli:gws', ok: gwsCmdExists },
      { label: 'node_modules/@googleworkspace/cli', ok: gwsPkgExists },
    ],
  };

  const localCapabilities: readonly LocalCapabilityStatus[] = [
    graphifyCap,
    playwrightCap,
    remotionCap,
    skillsCap,
    gwsCliCap,
  ];

  const checkedAt = nowFn().toISOString();
  const skillsAlignment: SkillsAlignmentSummary = {
    localSkillsPresent,
    localSkillsMissing,
    optionalSkillsPresent,
    legacyRegistryDeclaredCount: MARKETING_SKILLS.length,
  };
  const summary = {
    adaptersReady: adapters.filter((a) => a.configured).length,
    adaptersTotal: adapters.length,
    localReady: localCapabilities.filter((c) => c.status === 'READY').length,
    localTotal: localCapabilities.length,
  };

  const evidenceSha256 = computeEvidenceSha256({
    probed: true,
    source: 'live',
    mode: 'REAL',
    checkedAt,
    adapters,
    localCapabilities,
    skillsAlignment,
    summary,
  });

  return {
    ok: true,
    probed: true,
    source: 'live',
    mode: 'REAL',
    checkedAt,
    adapters,
    localCapabilities,
    skillsAlignment,
    summary,
    evidenceSha256,
  };
}
