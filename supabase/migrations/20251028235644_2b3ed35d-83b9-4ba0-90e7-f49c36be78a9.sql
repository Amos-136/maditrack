-- Ajouter une politique INSERT pour permettre la création d'organisations lors de l'inscription
CREATE POLICY "Anyone can create an organization during signup"
ON public.organizations
FOR INSERT
WITH CHECK (true);

-- Note: Cette politique permet à n'importe qui de créer une organisation.
-- Pour plus de sécurité, on pourrait utiliser une edge function pour gérer l'inscription.