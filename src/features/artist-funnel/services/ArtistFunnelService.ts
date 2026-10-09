/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARTIST FUNNEL SERVICE · PERSISTENCIA REAL + DESPACHO N8N
 * ════════════════════════════════════════════════════════════════════════════
 * Cero fachadas: la captura escribe en Firestore (`ear_artist_funnels`) y
 * dispara en background el webhook n8n `call-center-intake`. Si n8n no
 * responde, el lead queda persistido igualmente (la fuente de verdad es
 * Firestore) y el dispatcher lo reintenta vía DLQ.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';
import {
    nextStage,
    stageFromCompromiso,
    type ArtistFunnelInput,
    type ArtistFunnelLead,
    type CompromisoRuta,
} from '../model/artistFunnel';

const COLLECTION = 'ear_artist_funnels';

/** Nodo deja de arrojar si Firestore no está disponible (modo offline). */
function isFirestoreReady(): boolean {
    return Boolean(db);
}

/** Resultado tipado de la captura. */
export interface CaptureArtistResult {
    ok: boolean;
    lead: ArtistFunnelLead | null;
    reason?: 'NO_FIRESTORE' | 'INVALID_INPUT' | 'ERROR';
}

function buildLead(id: string, input: ArtistFunnelInput, source: string, now: Date): ArtistFunnelLead {
    return {
        id,
        nombre: input.nombre,
        email: input.email,
        telefono: input.telefono,
        objetivoPrincipal: input.objetivoPrincipal,
        ciudad: input.ciudad,
        genero: input.genero,
        stage: 'CAPTADO',
        source,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        commitAt: null,
        rutaCompromiso: null,
        tipsDelivered: 0,
    };
}

function isValidInput(input: ArtistFunnelInput): boolean {
    return Boolean(
        input.nombre?.trim() &&
        input.email?.trim() &&
        input.telefono?.trim() &&
        input.objetivoPrincipal?.trim()
    );
}

export class ArtistFunnelService {
    private static instance: ArtistFunnelService;

    private constructor() { }

    public static getInstance(): ArtistFunnelService {
        if (!ArtistFunnelService.instance) {
            ArtistFunnelService.instance = new ArtistFunnelService();
        }
        return ArtistFunnelService.instance;
    }

    /** Captura un nuevo lead de artista y lo despacha al ecosistema n8n. */
    public async captureArtist(input: ArtistFunnelInput, source: string): Promise<CaptureArtistResult> {
        if (!isValidInput(input)) {
            return { ok: false, lead: null, reason: 'INVALID_INPUT' };
        }

        if (!isFirestoreReady()) {
            console.warn('[ArtistFunnel] Firestore no disponible. Lead no persistido.');
            return { ok: false, lead: null, reason: 'NO_FIRESTORE' };
        }

        try {
            const ref = await addDoc(collection(db, COLLECTION), {
                nombre: input.nombre,
                email: input.email,
                telefono: input.telefono,
                objetivoPrincipal: input.objetivoPrincipal,
                ciudad: input.ciudad ?? null,
                genero: input.genero ?? null,
                stage: 'CAPTADO',
                source,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                commitAt: null,
                rutaCompromiso: null,
                tipsDelivered: 0,
            });

            const lead = buildLead(ref.id, input, source, new Date());

            fireAndForgetN8n('call-center-intake', {
                source: 'artist-funnel',
                funnel: 'artistas',
                stage: lead.stage,
                nombre: lead.nombre,
                email: lead.email,
                telefono: lead.telefono,
                objetivoPrincipal: lead.objetivoPrincipal,
                ciudad: lead.ciudad ?? '',
                genero: lead.genero ?? '',
            });

            return { ok: true, lead };
        } catch (error) {
            console.error('[ArtistFunnel] Error capturando artista:', error);
            return { ok: false, lead: null, reason: 'ERROR' };
        }
    }

    /** Avanza la etapa o registra la ruta de compromiso en Firestore. */
    public async transition(
        id: string,
        action: { tipo: 'ADELANTAR' } | { tipo: 'COMPROMETER'; ruta: CompromisoRuta }
    ): Promise<'OK' | 'NO_FIRESTORE' | 'NOT_FOUND' | 'ERROR'> {
        if (!isFirestoreReady()) {
            return 'NO_FIRESTORE';
        }

        try {
            const ref = doc(db, COLLECTION, id);
            const snapshot = await getDoc(ref);

            if (!snapshot.exists()) {
                return 'NOT_FOUND';
            }

            const existing = snapshot.data();

            if (action.tipo === 'ADELANTAR') {
                await updateDoc(ref, {
                    stage: nextStage(existing.stage as 'CAPTADO' | 'NUTRIENDO' | 'COMPROMETIDO' | 'CERRADO'),
                    updatedAt: serverTimestamp(),
                });
                return 'OK';
            }

            await updateDoc(ref, {
                rutaCompromiso: action.ruta,
                stage: stageFromCompromiso(action.ruta),
                commitAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return 'OK';
        } catch (error) {
            console.error('[ArtistFunnel] Error transitando lead:', error);
            return 'ERROR';
        }
    }

    /** Devuelve un resumen liviano del pipeline actual para el panel. */
    public async getPipelineSummary(): Promise<{ total: number; byStage: Record<string, number> }> {
        if (!isFirestoreReady()) {
            return { total: 0, byStage: {} };
        }

        try {
            const snapshot = await getDocs(collection(db, COLLECTION));
            const byStage: Record<string, number> = {};
            snapshot.forEach((doc) => {
                const stage = (doc.data().stage as string) ?? 'CAPTADO';
                byStage[stage] = (byStage[stage] ?? 0) + 1;
            });
            return { total: snapshot.size, byStage };
        } catch (error) {
            console.error('[ArtistFunnel] Error leyendo pipeline:', error);
            return { total: 0, byStage: {} };
        }
    }
}

export const artistFunnelService = ArtistFunnelService.getInstance();