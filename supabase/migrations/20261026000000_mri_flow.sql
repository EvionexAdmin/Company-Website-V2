-- MRI scan upload pipeline (run once in the Supabase SQL editor)
-- 1. mri_scans        — one row per uploaded MRI study (replaces storage-only uploads)
-- 2. mri_results      — analyst-reviewed output: 3D model + biomarker values,
--                       replaces the dummy data on the app's MRI page
-- 3. profiles.body_type — "default" | "feminine" illustration preference (Training Zone)

create table if not exists public.mri_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text,
  email text,
  bucket text not null default 'mri-scans',
  storage_path text not null,
  file_name text,
  file_size bigint,
  purpose text not null default 'routine',          -- 'health_concerns' | 'routine'
  notes text,
  status text not null default 'pending',           -- 'pending' | 'processing' | 'processed'
  created_at timestamptz not null default now()
);

alter table public.mri_scans enable row level security;

drop policy if exists "Users can insert their own scan" on public.mri_scans;
create policy "Users can insert their own scan" on public.mri_scans
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can view their own scans" on public.mri_scans;
create policy "Users can view their own scans" on public.mri_scans
  for select using (auth.uid() = user_id);

-- Admin helper: an admin is any row in evionex_profiles with sub_role = 'admin'.
drop policy if exists "Admins can view all scans" on public.mri_scans;
create policy "Admins can view all scans" on public.mri_scans
  for select using (
    exists (
      select 1 from public.evionex_profiles p
      where p.id = auth.uid() and p.sub_role = 'admin'
    )
  );

drop policy if exists "Admins can update scan status" on public.mri_scans;
create policy "Admins can update scan status" on public.mri_scans
  for update using (
    exists (
      select 1 from public.evionex_profiles p
      where p.id = auth.uid() and p.sub_role = 'admin'
    )
  );

create index if not exists mri_scans_user_idx on public.mri_scans (user_id, created_at desc);
create index if not exists mri_scans_status_idx on public.mri_scans (status, created_at desc);

-- -------------------------------------------------------------------------

create table if not exists public.mri_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  -- analyst-uploaded 3D model: URL to a .glb/.gltf (model viewer) OR an image/SVG
  model_url text,
  model_type text default 'none',                    -- 'gltf' | 'image' | 'none'
  -- array of metric objects:
  -- [{ category, name, unit, value, quantifiable, data: [{date, value}, ...] }]
  metrics jsonb not null default '[]'::jsonb,
  analyst_notes text,
  status text not null default 'ready',              -- 'ready' | 'retracted'
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.mri_results enable row level security;

drop policy if exists "Users can view their own results" on public.mri_results;
create policy "Users can view their own results" on public.mri_results
  for select using (auth.uid() = user_id);

drop policy if exists "Admins can view all results" on public.mri_results;
create policy "Admins can view all results" on public.mri_results
  for select using (
    exists (
      select 1 from public.evionex_profiles p
      where p.id = auth.uid() and p.sub_role = 'admin'
    )
  );

drop policy if exists "Admins can manage results" on public.mri_results;
create policy "Admins can manage results" on public.mri_results
  for insert with check (
    exists (
      select 1 from public.evionex_profiles p
      where p.id = auth.uid() and p.sub_role = 'admin'
    )
  );

drop policy if exists "Admins can update results" on public.mri_results;
create policy "Admins can update results" on public.mri_results
  for update using (
    exists (
      select 1 from public.evionex_profiles p
      where p.id = auth.uid() and p.sub_role = 'admin'
    )
  );

drop policy if exists "Admins can delete results" on public.mri_results;
create policy "Admins can delete results" on public.mri_results
  for delete using (
    exists (
      select 1 from public.evionex_profiles p
      where p.id = auth.uid() and p.sub_role = 'admin'
    )
  );

create index if not exists mri_results_user_idx on public.mri_results (user_id);

-- -------------------------------------------------------------------------

-- Public bucket for analyst-produced results (3D models / screenshots).
insert into storage.buckets (id, name, public)
values ('mri-results', 'mri-results', true)
on conflict (id) do update set public = true;

drop policy if exists "Admins can upload results" on storage.objects;
create policy "Admins can upload results" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'mri-results' and
    exists (
      select 1 from public.evionex_profiles p
      where p.id = auth.uid() and p.sub_role = 'admin'
    )
  );

-- Readability is public; the bucket holds analysed model files only.

-- -------------------------------------------------------------------------

-- Training Zone illustration preference.
alter table public.profiles
  add column if not exists body_type text not null default 'default';
-- Allowed values: 'default' | 'feminine'
