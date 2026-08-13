import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET as string);
    // Token is valid, proceed with the request
    return NextResponse.next();
  } catch (error) {
    console.error(error);
    // Token is invalid, redirect to login page
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
};