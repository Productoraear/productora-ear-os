
import { NextResponse } from 'next/server';
import { scanBOE } from '@/lib/services/scrapers/boe_predator';

export async function POST() {
  try {
    const result = await scanBOE();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
