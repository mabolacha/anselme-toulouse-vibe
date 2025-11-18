import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GalleryPhoto {
  id: string;
  image_url: string;
  title: string;
  event_date: string | null;
  event_type: string | null;
  location: string | null;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useGalleryPhotos = (featuredOnly: boolean = false) => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('gallery_photos')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (featuredOnly) {
        query = query.eq('featured', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPhotos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      if (import.meta.env.DEV) {
        console.error('Error fetching gallery photos:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [featuredOnly]);

  return {
    photos,
    loading,
    error,
    refetch: fetchPhotos
  };
};