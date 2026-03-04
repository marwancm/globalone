# GlobalOne - Bilingual E-commerce Platform

A professional, bilingual (Arabic/English) e-commerce store built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

## Features

- **Bilingual UI** — Full Arabic & English support with automatic RTL/LTR direction switching
- **Authentication** — Email/password, Google OAuth, password recovery via Supabase Auth
- **Product Management** — Categories, search, filters, pagination, discount pricing
- **Shopping Cart** — Persistent cart with Zustand, quantity management
- **Checkout Flow** — Shipping info, payment method selection, order confirmation
- **User Account** — Profile editing, order history with status tracking
- **Admin Dashboard** — Stats overview, product/category/order/user management with image upload
- **Dark/Light Mode** — Theme toggle with persistence
- **Responsive Design** — Mobile-first, works on all screen sizes
- **SEO Optimized** — Metadata, semantic HTML

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase (Auth, Database, Storage) |
| State | Zustand (cart, locale, theme) |
| Notifications | React Hot Toast |

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Register, Forgot Password
│   ├── (shop)/shop/     # Shop listing + Product detail [id]
│   ├── auth/callback/   # OAuth callback route
│   ├── cart/            # Shopping cart
│   ├── checkout/        # Checkout flow
│   ├── account/         # User profile & orders
│   ├── dashboard/       # Admin panel (stats, products, categories, orders, users)
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css
├── components/
│   ├── layout/          # Header, Footer
│   ├── providers/       # Providers (toast, theme, locale)
│   └── ui/              # Button, Input, Modal, Skeleton, ProductCard
├── hooks/               # useLocale, useCart, useTheme
├── lib/
│   ├── supabase/        # client, server, middleware helpers
│   └── i18n/            # translations (AR/EN)
├── types/               # TypeScript interfaces
├── utils/               # Helper functions
└── middleware.ts         # Route protection
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Storage** → Create a new **public** bucket named `images`
4. Go to **Authentication** → **Providers** → Enable **Google** (optional)

### 3. Environment Variables

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Find these in: **Supabase Dashboard** → **Settings** → **API**

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Create Admin User

1. Register a new account through the app
2. In Supabase **Table Editor** → `users` table → update the user's `role` to `admin`
3. Access the admin dashboard at `/dashboard`

## Design

- **Color Scheme**: Black + Royal Blue (`#1d4ed8`)
- **Fonts**: Inter (English), Tajawal (Arabic)
- **Style**: Amazon-inspired, clean UI, rounded corners, professional hover effects

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## License

MIT
