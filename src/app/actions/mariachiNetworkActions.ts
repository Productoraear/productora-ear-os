"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { isRateLimited } from "@/lib/security/shield";
import { CENTRALITA_EAR_OS } from "@/lib/constants/ear-os-ssot";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ALTA EN LA RED NACIONAL DE MARIACHIS — INTAKE S-CLASS (ESCRITURA REAL)
 * ════════════════════════════════════════════════════════════════════════════
 * Cadena completa, sin fachadas:
 *   1. Validación estricta (zod) + saneamiento de caracteres de control.
 *   2. Rate limit por IP (anti-abuso del formulario público).
 *   3. Persistencia durable en PostgreSQL (`ProposalRequest`, origin
 *      `mariachi-network`, urgencia `ALTA_RED`) → visible en el panel admin.
 *   4. Despacho al webhook n8n `call-center-intake` con timeout de 4 s: si la
 *      automatización cae, el alta NO se pierde (queda en base de datos).
 *   5. Devolución del enlace WhatsApp ya redactado para cierre inmediato.
 *
 * Doctrina: jamás se acepta la centralita como teléfono del grupo. Un alta sin
 * teléfono propio verificable es un lead huérfano y se rechaza.
 * ════════════════════════════════════════════════════════════════════════════
 */

const N8N_INTAKE_URL =
  process.env.N8N_CALL_CENTER_INTAKE_URL ??
  "https://n8n.productoraear.com/webhook/call-center-intake";

const CENTRALITA_DIGITS = CENTRALITA_EAR_OS.replace(/\D/g, "");
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

function sanitize(value: string): string {
  return value.replace(CONTROL_CHARS, " ").replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
}

/** Normaliza a formato internacional E.164. Devuelve `null` si no es válido. */
function normalizePhone(raw: string): string | null {
  let cleaned = raw.replace(/[^0-9+]/g, "");
  if (!cleaned) return null;
  if (cleaned.startsWith("00")) cleaned = `+${cleaned.slice(2)}`;
  if (cleaned.startsWith("+")) {
    const digits = cleaned.slice(1);
    if (!/^\d{9,15}$/.test(digits)) return null;
    return `+${digits}`;
  }
  if (/^34\d{9}$/.test(cleaned)) return `+${cleaned}`;
  if (/^[6789]\d{8}$/.test(cleaned)) return `+34${cleaned}`;
  return null;
}

const FormationSchema = z.enum([
  "solista",
  "trio",
  "cuarteto",
  "gala",
  "monumental",
  "otros",
]);

const ApplicationSchema = z.object({
  groupName: z.string().trim().min(2).max(120),
  leaderName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(9).max(24),
  province: z.string().trim().min(2).max(80),
  city: z.string().trim().max(80).default(""),
  formation: FormationSchema,
  repertoireNote: z.string().trim().max(500).default(""),
});

/** Resultado tipado del alta (cero `any` en la frontera cliente/servidor). */
export type MariachiNetworkApplicationResult =
  | {
      ok: true;
      applicationId: string;
      persisted: boolean;
      automationDispatched: boolean;
      whatsappUrl: string;
      message: string;
    }
  | { ok: false; error: string };

async function resolveClientIp(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || headersList.get("x-real-ip") || "127.0.0.1";
}

async function dispatchToAutomation(payload: Record<string, unknown>): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4_000);

  try {
    const response = await fetch(N8N_INTAKE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });
    return response.ok;
  } catch (error: unknown) {
    logger.warn({ event: "MARIACHI_NETWORK_N8N_UNAVAILABLE", error: String(error) });
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Registra un alta de agrupación en la red. El botón se bloquea en cliente
 * mientras la promesa está en vuelo para evitar dobles envíos.
 */
export async function submitMariachiNetworkApplication(
  input: unknown,
): Promise<MariachiNetworkApplicationResult> {
  const ip = await resolveClientIp();

  if (isRateLimited(ip, 3, 60_000)) {
    return {
      ok: false,
      error: "RATE_LIMIT: Demasiadas solicitudes seguidas. Inténtalo en un minuto.",
    };
  }

  const parsed = ApplicationSchema.safeParse(input);
  if (!parsed.success) {
    logger.warn({ event: "MARIACHI_NETWORK_VALIDATION_FAILED", ip });
    return {
      ok: false,
      error: "VALIDATION: Revisa el nombre del grupo, el director, la provincia y el teléfono.",
    };
  }

  const normalizedPhone = normalizePhone(parsed.data.phone);
  if (normalizedPhone === null) {
    return { ok: false, error: "PHONE_INVALID: Introduce un teléfono real de contacto." };
  }
  if (normalizedPhone.replace(/\D/g, "") === CENTRALITA_DIGITS) {
    return {
      ok: false,
      error: "PHONE_INVALID: Usa el teléfono propio del grupo, no la centralita.",
    };
  }

  const application = {
    groupName: sanitize(parsed.data.groupName),
    leaderName: sanitize(parsed.data.leaderName),
    phone: normalizedPhone,
    province: sanitize(parsed.data.province),
    city: sanitize(parsed.data.city),
    formation: parsed.data.formation,
    repertoireNote: sanitize(parsed.data.repertoireNote),
    source: "centralita-mariachi-network",
    submittedAt: new Date().toISOString(),
  };

  let applicationId = `red_${Date.now().toString(36)}`;
  let persisted = false;

  try {
    const record = await prisma.proposalRequest.create({
      data: {
        clientName: application.leaderName,
        phone: application.phone,
        address: application.city
          ? `${application.province} · ${application.city}`
          : application.province,
        title: `[ALTA RED] ${application.groupName}`,
        urgency: "ALTA_RED",
        rawText: JSON.stringify(application),
        aiConcepts: "[]",
        origin: "mariachi-network",
        status: "pendiente",
      },
      select: { id: true },
    });
    applicationId = record.id;
    persisted = true;
  } catch (error: unknown) {
    logger.error({ event: "MARIACHI_NETWORK_PERSIST_FAILED", error: String(error) });
  }

  const automationDispatched = await dispatchToAutomation({
    ...application,
    applicationId,
    persisted,
    channel: "mariachi-network",
  });

  const whatsappText = [
    "🎺 ALTA EN LA RED NACIONAL DE MARIACHIS — CENTRALITA EAR OS",
    "",
    `• Agrupación: ${application.groupName}`,
    `• Director / portavoz: ${application.leaderName}`,
    `• Teléfono propio: ${application.phone}`,
    `• Base: ${application.province}${application.city ? ` · ${application.city}` : ""}`,
    `• Formación habitual: ${application.formation}`,
    `• Repertorio / notas: ${application.repertoireNote || "sin notas"}`,
    `• Expediente: ${applicationId}`,
    "",
    "Acepto el modelo de red: 0 € fijos, Split Soberano 80 % artista / 10 % infraestructura / 10 % obra social VIMUME,",
    "depósito de 100 € del cliente deducible íntegro y auditoría previa de audio/vídeo.",
  ].join("\n");

  return {
    ok: true,
    applicationId,
    persisted,
    automationDispatched,
    whatsappUrl: `https://wa.me/34693693048?text=${encodeURIComponent(whatsappText)}`,
    message: persisted
      ? "Alta registrada. La centralita revisará tu material y activará tu perfil verificado."
      : "Alta recibida en la centralita. El registro en base de datos se reintentará automáticamente.",
  };
}
