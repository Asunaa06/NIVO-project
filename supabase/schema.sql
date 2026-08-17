-- NIVO full database schema for Supabase
-- This script creates the base tables, relationships, indexes, and RLS policies.

create extension if not exists "pgcrypto";

-- 1) profiles
create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    full_name text,
    avatar_url text,
    current_streak integer not null default 0,
    last_study_date date,
    created_at timestamptz not null default now()
);

-- 2) subjects
create table if not exists public.subjects (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    icon text,
    color text,
    created_at timestamptz not null default now()
);

-- 3) lessons
create table if not exists public.lessons (
    id uuid primary key default gen_random_uuid(),
    subject_id uuid not null references public.subjects (id) on delete cascade,
    title text not null,
    content text,
    review_method text,
    content_url text,
    anki_link text,
    anki_count integer not null default 0,
    bac_appearances integer not null default 0,
    bac_years text[] not null default '{}',
    order_index integer not null default 0,
    created_at timestamptz not null default now()
);

-- 3b) tips
create table if not exists public.tips (
    id uuid primary key default gen_random_uuid(),
    text text not null,
    created_at timestamptz not null default now()
);

-- 3c) resources
create table if not exists public.resources (
    id uuid primary key default gen_random_uuid(),
    lesson_id uuid not null references public.lessons (id) on delete cascade,
    title text not null,
    description text,
    link text,
    created_by uuid not null references public.profiles (id) on delete cascade,
    upvotes integer not null default 0,
    created_at timestamptz not null default now()
);

-- 4) lesson_progress
create table if not exists public.lesson_progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles (id) on delete cascade,
    lesson_id uuid not null references public.lessons (id) on delete cascade,
    completed boolean not null default false,
    last_review_date timestamptz,
    next_review_date timestamptz,
    level integer not null default 0,
    created_at timestamptz not null default now(),
    unique (user_id, lesson_id)
);

-- 5) user_events
create table if not exists public.user_events (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles (id) on delete cascade,
    title text not null,
    description text,
    event_date date not null,
    created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_lessons_subject_id
    on public.lessons (subject_id, order_index);

create index if not exists idx_resources_lesson_id
    on public.resources (lesson_id);

create index if not exists idx_tips_created_at
    on public.tips (created_at);

create index if not exists idx_lesson_progress_user_id
    on public.lesson_progress (user_id);

create index if not exists idx_lesson_progress_lesson_id
    on public.lesson_progress (lesson_id);

create index if not exists idx_lesson_progress_next_review
    on public.lesson_progress (next_review_date);

create index if not exists idx_user_events_user_id
    on public.user_events (user_id);

create index if not exists idx_user_events_event_date
    on public.user_events (event_date);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.lessons enable row level security;
alter table public.tips enable row level security;
alter table public.resources enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.user_events enable row level security;

-- profiles policies
create policy "Profiles can be viewed by owner"
    on public.profiles for select
    using (id = auth.uid());

create policy "Profiles can be inserted by owner"
    on public.profiles for insert
    with check (id = auth.uid());

create policy "Users can only update their own profile and streak"
    on public.profiles for update
    using (id = auth.uid())
    with check (
        id = auth.uid()
        and current_streak >= 0
        and (last_study_date is null or last_study_date <= current_date)
    );

create policy "Profiles can be deleted by owner"
    on public.profiles for delete
    using (id = auth.uid());

-- Daily streak function
create or replace function public.increment_streak(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    v_last_study_date date;
    v_today date := current_date;
begin
    if p_user_id is null then
        raise exception 'user_id is required';
    end if;

    if p_user_id <> auth.uid() then
        raise exception 'You can only update your own streak';
    end if;

    select last_study_date
    into v_last_study_date
    from public.profiles
    where id = p_user_id
    for update;

    if v_last_study_date is null then
        update public.profiles
        set current_streak = 1,
            last_study_date = v_today
        where id = p_user_id;
        return;
    end if;

    if v_last_study_date = v_today - 1 then
        update public.profiles
        set current_streak = coalesce(current_streak, 0) + 1,
            last_study_date = v_today
        where id = p_user_id;
        return;
    end if;

    if v_last_study_date = v_today then
        return;
    end if;

    update public.profiles
    set current_streak = 0,
        last_study_date = v_today
    where id = p_user_id;
end;
$$;

grant execute on function public.increment_streak(uuid) to authenticated;

-- subjects policies
-- Public read access for reference data; write access restricted to service role/admin operations.
create policy "Subjects are viewable by everyone"
    on public.subjects for select
    using (true);

create policy "Subjects can be inserted by service role"
    on public.subjects for insert
    with check (auth.role() = 'service_role');

create policy "Subjects can be updated by service role"
    on public.subjects for update
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');

create policy "Subjects can be deleted by service role"
    on public.subjects for delete
    using (auth.role() = 'service_role');

-- lessons policies
create policy "Lessons are viewable by everyone"
    on public.lessons for select
    using (true);

create policy "Lessons can be inserted by service role"
    on public.lessons for insert
    with check (auth.role() = 'service_role');

create policy "Lessons can be updated by service role"
    on public.lessons for update
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');

create policy "Lessons can be deleted by service role"
    on public.lessons for delete
    using (auth.role() = 'service_role');

-- tips policies
create policy "Tips are viewable by everyone"
    on public.tips for select
    using (true);

create policy "Tips can be inserted by service role"
    on public.tips for insert
    with check (auth.role() = 'service_role');

create policy "Tips can be updated by service role"
    on public.tips for update
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');

create policy "Tips can be deleted by service role"
    on public.tips for delete
    using (auth.role() = 'service_role');

-- resources policies
create policy "Resources are viewable by everyone"
    on public.resources for select
    using (true);

create policy "Resources can be inserted by authenticated users"
    on public.resources for insert
    with check (auth.uid() = created_by);

create policy "Resources can be updated by owner"
    on public.resources for update
    using (auth.uid() = created_by)
    with check (auth.uid() = created_by);

create policy "Resources can be deleted by owner"
    on public.resources for delete
    using (auth.uid() = created_by);

-- lesson_progress policies
create policy "Lesson progress can be viewed by owner"
    on public.lesson_progress for select
    using (user_id = auth.uid());

create policy "Lesson progress can be inserted by owner"
    on public.lesson_progress for insert
    with check (user_id = auth.uid());

create policy "Lesson progress can be updated by owner"
    on public.lesson_progress for update
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy "Lesson progress can be deleted by owner"
    on public.lesson_progress for delete
    using (user_id = auth.uid());

-- user_events policies
create policy "User events can be viewed by owner"
    on public.user_events for select
    using (user_id = auth.uid());

create policy "User events can be inserted by owner"
    on public.user_events for insert
    with check (user_id = auth.uid());

create policy "User events can be updated by owner"
    on public.user_events for update
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy "User events can be deleted by owner"
    on public.user_events for delete
    using (user_id = auth.uid());

-- Optional: a helper trigger to auto-create a profile row after signup
-- uncomment it if you want new auth users to get a profile automatically.
-- create or replace function public.handle_new_user()
-- returns trigger
-- language plpgsql
-- security definer
-- set search_path = public
-- as $$
-- begin
--   insert into public.profiles (id, full_name)
--   values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', 'New User'))
--   on conflict (id) do nothing;
--   return new;
-- end;
-- $$;
--
-- drop trigger if exists on_auth_user_created on auth.users;
-- create trigger on_auth_user_created
-- after insert on auth.users
-- for each row execute procedure public.handle_new_user();
