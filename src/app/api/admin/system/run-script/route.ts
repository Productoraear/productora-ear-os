import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { ADMIN_SYSTEM_SCRIPTS } from '@/lib/constants/admin-system-scripts';

const execAsync = promisify(exec);

// Lista blanca estricta de IDs permitidos para evitar inyección de comandos
const ALLOWED_SCRIPT_MAP = new Map(
  ADMIN_SYSTEM_SCRIPTS.map((s) => [s.id, s.command])
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scriptId } = body;

    if (!scriptId || typeof scriptId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Parámetro scriptId no proporcionado.' },
        { status: 400 }
      );
    }

    const commandToRun = ALLOWED_SCRIPT_MAP.get(scriptId);

    if (!commandToRun) {
      return NextResponse.json(
        { success: false, error: `Script '${scriptId}' no autorizado en la lista blanca de gobernanza.` },
        { status: 403 }
      );
    }

    const startTime = Date.now();
    let stdoutOutput = '';
    let stderrOutput = '';
    let exitCode = 0;

    try {
      const { stdout, stderr } = await execAsync(commandToRun, {
        cwd: process.cwd(),
        timeout: 45000, // 45 segundos máximo
        maxBuffer: 10 * 1024 * 1024,
      });
      stdoutOutput = stdout;
      stderrOutput = stderr;
    } catch (execErr: any) {
      exitCode = execErr.code || 1;
      stdoutOutput = execErr.stdout || '';
      stderrOutput = execErr.stderr || execErr.message || '';
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: exitCode === 0,
      scriptId,
      command: commandToRun,
      exitCode,
      durationMs,
      output: (stdoutOutput + (stderrOutput ? `\n[STDERR]:\n${stderrOutput}` : '')).trim(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error interno al ejecutar script de operaciones' },
      { status: 500 }
    );
  }
}
