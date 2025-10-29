-- Supprimer TOUTES les policies INSERT existantes sur organizations
DROP POLICY IF EXISTS "Allow anyone to create organization" ON public.organizations;
DROP POLICY IF EXISTS "Anyone can insert organization during signup" ON public.organizations;
DROP POLICY IF EXISTS "Allow authenticated users to create organizations" ON public.organizations;
DROP POLICY IF EXISTS "Users can insert organization during signup" ON public.organizations;

-- Créer une policy qui autorise EXPLICITEMENT les utilisateurs anonymes (anon) ET authentifiés
-- Cette policy est PERMISSIVE (par défaut) ce qui permet l'insertion
CREATE POLICY "Enable insert for anon and authenticated users"
ON public.organizations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- S'assurer que RLS est activé
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;