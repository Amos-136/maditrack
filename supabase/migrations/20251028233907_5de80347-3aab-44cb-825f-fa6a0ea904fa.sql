-- ============================
-- 🎯 TYPES PERSONNALISÉS (sauf app_role qui existe déjà)
-- ============================

-- Types d'organisations
create type public.organization_type as enum ('hopital_public', 'clinique_privee', 'centre_sante');

-- Statuts de rendez-vous
create type public.appointment_status as enum ('planifie', 'en_cours', 'termine', 'annule');

-- Plans d'abonnement
create type public.subscription_plan as enum ('basic', 'pro', 'clinic');

-- Statuts d'abonnement
create type public.subscription_status as enum ('actif', 'expire', 'suspendu');

-- Genre
create type public.gender_type as enum ('Homme', 'Femme', 'Autre');

-- ============================
-- 📊 TABLES
-- ============================

-- TABLE 1 : Organisations
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type organization_type not null,
  address text,
  phone text,
  email text,
  logo_url text,
  created_at timestamp with time zone default now()
);

-- TABLE 2 : Profils utilisateurs (référence auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  full_name text not null,
  email text unique not null,
  service text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- TABLE 3 : Patients
create table public.patients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  created_by uuid references auth.users(id),
  full_name text not null,
  age int check (age > 0 and age < 150),
  gender gender_type,
  phone text,
  email text,
  antecedents text,
  traitement text,
  medecin_id uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- TABLE 4 : Rendez-vous
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  patient_id uuid references public.patients(id) on delete cascade not null,
  medecin_id uuid references auth.users(id) not null,
  date timestamp with time zone not null,
  status appointment_status default 'planifie',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- TABLE 5 : Abonnements
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  plan subscription_plan not null,
  status subscription_status default 'actif',
  paystack_customer_id text,
  paystack_subscription_code text unique,
  start_date timestamp with time zone default now(),
  end_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- TABLE 6 : Journal du personnel
create table public.staff_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  action text not null,
  details jsonb,
  created_at timestamp with time zone default now()
);

-- ============================
-- 📈 INDEXES pour les performances
-- ============================

create index idx_profiles_organization on public.profiles(organization_id);
create index idx_patients_organization on public.patients(organization_id);
create index idx_patients_medecin on public.patients(medecin_id);
create index idx_appointments_organization on public.appointments(organization_id);
create index idx_appointments_patient on public.appointments(patient_id);
create index idx_appointments_medecin on public.appointments(medecin_id);
create index idx_appointments_date on public.appointments(date);
create index idx_subscriptions_organization on public.subscriptions(organization_id);
create index idx_staff_logs_organization on public.staff_logs(organization_id);
create index idx_staff_logs_user on public.staff_logs(user_id);

-- ============================
-- 🔐 FONCTIONS SECURITY DEFINER (évite la récursion RLS)
-- ============================

-- Fonction pour obtenir l'organization_id de l'utilisateur courant
create or replace function public.get_user_organization_id(_user_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id 
  from public.profiles 
  where id = _user_id
  limit 1;
$$;

-- Fonction pour vérifier si un utilisateur a un rôle spécifique
create or replace function public.user_has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

-- Fonction pour vérifier si un utilisateur est admin
create or replace function public.is_user_admin(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.user_has_role(_user_id, 'admin');
$$;

-- Fonction pour vérifier si deux utilisateurs sont dans la même organisation
create or replace function public.same_organization(_user_id1 uuid, _user_id2 uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p1
    join public.profiles p2 on p1.organization_id = p2.organization_id
    where p1.id = _user_id1 and p2.id = _user_id2
  );
$$;

-- ============================
-- 🔒 ACTIVATION RLS
-- ============================

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.subscriptions enable row level security;
alter table public.staff_logs enable row level security;

-- ============================
-- 🛡️ POLITIQUES RLS
-- ============================

-- ORGANIZATIONS : Les membres peuvent voir leur organisation
create policy "Users can view their organization"
on public.organizations for select
using (
  id = public.get_user_organization_id(auth.uid())
);

create policy "Admins can update their organization"
on public.organizations for update
using (
  id = public.get_user_organization_id(auth.uid())
  and public.is_user_admin(auth.uid())
);

-- PROFILES : Les utilisateurs peuvent voir les profils de leur organisation
create policy "Users can view profiles in their org"
on public.profiles for select
using (
  organization_id = public.get_user_organization_id(auth.uid())
);

create policy "Users can view their own profile"
on public.profiles for select
using (id = auth.uid());

create policy "Users can update their own profile"
on public.profiles for update
using (id = auth.uid());

create policy "Users can insert their own profile"
on public.profiles for insert
with check (id = auth.uid());

-- PATIENTS : Accessibles aux membres de la même organisation
create policy "Users can view patients in their org"
on public.patients for select
using (
  organization_id = public.get_user_organization_id(auth.uid())
);

create policy "Users can insert patients in their org"
on public.patients for insert
with check (
  organization_id = public.get_user_organization_id(auth.uid())
);

create policy "Users can update patients in their org"
on public.patients for update
using (
  organization_id = public.get_user_organization_id(auth.uid())
);

create policy "Users can delete patients in their org"
on public.patients for delete
using (
  organization_id = public.get_user_organization_id(auth.uid())
);

-- APPOINTMENTS : Accessibles aux membres de la même organisation
create policy "Users can view appointments in their org"
on public.appointments for select
using (
  organization_id = public.get_user_organization_id(auth.uid())
);

create policy "Users can insert appointments in their org"
on public.appointments for insert
with check (
  organization_id = public.get_user_organization_id(auth.uid())
);

create policy "Users can update appointments in their org"
on public.appointments for update
using (
  organization_id = public.get_user_organization_id(auth.uid())
);

create policy "Users can delete appointments in their org"
on public.appointments for delete
using (
  organization_id = public.get_user_organization_id(auth.uid())
);

-- SUBSCRIPTIONS : Seuls les admins peuvent gérer les abonnements
create policy "Admins can view subscriptions"
on public.subscriptions for select
using (
  organization_id = public.get_user_organization_id(auth.uid())
  and public.is_user_admin(auth.uid())
);

create policy "Admins can manage subscriptions"
on public.subscriptions for all
using (
  organization_id = public.get_user_organization_id(auth.uid())
  and public.is_user_admin(auth.uid())
);

-- STAFF_LOGS : Accessibles en lecture aux membres de la même organisation
create policy "Users can view logs in their org"
on public.staff_logs for select
using (
  organization_id = public.get_user_organization_id(auth.uid())
);

create policy "Users can insert logs in their org"
on public.staff_logs for insert
with check (
  organization_id = public.get_user_organization_id(auth.uid())
);

-- ============================
-- 🔄 TRIGGERS pour updated_at
-- ============================

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

create trigger set_patients_updated_at
  before update on public.patients
  for each row
  execute function public.update_updated_at_column();

create trigger set_appointments_updated_at
  before update on public.appointments
  for each row
  execute function public.update_updated_at_column();

create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row
  execute function public.update_updated_at_column();

-- ============================
-- 🎉 TRIGGER pour créer le profil automatiquement
-- ============================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, organization_id, full_name, email)
  values (
    new.id,
    (new.raw_user_meta_data->>'organization_id')::uuid,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();