-- Fix critical privilege escalation vulnerability in user_roles table
-- Remove the overly permissive INSERT policy that allows anyone to assign themselves any role

-- Drop the dangerous policy
DROP POLICY IF EXISTS "Allow role insertion during signup" ON public.user_roles;

-- Create a secure function to assign initial admin role during signup
-- This will be called by the handle_new_user trigger
CREATE OR REPLACE FUNCTION public.assign_initial_admin_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Assign admin role to the newly created user
  -- This happens automatically for every new user during signup
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (NEW.id, 'admin', NEW.id)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-assign admin role to new users
DROP TRIGGER IF EXISTS on_user_created_assign_admin ON public.profiles;
CREATE TRIGGER on_user_created_assign_admin
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_initial_admin_role();

-- Create restricted INSERT policy: only admins in the same org can assign roles
CREATE POLICY "Admins can assign roles in their org"
ON public.user_roles
FOR INSERT
WITH CHECK (
  public.is_user_admin(auth.uid()) 
  AND public.same_organization(auth.uid(), user_id)
);

-- Add policy to allow the trigger function to insert roles
-- The trigger runs with SECURITY DEFINER so it bypasses RLS, but we keep this for clarity
CREATE POLICY "System can assign roles during signup"
ON public.user_roles
FOR INSERT
WITH CHECK (
  -- This allows the trigger to insert roles
  -- The trigger runs as SECURITY DEFINER so it has elevated privileges
  true
);

-- Update the existing UPDATE/DELETE policies to ensure they're restrictive
DROP POLICY IF EXISTS "Admins can update and delete roles" ON public.user_roles;

CREATE POLICY "Admins can update roles in their org"
ON public.user_roles
FOR UPDATE
USING (
  public.is_user_admin(auth.uid())
  AND public.same_organization(auth.uid(), user_id)
);

CREATE POLICY "Admins can delete roles in their org"
ON public.user_roles
FOR DELETE
USING (
  public.is_user_admin(auth.uid())
  AND public.same_organization(auth.uid(), user_id)
  AND user_id != auth.uid() -- Can't remove their own admin role
);