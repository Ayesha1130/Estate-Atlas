import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
export { pkr } from "./format";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// Browser: session lives in cookies (shared with the server). Server components: plain anon client.
export const supabase = typeof window === "undefined" ? createClient(url, key) : createBrowserClient(url, key);
export type Property = {
  id: string; title: string; description: string; listing: "buy" | "rent"; type: string;
  price: number; city: string; area: string; bedrooms: number | null; bathrooms: number | null;
  size_sqft: number; image: string; owner_id?: string; status?: string;
};
