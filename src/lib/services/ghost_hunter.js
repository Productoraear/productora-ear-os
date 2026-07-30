import { supabase } from './auth_nexus';
// ============================================================================
// 🌌 CLIENTE CAZADOR FANTASMA (RAG & INTEL)
// ============================================================================
export class GhostHunter {
    /**
     * Consulta la Bóveda de Conocimiento mediante similitud vectorial.
     * Retorna fallback vacío si la conexión falla (Graceful Degradation).
     */
    static async queryVault(embedding) {
        try {
            const response = await fetch('/api/rag/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embedding })
            });
            if (!response.ok) {
                console.warn('⚠️ [GhostHunter] queryVault HTTP', response.status, '— Modo offline activo.');
                return [];
            }
            return await response.json();
        }
        catch (error) {
            console.warn('⚠️ [GhostHunter] queryVault offline (esperado en dev):', error);
            return [];
        }
    }
    /**
     * Obtiene la última inteligencia recolectada por el Cazador.
     * Nunca lanza — devuelve array vacío si Supabase no responde.
     */
    static async getLatestIntel(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('hunter_intel')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            if (error) {
                console.warn('⚠️ [GhostHunter] Modo offline activo:', error.message);
                return [];
            }
            return data || [];
        }
        catch (error) {
            console.warn('⚠️ [GhostHunter] Supabase inalcanzable — fallback vacío:', error);
            return [];
        }
    }
}
