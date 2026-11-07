import Hero from "@/components/Hero";
import { Categories, Locations, Why, Cta } from "@/components/HomeSections";
import Testimonials from "@/components/Testimonials";
import FeaturedTitle from "@/components/FeaturedTitle";
import PropertyCard from "@/components/PropertyCard";
import { supabase, Property } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DEMO_PREMIER_PROPERTIES: Property[] = [
  {
    id: "premier-lahore-1",
    title: "1 Kanal Signature Modern Architectural Villa in DHA Phase 6",
    description: "Architect-designed 5 bedroom villa with double-height lobby, imported Italian porcelain flooring, private pool, and integrated solar system.",
    listing: "buy",
    type: "house",
    price: 98000000, // 9.8 Crore
    city: "Lahore",
    area: "DHA Phase 6",
    bedrooms: 5,
    bathrooms: 6,
    size_sqft: 4500, // 1 Kanal
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    status: "approved",
  },
  {
    id: "premier-karachi-1",
    title: "Executive Sea-Facing Penthouse at Creek Vistas, DHA Phase 8",
    description: "Spectacular 4 bedroom duplex penthouse overlooking the Arabian Sea. Features wraparound terrace, private lift access, and club membership.",
    listing: "buy",
    type: "apartment",
    price: 145000000, // 14.5 Crore
    city: "Karachi",
    area: "Clifton / DHA Phase 8",
    bedrooms: 4,
    bathrooms: 5,
    size_sqft: 6200,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    status: "approved",
  },
  {
    id: "premier-islamabad-1",
    title: "2 Kanal Classical Diplomatic Residence in Sector F-7/2",
    description: "Prestigious residence against the backdrop of Margalla Hills. Features manicured lawns, basement home cinema, heated pool, and separate guard quarters.",
    listing: "buy",
    type: "house",
    price: 260000000, // 26 Crore
    city: "Islamabad",
    area: "Sector F-7/2",
    bedrooms: 6,
    bathrooms: 7,
    size_sqft: 9000, // 2 Kanal
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    status: "approved",
  },
  {
    id: "premier-lahore-rent",
    title: "Designer Furnished 3-Bed Penthouse in Gulberg III",
    description: "Turnkey luxury living in the commercial heart of Lahore. Fully automated lighting, floor-to-ceiling glass, and 24/7 concierge security.",
    listing: "rent",
    type: "apartment",
    price: 450000, // 4.5 Lakh / month
    city: "Lahore",
    area: "Gulberg III",
    bedrooms: 3,
    bathrooms: 4,
    size_sqft: 3200,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    status: "approved",
  },
  {
    id: "premier-rawalpindi-1",
    title: "10 Marla Luxury Contemporary House in Bahria Town Phase 8",
    description: "Brand new solid construction with Spanish tile, grohe fittings, solid ash wood doors, and imported modern kitchen with appliances.",
    listing: "buy",
    type: "house",
    price: 42500000, // 4.25 Crore
    city: "Rawalpindi",
    area: "Bahria Town Phase 8",
    bedrooms: 5,
    bathrooms: 6,
    size_sqft: 2250, // 10 Marla
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    status: "approved",
  },
  {
    id: "premier-commercial-1",
    title: "Prime Commercial Corporate Plaza Floor in Blue Area",
    description: "Grade-A corporate office space with high-speed elevators, dedicated underground parking, and panoramic views of Jinnah Avenue.",
    listing: "buy",
    type: "commercial",
    price: 85000000, // 8.5 Crore
    city: "Islamabad",
    area: "Blue Area",
    bedrooms: null,
    bathrooms: 4,
    size_sqft: 4000,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    status: "approved",
  },
];

export default async function Home() {
  let properties: Property[] = [];
  try {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);
    if (data && data.length > 0) {
      properties = data as Property[];
    } else {
      properties = DEMO_PREMIER_PROPERTIES;
    }
  } catch {
    properties = DEMO_PREMIER_PROPERTIES;
  }

  return (
    <main className="w-full">
      <Hero />
      <Categories />
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <FeaturedTitle />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {properties.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      </section>
      <Locations />
      <Why />
      <Testimonials />
      <Cta />
    </main>
  );
}
