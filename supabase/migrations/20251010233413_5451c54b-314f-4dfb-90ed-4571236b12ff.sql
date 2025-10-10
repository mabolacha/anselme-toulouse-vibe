-- Add missing write policies to user_roles table
-- This prevents privilege escalation by ensuring only admins can manage roles

-- Policy 1: Only admins can assign roles to users
CREATE POLICY "Admins can insert roles" 
ON public.user_roles
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());

-- Policy 2: Only admins can modify existing role assignments
CREATE POLICY "Admins can update roles" 
ON public.user_roles
FOR UPDATE 
TO authenticated
USING (public.is_admin());

-- Policy 3: Only admins can remove role assignments
CREATE POLICY "Admins can delete roles" 
ON public.user_roles
FOR DELETE 
TO authenticated
USING (public.is_admin());