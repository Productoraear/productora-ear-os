import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
/**
 * useStudioProgress - Conexión directa al Truth Engine (Supabase).
 * Lee el estado real del artista en la infraestructura de Edwin Agudelo.
 */
export const useStudioProgress = (userId) => {
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    useEffect(() => {
        const fetchProgress = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('studio_progress')
                .select('*')
                .eq('user_id', userId);
            if (!error && data) {
                setProgress(data);
            }
            setLoading(false);
        };
        if (userId) {
            fetchProgress();
        }
        // Suscripción Realtime para actualizaciones de XP instantáneas
        const channel = supabase
            .channel('schema-db-changes')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'studio_progress' }, (payload) => {
            setProgress(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
        })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [userId, supabase]);
    return { progress, loading };
};
