<div align="center">

# Prava Travel Workspace V2
### The AI-Augmented Travel Workspace

**Workspace First, AI Second.** A persistent, structured productivity workspace for modern travelers — combining Linear & Notion-grade trip organization with contextual Gemini intelligence and live travel essentials.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_%2F_3.x_Flash-4285F4?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
[![Polar](https://img.shields.io/badge/Billing-Polar_Sandbox-blueviolet?style=flat)](https://polar.sh/)

</div>

---

## 🌟 Overview & Product Philosophy

Travel planning is notoriously fragmented across disconnected spreadsheets, note apps, booking confirmations, weather forecasts, and chat threads. General-purpose chatbots can spit out generic bullet points, but they cannot maintain persistent state, reconcile budgets, or act as an ongoing source of truth before, during, and after travel.

**Prava Travel Workspace V2** rejects both conversational "AI slop" and monolithic 15-field creation forms. Instead, it provides a high-density, high-efficiency travel workspace modeled after **Linear, Notion, GitHub, and Stripe Dashboard**.

- **Workspace First**: Structured, durable, user-owned data is the core foundation. Every single workflow can be completed 100% manually with zero AI dependency.
- **AI Second**: The AI assistant (**Ichinose**) is an assistive accelerant layered on top of your persisted workspace data. It suggests, drafts, summarizes, and generates reviewable structured action proposals.
- **"The Application Remembers, The LLM Does Not"**: The LLM is stateless. Continuity, context assembly, and conversation histories are persisted in PostgreSQL via Prisma.
- **High-Affordance Design**: Crisp data-dense cards (`rounded-sm` / `rounded-md`), generous whitespace, calm typography, and zero decorative glassmorphism or floating gimmicks.

---

## ✨ Key Modules & Architecture

### 🧳 1. Trip Workspace (7 Integrated Sub-Modules)
Every trip operates in its own dedicated workspace powered by router-driven, accessible `shadcn/ui` tabs:

1. **Overview Dashboard**:
   - High-level trip KPI metrics (days countdown, budget spent vs total headroom, packing readiness, stops count).
   - Unsplash tour-vibe destination cover photography with 6-image interactive modal picker.
   - Direct 1-click **Google Calendar & RFC 5545 `.ics` Export** for entire trips or single activities.
   - Scheduled dates advisory banner when trip dates have elapsed while still in `PLANNING` status.
2. **Itinerary Timeline**:
   - **Empty-State AI Kickstart**: When an itinerary has 0 activities, travelers can one-click kickstart a tailored multi-day draft based on trip duration and preferences.
   - **Manual Planning**: Full CRUD with day filters, start times, categories (Activity, Food, Transit), locations, and cost tracking.
3. **Accommodations & Stays**:
   - Lodging management (Hotels, Hostels, Airbnbs, Resorts) with check-in/out dates, addresses, confirmation codes, provider contacts, and nightly cost breakdowns.
4. **Expense Tracker & Financials**:
   - Real-time spending ledger categorized by Lodging, Food, Transport, Flight, Activities, Shopping, and Other.
   - Cross-trip **Travel Financials Dialog** tracking unassigned general overheads (Passports/Visas, Gear, Travel Insurance, SIMs).
5. **Notes & Documentation**:
   - Rich Markdown documentation with note pinning, category filtering, and instant search.
6. **Checklist & Packing**:
   - Interactive packing lists and pre-departure tasks with category filtering, due dates, completion percentages, and instant auto-save.
7. **Links & Bookmarks**:
   - Trip reference links, reservation bookmarks, and article archives with domain badges and 1-click **"Import from Vault"** bridge.

---

### 🤖 2. Ichinose AI Assistant & Transactional Proposals

- **Right-Side 3-Column Companion Architecture**:
  - Integrated directly into `AppShell` as a persistent flex companion alongside the Sidebar (`w-52`) and Center Canvas (`flex-1`).
  - Symmetrical theme mirroring: dark obsidian navy (`#090E1A`) in light mode, crisp slate in dark mode.
- **Gemini Model Cascade**:
  - **Planning & Proposals**: Google Gemini 2.5 Flash / 3.x Flash via `@google/genai`.
  - **Conversational & Free Fallback**: Seamless fallback to OpenRouter Free (`nvidia/nemotron-3.5-lightning:free`, `openrouter/free`) when monthly credits are depleted.
- **Deterministic Complexity Evaluation**:
  - Automatically assesses prompt intent: Quick Tool (1 credit), Advisory (2 credits), Specialized Checklist/Notes (3 credits), Heavy Planning (5 credits).
- **Transactional Proposal Engine (`AiProposal`)**:
  - Gemini outputs structured JSON payloads conforming to `aiProposalPayloadSchema`.
  - The traveler visually reviews proposed changes in `AiProposalCard` with field diffs, checkboxes, and overflow-proof actions (`Accept All`, `Apply Selected`, `Reject`).
  - On acceptance, an atomic Prisma `$transaction` commits validated records into PostgreSQL.
- **Multi-Session Conversation Threads**:
  - Thread drawer supporting up to 15 messages per conversation, inline thread title renaming, and deletion.
  - Thinking pulse loading indicator with elapsed time counter and step-by-step reasoning progress.
  - Dynamic user profile avatars rendered in chat bubbles.

---

### 🌍 3. Live Travel Essentials (Max-Width 7XL)

Refactored to a spacious **Max-Width 7XL** layout featuring a deep obsidian dark aesthetic (`#0C1322`, `#080D18`) paired with Prava Cerulean Blue accents (`#2D9BF0`):

1. **Weather Forecast**: Powered by OpenWeather API with 5-day / 3-hour granular timelines, atmospheric matrix (humidity, wind speed, precipitation probability, pressure, UV index), and metro quick-pills.
2. **Currency Exchange & Trend Analytics**: Live European Central Bank rates via the Frankfurter API, interactive multi-timeframe SVG performance line charts (7D, 1M, 3M, 1Y), and personal watchlists.
3. **Country Guide**: Live country profiles for 250+ nations via REST Countries v3.1 (Emergency Dispatch Hub, AI travel summary & news feed, cultural dos & don'ts, fast facts).
4. **Interactive Leaflet Maps**: OpenStreetMap integration with Nominatim geocoding, GPS location finder, destination quick-pins, and nearby essentials search.
5. **Worldwide Emergency Hub**: Verified emergency dispatch numbers (Police, Ambulance, Fire) for international travelers.
6. **Language Phrasebook**: Interactive audio keypad reader with Web Speech API pronunciation, bidirectional translation, and category filters.
7. **Travel Resource Vault**: Centralized travel bookmark repository with 1-click **"Attach to Trip"** bridge.

---

### 👥 4. Community Hub, Travel Stories & Creator Profiles

- **Curated Itineraries (`/templates`)**: Handcrafted itineraries for world-class destinations (Kyoto, Amalfi Coast, Swiss Alps, Paris, Bali) with **1-Click Workspace Cloning**.
- **Travel Stories (`/stories`)**: Long-form Markdown travel blog posts with linked trips, upvoting, and reading time estimates.
- **Discussion Forum (`/forum`)**: Community threads covering route advice, packing tips, and local secrets with nested replies and upvoting.
- **Public Creator Profiles (`/u/[username]`)**: Showcases verified creators, bios, published itineraries, and travel stories under an immutable `@username` handle.

---

### 💳 5. Subscription Billing & Quota Governance

- **Polar Integration (`/subscription`, `/usage`)**:
  - Sandboxed and production-ready recurring billing powered by Polar.
  - Customer Portal session launch for payment method updates and billing history.
  - Webhook listener (`/api/webhooks/polar/route.ts`) validating subscription state transitions.
- **Tier Quota Governance**:
  - **Free Explorer**: Up to 10 trips, 30 AI planning credits/month.
  - **Pro Wanderer**: Up to 25 trips, 150 AI planning credits/month.
  - Real-time usage tracking meters and historical quota breakdown.

---

### 🔒 6. Security, Storage & Infrastructure

- **Authentication & Security**:
  - Supabase Auth SSR with server-side PKCE code exchange in `/auth/callback`.
  - Next.js 16 `proxy.ts` request middleware protecting private workspace routes.
  - 2-step account deletion flow with email OTP confirmation and graceful goodbye experience.
  - Forgot password flow with OTP and duplicate account detection.
  - Safe profile sync (`syncUserProfile`) preventing unique constraint email collisions.
- **Storage Optimization**:
  - Supabase Storage (`prava-media`) with client-side HTML5 Canvas downscaling for avatars (512x512 WebP/JPEG).
  - Reference-counted image garbage collection (`deleteUnusedTripCoverImage`) ensuring shared cover images are preserved across duplicated trips.
- **Offline Cache**: Client-side IndexedDB caching via `idb` with automatic background synchronization when online connectivity resumes.
- **Clean 6-Tier Import Architecture**: Strict import standardization enforced across all 164 files via `.agents/skills/format-imports-and-clean`.

---

## 🛠️ Technology Stack

| Domain | Technology | Key Details |
|---|---|---|
| **Framework** | [Next.js 16.3.3](https://nextjs.org/) | App Router, Server Components, Server Actions, `proxy.ts` |
| **Runtime & UI** | [React 19.2.8](https://react.dev/) | Concurrent rendering, modern hooks, Suspense transitions |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | CSS-first configuration via `@tailwindcss/postcss`, Cerulean `#2D9BF0` |
| **UI Primitives** | [shadcn/ui](https://ui.shadcn.com/) & Radix | Dialog, Tabs, Select, Popover, Calendar, Switch, Accordion, Tooltip |
| **Database** | [PostgreSQL (Supabase)](https://supabase.com/) | Managed PostgreSQL with PgBouncer connection pooling |
| **ORM** | [Prisma ORM 7.x](https://www.prisma.io/) | Type-safe queries using `@prisma/adapter-pg` driver |
| **Authentication** | [Supabase Auth](https://supabase.com/docs/guides/auth) | SSR authentication, server-side PKCE code exchange, Google OAuth |
| **Storage** | [Supabase Storage](https://supabase.com/docs/guides/storage) | User-scoped media bucket with client-side Canvas auto-downscaling |
| **AI Provider** | [Google Gemini](https://deepmind.google/technologies/gemini/) | `@google/genai` SDK (`gemini-2.5-flash`, `gemini-3.x-flash`) |
| **AI Fallback** | [OpenRouter Free](https://openrouter.ai/) | Free model fallback (`nvidia/nemotron-3.5-lightning:free`) |
| **Billing** | [Polar](https://polar.sh/) | Recurring subscriptions, webhook verification, customer portal |
| **Offline Sync** | [IndexedDB via `idb`](https://github.com/jakearchibald/idb) | Client-side offline cache and synchronization engine |
| **External APIs** | Unsplash, OpenWeather, Frankfurter FX, REST Countries, Leaflet/OSM | Real-time live data integrations with graceful fallbacks |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: **`npm`** (always use `npm` to preserve `package-lock.json`)
- A [Supabase](https://supabase.com/) project (PostgreSQL database & Auth)
- A [Google AI Studio](https://aistudio.google.com/) API Key for Gemini

### 1. Clone the Repository
```bash
git clone https://github.com/AvatarN03/Prava-V2.git
cd Prava-V2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration keys:
```env
# 1. Supabase Auth & Project Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key
SUPABASE_SECRET_KEY=your-supabase-secret-service-role-key

# 2. Database Connections (PostgreSQL via Supabase)
DATABASE_URL=postgresql://postgres.your-ref:your-password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.your-ref:your-password@aws-0-region.pooler.supabase.com:5432/postgres

# 3. AI Provider (Google Gemini & OpenRouter Fallback)
GEMINI_API_KEY=your-google-gemini-api-key
OPENROUTER_API_KEY=your-openrouter-api-key # Optional free fallback

# 4. External Live APIs
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
OPENWEATHER_API_KEY=your-openweather-api-key

# 5. Polar Subscription Billing (Sandbox)
POLAR_ACCESS_TOKEN=polar_oat_...
POLAR_PRODUCT_ID=...
POLAR_WEBHOOK_SECRET=polar_whsec_...
POLAR_SERVER=sandbox

# 6. Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Push Database Schema
Sync the Prisma schema to your PostgreSQL database:
```bash
npx prisma db push
npx prisma generate
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Codebase Organization

```
prava_v2/
├── app/                              # Next.js App Router (pages, layouts, route handlers)
│   ├── (workspace)/                  # Protected workspace layout group
│   │   ├── dashboard/                # Cross-trip overview & metrics
│   │   ├── trips/                    # Trips list & [tripId] 7-tab workspace
│   │   ├── travel-essentials/        # Weather, FX, Maps, Guides, Emergency, Language, Vault
│   │   ├── templates/                # Curated itineraries & 1-click cloner
│   │   ├── forum/                    # Community discussion forum
│   │   ├── stories/                  # Travel stories & markdown creator
│   │   ├── profile/                  # Account & Settings hub
│   │   ├── subscription/             # Polar billing & Customer Portal
│   │   ├── usage/                    # AI & Storage Quota meters
│   │   └── u/[username]/             # Public creator showcase
│   ├── auth/                         # Sign In, Sign Up, Forgot Password & PKCE callback
│   ├── api/webhooks/polar/           # Polar billing webhook handler
│   └── page.tsx                      # Dynamic landing page
├── components/                       # Shared UI primitives
│   ├── app-shell/                    # Fixed Sidebar, TopBar, ConfirmDeleteDialog
│   ├── storage/                      # AvatarUpload, CoverImage, ImageUpload
│   └── ui/                           # shadcn/ui primitives (button, card, dialog, etc.)
├── features/                         # Feature-first domain modules
│   ├── blog/                         # Story editor, markdown renderer, actions
│   ├── community/                    # Discussion forum feeds, threads, comments & upvoting
│   ├── dashboard/                    # Metric queries & summary components
│   ├── pricing/                      # Tier configurations & quota actions
│   ├── profile/                      # Username generator, general preferences, delete account
│   ├── storage/                      # Supabase storage server actions & garbage collection
│   ├── subscription/                 # Polar billing integration & customer portal
│   ├── templates/                    # Curated trip templates & 1-click clone engine
│   ├── travel-essentials/            # Weather, FX, Country, Maps, Emergency, Language, Vault
│   ├── trip-workspace/               # 7 workspace sub-modules + AI proposal engine
│   └── trips/                        # Trips CRUD, Unsplash picker, DatePickers
├── lib/                              # Core singletons and utilities
│   ├── ai/                           # Gemini client initialization & model cascade
│   ├── auth/                         # Safe profile sync helper (syncUserProfile)
│   ├── calendar/                     # Google Calendar URL & .ics export engine
│   ├── db.ts                         # Prisma client with pg adapter
│   ├── offline/                      # IndexedDB offline store & synchronization
│   ├── storage/                      # Supabase Storage client
│   ├── supabase/                     # Supabase SSR client & proxy middleware
│   └── utils/                        # Canvas image resizer & string helpers
├── prisma/                           # schema.prisma & PostgreSQL migrations
├── services/                         # External integrations (context-builder, unsplash)
├── memory.md                         # Continuous task memory & completed phases log (Phase 1-55)
└── AGENTS.md                         # Architecture rules & agent pair programming guidelines
```

---

## 📜 Key Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Starts local Next.js dev server on `http://localhost:3000` with Turbopack |
| `npm run build` | Compiles production bundle with strict TypeScript verification |
| `npm run start` | Runs the compiled production build |
| `npm run lint` | Runs ESLint checks |
| `npx prisma db push` | Pushes schema changes directly to Supabase PostgreSQL |
| `npx prisma generate` | Regenerates Prisma TypeScript client |
| `npx prisma studio` | Opens interactive database browser |

---

## 🎨 Design System & UI Standards

Prava Travel Workspace adheres to strict productivity design guidelines:
- **Calm & Minimal**: Focuses on whitespace, clear typography hierarchy, and content density over visual clutter.
- **Productivity First**: Modeled after tools like Notion, Linear, GitHub, and Stripe Dashboard.
- **No AI Slop**: Explicitly avoids chat-first chrome, floating bubbles, neumorphism, heavy gradients, or glowing neon animations.
- **Brand Palette**: Prava Cerulean Blue (`#2D9BF0` primary, `#F0F8FF` active accents, `#1E293B` slate text, `#F8FAFC` slate background, deep obsidian `#0C1322` dark mode).
- **Interactive Affordances**: All interactive surfaces, buttons, and links strictly render `cursor: pointer`.
- **Import Hierarchy**: Follows the strict 6-tier import structure formalized in `.agents/skills/format-imports-and-clean`.

---

## 📄 License

This project is private and proprietary. All rights reserved.
