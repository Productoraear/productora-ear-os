import { PrismaClient, Role, WaybillStatus, VendorCategory, ClaimStatus, CommissionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Poblando base de datos PostgreSQL con grafo maestro de datos de EAR OS...');

  // 1. Usuario Artista Principal (Edwin Agudelo)
  const artistUser = await prisma.user.upsert({
    where: { email: 'edwin@productoraear.com' },
    update: {
      name: 'Edwin Agudelo',
      displayName: 'Edwin Agudelo',
      role: Role.ARTIST,
      rank: 'S-Class Principal'
    },
    create: {
      id: 'usr-sovereign-01',
      email: 'edwin@productoraear.com',
      name: 'Edwin Agudelo',
      displayName: 'Edwin Agudelo',
      role: Role.ARTIST,
      rank: 'S-Class Principal'
    }
  });
  console.log('  ✔ Usuario Artista verificado:', artistUser.email);

  // 2. Perfil Artístico
  const artistProfile = await prisma.artistProfile.upsert({
    where: { userId: artistUser.id },
    update: {
      displayName: 'Edwin Agudelo',
      stageName: 'Edwin Agudelo Tenor',
      bio: 'Tenor Lírico y Director Artístico de Productora EAR. 100% valoraciones 5.0 en Bodas.net.',
      status: 'PUBLISHED',
      genres: ['Mariachi de Gala', 'Música Sacra', 'Pop Lírico', 'Boleros']
    },
    create: {
      id: 'ap-sovereign-01',
      userId: artistUser.id,
      slug: 'edwin-agudelo',
      stageName: 'Edwin Agudelo Tenor',
      displayName: 'Edwin Agudelo',
      bio: 'Tenor Lírico y Director Artístico de Productora EAR. 100% valoraciones 5.0 en Bodas.net.',
      status: 'PUBLISHED',
      genres: ['Mariachi de Gala', 'Música Sacra', 'Pop Lírico', 'Boleros']
    }
  });
  console.log('  ✔ Perfil Artístico verificado:', artistProfile.stageName);

  // 3. Aura Wallet del Artista
  const wallet = await prisma.auraWallet.upsert({
    where: { userId: artistUser.id },
    update: {
      balance: 15450.0,
      currency: 'EUR',
      walletAddress: '0xEAR_AURA_SOVEREIGN_MASTER'
    },
    create: {
      id: 'wal-sovereign-01',
      userId: artistUser.id,
      balance: 15450.0,
      currency: 'EUR',
      walletAddress: '0xEAR_AURA_SOVEREIGN_MASTER'
    }
  });
  console.log('  ✔ Aura Wallet verificada. Balance:', wallet.balance, wallet.currency);

  // 4. Perfil de Proveedor Soberano (Productora EAR Sovereign)
  const provider = await prisma.providerProfile.upsert({
    where: { slug: 'productora-ear-sovereign' },
    update: {
      name: 'Productora EAR Sovereign',
      companyName: 'Productora EAR S.L.',
      category: VendorCategory.FINCA_ALQUILER,
      city: 'Madrid',
      location: 'Madrid & Toledo',
      phone: '+34693693048',
      email: 'hola@productoraear.com',
      isVerified: true,
      claimStatus: ClaimStatus.VERIFIED_ACTIVE,
      roiGuaranteeScore: 9.8,
      roiProjected: 3.5
    },
    create: {
      id: 'pv-sovereign-01',
      slug: 'productora-ear-sovereign',
      name: 'Productora EAR Sovereign',
      companyName: 'Productora EAR S.L.',
      category: VendorCategory.FINCA_ALQUILER,
      city: 'Madrid',
      location: 'Madrid & Toledo',
      phone: '+34693693048',
      email: 'hola@productoraear.com',
      isVerified: true,
      claimStatus: ClaimStatus.VERIFIED_ACTIVE,
      roiGuaranteeScore: 9.8,
      roiProjected: 3.5
    }
  });
  console.log('  ✔ Perfil Proveedor verificado:', provider.name);

  // 5. Usuario y Perfil de Cliente Demostración
  const clientUser = await prisma.user.upsert({
    where: { email: 'contacto@bodaspremiummadrid.es' },
    update: {
      name: 'Bodas Premium Madrid',
      displayName: 'Bodas Premium Madrid',
      role: Role.CLIENT
    },
    create: {
      id: 'usr-client-01',
      email: 'contacto@bodaspremiummadrid.es',
      name: 'Bodas Premium Madrid',
      displayName: 'Bodas Premium Madrid',
      role: Role.CLIENT
    }
  });

  const clientProfile = await prisma.clientProfile.upsert({
    where: { userId: clientUser.id },
    update: {
      companyName: 'Bodas Premium Madrid'
    },
    create: {
      id: 'cp-demo-01',
      userId: clientUser.id,
      companyName: 'Bodas Premium Madrid'
    }
  });
  console.log('  ✔ Perfil Cliente verificado:', clientProfile.companyName);

  // 6. Hoja de Ruta / Waybill S-Class (Relacionada con Artista, Proveedor y Cliente)
  const waybill = await prisma.waybill.upsert({
    where: { id: 'wb-demo-01' },
    update: {
      referenceCode: 'EAR-2026-001',
      status: WaybillStatus.COMPLETED,
      originLabel: 'Estudio Méntrida',
      destinationLabel: 'Escorial Park',
      distanceMeters: 45000,
      notes: 'Sonorización Bose F1 2.000W, Shure Axient Digital y protocolo de gala 12 W/pax.',
      artistProfileId: artistProfile.id,
      providerProfileId: provider.id,
      clientProfileId: clientProfile.id
    },
    create: {
      id: 'wb-demo-01',
      referenceCode: 'EAR-2026-001',
      status: WaybillStatus.COMPLETED,
      originLabel: 'Estudio Méntrida',
      destinationLabel: 'Escorial Park',
      distanceMeters: 45000,
      notes: 'Sonorización Bose F1 2.000W, Shure Axient Digital y protocolo de gala 12 W/pax.',
      artistProfileId: artistProfile.id,
      providerProfileId: provider.id,
      clientProfileId: clientProfile.id
    }
  });
  console.log('  ✔ Waybill creada/verificada:', waybill.referenceCode, `[${waybill.status}]`);

  // 7. Registro de Comisión en Ledger (Split 80/10/10)
  const ledger = await prisma.commissionLedger.upsert({
    where: { id: 'cl-demo-01' },
    update: {
      amount: 350.0,
      currency: 'EUR',
      status: CommissionStatus.PAID,
      reference: 'REF-BODAS-2026-001',
      sourceEvent: 'Boda de Gala El Escorial',
      notes: 'Split Soberano: 80% Artista (280€) / 10% EAR OS (35€) / 10% VIMUME (35€)'
    },
    create: {
      id: 'cl-demo-01',
      userId: artistUser.id,
      amount: 350.0,
      currency: 'EUR',
      status: CommissionStatus.PAID,
      reference: 'REF-BODAS-2026-001',
      sourceEvent: 'Boda de Gala El Escorial',
      notes: 'Split Soberano: 80% Artista (280€) / 10% EAR OS (35€) / 10% VIMUME (35€)'
    }
  });
  console.log('  ✔ Asiento en CommissionLedger verificado:', ledger.reference, `(${ledger.amount} €)`);

  console.log('✅ Poblamiento relacional S-Class completado con éxito (0 violaciones de FK).');
}

main()
  .catch((e) => {
    console.error('❌ Error crítico en el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
