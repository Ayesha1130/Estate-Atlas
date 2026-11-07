export const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad"] as const;
export type CityName = (typeof CITIES)[number];

export const TYPES = ["house", "apartment", "plot", "commercial"] as const;
export type PropertyType = (typeof TYPES)[number];

export const CITY_COORDS: Record<string, [number, number]> = {
  Lahore: [31.5204, 74.3587],
  Karachi: [24.8607, 67.0011],
  Islamabad: [33.6844, 73.0479],
  Rawalpindi: [33.5651, 73.0169],
  Faisalabad: [31.4504, 73.135],
};

export const POPULAR_LOCATIONS: {
  city: CityName;
  area: string;
  count: number;
  image: string;
  tag: string;
}[] = [
  {
    city: "Lahore",
    area: "DHA Phase 5 & 6",
    count: 148,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    tag: "Ultra Luxury Mansions",
  },
  {
    city: "Karachi",
    area: "Clifton & DHA Phase 8",
    count: 212,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    tag: "Seafront Penthouses",
  },
  {
    city: "Islamabad",
    area: "Sector F-6 & F-7",
    count: 94,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    tag: "Margalla Diplomatic Enclave",
  },
  {
    city: "Rawalpindi",
    area: "Bahria Town Phase 7 & 8",
    count: 120,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    tag: "Gated Communities",
  },
  {
    city: "Lahore",
    area: "Gulberg III",
    count: 85,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    tag: "High-Rise Commercial",
  },
  {
    city: "Faisalabad",
    area: "Canal Road & Kohinoor",
    count: 67,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    tag: "Prime Estates",
  },
];

export const LUXURY_CATEGORIES = [
  {
    id: "buy",
    title: "Signature Villas & Mansions",
    subtitle: "Custom-built 1 to 4 Kanal designer estates",
    href: "/properties?listing=buy&type=house",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "rent",
    title: "Panoramic Penthouses",
    subtitle: "Executive living with private pools & skyline views",
    href: "/properties?listing=rent&type=apartment",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "commercial",
    title: "Corporate Towers & Retail",
    subtitle: "High-yield investment assets in primary financial hubs",
    href: "/properties?type=commercial",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "plots",
    title: "Prime Residential Plots",
    subtitle: "LDA, CDA & Bahria possession plots ready for construction",
    href: "/properties?type=plot",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
  },
];

export const CURATED_ARCHITECTURAL_SHOWCASE = [
  {
    id: "residence-1",
    name: "The Obsidian Pavilion",
    location: "DHA Phase 6, Lahore",
    category: "Exterior",
    tag: "Architectural Landmark",
    price: 385000000, // 38.5 Crore
    specs: "2 Kanal · 6 Beds · 8 Baths · Infinity Pool",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    hotspots: [
      {
        id: "pool",
        title: "Heated Infinity Edge Pool",
        subtitle: "Imported Italian mosaic tile with underwater sound system",
        top: "68%",
        left: "72%",
      },
      {
        id: "facade",
        title: "Travertine & Charcoal Zinc Cladding",
        subtitle: "Thermally broken floor-to-ceiling double-glazed curtain walls",
        top: "34%",
        left: "48%",
      },
      {
        id: "terrace",
        title: "Cantilevered Sky Terrace",
        subtitle: "Panoramic 270° views across Lahore Golf & Country Club",
        top: "22%",
        left: "24%",
      },
    ],
  },
  {
    id: "residence-2",
    name: "Azure Marina Residence",
    location: "Creek Vistas, DHA Phase 8, Karachi",
    category: "Residences",
    tag: "Seafront Haven",
    price: 240000000, // 24 Crore
    specs: "8,500 sqft · 5 Beds · Ocean Balcony · 4 Car Park",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
    hotspots: [
      {
        id: "living",
        title: "Double-Height Grand Salon",
        subtitle: "Greek Thassos white marble with minimalist ambient cove lighting",
        top: "52%",
        left: "38%",
      },
      {
        id: "view",
        title: "Arabian Sea Horizon View",
        subtitle: "Unobstructed sunset oceanfront panorama",
        top: "36%",
        left: "76%",
      },
    ],
  },
  {
    id: "residence-3",
    name: "Margalla Crest Villa",
    location: "Sector E-7, Islamabad",
    category: "Amenities",
    tag: "Diplomatic Sector",
    price: 490000000, // 49 Crore
    specs: "4 Kanal · 7 Beds · Private Cinema · Smart Home",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    hotspots: [
      {
        id: "wellness",
        title: "Private Wellness Spa & Sauna",
        subtitle: "Nordic cedar wood dry sauna with adjacent cold plunge",
        top: "62%",
        left: "58%",
      },
      {
        id: "court",
        title: "Lush Zen Courtyard",
        subtitle: "Fountain wall framed by mature pine trees against Margalla Hills",
        top: "45%",
        left: "28%",
      },
    ],
  },
];
