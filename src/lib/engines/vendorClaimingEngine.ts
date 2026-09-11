import { prisma } from '@/lib/prisma';

export class VendorClaimingEngine {
  /**
   * BALA DE PLATA 4: VENDOR CLAIMING PATTERN
   * Unifica el perfil sombra con la nueva cuenta registrada.
   * Evita colisiones a largo plazo centralizando la facturación y contratos.
   */
  public static async claimProfile(userId: string, claimToken: string) {
    // Transacción ACID para asegurar que o se hace todo o nada
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Encontrar el perfil sombra
      const shadowProfile = await tx.vendorShadowProfile.findUnique({
        where: { claimToken }
      });

      if (!shadowProfile) {
        throw new Error('Token de reclamación inválido o perfil no encontrado.');
      }

      if (shadowProfile.status !== 'GHOST_UNCLAIMED') {
        throw new Error('Este perfil ya ha sido reclamado.');
      }

      // 2. Verificar si el usuario ya tiene un ProviderProfile
      let providerProfile = await tx.providerProfile.findUnique({
        where: { userId }
      });

      // Si no tiene, se lo creamos fusionando los datos del sombra
      if (!providerProfile) {
        providerProfile = await tx.providerProfile.create({
          data: {
            userId,
            slug: shadowProfile.shaHash.substring(0, 8),
            name: shadowProfile.name,
            companyName: shadowProfile.name,
            category: shadowProfile.category as any, // Cuidado con el enum casting
            province: shadowProfile.province,
            phone: shadowProfile.telephone,
            description: shadowProfile.description,
            rating: shadowProfile.rating || 5.0,
            reviewsCount: shadowProfile.reviewsCount || 0,
            status: 'ACTIVE_VERIFIED',
            isVerified: true,
            claimedAt: new Date(),
          }
        });
      } else {
        // Si ya tenía perfil (por un registro anómalo), lo actualizamos y verificamos
        providerProfile = await tx.providerProfile.update({
          where: { id: providerProfile.id },
          data: {
            isVerified: true,
            status: 'ACTIVE_VERIFIED',
            claimedAt: new Date(),
          }
        });
      }

      // 3. Migrar historial (Contratos, SmartLocks, etc.)
      // (Aquí iría la lógica para migrar otros registros si en la BD se enlazaran al ShadowProfile.
      // Por ahora, como shadowProfile no tiene relaciones fuertes en Prisma Schema aparte de sí mismo,
      // el acto de crear/actualizar el providerProfile con sus datos es suficiente.)

      // 4. Soft-delete del ShadowProfile marcando claimedById
      await tx.vendorShadowProfile.update({
        where: { id: shadowProfile.id },
        data: {
          status: 'VERIFIED_ACTIVE',
          claimedById: providerProfile.id,
        }
      });

      return providerProfile;
    });

    return {
      success: true,
      providerId: result.id,
      message: 'Perfil reclamado y fusionado exitosamente.'
    };
  }
}
