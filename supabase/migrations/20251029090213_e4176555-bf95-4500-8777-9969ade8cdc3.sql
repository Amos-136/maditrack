-- 1. Créer l'enum pour les catégories d'organisations
CREATE TYPE public.organization_category AS ENUM ('hopital', 'clinique', 'pharmacie', 'particulier');

-- 2. Ajouter la colonne category à la table organizations
ALTER TABLE public.organizations 
ADD COLUMN category public.organization_category DEFAULT 'hopital';

-- 3. Mettre à jour les organisations existantes avec la catégorie par défaut
UPDATE public.organizations 
SET category = 'hopital' 
WHERE category IS NULL;