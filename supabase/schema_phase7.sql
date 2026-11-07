insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-images', 'property-images', true, 5242880, array['image/jpeg','image/png','image/webp']);

create policy "property images public read" on storage.objects for select using (bucket_id = 'property-images');
create policy "owners upload own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'property-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "owners delete own files" on storage.objects for delete to authenticated
  using (bucket_id = 'property-images' and (storage.foldername(name))[1] = auth.uid()::text);

alter table property_images add column path text;
create policy "owner inserts images" on property_images for insert to authenticated
  with check (exists (select 1 from properties p where p.id = property_id and p.owner_id = auth.uid()));
create policy "owner updates images" on property_images for update to authenticated
  using (exists (select 1 from properties p where p.id = property_id and p.owner_id = auth.uid()));
create policy "owner deletes images" on property_images for delete to authenticated
  using (exists (select 1 from properties p where p.id = property_id and p.owner_id = auth.uid()));

create or replace function limit_images() returns trigger language plpgsql as $$
begin
  if (select count(*) from property_images where property_id = new.property_id) >= 8 then
    raise exception 'Maximum 8 images per property';
  end if;
  return new;
end;
$$;
create trigger property_images_limit before insert on property_images for each row execute function limit_images();

create or replace function sync_cover() returns trigger language plpgsql security definer set search_path = public as $$
declare pid uuid := coalesce(new.property_id, old.property_id);
begin
  update properties set image = coalesce((select url from property_images where property_id = pid order by position, id limit 1), image) where id = pid;
  return coalesce(new, old);
end;
$$;
create trigger property_images_cover after insert or update or delete on property_images for each row execute function sync_cover();

create table if not exists rate_limits (key text primary key, count int not null, window_start timestamptz not null);
alter table rate_limits enable row level security;

create or replace function rate_limit_hit(p_key text, p_limit int, p_window int) returns boolean
language plpgsql security definer set search_path = public as $$
declare c int;
begin
  insert into rate_limits (key, count, window_start) values (p_key, 1, now())
  on conflict (key) do update set
    count = case when rate_limits.window_start < now() - make_interval(secs => p_window) then 1 else rate_limits.count + 1 end,
    window_start = case when rate_limits.window_start < now() - make_interval(secs => p_window) then now() else rate_limits.window_start end
  returning count into c;
  return c <= p_limit;
end;
$$;
revoke all on function rate_limit_hit(text, int, int) from public, anon, authenticated;
grant execute on function rate_limit_hit(text, int, int) to service_role;