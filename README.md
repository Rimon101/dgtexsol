# Digital Exchange & Solution — E-Commerce Platform

A sleek, high-converting product showcase landing page and powerful administrative dashboard built for **Digital Exchange & Solution** — your trusted destination for phone sales, exchanges, repairs, and electrical solutions. Engineered with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **shadcn/ui**, and **Supabase (PostgreSQL, Auth & Storage)**.

---

## ✨ Features

### 🛍️ Customer Storefront
- **Hero Section:** Dynamic product counter, service highlights (repairs, exchange, electrical), and smooth navigation.
- **Interactive Catalog Grid:** Real-time client-side search, category filter pills, price and newest sorting, and in-stock toggling.
- **Quick View Modal:** Fast product inspection dialog showing full descriptions, pricing comparisons, and high-res photography.
- **Micro-Interactions & Feedback:** Polished hover effects, discount percentage pills, sold-out indicators, and responsive mobile navigation.
- **Graceful Empty States:** User-friendly fallbacks when searching or when the catalog is being stocked.

### ⚙️ Management Portal (Admin Dashboard)
- **Protected Dashboard Shell:** Fixed desktop sidebar, mobile drawer navigation, user profile badge, and instant sign-out.
- **Live Business Metrics:** Real-time summary cards for total products, active catalog items, sold-out inventory, and categories.
- **Full Product CRUD:** Complete product creation and editing forms with auto-slug generation, compare-at pricing, category assignment, and instant visibility/sold-out toggle switches.
- **Category Management:** Dedicated category creator and deletion manager with product association counters.
- **Drag-and-Drop Image Upload:** Direct image uploads to Supabase Storage with size limits, MIME validation, instant preview, and **automated orphaned image cleanup** when products are removed or replaced.

### 🛡️ Enterprise-Grade Security
- **Triple-Layer Defense:**
  1. *Edge Middleware:* Intercepts unauthenticated requests to `/admin/*` and redirects to login with return target preservation.
  2. *Server Action Session Guards:* All database mutations (`create`, `update`, `delete`, `toggle`) explicitly verify authenticated admin sessions server-side.
  3. *Database Row Level Security (RLS):* Postgres-level policies restrict public visitors to reading only active items, while locking write operations to authenticated administrators.
- **Environment Isolation:** Zero leakage of `SUPABASE_SERVICE_ROLE_KEY` to client bundles; safeguarded by Next.js `import "server-only"`.
- **HTTP Security Headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and suppressed `X-Powered-By` header.

### 🚀 Search Engine Optimization (SEO)
- **Schema.org Structured Data:** Dynamic JSON-LD markup for `schema.org/Store` and `schema.org/ItemList` with live prices and stock availability for Google Rich Snippets.
- **OpenGraph & Social Sharing:** Pre-rendered 1200x630 dynamic social preview cards (`/opengraph-image`) for WhatsApp, iMessage, Twitter/X, and Facebook.
- **Automated Crawling Policies:** Next.js dynamic `robots.txt` policy and dynamic XML `sitemap.xml` listing all active products.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16.3.5](https://nextjs.org/) (App Router, Turbopack, Server Actions) |
| **UI Library** | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| **Component System** | [shadcn/ui](https://ui.shadcn.com/) (base-nova with `@base-ui/react`) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL with RLS + GoTrue Auth) |
| **Image Storage** | [Supabase Storage](https://supabase.com/storage) (Public `product-images` bucket) |
| **Validation** | [Zod v4](https://zod.dev/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🏁 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Rimon101/dgtexsol.git
cd dgtexsol
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
WAITMARK_PUBLIC_KEY=pk_live_xxxx
WAITMARK_SECRET_KEY=sk_live_xxxx
```

### 3. Setup Database Schema
Execute the SQL files in `supabase/migrations/` inside your Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql` (Tables, Indexes, RLS)
2. `supabase/migrations/002_storage_setup.sql` (Storage Bucket & Policies)
3. `supabase/migrations/003_orders_table.sql` (Orders Table, Indexes, RLS)
4. `supabase/migrations/004_custom_clocks.sql` (Custom Clocks Table, Indexes, RLS)

### 4. Create an Admin User
In your Supabase Dashboard, go to **Authentication** > **Users** > **Add User** and create your admin account.

### 5. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser. Access the management dashboard at **[http://localhost:3000/admin](http://localhost:3000/admin)**.

---

## 🏗️ Production Build & Verification

To compile an optimized production build:
```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Compile production build
npm run build

# Start production server
npm run start
```

---

## 🚢 Deployment to Vercel

For complete production deployment instructions, domain setup, and Supabase URL configuration, see the [Production Deployment Guide](DEPLOYMENT.md).

---

## 📄 License
This project is licensed under the MIT License.
