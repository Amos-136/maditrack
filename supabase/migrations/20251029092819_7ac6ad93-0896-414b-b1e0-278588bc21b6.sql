-- Supprimer toutes les policies INSERT existantes sur organizations
DROP POLICY IF EXISTS "Anyone can insert organization during signup" ON public.organizations;
DROP POLICY IF EXISTS "Allow authenticated users to create organizations" ON public.organizations;
DROP POLICY IF EXISTS "Users can insert organization during signup" ON public.organizations;

-- Créer une policy simple qui autorise TOUT LE MONDE à insérer une organisation
-- Nécessaire car au moment du signup, l'utilisateur n'est pas encore authentifié
CREATE POLICY "Allow anyone to create organization"
ON public.organizations
FOR INSERT
WITH CHECK (true);