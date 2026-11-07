alter table properties add column owner_id uuid references auth.users(id) on delete cascade;
create policy "owner delete" on properties for delete using (auth.uid() = owner_id);

create table if not exists favorites (
  user_id uuid references auth.users(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade,
  primary key (user_id, property_id)
);
alter table favorites enable row level security;
create policy "own favorites select" on favorites for select using (auth.uid() = user_id);
create policy "own favorites insert" on favorites for insert with check (auth.uid() = user_id);
create policy "own favorites delete" on favorites for delete using (auth.uid() = user_id);