<<<<<<< HEAD
# PropertyHub Premier — Pakistan's Luxury Real Estate & 3D Architectural Platform

PropertyHub Premier is an elite, world-class luxury real estate platform designed for discerning buyers, high-net-worth investors, and developers across Pakistan's primary metropolitan centers (Lahore, Karachi, Islamabad, Rawalpindi, and Faisalabad).

Inspired by Apple-level visual craftsmanship and international luxury architectural showcases, PropertyHub merges procedural 3D architectural visualization, AI-powered real estate concierges, multi-standard land engineering calculators, and bank-grade Row Level Security (RLS).

---

## Architecture & Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components, Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing, zero compile-time warnings)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom luxury Obsidian, Emerald, and Champagne Gold design system
- **3D Visualization**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Three.js](https://threejs.org/) with procedural modern architectural villa, procedural glass materials, camera rigs, and interactive 3D HTML hotspot pins
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, `pgvector` semantic search, Row Level Security, Storage Buckets, Triggers, and Auth)
- **Artificial Intelligence**: [OpenAI GPT-4o-mini](https://platform.openai.com/) & `text-embedding-3-small` with heuristic Pakistani natural language parsing fallback
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) unit & integration test runner

---

## Key Features & Completed Modules

### 1. 3D Architectural Experience & Luxury Hero
- **Procedural 3D Modern Villa**: Multi-level modern residence with cantilevered pavilions, double-height glass with physical transmission materials, ambient twilight lighting, and reflecting pool basin.
- **Interactive 3D Hotspot Pins**: Real-time 3D markers in canvas space that display architectural specifications on hover.
- **Graceful Non-3D / Mobile Fallback**: Automatic device capability inspection (WebGL detection, core count, and `prefers-reduced-motion`) with toggleable High-Definition Architectural Showcase view.
- **Interactive Hotspot Pins & Carousel**: Inspired by high-end architectural publications with category switcher (`Exterior`, `Amenities`, `Residences`, `Location`) and interactive pulsing callout rings.

### 2. Search & Discovery Engine
- **Multimodal Filter Bar**: Fast filtering by Purpose (`Buy`, `Rent`), Property Type (`House/Villa`, `Apartment`, `Commercial`, `Plot`), City (`Lahore`, `Karachi`, `Islamabad`, `Rawalpindi`, `Faisalabad`), Budget range in Pakistani Lakhs & Crores, Bedrooms, Bathrooms, and Area in Sqft.
- **URL Query Persistence**: All filter configurations and pagination states persist cleanly in query parameters.
- **3D Interactive Property Cards**: Next.js optimized images, instant wishlist toggle, verified badge, Demand price in Lakhs/Crores, and dual area display (Marla + Sqft).
- **Property Detail Page**: High-resolution lightbox gallery with keyboard navigation, interactive location mapping, private viewing scheduling form, financing breakdown, and similar estate recommendations.

### 3. Engineering Tools & Regional Calculators
- **Universal Land Area Converter**: Real-time conversions across Marla, Kanal, Square Feet, Square Yards (Guz), and Acres.
- **Configurable Pakistani Marla Standards**:
  - **LDA / Lahore Standard (225 sqft)**: Standard for Lahore Development Authority and modern housing societies across Punjab.
  - **CDA / Bahria Standard (250 sqft)**: Standard utilized in Islamabad CDA sectors and Bahria Town.
  - **Board of Revenue / Patwar Standard (272.25 sqft)**: Official government revenue standard based on 9 square karams (30.25 sq yards).
- **Property Valuation & Per-Sqft Deriver**: Demand calculation with automated price-per-square-foot benchmarking.
- **2026 Pakistani Construction Cost Estimator**: Itemized Grey Structure (~55%) and Turnkey A+ Luxury Finishing (~45%) outlays.
- **Islamic / Commercial Home Finance Simulator**: Dynamic down payment percentages, tenure from 3 to 25 years, KIBOR spread modeling, and annual amortization schedule.

### 4. AI Real Estate Concierge
- **Pakistani Natural Language Comprehension**: Understands queries such as:
  - *"Find a 10 marla house in Lahore under 3.5 crore"*
  - *"3 bed apartment in Clifton Karachi for rent under 1.5 lakh"*
  - *"Commercial plot in Islamabad"*
- **Resilient Fallback Engine**: If the OpenAI API key is unavailable or credits expire, the concierge does **not** fail—it parses cities, budgets, property types, and Marla dimensions using local regex heuristics and queries verified database records directly.

### 5. Private User & Executive Admin Dashboards
- **User Dashboard**: List properties, track approval state (`Approved`, `Pending`, `Closed`, `Rejected`), manage photo galleries, mark listings as closed or reopened, and review received client inquiries.
- **Executive Admin Console**: Server-side role enforcement (database-verified `profiles.role = 'admin'`), moderation workflow (`Approve`, `Reject`, `Delete`), role promotion/demotion with self-protection safeguards, and security audit log tracking.

### 6. Full Urdu & English Localization
- **Complete RTL Layout**: Dynamic document-level `dir="rtl"` toggling with typography mirroring for Urdu (`اردو`).
- **Comprehensive Bilingual Vocabulary**: Complete translations across search, calculators, property specifications, legal disclaimers, and dashboard workflows.

---

## Installation & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v18.17 or higher
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A free [Supabase](https://supabase.com/) project

### 1. Clone & Install Dependencies
```bash
cd property-hub
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials and optional OpenAI API key:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key # Optional: falls back gracefully if omitted
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Setup Database Schema
Open your Supabase project dashboard, navigate to **SQL Editor > New Query**, paste the contents of `supabase/consolidated_schema.sql`, and click **Run**.

This unified migration sets up:
- Tables: `properties`, `property_images`, `profiles`, `favorites`, `inquiries`, `testimonials`, `admin_logs`, and `rate_limits`.
- Extensions: `vector` (pgvector semantic search) and `uuid-ossp`.
- Row Level Security (RLS) policies and triggers.
- Storage bucket: `property-images` with 5 MB file size limit and image mime-type restrictions.

### 4. Seed Demo Data (Optional)
To seed 20 premier properties across Lahore, Karachi, and Islamabad with multi-image galleries:
```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Creating an Administrator Account

1. Register a new user account through `/login` (select "New to PropertyHub? Create an account").
2. In your Supabase Dashboard, open **SQL Editor** and promote your profile to `admin`:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```
3. Refresh your browser or sign in again. The **Admin** console link will appear in your top navigation bar, granting access to `/admin`.

---

## Testing & Verification

Run the automated Vitest test suite:
```bash
npm test
```

Execute TypeScript typechecking:
```bash
npx tsc --noEmit
```

Build the production distribution:
```bash
npm run build
```

---

## Rate Limiting Architecture

PropertyHub Premier implements a 3-tier rate limiting strategy:
1. **Tier 1 (Upstash Redis)**: If `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, queries are piped through Redis pipelines for distributed serverless edge clusters.
2. **Tier 2 (PostgreSQL Stored Procedure)**: In production environments without Redis, the system synchronizes rate limits across all serverless instances via the `public.rate_limit_hit` stored procedure.
3. **Tier 3 (In-Memory Sliding Window)**: In local development and single-instance environments, requests are tracked using a safe, bounded in-memory sliding window token bucket with automatic stale timestamp pruning.

---

## Production Deployment (Vercel)

1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com/), create a new project and import your repository.
3. Add the environment variables defined in `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your custom domain, e.g., `https://premier.propertyhub.pk`)
4. In Supabase Dashboard under **Authentication > URL Configuration**, add your production domain to the **Redirect URLs**.
5. Deploy. All static assets, 3D scenes, server components, and API routes will build and optimize automatically.

---

## Remaining Honest Limitations & Recommendations

1. **Geolocation Pin Accuracy**: The location map embeds OpenStreetMap at the city and major sector level. Exact latitude/longitude pins are restricted to private appointment viewings to protect seller privacy and comply with Pakistani society regulations.
2. **OpenAI API Quotas**: If your OpenAI account experiences rate limits or exhausted credits, the AI Concierge continues to function via heuristic keyword extraction. Adding your own paid OpenAI API key activates full neural GPT-4o-mini dialogue.
3. **Email Confirmation**: In production, ensure Supabase Auth SMTP is configured with your corporate domain (e.g. via Resend or SendGrid) for branded password reset and email confirmation messages.
=======
# Estate-Atlas
Premium real estate platform with 3D experience, AI property assistant, admin moderation and Urdu/English support. Built with Next.js, TypeScript, Supabase and OpenAI.
>>>>>>> d11a86b5feb79c3a5a6146664cedc6b3a64fc7ec
