-- Add database-level constraints for data integrity on bookings table
ALTER TABLE public.bookings
  ADD CONSTRAINT check_name_length CHECK (char_length(name) <= 100),
  ADD CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  ADD CONSTRAINT check_phone_length CHECK (phone IS NULL OR char_length(phone) <= 20);

-- Add database-level constraints for data integrity on quotes table
ALTER TABLE public.quotes
  ADD CONSTRAINT check_name_length CHECK (char_length(name) <= 100),
  ADD CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  ADD CONSTRAINT check_phone_length CHECK (phone IS NULL OR char_length(phone) <= 20),
  ADD CONSTRAINT check_special_requests_length CHECK (special_requests IS NULL OR char_length(special_requests) <= 1000);

-- Add comments for documentation
COMMENT ON CONSTRAINT check_name_length ON public.bookings IS 'Ensures customer names do not exceed 100 characters';
COMMENT ON CONSTRAINT check_email_format ON public.bookings IS 'Validates email format at database level';
COMMENT ON CONSTRAINT check_phone_length ON public.bookings IS 'Limits phone number length to 20 characters';

COMMENT ON CONSTRAINT check_name_length ON public.quotes IS 'Ensures customer names do not exceed 100 characters';
COMMENT ON CONSTRAINT check_email_format ON public.quotes IS 'Validates email format at database level';
COMMENT ON CONSTRAINT check_phone_length ON public.quotes IS 'Limits phone number length to 20 characters';
COMMENT ON CONSTRAINT check_special_requests_length ON public.quotes IS 'Limits special requests to 1000 characters';