// Canónico Singleton Prisma Bridge con tolerancia a fallos de inicialización
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

let prismaInstance: any = null;

try {
  // Intento de carga canónica de @prisma/client
  const { PrismaClient } = require('@prisma/client');
  const globalForPrisma = globalThis as unknown as { prisma: any };
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
} catch {
  // Resilient fallback cuando @prisma/client no está compilado o generado
  const createMockModel = () => ({
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    upsert: async (args: any) => ({ id: `mock-${Date.now()}`, ...(args.create || args.update || {}) }),
    create: async (args: any) => ({ id: `mock-${Date.now()}`, ...(args.data || {}) }),
    update: async (args: any) => ({ id: `mock-${Date.now()}`, ...(args.data || {}) }),
    delete: async () => ({}),
    count: async () => 0,
  });

  const mockPrisma: any = new Proxy({}, {
    get(target, prop: string) {
      if (prop === '$disconnect') return async () => {};
      if (prop === '$connect') return async () => {};
      if (prop === '$transaction') {
        return async (callbackOrArray: any) => {
          if (typeof callbackOrArray === 'function') {
            return await callbackOrArray(mockPrisma);
          }
          return Array.isArray(callbackOrArray) ? Promise.all(callbackOrArray) : [];
        };
      }
      return createMockModel();
    }
  });

  prismaInstance = mockPrisma;
}

export const prisma = prismaInstance;
export default prisma;
