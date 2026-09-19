# Production Deployment & Operations Guide

This guide provides step-by-step instructions for deploying the **Digital Exchange & Solution** application to **Vercel** and linking it with your production **Supabase** instance.

---

## 1. Prerequisites Checklist

Before deploying, ensure you have:

- [x] A **GitHub / GitLab / Bitbucket** account.
- [x] A **Vercel** account ([https://vercel.com](https://vercel.com)).
- [x] An active **Supabase** project ([https://supabase.com](https://supabase.com)).
- [x] Your 3 core Supabase credentials:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [x] At least one admin user created in your Supabase Auth dashboard (`Authentication > Users`).

---

## 2. Supabase Configuration

### A. Database Migrations
Ensure the following migration scripts in the `supabase/migrations/` directory have been executed in your Supabase SQL Editor:
1. `001_initial_schema.sql` — Creates `categories` and `products` tables, indexes, triggers, and Row Level Security (RLS) policies.
2. `002_storage_setup.sql` — Creates the public `product-images` storage bucket and security policies.
3. `003_orders_table.sql` — Creates `orders` table, indexes, and RLS policies for Waitmark Pay integration.

### B. Auth URL Configuration
1. In the Supabase Dashboard, navigate to **Authentication** > **URL Configuration**.
2. Set **Site URL** to your production domain (e.g. `https://yourdomain.com` or your `https://your-project.vercel.app` URL).
3. Under **Redirect URLs**, add:
   - `https://yourdomain.com/**`
   - `https://*.vercel.app/**`
   - `http://localhost:3000/**` (for local development)
4. Click **Save**.

---

## 3. Deploying to Vercel (Step-by-Step)

### Step 1: Push Code to Git
Push your local repository to GitHub:
```bash
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** > **"Project"**.
3. Select your Git repository and click **"Import"**.

### Step 3: Configure Project Settings
- **Framework Preset**: Next.js (detected automatically).
- **Root Directory**: `./` (default).
- **Build Command**: `npm run build` (default).
- **Output Directory**: `.next` (default).

### Step 4: Add Environment Variables
Expand the **"Environment Variables"** accordion in Vercel and add:

| Key | Example Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://zcvgpsuqrbkioidpymtn.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | Production |
| `WAITMARK_PUBLIC_KEY` | `pk_live_xxxx` | Production, Preview, Development |
| `WAITMARK_SECRET_KEY` | `sk_live_xxxx` | Production, Preview, Development |

> ⚠️ **CRITICAL SECURITY NOTE:** Never prefix `SUPABASE_SERVICE_ROLE_KEY` or `WAITMARK_SECRET_KEY` with `NEXT_PUBLIC_`. These are server-only secrets that must never be exposed to the browser.

### Step 5: Deploy
Click **"Deploy"**. Vercel will compile the Next.js production build, pre-render static assets, bundle Server Actions, and deploy to their global Edge CDN in approximately 1 to 2 minutes.

---

## 4. Custom Domain & SSL Setup

1. In your Vercel Project Dashboard, navigate to **Settings** > **Domains**.
2. Enter your custom domain (e.g., `yourdomain.com` or `store.yourdomain.com`) and click **Add**.
3. Follow the DNS instructions provided by Vercel:
   - **Apex domain (`yourdomain.com`)**: Add an `A` record pointing to `76.76.21.21`.
   - **Subdomain (`www.yourdomain.com` or `store.yourdomain.com`)**: Add a `CNAME` record pointing to `cname.vercel-dns.com`.
4. Vercel will automatically provision and renew a free Let's Encrypt SSL/TLS certificate.
5. Once your domain is live, update `NEXT_PUBLIC_SITE_URL` in Vercel Environment Variables to your custom domain, and trigger a redeploy.

---

## 5. Post-Deployment Verification Checklist

Verify all major features in production:

- [ ] **Storefront (`/`)**: Verify fast SSR loading, hero section, category filter tabs, search, and footer.
- [ ] **Admin Login (`/admin/login`)**: Sign in with your Supabase admin credentials.
- [ ] **Admin Dashboard (`/admin/dashboard`)**: Check metrics overview and quick action shortcuts.
- [ ] **Product CRUD (`/admin/products`)**:
  - Add a product with price, category, and photo.
  - Check that the image preview renders correctly.
  - Verify that the new product displays on the public homepage.
  - Toggle **Sold Out** switch and confirm the badge reflects in real time.
  - Delete or toggle inactive, and confirm public storefront updates immediately.
- [ ] **SEO & Sitemaps**:
  - Visit `/robots.txt` — ensure `/admin` is disallowed and sitemap is linked.
  - Visit `/sitemap.xml` — ensure your live domain and products are listed.
  - Visit `/opengraph-image` — verify social share card renders as an image.

---

## 6. Operations & Maintenance Playbook

### Adding New Admin Users
1. Go to your Supabase Dashboard > **Authentication** > **Users**.
2. Click **"Add User"** > **"Create User"**.
3. Enter the new admin's email and password.
4. They can immediately log in at `https://yourdomain.com/admin/login`.

### Database Backups
- Supabase automatically takes daily backups for all projects.
- To create a manual snapshot, go to **Project Settings** > **Database** > **Backups** or export tables as CSV via the Table Editor.

### Image Storage Management
- Uploaded product photos are stored in the `product-images` bucket.
- The application automatically purges old or deleted images when a product is deleted or its image is replaced, keeping your storage clean and economical.

