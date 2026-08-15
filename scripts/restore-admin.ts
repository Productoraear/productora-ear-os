import { adminAuth } from '@/lib/firebaseAdmin';
import { prisma } from '@/lib/prisma';
import dotenv from 'dotenv';
import fs from 'fs';

// Cargar variables de entorno
if (fs.existsSync('.env.production.local')) dotenv.config({ path: '.env.production.local' });
if (fs.existsSync('.env.local')) dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

if (!process.env.POSTGRES_PRISMA_URL && process.env.DATABASE_URL) {
  process.env.POSTGRES_PRISMA_URL = process.env.DATABASE_URL;
}
if (!process.env.POSTGRES_URL_NON_POOLING && process.env.DATABASE_URL) {
  process.env.POSTGRES_URL_NON_POOLING = process.env.DATABASE_URL;
}
if (!process.env.FIREBASE_ADMIN_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  process.env.FIREBASE_ADMIN_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

/**
 * 👑 SCRIPT DE RESTAURACIÓN DE ADMINISTRADOR ÚNICO (EAR OS V2)
 * Inyecta Custom Claims de Superadmin en Firebase Auth y eleva el registro en PostgreSQL (Prisma).
 */
export async function restoreSingleAdmin(adminEmail: string, adminUid?: string) {
  console.log(`👑 [RESTORING ADMIN] Iniciando protocolo de elevación de privilegios para: ${adminEmail}`);

  let targetUid = adminUid;

  // 1. Si no tenemos UID, buscar o crear en Firebase Auth
  try {
    if (!targetUid) {
      try {
        const userRecord = await adminAuth.getUserByEmail(adminEmail);
        targetUid = userRecord.uid;
      } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
          console.log(`ℹ️ Usuario no encontrado en Firebase Auth. Creando usuario admin...`);
          const newUser = await adminAuth.createUser({
            email: adminEmail,
            emailVerified: true,
            displayName: 'Comandante EAR OS',
          });
          targetUid = newUser.uid;
        } else {
          throw err;
        }
      }
    }

    // 2. Asignar Custom Claims de seguridad a nivel de Token Auth
    await adminAuth.setCustomUserClaims(targetUid, {
      role: 'superadmin',
      admin: true,
      singleAdmin: true,
      accessLevel: 100,
    });
    console.log(`✅ [FIREBASE AUTH] Custom Claims inyectados (role: superadmin, accessLevel: 100) en UID: ${targetUid}`);

  } catch (authError: any) {
    console.warn(`⚠️ [FIREBASE ADMIN WARNING]:`, authError.message || authError);
  }

  // 3. Sincronizar y forzar rol en PostgreSQL / Prisma
  try {
    const user = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        role: 'ADMIN',
        name: 'Comandante EAR OS',
        displayName: 'Administrador Único',
      },
      create: {
        email: adminEmail,
        role: 'ADMIN',
        name: 'Comandante EAR OS',
        displayName: 'Administrador Único',
      },
    });
    console.log(`✅ [POSTGRESQL / PRISMA] Usuario elevado a ADMIN con ID: ${user.id}`);
  } catch (dbError: any) {
    console.warn(`⚠️ [DATABASE WARNING]:`, dbError.message || dbError);
  }

  console.log(`🏆 [SUCCESS] Acceso de Administrador Único reestablecido para: ${adminEmail}`);
}

// Ejecución directa
const emailArg = process.argv[2] || process.env.ADMIN_EMAIL || 'productoraear@gmail.com';
const uidArg = process.argv[3];

if (require.main === module) {
  restoreSingleAdmin(emailArg, uidArg)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error fatal restaurando admin:', err);
      process.exit(1);
    });
}
