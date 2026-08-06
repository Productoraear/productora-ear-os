import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export class UserService {
  /**
   * 🏛️ S-CLASS USER PROFILE FETCHER
   * Obtiene o crea el perfil del usuario en la base de datos centralizada.
   */
  static async getOrCreateProfile(id: string, email: string) {
    try {
      let user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        console.log(`🆕 [USER_SERVICE] Creando nuevo perfil S-Class para ${email}`);
        user = await prisma.user.create({
          data: {
            id,
            email,
            role: 'EXPLORADOR',
            rank: 'NIVEL_0_EXPLORADOR',
            isPacienteCero: false,
          },
        });
      }

      return user;
    } catch (error) {
      console.error('🛑 [USER_SERVICE] Fallo crítico al sincronizar perfil:', error);
      return null;
    }
  }

  /**
   * 🛡️ RBAC AUTHORITY CHECK
   * Verifica si el usuario tiene un rol específico o superior.
   */
  static async hasRole(id: string, requiredRole: Role): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user) return false;

    const roleHierarchy: Record<Role, number> = {
      EXPLORADOR: 0,
      CLIENT: 1,
      AFFILIATE: 2,
      ARTIST: 3,
      PROVIDER: 4,
      ARQUITECTO: 5,
      OPERADOR: 6,
      FLEET_OPERATOR: 7,
      ADMIN: 8,
      COMMANDER: 9,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }
}
