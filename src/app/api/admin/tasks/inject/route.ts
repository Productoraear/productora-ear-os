import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { task } = body;

    if (!task || !task.id || !task.title) {
      return NextResponse.json({ error: 'Estructura de tarea invalida' }, { status: 400 });
    }

    const queuePath = path.join(process.cwd(), '.antigravity', 'tasks_queue.json');
    if (!fs.existsSync(queuePath)) {
      return NextResponse.json({ error: 'No se localiza tasks_queue.json' }, { status: 404 });
    }

    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    const existingIndex = queue.tasks.findIndex((t: any) => t.id === task.id);
    if (existingIndex !== -1) {
      queue.tasks[existingIndex] = task;
    } else {
      queue.tasks.push(task);
    }

    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      taskId: task.id,
      totalInQueue: queue.tasks.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error imprevisto' }, { status: 500 });
  }
}
