import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

interface AffiliatePayload {
  name: string;
  companyName: string;
  cifNif: string;
  email: string;
  phone: string;
  category: string;
  payoutMethod: 'IBAN' | 'BIZUM';
  payoutDetails: string;
}

export async function POST(req: Request) {
  try {
    const body: AffiliatePayload = await req.json();
    const {
      name,
      companyName,
      cifNif,
      email,
      phone,
      category = 'FINCA_ESPACIO',
      payoutMethod = 'IBAN',
      payoutDetails
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Nombre, email y teléfono son obligatorios para el alta de afiliado.' },
        { status: 400 }
      );
    }

    // Generar código soberano de afiliado único basado en slug o hash
    const cleanCompany = (companyName || name)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 8);
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const affiliateCode = `EAR-${cleanCompany.toUpperCase()}-${uniqueSuffix}`;

    const affiliateRecord = {
      id: `aff_${Date.now()}`,
      affiliateCode,
      name,
      companyName: companyName || name,
      cifNif: cifNif || 'PENDIENTE_VERIFICACION',
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      category,
      payoutMethod,
      payoutDetails: payoutDetails || '',
      splitRate: '10%',
      status: 'ACTIVE_HOMOLOGATED',
      registeredAt: new Date().toISOString(),
      referralUrl: `https://productoraear.com/?ref=${affiliateCode}`
    };

    // 1. Guardar en Base de Datos Prisma si está disponible
    try {
      await prisma.user.upsert({
        where: { email: affiliateRecord.email },
        update: {
          name: affiliateRecord.name,
          displayName: affiliateRecord.companyName,
          role: 'AFFILIATE',
          rank: affiliateCode
        },
        create: {
          email: affiliateRecord.email,
          name: affiliateRecord.name,
          displayName: affiliateRecord.companyName,
          role: 'AFFILIATE',
          rank: affiliateCode
        }
      });
    } catch (dbErr) {
      console.warn('⚠️ [AFFILIATE REGISTER] Prisma upsert fallback to JSON:', dbErr);
    }

    // 2. Persistencia en bóveda local JSON para resiliencia absoluta
    try {
      const dataFilePath = path.join(process.cwd(), 'src', 'data', 'affiliates_registered.json');
      let currentAffiliates = [];
      if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        try {
          currentAffiliates = JSON.parse(fileContent);
        } catch {
          currentAffiliates = [];
        }
      }
      currentAffiliates.push(affiliateRecord);
      fs.writeFileSync(dataFilePath, JSON.stringify(currentAffiliates, null, 2), 'utf8');
    } catch (fsErr) {
      console.error('⚠️ [AFFILIATE REGISTER] Error guardando en affiliates_registered.json:', fsErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Alta de afiliado homologada con éxito bajo Split 80/10/10.',
      affiliate: affiliateRecord
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ [AFFILIATE REGISTER ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Error en el alta de afiliado.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'affiliates_registered.json');
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf8');
      const affiliates = JSON.parse(fileContent);
      return NextResponse.json({ success: true, count: affiliates.length, affiliates });
    }
    return NextResponse.json({ success: true, count: 0, affiliates: [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, count: 0, affiliates: [], error: error.message });
  }
}
