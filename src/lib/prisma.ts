import { PrismaClient } from "@prisma/client";

/**
 * 🏛️ EAR OS GOLD - PRISMA CLIENT SINGLETON
 * Garantiza una única instancia de conexión para evitar el agotamiento del pool de conexiones en desarrollo.
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
