import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  float,
  json,
  boolean,
} from "drizzle-orm/mysql-core";

// ─── Core Auth ────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// ─── RAG Documents ────────────────────────────────────────────────────────────
export const ragDocuments = mysqlTable("rag_documents", {
  id: int("id").autoincrement().primaryKey(),
  indexName: mysqlEnum("indexName", ["RAG_EVENTOS", "RAG_VIMUME", "RAG_ARTISTAS", "RAG_SKILLS"]).notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  content: text("content").notNull(),
  // Serialized token array for TF-IDF similarity (JSON array of strings)
  tokens: text("tokens"),
  metadata: json("metadata"),
  source: varchar("source", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Artists S-Class ──────────────────────────────────────────────────────────
export const artists = mysqlTable("artists", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  genre: varchar("genre", { length: 128 }),
  bio: text("bio"),
  imageUrl: text("imageUrl"),
  // S-Class Metrics (0-10 each, max 50)
  scoreMusica: float("scoreMusica").default(0).notNull(),
  scoreLogistica: float("scoreLogistica").default(0).notNull(),
  scoreEstetica: float("scoreEstetica").default(0).notNull(),
  scoreEquipo: float("scoreEquipo").default(0).notNull(),
  scorePresencia: float("scorePresencia").default(0).notNull(),
  // Computed label: S-CLASS ELITE | PREMIUM EAR | PROFESIONAL | ESTÁNDAR | NO APTO
  sclassLabel: varchar("sclassLabel", { length: 64 }),
  totalScore: float("totalScore").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── VIMUME Patients ──────────────────────────────────────────────────────────
export const vimumePatients = mysqlTable("vimume_patients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  condition: varchar("condition", { length: 256 }).notNull(),
  // JSON array of musical preferences
  musicalPreferences: json("musicalPreferences"),
  sensitivityLevel: int("sensitivityLevel").default(5).notNull(), // 1-10
  therapyType: mysqlEnum("therapyType", ["RELAXATION", "COGNITIVE", "MOTOR_SKILLS"]).default("RELAXATION").notNull(),
  notes: text("notes"),
  assignedArtistId: int("assignedArtistId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Skills Registry (marketingskills-main) ───────────────────────────────────
export const skillsRegistry = mysqlTable("skills_registry", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  // Level 1: metadata only (loaded always)
  metadataVersion: varchar("metadataVersion", { length: 32 }),
  metadataTags: json("metadataTags"),
  // Level 2-3: full content (loaded on demand)
  fullContent: text("fullContent"),
  isLoaded: boolean("isLoaded").default(false).notNull(),
  leverage: mysqlEnum("leverage", ["HIGH", "MEDIUM", "LOW"]).default("MEDIUM").notNull(),
  category: varchar("category", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Astra Sessions ───────────────────────────────────────────────────────────
export const astraSessions = mysqlTable("astra_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  title: varchar("title", { length: 512 }),
  // JSON array of {role, content} messages
  messages: json("messages"),
  ragContext: text("ragContext"),
  tokensUsed: int("tokensUsed").default(0).notNull(),
  cacheHit: boolean("cacheHit").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Telemetry Events ─────────────────────────────────────────────────────────
export const telemetryEvents = mysqlTable("telemetry_events", {
  id: int("id").autoincrement().primaryKey(),
  eventType: varchar("eventType", { length: 128 }).notNull(),
  context: varchar("context", { length: 256 }),
  level: mysqlEnum("level", ["INFO", "WARNING", "CRITICAL"]).default("INFO").notNull(),
  durationMs: int("durationMs"),
  tokensConsumed: int("tokensConsumed"),
  cacheHit: boolean("cacheHit").default(false).notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Knowledge Nuggets ────────────────────────────────────────────────────────
export const knowledgeNuggets = mysqlTable("knowledge_nuggets", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 128 }).notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  insight: text("insight").notNull(),
  source: varchar("source", { length: 256 }),
  priority: mysqlEnum("priority", ["GOLD", "SILVER", "BRONZE"]).default("SILVER").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type RagDocument = typeof ragDocuments.$inferSelect;
export type Artist = typeof artists.$inferSelect;
export type VimumePacient = typeof vimumePatients.$inferSelect;
export type SkillEntry = typeof skillsRegistry.$inferSelect;
export type AstraSession = typeof astraSessions.$inferSelect;
export type TelemetryEvent = typeof telemetryEvents.$inferSelect;
export type KnowledgeNugget = typeof knowledgeNuggets.$inferSelect;
