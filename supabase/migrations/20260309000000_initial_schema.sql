-- ============================================================
-- Blood Hero - Initial Database Schema
-- ============================================================

-- 1. profiles（擴展 auth.users）
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  gender text check (gender in ('male', 'female')),
  blood_type text check (blood_type in ('A', 'B', 'O', 'AB')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. donation_records（捐血紀錄）
create table public.donation_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  donation_date date not null,
  donation_type text not null check (donation_type in ('whole_250', 'whole_500', 'platelet', 'leukocyte')),
  location_name text,
  notes text,
  next_eligible_date date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. blood_stations（捐血站）
create table public.blood_stations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  lat numeric,
  lng numeric,
  phone text,
  operating_hours text,
  station_type text check (station_type in ('fixed_station', 'mobile_bus')),
  source_url text,
  last_synced_at timestamptz
);

-- 4. donation_events（捐血活動）
create table public.donation_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  start_date date,
  end_date date,
  organizer text,
  source_url text,
  last_synced_at timestamptz
);

-- 5. achievements（成就）
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  threshold_count int not null default 0,
  achievement_type text not null
);

-- 6. user_achievements（使用者成就）
create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at timestamptz default now() not null,
  unique (user_id, achievement_id)
);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_donation_records_user_id on public.donation_records(user_id);
create index idx_donation_records_date on public.donation_records(donation_date desc);
create index idx_user_achievements_user_id on public.user_achievements(user_id);
create index idx_blood_stations_type on public.blood_stations(station_type);
create index idx_donation_events_dates on public.donation_events(start_date, end_date);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- profiles: 使用者只能讀寫自己的資料
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- donation_records: 使用者只能讀寫自己的紀錄
alter table public.donation_records enable row level security;

create policy "Users can view own donation records"
  on public.donation_records for select
  using (auth.uid() = user_id);

create policy "Users can insert own donation records"
  on public.donation_records for insert
  with check (auth.uid() = user_id);

create policy "Users can update own donation records"
  on public.donation_records for update
  using (auth.uid() = user_id);

create policy "Users can delete own donation records"
  on public.donation_records for delete
  using (auth.uid() = user_id);

-- blood_stations: 公開可讀
alter table public.blood_stations enable row level security;

create policy "Blood stations are publicly readable"
  on public.blood_stations for select
  using (true);

-- donation_events: 公開可讀
alter table public.donation_events enable row level security;

create policy "Donation events are publicly readable"
  on public.donation_events for select
  using (true);

-- achievements: 公開可讀
alter table public.achievements enable row level security;

create policy "Achievements are publicly readable"
  on public.achievements for select
  using (true);

-- user_achievements: 使用者只能讀寫自己的
alter table public.user_achievements enable row level security;

create policy "Users can view own achievements"
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "Users can insert own achievements"
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-create profile on user signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Trigger: auto-update updated_at
-- ============================================================
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger donation_records_updated_at
  before update on public.donation_records
  for each row execute procedure public.update_updated_at();
