import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const baseDir = process.cwd();
    const resultsDir = path.join(baseDir, 'scripts', 'nightcrawler_results');

    // 1. Progress file
    let progress: any = { total_requests: 0, new_providers: 0, completed_urls: [], started_at: '', updated_at: '' };
    const progressPath = path.join(resultsDir, 'nightcrawler_progress.json');
    if (fs.existsSync(progressPath)) {
      try {
        progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
      } catch {}
    }

    // 2. Online providers
    let onlineProviders: any[] = [];
    const onlinePath = path.join(resultsDir, 'new_online_providers.json');
    if (fs.existsSync(onlinePath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(onlinePath, 'utf-8'));
        onlineProviders = Array.isArray(raw) ? raw : (raw.providers || []);
      } catch {}
    }

    // 3. Vault absorbed providers
    let vaultCount = 0;
    let vaultSample: any[] = [];
    const vaultPath = path.join(resultsDir, 'vault_absorbed_providers.json');
    if (fs.existsSync(vaultPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(vaultPath, 'utf-8'));
        const provs = Array.isArray(raw) ? raw : (raw.providers || []);
        vaultCount = raw.total || provs.length;
        vaultSample = provs.slice(0, 10);
      } catch {}
    }

    // 4. Fast phones
    let phonesCount = 0;
    const phonesPath = path.join(resultsDir, 'fast_extracted_phones.json');
    if (fs.existsSync(phonesPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(phonesPath, 'utf-8'));
        phonesCount = Array.isArray(raw) ? raw.length : 0;
      } catch {}
    }

    // 5. Stdout log tail
    let logTail: string[] = [];
    const logPath = path.join(resultsDir, 'stdout.log');
    if (fs.existsSync(logPath)) {
      try {
        const content = fs.readFileSync(logPath, 'utf-8');
        const lines = content.split('\n').filter((l) => l.trim().length > 0);
        logTail = lines.slice(-25);
      } catch {}
    }

    // Combine recent leads
    const recentLeads = onlineProviders.slice(-50).reverse();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      metrics: {
        total_online_captured: onlineProviders.length,
        total_vault_absorbed: vaultCount,
        total_phones_recovered: phonesCount,
        total_requests: progress.total_requests || 0,
        waf_status: 'BYPASS_ACTIVE_CHROME110',
        daemon_status: 'RUNNING',
        started_at: progress.started_at,
        updated_at: progress.updated_at,
      },
      log_tail: logTail,
      recent_leads: recentLeads,
      vault_sample: vaultSample,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
