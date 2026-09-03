import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    const projectRoot = process.cwd();

    if (role === 'vimume') {
      const filePath = path.join(projectRoot, 'src', 'data', 'vimume-rag-ssot.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        // Devolvemos solo metadatos, ontología y los primeros 6 chunks de muestra
        return NextResponse.json({
          success: true,
          role: 'vimume',
          metadata: data.metadata,
          ontology_roots: data.ontology_roots,
          sample_chunks: data.chunks?.slice(0, 6) || [],
          thresholds: {
            frecuencia_estimulacion: '40 Hz Gamma',
            limite_acustico_b2g: '< 75 dB SPL',
            art_118_lcsp_techo: '14.990 €',
            poblacion_piloto: '45 participantes (3 cohortes)'
          }
        });
      }
    }

    if (role === 'artistas') {
      const filePath = path.join(projectRoot, 'src', 'data', 'artistas_vault', 'artistas-knowledge-base.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        return NextResponse.json({
          success: true,
          role: 'artistas',
          metadata: data.metadata,
          thresholds: data.operational_thresholds,
          clusters: data.clusters_definition,
          items: data.items?.slice(0, 8) || []
        });
      }
    }

    if (role === 'eventos') {
      const filePath = path.join(projectRoot, 'src', 'data', 'eventos_vault', 'eventos-knowledge-base.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        return NextResponse.json({
          success: true,
          role: 'eventos',
          metadata: data.metadata,
          thresholds: data.operational_thresholds,
          clusters: data.clusters_definition,
          items: data.items?.slice(0, 8) || []
        });
      }
    }

    if (role === 'empresas') {
      const filePath = path.join(projectRoot, 'src', 'data', 'empresas_vault', 'empresas-knowledge-base.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        return NextResponse.json({
          success: true,
          role: 'empresas',
          metadata: data.metadata,
          thresholds: data.operational_thresholds,
          clusters: data.clusters_definition,
          items: data.items?.slice(0, 8) || []
        });
      }
    }

    if (role === 'instituciones') {
      const filePath = path.join(projectRoot, 'src', 'data', 'instituciones_vault', 'instituciones-knowledge-base.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        return NextResponse.json({
          success: true,
          role: 'instituciones',
          metadata: data.metadata,
          thresholds: data.operational_thresholds,
          clusters: data.clusters_definition,
          items: data.items?.slice(0, 8) || []
        });
      }
    }

    return NextResponse.json({
      success: true,
      role,
      message: 'No specific SSOT file found, operating in default mode'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error reading SSOT' }, { status: 500 });
  }
}
