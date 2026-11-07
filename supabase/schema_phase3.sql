alter table properties add column status text default 'approved';
drop policy "public read" on properties;
create policy "read approved or own" on properties for select using (status = 'approved' or auth.uid() = owner_id);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  name text, phone text, message text,
  created_at timestamptz default now()
);
alter table inquiries enable row level security;
create policy "anyone can inquire" on inquiries for insert with check (true);