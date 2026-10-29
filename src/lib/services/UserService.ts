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
   * ============================================================================
   * Verifica si el usuario tiene un rol específico o superior.
   *
   * BLINDAJE P0 (W41_T02): el JWT de Firebase entrega el UID de Firebase, NO el
   * `User.id` interno de PostgreSQL. El lookup DEBE resolver por ambos cauces
   * (`id` OR `firebaseUid`) o todo admin real cae en 403 permanente.
   * ============================================================================
   */
  static async hasRole(id: string, requiredRole: Role): Promise<boolean> {
    if (!id) return false;

    const user = await prisma.user.findFirst({
      where: { OR: [{ id }, { firebaseUid: id }] },
      select: { role: true },
    });

    if (!user) return false;

    const roleHierarchy: Record<Role, number> = {
      USER: 0,
      EXPLORADOR: 0,
      CLIENT: 1,
      AFFILIATE: 2,
      ARTIST: 3,
      PROVIDER: 4,
      ARQUITECTO: 5,
      THERAPIST: 6,
      OPERADOR: 6,
      FLEET_OPERATOR: 7,
      ADMIN: 8,
      COMMANDER: 9,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }
}
