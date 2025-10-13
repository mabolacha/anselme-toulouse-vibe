-- Add new columns to quotes table for detailed quote management

-- Equipment and packages
ALTER TABLE public.quotes
ADD COLUMN equipment_included BOOLEAN DEFAULT false,
ADD COLUMN base_package_with_equipment NUMERIC(10,2),
ADD COLUMN base_package_without_equipment NUMERIC(10,2);

-- Travel fees
ALTER TABLE public.quotes
ADD COLUMN venue_distance_km NUMERIC(10,2),
ADD COLUMN travel_fees NUMERIC(10,2) DEFAULT 0;

-- Included services
ALTER TABLE public.quotes
ADD COLUMN dj_animation_included BOOLEAN DEFAULT true,
ADD COLUMN technical_installation_included BOOLEAN DEFAULT true,
ADD COLUMN custom_playlist_included BOOLEAN DEFAULT false;

-- Extra options (stored as JSONB array)
ALTER TABLE public.quotes
ADD COLUMN extra_options JSONB DEFAULT '[]'::jsonb;

-- Payment details
ALTER TABLE public.quotes
ADD COLUMN deposit_percentage NUMERIC(5,2) DEFAULT 30.00,
ADD COLUMN deposit_amount NUMERIC(10,2),
ADD COLUMN balance_amount NUMERIC(10,2),
ADD COLUMN payment_terms TEXT;

-- Quote metadata
ALTER TABLE public.quotes
ADD COLUMN quote_notes TEXT,
ADD COLUMN quote_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN quote_sent_at TIMESTAMP WITH TIME ZONE;

-- Add comment for documentation
COMMENT ON COLUMN public.quotes.extra_options IS 'JSONB array of extra options: [{"name": "Photobooth", "price": 250, "selected": true, "quantity": 1}]';
COMMENT ON COLUMN public.quotes.travel_fees IS 'Calculated as: free up to 20km, then 0.5€/km';
COMMENT ON COLUMN public.quotes.deposit_amount IS 'Calculated from quote_amount * deposit_percentage / 100';
COMMENT ON COLUMN public.quotes.balance_amount IS 'Calculated as: quote_amount - deposit_amount';