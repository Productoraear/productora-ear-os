/**
 * ════════════════════════════════════════════════════════════════════════════
 * FAL.AI & KLING O1 VIDEO GENERATION ADAPTER (M2)
 * ════════════════════════════════════════════════════════════════════════════
 * Server-only (`node:crypto` para firma HS256 JWT directa de Kling y hashing).
 * Soporta fal.ai (`Authorization: Key <FAL_KEY>`) para los 3 endpoints O1 y
 * proveedor directo Kling O1 (`KLING_ACCESS_KEY`, `KLING_SECRET_KEY`,
 * `KLING_API_BASE_URL`).
 *
 * REGLAS ESTRICTAS:
 *  · Anti-SSRF HTTPS-only en TODA URL de entrada, base URL y URL devuelta.
 *  · `AbortSignal.timeout(8000)`, `redirect: 'error'`, Zod `.strict()`.
 *  · `VideoJobReceipt` honesto: `videoUrl: null` hasta verificación HTTPS real;
 *    jamás fabrica URLs `.mp4` ficticias. `503 UNCONFIGURED` sin credenciales.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHmac } from 'node:crypto';
import { z } from 'zod';

import {
  ADAPTER_TIMEOUT_MS,
  type AdapterEnvelope,
  type AdapterReadiness,
  type AdapterTransport,
  type EnvSource,
  createAdapterFetchTransport,
  effectiveAdapterSignal,
  envelopeError,
  envelopeHitlBlocked,
  envelopeOk,
  envelopeUnconfigured,
  evaluateHitlPolicyGate,
  parseStrictWithSchema,
  readEnvVar,
  validateSafeHttpsPublicUrl,
} from './adapter-contract';

export const KLING_FAL_ADAPTER_ID = 'kling-fal' as const;
export const KLING_DEFAULT_BASE_URL = 'https://api.klingai.com' as const;

export const FAL_KLING_O1_ENDPOINTS = {
  'image-to-video': 'https://queue.fal.run/fal-ai/kling-video/o1/image-to-video',
  'video-to-video/edit':
    'https://queue.fal.run/fal-ai/kling-video/o1/video-to-video/edit',
  'reference-to-video':
    'https://queue.fal.run/fal-ai/kling-video/o1/standard/reference-to-video',
} as const;

export type KlingOperation = keyof typeof FAL_KLING_O1_ENDPOINTS;

const safeHttpsMediaUrlSchema = z.string().superRefine((val, ctx) => {
  const check = validateSafeHttpsPublicUrl(val);
  if (!check.ok) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: check.reason,
    });
  }
});

export const klingFalGenerateInputSchema = z
  .object({
    provider: z.enum(['fal', 'kling-direct']).default('fal'),
    operation: z.enum([
      'image-to-video',
      'video-to-video/edit',
      'reference-to-video',
    ]),
    prompt: z.string().trim().min(1).max(2500),
    imageUrl: safeHttpsMediaUrlSchema.optional(),
    videoUrl: safeHttpsMediaUrlSchema.optional(),
    referenceImageUrls: z.array(safeHttpsMediaUrlSchema).min(1).max(4).optional(),
    durationSeconds: z.enum(['5', '10']).optional().default('5'),
    aspectRatio: z.enum(['16:9', '9:16', '1:1']).optional().default('16:9'),
    humanApproved: z.boolean().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.operation === 'image-to-video' && !data.imageUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['imageUrl'],
        message: 'imageUrl HTTPS público requerido para image-to-video.',
      });
    }
    if (data.operation === 'video-to-video/edit' && !data.videoUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['videoUrl'],
        message: 'videoUrl HTTPS público requerido para video-to-video/edit.',
      });
    }
    if (
      data.operation === 'reference-to-video' &&
      (!data.referenceImageUrls || data.referenceImageUrls.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['referenceImageUrls'],
        message:
          'referenceImageUrls (1..4 URLs HTTPS públicas) requerido para reference-to-video.',
      });
    }
  });

export type KlingFalGenerateInput = z.infer<typeof klingFalGenerateInputSchema>;

const falQueueResponseSchema = z
  .object({
    request_id: z.string().min(1),
    status: z.string().optional(),
    status_url: z.string().optional(),
    response_url: z.string().optional(),
    cancel_url: z.string().optional(),
    queue_position: z.number().int().nonnegative().optional(),
    video: z
      .object({
        url: z.string(),
        content_type: z.string().optional(),
        file_name: z.string().optional(),
        file_size: z.number().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

const klingDirectResponseSchema = z
  .object({
    code: z.number().int(),
    message: z.string().optional(),
    request_id: z.string().optional(),
    data: z
      .object({
        task_id: z.string().min(1),
        task_status: z.string().optional(),
        task_result: z
          .object({
            videos: z
              .array(
                z
                  .object({
                    id: z.string().optional(),
                    url: z.string(),
                    duration: z.string().optional(),
                  })
                  .strict(),
              )
              .optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type VideoJobStatus = 'queued' | 'completed' | 'failed' | 'unconfigured';

export interface VideoJobReceipt {
  readonly provider: 'fal' | 'kling-direct';
  readonly endpoint: string;
  readonly operation: KlingOperation;
  readonly requestId: string;
  readonly status: VideoJobStatus;
  readonly statusUrl: string | null;
  readonly responseUrl: string | null;
  readonly videoUrl: string | null;
  readonly submittedAt: string;
}

export interface KlingFalOptions {
  readonly env?: EnvSource;
  readonly transport?: AdapterTransport;
  readonly now?: () => Date;
  readonly deadline?: Date;
}

function resolveKlingBaseUrl(
  env: EnvSource,
): { readonly ok: true; readonly url: string } | { readonly ok: false; readonly reason: string } {
  const raw = readEnvVar(env, 'KLING_API_BASE_URL');
  if (!raw) {
    return { ok: true, url: KLING_DEFAULT_BASE_URL };
  }
  const safe = validateSafeHttpsPublicUrl(raw);
  if (!safe.ok) {
    return { ok: false, reason: `KLING_API_BASE_URL inválida: ${safe.reason}` };
  }
  return { ok: true, url: safe.url.origin };
}

export function checkKlingFalReadiness(
  env: EnvSource = process.env,
): AdapterReadiness {
  const falKey = readEnvVar(env, 'FAL_KEY');
  const klingAccess = readEnvVar(env, 'KLING_ACCESS_KEY');
  const klingSecret = readEnvVar(env, 'KLING_SECRET_KEY');
  const baseCheck = resolveKlingBaseUrl(env);

  const falReady = falKey.length > 0;
  const directReady =
    klingAccess.length > 0 && klingSecret.length > 0 && baseCheck.ok;

  if (!baseCheck.ok && !falReady) {
    return {
      adapterId: KLING_FAL_ADAPTER_ID,
      configured: false,
      mode: 'UNCONFIGURED',
      missingVars: ['FAL_KEY'],
      details: baseCheck.reason,
    };
  }

  const configured = falReady || directReady;
  const missingVars: string[] = [];
  if (!configured) {
    missingVars.push('FAL_KEY');
  }

  const notes: string[] = [];
  if (falReady) notes.push('fal_ai=ready');
  if (directReady) notes.push(`kling_direct=ready(${baseCheck.ok ? baseCheck.url : ''})`);
  if (!configured) {
    notes.push(
      'Falta FAL_KEY (o bien KLING_ACCESS_KEY + KLING_SECRET_KEY para Kling directo).',
    );
  }
  if (!baseCheck.ok) {
    notes.push(baseCheck.reason);
  }

  return {
    adapterId: KLING_FAL_ADAPTER_ID,
    configured,
    mode: configured ? 'READY' : 'UNCONFIGURED',
    missingVars,
    details: notes.join(' | '),
  };
}

function base64UrlEncode(input: string | Buffer): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signKlingJwt(
  accessKey: string,
  secretKey: string,
  nowDate: Date,
): string {
  const nowSec = Math.floor(nowDate.getTime() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: accessKey,
      exp: nowSec + 1800,
      nbf: nowSec - 5,
    }),
  );
  const signingInput = `${header}.${payload}`;
  const sig = createHmac('sha256', secretKey).update(signingInput).digest();
  return `${signingInput}.${base64UrlEncode(sig)}`;
}

function normalizeReturnedSafeUrl(raw: string | undefined): {
  readonly valid: boolean;
  readonly url: string | null;
} {
  if (!raw) return { valid: true, url: null };
  const check = validateSafeHttpsPublicUrl(raw);
  if (!check.ok) return { valid: false, url: null };
  return { valid: true, url: check.url.toString() };
}

function mapVideoStatus(rawStatus: string | undefined): VideoJobStatus {
  const norm = (rawStatus ?? '').trim().toUpperCase();
  if (norm === 'COMPLETED' || norm === 'SUCCEED' || norm === 'SUCCEEDED') {
    return 'completed';
  }
  if (norm === 'FAILED' || norm === 'ERROR' || norm === 'CANCELLED') {
    return 'failed';
  }
  return 'queued';
}

function buildFalRequestBody(input: KlingFalGenerateInput): Record<string, unknown> {
  const base: Record<string, unknown> = {
    prompt: input.prompt,
    duration: input.durationSeconds,
    aspect_ratio: input.aspectRatio,
  };
  if (input.operation === 'image-to-video') {
    base.image_url = input.imageUrl;
  } else if (input.operation === 'video-to-video/edit') {
    base.video_url = input.videoUrl;
  } else {
    base.reference_image_urls = input.referenceImageUrls;
  }
  return base;
}

function buildKlingDirectEndpoint(
  baseUrl: string,
  operation: KlingOperation,
): string {
  if (operation === 'image-to-video') {
    return `${baseUrl}/v1/videos/image2video`;
  }
  if (operation === 'video-to-video/edit') {
    return `${baseUrl}/v1/videos/omni-video`;
  }
  return `${baseUrl}/v1/videos/multi-image2video`;
}

export async function submitKlingFalVideoJob(
  rawInput: unknown,
  options: KlingFalOptions = {},
): Promise<AdapterEnvelope<VideoJobReceipt>> {
  const env = options.env ?? process.env;
  const nowFn = options.now ?? (() => new Date());

  // 1. Validación estricta Zod + anti-SSRF en todas las URLs de entrada
  const parsedInput = parseStrictWithSchema(klingFalGenerateInputSchema, rawInput);
  if (!parsedInput.ok) {
    return envelopeError(400, 'KLING_FAL_INVALID_INPUT', parsedInput.error);
  }
  const input = parsedInput.data;

  // 2. Comprobación anti-SSRF en KLING_API_BASE_URL antes de readiness / red
  const readiness = checkKlingFalReadiness(env);
  const falKey = readEnvVar(env, 'FAL_KEY');
  const klingAccess = readEnvVar(env, 'KLING_ACCESS_KEY');
  const klingSecret = readEnvVar(env, 'KLING_SECRET_KEY');
  const baseCheck = resolveKlingBaseUrl(env);

  if (input.provider === 'kling-direct' && !baseCheck.ok) {
    return envelopeError(400, 'KLING_INVALID_BASE_URL', baseCheck.reason);
  }

  // 3. Comprobación fail-closed de credenciales para el proveedor solicitado
  if (input.provider === 'fal' && !falKey) {
    return envelopeUnconfigured({
      adapterId: KLING_FAL_ADAPTER_ID,
      configured: false,
      mode: 'UNCONFIGURED',
      missingVars: ['FAL_KEY'],
      details: readiness.details,
    });
  }

  if (input.provider === 'kling-direct') {
    const missingDirect: string[] = [];
    if (!klingAccess) missingDirect.push('KLING_ACCESS_KEY');
    if (!klingSecret) missingDirect.push('KLING_SECRET_KEY');
    if (missingDirect.length > 0) {
      return envelopeUnconfigured({
        adapterId: KLING_FAL_ADAPTER_ID,
        configured: false,
        mode: 'UNCONFIGURED',
        missingVars: missingDirect,
        details: readiness.details,
      });
    }
  }

  // 4. Puerta HITL fail-closed (25_REVIEW) antes de ejecutar generación externa
  const hitlDecision = evaluateHitlPolicyGate({
    actionKind: 'mutating_action',
    humanApproved: input.humanApproved,
    contextSummary: `Kling/fal.ai ${input.provider} ${input.operation}`,
  });
  if (!hitlDecision.allowed) {
    return envelopeHitlBlocked(hitlDecision);
  }

  const transport = options.transport ?? createAdapterFetchTransport();
  const knownSecrets = [falKey, klingAccess, klingSecret].filter((s) => s.length > 0);

  if (input.provider === 'fal') {
    const endpoint = FAL_KLING_O1_ENDPOINTS[input.operation];
    try {
      const response = await transport.send({
        url: endpoint,
        method: 'POST',
        headers: {
          Authorization: `Key ${falKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(buildFalRequestBody(input)),
        signal: effectiveAdapterSignal(options.deadline, nowFn, ADAPTER_TIMEOUT_MS),
      });

      if (response.status === 401 || response.status === 403) {
        return envelopeError(
          403,
          'FAL_UNAUTHORIZED',
          `fal.ai rechazó la credencial (HTTP ${response.status}).`,
          knownSecrets,
        );
      }
      if (response.status < 200 || response.status >= 300) {
        return envelopeError(
          502,
          'FAL_UPSTREAM_ERROR',
          `fal.ai devolvió HTTP ${response.status}: ${response.text}`,
          knownSecrets,
        );
      }

      const rawJson = JSON.parse(response.text) as unknown;
      const parsedRes = parseStrictWithSchema(falQueueResponseSchema, rawJson);
      if (!parsedRes.ok) {
        return envelopeError(
          502,
          'FAL_INVALID_PAYLOAD',
          `Respuesta de fal.ai inválida: ${parsedRes.error}`,
          knownSecrets,
        );
      }

      const statusUrlCheck = normalizeReturnedSafeUrl(parsedRes.data.status_url);
      const responseUrlCheck = normalizeReturnedSafeUrl(parsedRes.data.response_url);
      const videoUrlCheck = normalizeReturnedSafeUrl(parsedRes.data.video?.url);

      if (!statusUrlCheck.valid || !responseUrlCheck.valid || !videoUrlCheck.valid) {
        return envelopeError(
          502,
          'KLING_FAL_UNSAFE_RESPONSE_URL',
          'El proveedor devolvió una URL de medios o estado no segura (bloqueada por anti-SSRF).',
          knownSecrets,
        );
      }

      const receipt: VideoJobReceipt = {
        provider: 'fal',
        endpoint,
        operation: input.operation,
        requestId: parsedRes.data.request_id,
        status: mapVideoStatus(parsedRes.data.status),
        statusUrl: statusUrlCheck.url,
        responseUrl: responseUrlCheck.url,
        videoUrl: videoUrlCheck.url,
        submittedAt: nowFn().toISOString(),
      };

      return envelopeOk(receipt, {
        adapterId: KLING_FAL_ADAPTER_ID,
        provider: 'fal',
        operation: input.operation,
        requestId: receipt.requestId,
        status: receipt.status,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const code =
        err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AdapterTimeoutError')
          ? 'FAL_TIMEOUT'
          : 'FAL_TRANSPORT_ERROR';
      return envelopeError(502, code, msg, knownSecrets);
    }
  }

  // Proveedor directo Kling O1
  if (!baseCheck.ok) {
    return envelopeError(400, 'KLING_INVALID_BASE_URL', baseCheck.reason);
  }
  const directEndpoint = buildKlingDirectEndpoint(baseCheck.url, input.operation);
  const jwt = signKlingJwt(klingAccess, klingSecret, nowFn());
  const allSecrets = [...knownSecrets, jwt];

  try {
    const response = await transport.send({
      url: directEndpoint,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        model_name: 'kling-o1',
        prompt: input.prompt,
        duration: input.durationSeconds,
        aspect_ratio: input.aspectRatio,
        ...(input.imageUrl ? { image: input.imageUrl } : {}),
        ...(input.videoUrl ? { video_url: input.videoUrl } : {}),
        ...(input.referenceImageUrls ? { image_list: input.referenceImageUrls } : {}),
      }),
      signal: effectiveAdapterSignal(options.deadline, nowFn, ADAPTER_TIMEOUT_MS),
    });

    if (response.status === 401 || response.status === 403) {
      return envelopeError(
        403,
        'KLING_UNAUTHORIZED',
        `Kling API rechazó la credencial (HTTP ${response.status}).`,
        allSecrets,
      );
    }
    if (response.status < 200 || response.status >= 300) {
      return envelopeError(
        502,
        'KLING_UPSTREAM_ERROR',
        `Kling API devolvió HTTP ${response.status}: ${response.text}`,
        allSecrets,
      );
    }

    const rawJson = JSON.parse(response.text) as unknown;
    const parsedRes = parseStrictWithSchema(klingDirectResponseSchema, rawJson);
    if (!parsedRes.ok || parsedRes.data.code !== 0 || !parsedRes.data.data) {
      const errDetail = parsedRes.ok
        ? parsedRes.data.message ?? `code=${parsedRes.data.code}`
        : parsedRes.error;
      return envelopeError(
        502,
        'KLING_INVALID_PAYLOAD',
        `Respuesta de Kling API inválida: ${errDetail}`,
        allSecrets,
      );
    }

    const firstVideoRaw = parsedRes.data.data.task_result?.videos?.[0]?.url;
    const videoUrlCheck = normalizeReturnedSafeUrl(firstVideoRaw);
    if (!videoUrlCheck.valid) {
      return envelopeError(
        502,
        'KLING_FAL_UNSAFE_RESPONSE_URL',
        'Kling API devolvió una URL de vídeo no segura (bloqueada por anti-SSRF).',
        allSecrets,
      );
    }

    const receipt: VideoJobReceipt = {
      provider: 'kling-direct',
      endpoint: directEndpoint,
      operation: input.operation,
      requestId: parsedRes.data.data.task_id,
      status: mapVideoStatus(parsedRes.data.data.task_status),
      statusUrl: null,
      responseUrl: null,
      videoUrl: videoUrlCheck.url,
      submittedAt: nowFn().toISOString(),
    };

    return envelopeOk(receipt, {
      adapterId: KLING_FAL_ADAPTER_ID,
      provider: 'kling-direct',
      operation: input.operation,
      requestId: receipt.requestId,
      status: receipt.status,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const code =
      err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AdapterTimeoutError')
        ? 'KLING_TIMEOUT'
        : 'KLING_TRANSPORT_ERROR';
    return envelopeError(502, code, msg, allSecrets);
  }
}
