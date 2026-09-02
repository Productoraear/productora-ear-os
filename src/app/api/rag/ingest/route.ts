import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const RAG_DB_PATH = path.join(process.cwd(), 'src', 'data', 'ear-rag-database.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, content, tags, summary, source_file } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título y contenido son campos obligatorios.' },
        { status: 400 }
      );
    }

    const nodeId = body.id || `RAG-LIVE-${category ? category.slice(0, 8).toUpperCase() : 'NUGGET'}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const newNode = {
      id: nodeId,
      title: title.trim(),
      category: category || 'WISDOM_VAULT_LIVE',
      summary: summary || (content.length > 250 ? content.slice(0, 250) + '...' : content),
      content: content.trim(),
      tags: Array.isArray(tags) ? Array.from(new Set([...tags, 'Live Ingestion', 'Astra OS'])) : ['Live Ingestion', 'Astra OS'],
      source_file: source_file || 'Astra Wisdom Vault Live',
      createdAt: new Date().toISOString()
    };

    let ragDb: any[] = [];
    if (fs.existsSync(RAG_DB_PATH)) {
      const raw = fs.readFileSync(RAG_DB_PATH, 'utf-8');
      ragDb = JSON.parse(raw);
    }

    // Comprobar si ya existe por ID o título
    const existingIndex = ragDb.findIndex(n => n.id === newNode.id || n.title.toLowerCase() === newNode.title.toLowerCase());
    if (existingIndex >= 0) {
      ragDb[existingIndex] = { ...ragDb[existingIndex], ...newNode, updatedAt: new Date().toISOString() };
    } else {
      ragDb.unshift(newNode);
    }

    // Persistir en disco
    fs.writeFileSync(RAG_DB_PATH, JSON.stringify(ragDb, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Nodo inyectado con éxito en la Bóveda RAG.',
      node: newNode,
      totalNodes: ragDb.length
    });
  } catch (error: any) {
    console.error('Error en /api/rag/ingest:', error);
    return NextResponse.json(
      { error: 'Error interno inyectando nodo RAG.', details: error.message },
      { status: 500 }
    );
  }
}
