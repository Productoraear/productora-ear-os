/**
 * EAR OS — Rate Limit Guard (token-bucket en memoria)
 * ---------------------------------------------------
 * Protege endpoints sensibles de IA frente a abuso por IP.
 * Límite: 20 peticiones/minuto por IP.
 *
 * Nota: en serverless el estado es efímero (por instancia). Para
 * producción multi-instancia se debe sustituir por un almacén
 * compartido (Upstash Redis / Firestore). Sirve como primera barrera
 * de contención de coste contra ráfagas y scraping.
 */

type Bucket = {
  tokens: number;
  updatedAt: number;
};

type GuardResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

const MAX_REQUESTS = 20;
const WINDOW_MS = 60_000;
const REFILL_INTERVAL_MS = WINDOW_MS / MAX_REQUESTS;

const buckets = new Map<string, Bucket>();

function normalizeIp(ip: string | null | undefined): string {
  if (!ip) return "unknown";
  // IPv6-mapped IPv4 (::ffff:127.0.0.1) -> conservar el prefijo para evitar
  // colisiones entre representaciones del mismo cliente.
  return ip.replace(/^::ffff:/i, "");
}

function refill(bucket: Bucket, now: number): Bucket {
  const elapsed = now - bucket.updatedAt;
  if (elapsed <= 0) return bucket;

  const tokensToAdd = Math.floor(elapsed / REFILL_INTERVAL_MS);
  if (tokensToAdd <= 0) {
    return { ...bucket, updatedAt: now };
  }

  return {
    tokens: Math.min(MAX_REQUESTS, bucket.tokens + tokensToAdd),
    updatedAt: now,
  };
}

/**
 * Comprueba y consume un token para una IP determinada.
 * Devuelve el veredicto junto a datos para informar al cliente.
 */
export function consumeRateLimit(ip: string | null | undefined): GuardResult {
  const now = Date.now();
  const key = normalizeIp(ip);

  const existing = buckets.get(key);
  let bucket: Bucket;

  if (!existing) {
    bucket = { tokens: MAX_REQUESTS, updatedAt: now };
  } else {
    bucket = refill(existing, now);
  }

  if (bucket.tokens <= 0) {
    const retryAfterMs = Math.max(
      0,
      bucket.updatedAt + REFILL_INTERVAL_MS - now,
    );
    buckets.set(key, bucket);
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  bucket = { tokens: bucket.tokens - 1, updatedAt: now };
  buckets.set(key, bucket);

  // Purga ligera para evitar crecimiento descontrolado en instancias
  // de larga duración (memoria acotada).
  if (buckets.size > 10_000) {
    const cutoff = now - WINDOW_MS * 2;
    for (const [k, b] of buckets) {
      if (b.updatedAt < cutoff) {
        buckets.delete(k);
      }
    }
  }

  return {
    allowed: true,
    remaining: bucket.tokens,
    retryAfterMs: 0,
  };
}

/**
 * Devuelve métricas del guard sin consumir tokens. Útil para
 * telemetría y auditoría del panel /admin.
 */
export function getRateLimitStats() {
  let activeBuckets = 0;
  let totalTokens = 0;

  for (const bucket of buckets.values()) {
    if (bucket.tokens > 0 || Date.now() - bucket.updatedAt < WINDOW_MS) {
      activeBuckets += 1;
      totalTokens += bucket.tokens;
    }
  }

  return {
    trackedIps: buckets.size,
    activeBuckets,
    totalTokens,
    maxRequestsPerMinute: MAX_REQUESTS,
  };
}