-- 1. Corriger la policy INSERT sur organizations pour permettre les inscriptions
-- Supprimer toutes les anciennes policies INSERT
DROP POLICY IF EXISTS "Enable insert for anon and authenticated users" ON public.organizations;
DROP POLICY IF EXISTS "Allow anyone to create organization" ON public.organizations;
DROP POLICY IF EXISTS "Anyone can insert organization during signup" ON public.organizations;

-- Créer une policy simple qui autorise TOUT LE MONDE à créer une organisation
CREATE POLICY "Allow organization creation"
ON public.organizations
FOR INSERT
WITH CHECK (true);

-- 2. S'assurer que les policies sur profiles permettent l'insertion automatique
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Allow profile creation during signup"
ON public.profiles
FOR INSERT
WITH CHECK (true);

-- 3. Améliorer la policy SELECT sur profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (id = auth.uid() OR organization_id = get_user_organization_id(auth.uid()));

-- 4. Améliorer le trigger handle_new_user pour être plus robuste
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id uuid;
BEGIN
  -- Récupérer l'organization_id depuis les metadata
  org_id := (new.raw_user_meta_data->>'organization_id')::uuid;
  
  -- Si pas d'organization_id, on ne fait rien
  IF org_id IS NULL THEN
    RAISE EXCEPTION 'organization_id manquant dans raw_user_meta_data';
  END IF;

  -- Insérer le profil avec organization_id
  INSERT INTO public.profiles (id, organization_id, full_name, email)
  VALUES (
    new.id,
    org_id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email
  );
  
  RETURN new;
END;
$$;

-- 5. Améliorer les policies sur user_roles
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert roles during signup" ON public.user_roles;

CREATE POLICY "Allow role insertion during signup"
ON public.user_roles
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Admins can update and delete roles"
ON public.user_roles
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));