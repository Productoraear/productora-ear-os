import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ModuleProgress {
  id: string;
  status: 'locked' | 'active' | 'completed';
  xp_earned: number;
  test_of_work_submitted: boolean;
}

/**
 * useStudioProgress - Conexión directa al Truth Engine (Supabase).
 * Lee el estado real del artista en la infraestructura de Edwin Agudelo.
 */
export const useStudioProgress = (userId: string) => {
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
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
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'studio_progress' }, 
        (payload: any) => {
          setProgress(prev => prev.map(p => p.id === payload.new.id ? payload.new as ModuleProgress : p));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, supabase]);

  return { progress, loading };
};
