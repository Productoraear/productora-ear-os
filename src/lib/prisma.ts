import { PrismaClient } from '@prisma/client';

// Patrón Singleton Serverless optimizado para Vercel Edge & Lambdas
// Evita la saturación del pool de conexiones en contenedores reciclados
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

// Persistir en globalThis en TODOS los entornos para reutilizar la conexión en Vercel
globalForPrisma.prisma = prisma;

export default prisma;
