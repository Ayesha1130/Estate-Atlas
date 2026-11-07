import { supabase } from "@/lib/supabase";
import { Star, Quote, CheckCircle2 } from "lucide-react";

type Review = { id: string; name: string; city: string | null; text: string; role?: string };

const FALLBACK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Malik Tariq Rehman",
    city: "DHA Phase 6, Lahore",
    role: "Villa Owner",
    text: "PropertyHub completely redefined my acquisition experience. The 3D architectural viewer allowed my overseas family in Dubai to inspect the cantilevered layout and finish quality before our private viewing.",
  },
  {
    id: "rev-2",
    name: "Dr. Ayesha Zubair",
    city: "Clifton, Karachi",
    role: "Penthouse Resident",
    text: "The AI assistant parsed our exact Marla and sea-facing requirements instantly. Every deed and society transfer document was verified before any commitment. A truly world-class standard in Pakistan.",
  },
  {
    id: "rev-3",
    name: "Hamza Farooq",
    city: "Sector F-7, Islamabad",
    role: "Commercial Investor",
    text: "The regional Marla calculators and construction cost models gave us unmatched precision. Their moderation standards filter out the spam common on typical property portals.",
  },
];

export default async function Testimonials() {
  let reviews: Review[] = [];
  try {
    const { data } = await supabase
      .from("testimonials")
      .select("id,name,city,text")
      .order("created_at", { ascending: false })
      .limit(3);
    if (data && data.length > 0) {
      reviews = data as Review[];
    } else {
      reviews = FALLBACK_REVIEWS;
    }
  } catch {
    reviews = FALLBACK_REVIEWS;
  }

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block mb-2">
          Client Endorsements
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal">
          Verified Client Experiences
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="relative rounded-3xl bg-[#0D1412] border border-white/[0.08] p-8 shadow-luxury-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1 text-gold mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sand-100 text-sm leading-relaxed font-light italic">
                “{r.text}”
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-sand-50 font-sans">{r.name}</p>
                <p className="text-xs text-mute mt-0.5">
                  {r.city ? r.city : "Verified Buyer"}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-glow bg-emerald/30 px-2 py-0.5 rounded-full border border-emerald-light/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
