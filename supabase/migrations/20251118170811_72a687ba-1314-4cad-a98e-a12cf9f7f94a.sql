-- Create storage bucket for event photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-photos', 'event-photos', true);

-- Create gallery_photos table
CREATE TABLE public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  event_date DATE,
  event_type TEXT,
  location TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gallery_photos
CREATE POLICY "Anyone can view gallery photos"
ON public.gallery_photos
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert gallery photos"
ON public.gallery_photos
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can update gallery photos"
ON public.gallery_photos
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete gallery photos"
ON public.gallery_photos
FOR DELETE
USING (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_gallery_photos_updated_at
BEFORE UPDATE ON public.gallery_photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for event-photos bucket
CREATE POLICY "Anyone can view event photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'event-photos');

CREATE POLICY "Admins can upload event photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'event-photos' AND is_admin());

CREATE POLICY "Admins can update event photos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'event-photos' AND is_admin());

CREATE POLICY "Admins can delete event photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'event-photos' AND is_admin());