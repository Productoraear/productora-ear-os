import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming this is the path to your Prisma client 

const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/gi;
const phoneRegex = /(?:\d[\s-]*){9,}/g;

export async function POST(req: Request) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // Using a mock userId for now, replace with actual auth logic
    const userId = "mock-user-id"; // TODO: Implement real authentication

    const body = await req.json();
    const { bio } = body;

    if (!bio || typeof bio !== 'string') {
      return NextResponse.json({ error: 'Bio is required' }, { status: 400 });
    }

    // 1. Validar max 1000 palabras
    const wordCount = bio.trim().split(/\s+/).length;
    if (wordCount > 1000) {
      return NextResponse.json({ error: 'La biografía no puede exceder las 1000 palabras.' }, { status: 400 });
    }

    // 2. Anti-Sabotaje: Bloquear URLs y teléfonos
    if (urlRegex.test(bio)) {
      return NextResponse.json({ error: 'No se permiten enlaces o URLs en la biografía. Nuestro sistema lo ha bloqueado.' }, { status: 403 });
    }

    if (phoneRegex.test(bio)) {
      return NextResponse.json({ error: 'No se permiten números de teléfono en la biografía. Nuestro sistema lo ha bloqueado.' }, { status: 403 });
    }

    // 3. Actualizar perfil
    const updatedProfile = await prisma.vendorProfile.upsert({
      where: { userId },
      update: { bio },
      create: {
        userId,
        bio,
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Error updating vendor profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
