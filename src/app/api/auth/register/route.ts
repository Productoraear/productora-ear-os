import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  const { email, password, name } = await req.json();

  try {
const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return new NextResponse(JSON.stringify({ message: 'Email already in use' }), {
        status: 409,
      });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    return new NextResponse(JSON.stringify({ message: 'User registered successfully', user: newUser }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}