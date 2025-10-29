-- Remove the permissive organization creation policy
-- Now only service role (edge functions) can create organizations
DROP POLICY IF EXISTS "Allow organization creation" ON public.organizations;

-- Keep other organization policies as they are
-- Users can still view and admins can update their organization