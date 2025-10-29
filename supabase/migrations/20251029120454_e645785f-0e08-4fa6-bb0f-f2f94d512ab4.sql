-- Remove the overly permissive policy that was accidentally left in place
-- Triggers with SECURITY DEFINER bypass RLS, so they don't need this policy
-- Having this policy creates a security vulnerability as it allows anyone to insert roles

DROP POLICY IF EXISTS "System can assign roles during signup" ON public.user_roles;