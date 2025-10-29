-- Ajouter la policy permettant aux admins de créer des profils pour leur organisation
CREATE POLICY "Admins can insert profiles in their org"
ON public.profiles
FOR INSERT
WITH CHECK (
  organization_id = get_user_organization_id(auth.uid()) 
  AND is_user_admin(auth.uid())
);

-- S'assurer que la policy DELETE existe pour les admins
DROP POLICY IF EXISTS "Admins can delete profiles in their org" ON public.profiles;
CREATE POLICY "Admins can delete profiles in their org"
ON public.profiles
FOR DELETE
USING (
  organization_id = get_user_organization_id(auth.uid()) 
  AND is_user_admin(auth.uid())
  AND id != auth.uid() -- Un admin ne peut pas se supprimer lui-même
);