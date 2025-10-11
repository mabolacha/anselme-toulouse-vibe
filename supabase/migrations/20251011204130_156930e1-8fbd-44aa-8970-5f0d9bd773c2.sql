-- ============================================
-- MIGRATION: Rate Limiting sur bookings et quotes
-- Date: 2025-10-11
-- Description: Limiter à 3 demandes par email par heure
-- ============================================

-- Étape 1: Créer la fonction de rate limiting pour bookings
CREATE OR REPLACE FUNCTION public.check_booking_rate_limit(p_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_count integer;
BEGIN
  SELECT COUNT(*) INTO request_count
  FROM public.bookings
  WHERE LOWER(email) = LOWER(p_email)
    AND created_at > (NOW() - INTERVAL '1 hour');
  
  RETURN request_count < 3;
END;
$$;

-- Étape 2: Créer la fonction de rate limiting pour quotes
CREATE OR REPLACE FUNCTION public.check_quote_rate_limit(p_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_count integer;
BEGIN
  SELECT COUNT(*) INTO request_count
  FROM public.quotes
  WHERE LOWER(email) = LOWER(p_email)
    AND created_at > (NOW() - INTERVAL '1 hour');
  
  RETURN request_count < 3;
END;
$$;

-- Étape 3: Supprimer les anciennes politiques trop permissives
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create quotes" ON public.quotes;

-- Étape 4: Créer les nouvelles politiques avec rate limiting
CREATE POLICY "Rate limited bookings insert" 
ON public.bookings
FOR INSERT 
TO anon, authenticated
WITH CHECK (public.check_booking_rate_limit(email));

CREATE POLICY "Rate limited quotes insert" 
ON public.quotes
FOR INSERT 
TO anon, authenticated
WITH CHECK (public.check_quote_rate_limit(email));

-- Étape 5: Ajouter des commentaires pour documentation
COMMENT ON FUNCTION public.check_booking_rate_limit IS 
  'Vérifie le rate limit: max 3 bookings par email par heure';

COMMENT ON FUNCTION public.check_quote_rate_limit IS 
  'Vérifie le rate limit: max 3 quotes par email par heure';