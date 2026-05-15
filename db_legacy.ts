import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  ragDocuments, artists, vimumePatients,
  skillsRegistry, astraSessions, telemetryEvents, knowledgeNuggets,
  type RagDocument, type Artist, type VimumePacient,
  type SkillEntry, type AstraSession, type TelemetryEvent, type KnowledgeNugget,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach((field) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  });
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── RAG Documents ────────────────────────────────────────────────────────────
export async function getRagDocumentsByIndex(indexName: RagDocument["indexName"]) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ragDocuments).where(eq(ragDocuments.indexName, indexName));
}

export async function insertRagDocument(doc: Omit<RagDocument, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  await db.insert(ragDocuments).values(doc);
}

export async function getRagStats() {
  const db = await getDb();
  if (!db) return { total: 0, byIndex: {} };
  const rows = await db.select({
    indexName: ragDocuments.indexName,
    count: sql<number>`count(*)`,
  }).from(ragDocuments).groupBy(ragDocuments.indexName);
  const byIndex: Record<string, number> = {};
  let total = 0;
  rows.forEach((r) => { byIndex[r.indexName] = Number(r.count); total += Number(r.count); });
  return { total, byIndex };
}

// ─── Artists ──────────────────────────────────────────────────────────────────
export async function getArtists() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(artists).where(eq(artists.isActive, true)).orderBy(desc(artists.totalScore));
}

export async function upsertArtist(data: Omit<Artist, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) return;
  const total = data.scoreMusica + data.scoreLogistica + data.scoreEstetica + data.scoreEquipo + data.scorePresencia;
  let label = "NO APTO";
  if (total >= 45) label = "S-CLASS ELITE";
  else if (total >= 35) label = "PREMIUM EAR";
  else if (total >= 25) label = "PROFESIONAL";
  else if (total >= 18) label = "ESTÁNDAR ACEPTABLE";
  await db.insert(artists).values({ ...data, totalScore: total, sclassLabel: label });
}

export async function updateArtistScores(id: number, scores: {
  scoreMusica: number; scoreLogistica: number; scoreEstetica: number;
  scoreEquipo: number; scorePresencia: number;
}) {
  const db = await getDb();
  if (!db) return;
  const total = scores.scoreMusica + scores.scoreLogistica + scores.scoreEstetica + scores.scoreEquipo + scores.scorePresencia;
  let label = "NO APTO";
  if (total >= 45) label = "S-CLASS ELITE";
  else if (total >= 35) label = "PREMIUM EAR";
  else if (total >= 25) label = "PROFESIONAL";
  else if (total >= 18) label = "ESTÁNDAR ACEPTABLE";
  await db.update(artists).set({ ...scores, totalScore: total, sclassLabel: label }).where(eq(artists.id, id));
}

// ─── VIMUME Patients ──────────────────────────────────────────────────────────
export async function getVimumePacients() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vimumePatients).orderBy(desc(vimumePatients.createdAt));
}

export async function insertVimumePacient(data: Omit<VimumePacient, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) return;
  await db.insert(vimumePatients).values(data);
}

export async function assignArtistToPatient(patientId: number, artistId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(vimumePatients).set({ assignedArtistId: artistId }).where(eq(vimumePatients.id, patientId));
}

// ─── Skills Registry ──────────────────────────────────────────────────────────
export async function getSkillsMetadata() {
  const db = await getDb();
  if (!db) return [];
  // Level 1: return metadata only (no fullContent)
  return db.select({
    id: skillsRegistry.id,
    slug: skillsRegistry.slug,
    name: skillsRegistry.name,
    description: skillsRegistry.description,
    metadataVersion: skillsRegistry.metadataVersion,
    metadataTags: skillsRegistry.metadataTags,
    isLoaded: skillsRegistry.isLoaded,
    leverage: skillsRegistry.leverage,
    category: skillsRegistry.category,
    createdAt: skillsRegistry.createdAt,
  }).from(skillsRegistry).orderBy(skillsRegistry.leverage, skillsRegistry.name);
}

export async function getSkillFullContent(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(skillsRegistry).where(eq(skillsRegistry.slug, slug)).limit(1);
  return result[0] ?? null;
}

export async function upsertSkill(data: Omit<SkillEntry, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  await db.insert(skillsRegistry).values(data).onDuplicateKeyUpdate({ set: { ...data } });
}

// ─── Astra Sessions ───────────────────────────────────────────────────────────
export async function createAstraSession(data: Omit<AstraSession, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(astraSessions).values(data);
  return result;
}

export async function getAstraSessions(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(astraSessions).orderBy(desc(astraSessions.createdAt)).limit(limit);
}

export async function getAstraSessionCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(astraSessions);
  return Number(result[0]?.count ?? 0);
}

// ─── Telemetry ────────────────────────────────────────────────────────────────
export async function logTelemetry(data: Omit<TelemetryEvent, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  await db.insert(telemetryEvents).values(data);
}

export async function getTelemetryStats() {
  const db = await getDb();
  if (!db) return { totalEvents: 0, totalTokens: 0, cacheHitRate: 0, avgLatency: 0 };
  const rows = await db.select({
    totalEvents: sql<number>`count(*)`,
    totalTokens: sql<number>`coalesce(sum(tokensConsumed), 0)`,
    cacheHits: sql<number>`sum(case when cacheHit = 1 then 1 else 0 end)`,
    avgLatency: sql<number>`coalesce(avg(durationMs), 0)`,
  }).from(telemetryEvents);
  const r = rows[0];
  const totalEvents = Number(r?.totalEvents ?? 0);
  const cacheHits = Number(r?.cacheHits ?? 0);
  return {
    totalEvents,
    totalTokens: Number(r?.totalTokens ?? 0),
    cacheHitRate: totalEvents > 0 ? Math.round((cacheHits / totalEvents) * 100) : 0,
    avgLatency: Math.round(Number(r?.avgLatency ?? 0)),
  };
}

// ─── Knowledge Nuggets ────────────────────────────────────────────────────────
export async function getKnowledgeNuggets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(knowledgeNuggets).orderBy(knowledgeNuggets.priority, desc(knowledgeNuggets.createdAt));
}

export async function insertNugget(data: Omit<KnowledgeNugget, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  await db.insert(knowledgeNuggets).values(data);
}

export async function getNuggetCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(knowledgeNuggets);
  return Number(result[0]?.count ?? 0);
}
