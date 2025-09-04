-- Fix critical security issue: Remove unrestricted access to customer data
-- Drop existing overly permissive policies for bookings table
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;

-- Drop existing overly permissive policies for quotes table  
DROP POLICY IF EXISTS "Admins can view all quotes" ON public.quotes;
DROP POLICY IF EXISTS "Admins can update quotes" ON public.quotes;

-- Keep INSERT policies as they allow public to submit booking/quote requests
-- These are needed for the website functionality

-- Note: SELECT and UPDATE access will be restricted until proper authentication 
-- and admin role system is implemented. This prevents unauthorized access to
-- customer personal information (names, emails, phone numbers).

-- To restore admin access later, implement authentication and create policies like:
-- CREATE POLICY "Authenticated admins can view bookings" ON public.bookings
-- FOR SELECT USING (auth.uid() IS NOT NULL AND has_admin_role(auth.uid()));

-- For now, data can only be viewed through direct database access by project owners