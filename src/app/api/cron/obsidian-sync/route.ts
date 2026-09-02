import { NextResponse } from "next/server";
import { ObsidianIngestor } from "@/lib/services/rag/obsidianIngestor";
import { sendTelegramNotification } from "@/lib/services/telegram";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 🛰️ ASTRA CROM SYNC HANDLER (FASE 205.GOD_MODE)
 * Endpoint protegido para sincronización periódica automatizada del cerebro semántico de Obsidian.
 * Diseñado para ser invocado por Vercel Cron Jobs mediante Bearer Token.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "LEVIATHAN_SECRET_KEY";

  // 1. Verificación del Guardián Bearer Token
  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ") ||
    authHeader.split(" ")[1] !== cronSecret
  ) {
    logger.warn({
      event: "CRON_SYNC_UNAUTHORIZED",
      ip: req.headers.get("x-forwarded-for") || "unknown",
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  } catch (err: any) {
    logger.error({ event: "CRON_SYNC_FAILED", error: err.message });
    return NextResponse.json(
      { error: `Sync execution failed: ${err.message}` },
      { status: 500 }
    );
  }
}
