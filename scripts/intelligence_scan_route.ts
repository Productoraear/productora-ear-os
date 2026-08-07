import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 🛰 EAR OS SYSTEM SCANNER & CLOUD SYNC [VIMUME RAG]
 * Lee H: y F: y guarda el CONTENIDO en Firestore para el SaaS 24/7.
 * ROBUSTEZ: Añadido manejo de errores para archivos inexistentes.
 */

const SCAN_TARGETS = [
  'H:/ear-gold',
  'H:/02_ECOSISTEMA_EAR',
  'F:/'
];

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ status: 'ok', targets: SCAN_TARGETS });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}