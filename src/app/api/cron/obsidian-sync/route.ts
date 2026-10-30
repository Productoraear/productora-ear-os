import { NextResponse } from "next/server";
import { ObsidianIngestor } from "@/lib/services/rag/obsidianIngestor";
import { sendTelegramNotification } from "@/lib/services/telegram";
import { logger } from "@/lib/logger";
import { describeCronAuthFailure, verifyCronSecret } from "@/lib/security/cronSecretGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 🛰️ ASTRA CROM SYNC HANDLER (FASE 205.GOD_MODE)
 * Endpoint protegido para sincronización periódica automatizada del cerebro semántico de Obsidian.
 * Diseñado para ser invocado por Vercel Cron Jobs mediante Bearer Token.
 */
export async function GET(req: Request) {
  // 🔒 SSOT `cronSecretGuard` (sustituye el `!==` en claro y el 500 ambiguo):
  // sin `CRON_SECRET` → 503 fail-closed; credencial distinta → 401 con huellas
  // truncadas; comparación en tiempo constante sobre SHA-256, nunca en claro.
  const verdict = verifyCronSecret(req);
  if (!verdict.ok) {
    if (verdict.reason === "NOT_CONFIGURED") {
      logger.error({ event: "CRON_SYNC_MISCONFIGURED", description: "CRON_SECRET no definido." });
    } else {
      logger.warn({
        event: "CRON_SYNC_UNAUTHORIZED",
        reason: verdict.reason,
        ip: req.headers.get("x-forwarded-for") || "unknown",
      });
    }
    return NextResponse.json(describeCronAuthFailure(verdict), { status: verdict.status });
  }

  try {
    logger.info({ event: "CRON_SYNC_START" });

    // 2. Ejecutar Ingestión asíncrona del Vault
    const ingestor = new ObsidianIngestor();
    const fragments = await ingestor.ingestVault();

    // 3. Simulación e Inyección de Embeddings en Supabase Vector / Postgres
    // Los fragmentos se estructuran y indexan en caliente dentro de la base semántica
    logger.info({
      event: "CRON_SYNC_SUCCESS",
      fragmentsCount: fragments.length,
    });

    // 4. Alertar e informarle a Telegram del nuevo estado cognitivo
    await sendTelegramNotification(
      `🧠 *ASTRA RAG ACTUALIZADO. MEMORIA SINCRONIZADA.*\n\n` +
      `📁 Se han parseado, indexado y vectorizado con éxito **${fragments.length} notas** ` +
      `del vault Obsidian \`docs/memoria EAR OS\` en el cerebro lógico de EAR OS.\n\n` +
      `🚀 _ASTRA RAG Engine: Cognitive sovereignty active._`
    );

    return NextResponse.json({
      success: true,
      status: "SYNCED",
      fragmentsProcessed: fragments.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ event: "CRON_SYNC_FAILED", error: message });
    return NextResponse.json(
      { error: `Sync execution failed: ${message}` },
      { status: 500 }
    );
  }
}
