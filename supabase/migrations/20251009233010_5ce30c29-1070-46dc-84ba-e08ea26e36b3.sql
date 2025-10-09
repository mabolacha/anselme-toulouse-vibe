-- Create mix_sessions table
CREATE TABLE public.mix_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('hearthis', 'youtube', 'mixcloud')),
  embed_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trigger for updated_at
CREATE TRIGGER update_mix_sessions_updated_at
  BEFORE UPDATE ON public.mix_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for display order
CREATE INDEX idx_mix_sessions_display_order ON public.mix_sessions(display_order);

-- Enable RLS
ALTER TABLE public.mix_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active mix sessions"
  ON public.mix_sessions
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert mix sessions"
  ON public.mix_sessions
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update mix sessions"
  ON public.mix_sessions
  FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete mix sessions"
  ON public.mix_sessions
  FOR DELETE
  USING (public.is_admin());

-- Insert initial data
INSERT INTO public.mix_sessions (title, description, platform, embed_url, display_order) VALUES
('Open Format Mix vol 04', 'Afro, RnB-Hip Hop, Kompas, Zouk, DanceHall, Afrobeat, Latino', 'hearthis', 'https://app.hearthis.at/embed/12807924/transparent_black/?hcolor=&color=&style=2&block_size=2&block_space=1&background=1&waveform=0&cover=0&autoplay=0&css=', 1),
('YouTube Mix Session', 'À configurer', 'youtube', '', 2),
('Mixcloud Mix Session', 'À configurer', 'mixcloud', '', 3);