import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AudioContent {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_size: number | null;
  duration_seconds: number | null;
  genre: string | null;
  mix_type: 'mix' | 'podcast' | 'live_set' | 'original_track' | null;
  release_date: string | null;
  play_count: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export const useAudioContent = () => {
  const [audioContent, setAudioContent] = useState<AudioContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudioContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('audio_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAudioContent(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      console.error('Error fetching audio content:', err);
    } finally {
      setLoading(false);
    }
  };

  const updatePlayCount = async (id: string) => {
    try {
      const { error } = await supabase.rpc('increment_play_count', { audio_id: id });
      if (error) throw error;
      
      // Update local state
      setAudioContent(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, play_count: item.play_count + 1 }
            : item
        )
      );
    } catch (err) {
      console.error('Error updating play count:', err);
    }
  };

  useEffect(() => {
    fetchAudioContent();
  }, []);

  return {
    audioContent,
    loading,
    error,
    refetch: fetchAudioContent,
    updatePlayCount
  };
};