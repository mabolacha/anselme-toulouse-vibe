-- Create events table
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  venue text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  location text NOT NULL,
  description text,
  price text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view events"
  ON public.events
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert events"
  ON public.events
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update events"
  ON public.events
  FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete events"
  ON public.events
  FOR DELETE
  USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing events
INSERT INTO public.events (title, venue, date, time, location, description, price, status) VALUES
('Soirée spéciale jeunes - Marignac Lasclares', 'Salles des fêtes', '2025-05-31', '23:00', 'Marignac Lasclares, (31)', 'Organisée par les Comité des fêtes de la Mairie', '15€', 'confirmed'),
('Fête de la Musique - Le Fousseret', 'Place de la Mairie', '2025-06-21', '23:00', 'Le Fousseret, (31)', 'Festival outdoor avec DJ sets en plein air', 'Gratuit', 'confirmed'),
('Soirée Afro-Caribéénne', 'BBT Cornebarrieu', '2025-09-13', '22:30', '6, rue E. Dewotine, Cornebarrieu (31)', 'Animation avec DJ Riina', '12€ + Conso - en pré-vente sur Bizouk', 'confirmed'),
('Soirée Afro-Caribéénne', 'BBT Cornebarrieu (31700)', '2025-12-06', '22:30', '6, rue E. Dewotine, Cornebarrieu (31)', 'Cours de danse Kizomba avant la soirée', '12€ + Conso - en pré-vente sur Bizouk', 'confirmed');