create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);
alter table profiles enable row level security;

create or replace function is_admin() returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create policy "own profile read" on profiles for select using (auth.uid() = id or is_admin());
create policy "own profile update" on profiles for update using (auth.uid() = id);
revoke update on profiles from authenticated, anon;
grant update (full_name, phone) on profiles to authenticated;

create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name') on conflict do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
insert into profiles (id) select id from auth.users on conflict do nothing;

drop policy "read approved or own" on properties;
create policy "read approved own or admin" on properties for select using (status = 'approved' or auth.uid() = owner_id or is_admin());

create policy "owner reads inquiries" on inquiries for select using (
  is_admin() or exists (select 1 from properties p where p.id = property_id and p.owner_id = auth.uid())
);

create table if not exists admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  target text,
  created_at timestamptz default now()
);
alter table admin_logs enable row level security;

create index if not exists properties_filter_idx on properties (status, listing, city, type);
create index if not exists properties_owner_idx on properties (owner_id);
create index if not exists inquiries_property_idx on inquiries (property_id);
create index if not exists favorites_property_idx on favorites (property_id);