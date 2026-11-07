alter table properties add constraint properties_status_check check (status in ('pending','approved','closed','rejected'));

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  text text not null check (char_length(text) <= 300),
  approved boolean not null default false,
  created_at timestamptz default now()
);
alter table testimonials enable row level security;
create policy "public reads approved testimonials" on testimonials for select using (approved);