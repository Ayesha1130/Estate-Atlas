import { z } from "zod";
import { CITIES, TYPES } from "./constants";
const optNum = (max: number) => z.preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().min(0).max(max).optional());
export const ListingBody = z.object({
  title: z.string().trim().min(3, "Title is too short").max(120),
  description: z.string().trim().max(1500).default(""),
  listing: z.enum(["buy", "rent"]), type: z.enum(TYPES), city: z.enum(CITIES),
  area: z.string().trim().max(80).default(""),
  price: z.coerce.number({ invalid_type_error: "Enter a valid price" }).positive("Enter a valid price").max(1e11),
  bedrooms: optNum(20), size_sqft: optNum(1e6),
});

// What the AI assistant extracts from a natural-language request. Anything invalid is discarded.
export const SearchFilters = z.object({
  city: z.enum(CITIES).nullish(), listing: z.enum(["buy", "rent"]).nullish(), type: z.enum(TYPES).nullish(),
  min_price: z.number().nonnegative().nullish(), max_price: z.number().nonnegative().nullish(),
  bedrooms: z.number().int().min(0).max(20).nullish(), size_marla: z.number().positive().nullish(),
});
