create table if not exists property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  url text not null,
  position int not null default 0
);
create index if not exists property_images_property_idx on property_images (property_id, position);
alter table property_images enable row level security;
create policy "images follow property visibility" on property_images for select
  using (exists (select 1 from properties p where p.id = property_id));