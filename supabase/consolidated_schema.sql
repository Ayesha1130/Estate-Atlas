-- ==============================================================================
-- PROPERTYHUB PREMIER — UNIFIED MASTER DATABASE MIGRATION SCRIPT
-- Execute in Supabase SQL Editor: Dashboard > SQL Editor > New Query > Run
-- Safe to execute repeatedly (idempotent, does not erase existing data)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  listing TEXT NOT NULL CHECK (listing IN ('buy', 'rent')),
  type TEXT NOT NULL CHECK (type IN ('house', 'apartment', 'plot', 'commercial')),
  price NUMERIC NOT NULL CHECK (price >= 0),
  city TEXT NOT NULL,
  area TEXT,
  bedrooms INT,
  bathrooms INT,
  size_sqft INT NOT NULL DEFAULT 2250,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'closed', 'rejected')),
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure indexes for high-speed discovery and filtering
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_listing ON public.properties(listing);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON public.properties(owner_id);

-- 3. Property Images Table
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  path TEXT,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_images_prop ON public.property_images(property_id, position);

-- 4. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Favorites / Wishlist Table
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, property_id)
);

-- 6. Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_prop ON public.inquiries(property_id);

-- 7. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  text TEXT NOT NULL CHECK (char_length(text) <= 500),
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Admin Security Audit Logs
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Rate Limits Table (Serverless in-database fallback)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  count INT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL
);

-- ==============================================================================
-- DATABASE FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Admin Check Function (Evaluated securely server-side)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- Automatic Profile Creation on User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure all current users have profiles
INSERT INTO public.profiles (id)
SELECT id FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Image Limit Trigger (Max 8 per listing)
CREATE OR REPLACE FUNCTION public.limit_property_images()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT count(*) FROM public.property_images WHERE property_id = new.property_id) >= 8 THEN
    RAISE EXCEPTION 'Maximum 8 photographs allowed per property listing';
  END IF;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS property_images_limit ON public.property_images;
CREATE TRIGGER property_images_limit
BEFORE INSERT ON public.property_images
FOR EACH ROW EXECUTE FUNCTION public.limit_property_images();

-- Keep properties.image in sync with the primary (first) cover photo
CREATE OR REPLACE FUNCTION public.sync_property_cover()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  target_pid UUID := COALESCE(new.property_id, old.property_id);
BEGIN
  UPDATE public.properties
  SET image = COALESCE(
    (SELECT url FROM public.property_images WHERE property_id = target_pid ORDER BY position ASC, id ASC LIMIT 1),
    image
  )
  WHERE id = target_pid;
  RETURN COALESCE(new, old);
END;
$$;

DROP TRIGGER IF EXISTS property_images_sync_cover ON public.property_images;
CREATE TRIGGER property_images_sync_cover
AFTER INSERT OR UPDATE OR DELETE ON public.property_images
FOR EACH ROW EXECUTE FUNCTION public.sync_property_cover();

-- AI Semantic Search Matcher (pgvector cosine similarity)
CREATE OR REPLACE FUNCTION public.match_properties(
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  listing TEXT,
  price NUMERIC,
  city TEXT,
  area TEXT,
  bedrooms INT,
  size_sqft INT,
  similarity FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT id, title, description, listing, price, city, area, bedrooms, size_sqft,
         1 - (embedding <=> query_embedding) AS similarity
  FROM public.properties
  WHERE status = 'approved' AND embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Database-backed rate limiter function
CREATE OR REPLACE FUNCTION public.rate_limit_hit(p_key TEXT, p_limit INT, p_window INT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  c INT;
BEGIN
  INSERT INTO public.rate_limits (key, count, window_start)
  VALUES (p_key, 1, now())
  ON CONFLICT (key) DO UPDATE SET
    count = CASE WHEN public.rate_limits.window_start < now() - make_interval(secs => p_window) THEN 1 ELSE public.rate_limits.count + 1 END,
    window_start = CASE WHEN public.rate_limits.window_start < now() - make_interval(secs => p_window) THEN now() ELSE public.rate_limits.window_start END
  RETURNING count INTO c;
  RETURN c <= p_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.rate_limit_hit(TEXT, INT, INT) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rate_limit_hit(TEXT, INT, INT) TO service_role;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Properties Policies
DROP POLICY IF EXISTS "public read approved" ON public.properties;
DROP POLICY IF EXISTS "read approved own or admin" ON public.properties;
CREATE POLICY "read approved own or admin" ON public.properties
FOR SELECT USING (status = 'approved' OR auth.uid() = owner_id OR is_admin());

DROP POLICY IF EXISTS "owner insert properties" ON public.properties;
CREATE POLICY "owner insert properties" ON public.properties
FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "owner update properties" ON public.properties;
CREATE POLICY "owner update properties" ON public.properties
FOR UPDATE TO authenticated USING (auth.uid() = owner_id OR is_admin());

DROP POLICY IF EXISTS "owner delete properties" ON public.properties;
CREATE POLICY "owner delete properties" ON public.properties
FOR DELETE TO authenticated USING (auth.uid() = owner_id OR is_admin());

-- Property Images Policies
DROP POLICY IF EXISTS "public read images" ON public.property_images;
CREATE POLICY "public read images" ON public.property_images
FOR SELECT USING (true);

DROP POLICY IF EXISTS "owner manage images" ON public.property_images;
CREATE POLICY "owner manage images" ON public.property_images
FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND (p.owner_id = auth.uid() OR is_admin()))
);

-- Profiles Policies
DROP POLICY IF EXISTS "read profile" ON public.profiles;
CREATE POLICY "read profile" ON public.profiles
FOR SELECT USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "update profile" ON public.profiles;
CREATE POLICY "update profile" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Restrict direct role escalation: authenticated users can only update full_name and phone
REVOKE UPDATE ON public.profiles FROM authenticated, anon;
GRANT UPDATE (full_name, phone) ON public.profiles TO authenticated;

-- Favorites Policies
DROP POLICY IF EXISTS "own favorites select" ON public.favorites;
CREATE POLICY "own favorites select" ON public.favorites
FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own favorites insert" ON public.favorites;
CREATE POLICY "own favorites insert" ON public.favorites
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own favorites delete" ON public.favorites;
CREATE POLICY "own favorites delete" ON public.favorites
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Inquiries Policies
DROP POLICY IF EXISTS "anyone can insert inquiry" ON public.inquiries;
CREATE POLICY "anyone can insert inquiry" ON public.inquiries
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "owner or admin read inquiries" ON public.inquiries;
CREATE POLICY "owner or admin read inquiries" ON public.inquiries
FOR SELECT USING (
  is_admin() OR EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid())
);

-- Testimonials Policies
DROP POLICY IF EXISTS "public reads approved testimonials" ON public.testimonials;
CREATE POLICY "public reads approved testimonials" ON public.testimonials
FOR SELECT USING (approved = true);

-- Storage Bucket Configuration (property-images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "property images public read" ON storage.objects;
CREATE POLICY "property images public read" ON storage.objects
FOR SELECT USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "owners upload own folder" ON storage.objects;
CREATE POLICY "owners upload own folder" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "owners delete own files" ON storage.objects;
CREATE POLICY "owners delete own files" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text
);

