-- Create storage bucket for audio files (mixes, podcasts)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio-content', 
  'audio-content', 
  true,
  104857600, -- 100MB max per file
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac']
);

-- Create table for audio content metadata
CREATE TABLE public.audio_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL, -- Path in storage bucket
  file_size BIGINT,
  duration_seconds INTEGER,
  genre TEXT,
  mix_type TEXT CHECK (mix_type IN ('mix', 'podcast', 'live_set', 'original_track')),
  release_date DATE DEFAULT CURRENT_DATE,
  play_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audio_content table
ALTER TABLE public.audio_content ENABLE ROW LEVEL SECURITY;

-- Public can read audio content (for website display)
CREATE POLICY "Anyone can view audio content" 
ON public.audio_content 
FOR SELECT 
USING (true);

-- Create storage policies for audio bucket
-- Public can view/download files (for audio streaming)
CREATE POLICY "Public can view audio files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'audio-content');

-- Only authenticated users can upload audio (admin access)
CREATE POLICY "Authenticated users can upload audio" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'audio-content' 
  AND auth.uid() IS NOT NULL
);

-- Only authenticated users can update/delete audio
CREATE POLICY "Authenticated users can update audio" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'audio-content' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete audio" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'audio-content' 
  AND auth.uid() IS NOT NULL
);

-- Add trigger for updating updated_at timestamp
CREATE TRIGGER update_audio_content_updated_at
BEFORE UPDATE ON public.audio_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for demonstration
INSERT INTO public.audio_content (title, description, file_path, mix_type, genre, duration_seconds) VALUES
('Mix House Toulouse 2024', 'Mix house exclusif enregistré à Toulouse', 'sample-house-mix-2024.mp3', 'mix', 'House', 3600),
('Podcast Deep Vibes #1', 'Premier épisode du podcast Deep Vibes', 'podcast-deep-vibes-01.mp3', 'podcast', 'Deep House', 2400),
('Live Set - Club XYZ', 'Set live enregistré au Club XYZ', 'live-set-club-xyz.mp3', 'live_set', 'Techno', 5400);