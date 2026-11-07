create extension if not exists vector;
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  listing text not null check (listing in ('buy','rent')),
  type text not null,
  price numeric not null,
  city text not null,
  area text,
  bedrooms int,
  bathrooms int,
  size_sqft int,
  image text,
  embedding vector(1536),
  created_at timestamptz default now()
);
alter table properties enable row level security;
create policy "public read" on properties for select using (true);

create or replace function match_properties(query_embedding vector(1536), match_count int default 5)
returns table (id uuid, title text, description text, listing text, price numeric, city text, area text, bedrooms int, similarity float)
language sql stable as $$
  select id, title, description, listing, price, city, area, bedrooms,
         1 - (embedding <=> query_embedding) as similarity
  from properties order by embedding <=> query_embedding limit match_count;
$$;
