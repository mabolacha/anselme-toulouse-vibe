import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MixSession {
  id: string;
  title: string;
  description: string | null;
  platform: 'hearthis' | 'youtube' | 'mixcloud';
  embed_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useMixSessions = () => {
  const [mixSessions, setMixSessions] = useState<MixSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMixSessions = async (includeInactive = false) => {
    try {
      setLoading(true);
      let query = supabase
        .from('mix_sessions')
        .select('*');
      
      // Filter by active status only if not including inactive sessions
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query.order('display_order', { ascending: true });

      if (error) throw error;
      setMixSessions((data as MixSession[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      if (import.meta.env.DEV) {
        console.error('Error fetching mix sessions:', err);
      }
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMixSessions();
  }, []);

  const createMixSession = async (data: Omit<MixSession, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('mix_sessions')
        .insert(data);
      
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Erreur lors de la création') };
    }
  };

  const updateMixSession = async (id: string, data: Partial<Omit<MixSession, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { error } = await supabase
        .from('mix_sessions')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Erreur lors de la mise à jour') };
    }
  };

  const deleteMixSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mix_sessions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Erreur lors de la suppression') };
    }
  };

  return {
    mixSessions,
    loading,
    error,
    refetch: fetchMixSessions,
    createMixSession,
    updateMixSession,
    deleteMixSession
  };
};
