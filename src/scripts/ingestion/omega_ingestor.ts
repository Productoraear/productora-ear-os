import { PrismaClient, Rank, Role, MilestoneCategory } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 INICIANDO OMNI-STITCH INGESTOR — V120');
  console.log('🎯 Objetivo: Materializar el Paciente Cero (Edwin Agudelo)');

  // 1. Crear/Actualizar el Usuario Soberano (Paciente Cero)
  const user = await prisma.user.upsert({
    where: { id: 'edwin-agudelo-soberano' }, // ID Fijo para trazabilidad
    update: {
      role: Role.ADMIN,
      rank: Rank.NIVEL_1_ARQUITECTO,
      xp: 850,
      isPacienteCero: true,
    },
    create: {
      id: 'edwin-agudelo-soberano',
      role: Role.ADMIN,
      rank: Rank.NIVEL_1_ARQUITECTO,
      xp: 850,
      isPacienteCero: true,
      affiliateCode: 'EDWIN_EAR_GOLD',
    },
  });

  console.log(`✅ Usuario Soberano: ${user.id} [Rank: ${user.rank}]`);

  // 2. Inyectar Hitos de Carrera (Basado en el Dashboard de Soberanía)
  const milestones = [
    { title: 'Ikigai Musical', category: MilestoneCategory.IKIGAI, impactScore: 95, description: 'Propósito y razón de ser en la industria.' },
    { title: 'Pitch & Presentation', category: MilestoneCategory.PITCH, impactScore: 90, description: 'Venta de proyecto y comunicación efectiva.' },
    { title: 'Metrics & Analysis', category: MilestoneCategory.METRICS, impactScore: 85, description: 'Soberanía de datos y audiencias.' },
    { title: 'Aspectos Legales', category: MilestoneCategory.LEGAL, impactScore: 100, description: 'Contratos, derechos y propiedad intelectual.' },
    { title: 'Ruta de Touring', category: MilestoneCategory.TOURING, impactScore: 80, description: 'Logística y expansión territorial.' },
    { title: 'Legado & Patrimonio', category: MilestoneCategory.LEGADO, impactScore: 98, description: 'Impacto a largo plazo y sostenibilidad.' },
  ];

  for (const m of milestones) {
    await prisma.careerMilestone.create({
      data: {
        userId: user.id,
        title: m.title,
        category: m.category,
        impactScore: m.impactScore,
        description: m.description,
        isCompleted: true,
      },
    });
  }
  console.log('✅ Hitos de Carrera inyectados.');

  // 3. Inyectar Activos Digitales y Bóveda Legal (Basado en AssetAnalytics y LegalShield)
  const assets = [
    { name: 'Metodología 61 Días', type: 'IP_RIGHTS', roiCurrent: 25000, roiProjected: 150000 },
    { name: 'Catálogo Musical EAR', type: 'AUDIO', roiCurrent: 12000, roiProjected: 85000 },
    { name: 'VIMUME Neural Engine', type: 'TOKEN', roiCurrent: 50000, roiProjected: 25000000 }, // 25M$ Proyectado
  ];

  for (const a of assets) {
    const digitalAsset = await prisma.digitalAsset.create({
      data: {
        userId: user.id,
        name: a.name,
        type: a.type,
        roiCurrent: a.roiCurrent,
        roiProjected: a.roiProjected,
        performanceScore: 9.5,
      },
    });

    // Crear Bóveda Legal para cada activo
    await prisma.legalVault.create({
      data: {
        assetId: digitalAsset.id,
        encryptionHash: `SHA256-${Math.random().toString(36).substring(7)}`,
        ipfsPointer: `ipfs://Qm${Math.random().toString(36).substring(7)}`,
        contractType: 'SMART_CONTRACT',
        legalStatus: 'PROTECTED',
      },
    });
  }

  console.log('✅ Activos Digitales y Bóvedas Legales sincronizados.');

  // 4. Inicializar Aura Wallet
  await prisma.auraWallet.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      balanceSettled: 12500.50,
      balancePending: 45000.00,
      totalGenerated: 57500.50,
    },
  });

  console.log('✅ Aura Wallet inicializada con Gravedad Financiera.');
  console.log('🏁 CASCADA OMNI-STITCH COMPLETADA CON ÉXITO.');
}

main()
  .catch((e) => {
    console.error('❌ ERROR CRÍTICO EN LA INGESTIÓN:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
