import { NextResponse } from 'next/server';
import { vampireService } from '@/lib/services/VampireService';
export const dynamic = 'force-dynamic';
/**
 * 🧛 VAMPIRE TRANSMUTATION BRIDGE
 * Executes the ingestion protocol: raw leads -> structured intelligence.
 */
export async function POST(req) {
    try {
        // En un entorno S-Class real, aquí verificaríamos privilegios ALPHA_GOD_MODE
        const result = await vampireService.processNewLeads();
        if (result.success) {
            return NextResponse.json(result);
        }
        else {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
    }
    catch (error) {
        console.error('❌ VAMPIRE_API_ERROR:', error);
        return NextResponse.json({ error: 'Error en la cámara de transmutación' }, { status: 500 });
    }
}
