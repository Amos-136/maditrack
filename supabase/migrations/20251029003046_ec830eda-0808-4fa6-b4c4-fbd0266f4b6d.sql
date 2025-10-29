-- 1. Nettoyer et recréer les policies pour organizations
DROP POLICY IF EXISTS "Anyone can create an organization during signup" ON public.organizations;
DROP POLICY IF EXISTS "Allow authenticated users to create organizations" ON public.organizations;

-- Permettre à TOUS d'insérer une organization (nécessaire pour le signup)
-- Car au moment du signup, l'utilisateur n'est pas encore authentifié
CREATE POLICY "Anyone can insert organization during signup"
ON public.organizations
FOR INSERT
WITH CHECK (true);

-- 2. Rendre organization_id nullable sur profiles
ALTER TABLE public.profiles ALTER COLUMN organization_id DROP NOT NULL;

-- 3. Ajouter une policy pour permettre au trigger d'insérer les profils
-- Le trigger handle_new_user s'exécute avec SECURITY DEFINER donc cette policy n'est pas nécessaire
-- Mais on s'assure que la policy d'insertion existe pour les cas normaux
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (id = auth.uid());

-- 4. S'assurer que le trigger handle_new_user existe toujours
-- (Il devrait déjà exister, on le recrée au cas où)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, organization_id, full_name, email)
  VALUES (
    new.id,
    (new.raw_user_meta_data->>'organization_id')::uuid,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();