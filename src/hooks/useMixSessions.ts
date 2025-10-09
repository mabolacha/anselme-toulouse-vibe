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

  const fetchMixSessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mix_sessions')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setMixSessions((data as MixSession[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      console.error('Error fetching mix sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMixSessions();
  }, []);

  return {
    mixSessions,
    loading,
    error,
    refetch: fetchMixSessions
  };
};
