-- Create user roles system to secure booking data access
-- 1. Create an enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table 
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- 5. Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- 6. Add RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- 7. Add secure SELECT policy for bookings table (ONLY admins can view booking data)
CREATE POLICY "Only admins can view bookings" ON public.bookings
FOR SELECT 
USING (public.is_admin());

-- 8. Add admin management policies for bookings
CREATE POLICY "Admins can update bookings" ON public.bookings
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete bookings" ON public.bookings
FOR DELETE 
USING (public.is_admin());

-- 9. Apply same security to quotes table
CREATE POLICY "Only admins can view quotes" ON public.quotes
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update quotes" ON public.quotes
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete quotes" ON public.quotes
FOR DELETE 
USING (public.is_admin());