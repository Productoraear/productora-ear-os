import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const authCookie = request.cookies.get('token');
  
  if (!authCookie) {
    return NextResponse.redirect('/login', { status: 302 });
  }

  try {
    const decoded = jwt.verify(authCookie.value, process.env.JWT_SECRET as string);
    // @ts-ignore
    request.userId = decoded.userId;
  } catch (error) {
    console.error(error);
    return NextResponse.redirect('/login', { status: 302 });
  }
  
  try {
    const { email, password } = await request.json();
const user = await prisma.user.findUnique({
  where: { email },
  select: { id: true, email: true, password: true }
});

    if (!user || !bcryptjs.compareSync(password, user.password)) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    return NextResponse.json({ message: 'Logged in successfully' }, {
      headers: {
        'Set-Cookie': `token=${authToken}; HttpOnly; Path=/`,
      },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}