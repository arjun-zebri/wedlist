# WedList - Wedding MC Directory Platform

A Next.js 15 application for finding and booking wedding MCs in Sydney. Built with TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎯 **Wedding MC Directory** - Browse and filter professional wedding MCs
- 🔍 **Advanced Search** - Filter by price, language, and availability
- 📝 **Contact Forms** - Direct inquiries to MCs with email notifications
- ⭐ **Reviews & Ratings** - Google reviews integration
- 📦 **Package Management** - Compare MC packages and pricing
- 📱 **Responsive Design** - Minimalistic, mobile-friendly interface
- 📊 **Admin Dashboard** - Manage MCs, inquiries, and blog posts
- 🔒 **SEO Optimized** - Server-side rendering and static generation

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Email:** Nodemailer (SMTP)
- **Forms:** React Hook Form + Zod validation

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- SMTP email service (Gmail, SendGrid, etc.)
- Vercel account (for deployment)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon key
4. Go to SQL Editor and run the schema from `supabase/schema.sql`

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
ADMIN_EMAIL=admin@wedlist.com.au

# Admin Dashboard
ADMIN_PASSWORD=your_secure_password

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Set Up Gmail SMTP (if using Gmail)

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security > 2-Step Verification
   - App passwords > Select app: Mail
   - Generate and copy the password
3. Use this app password in `SMTP_PASSWORD`

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main tables:

- `mc_profiles` - MC profiles and basic information
- `mc_photos` - MC gallery images
- `mc_videos` - Embedded videos (YouTube/Vimeo)
- `mc_packages` - Pricing packages
- `mc_additional_info` - Response time, policies, etc.
- `google_reviews` - Top 5 Google reviews per MC
- `contact_inquiries` - Lead capture and tracking
- `blog_posts` - Blog content management

All tables have Row Level Security (RLS) enabled. Public users can read published content. Admin operations use the service role key.

## Project Structure

```
wedlist/
├── app/
│   ├── api/
│   │   └── contact/          # Contact form API
│   ├── admin/                # Admin dashboard (to be built)
│   ├── blog/                 # Blog pages (to be built)
│   ├── mc/
│   │   └── [slug]/          # Individual MC profiles
│   ├── wedding-mc-sydney/   # MC directory with filters
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── Footer.tsx           # Site footer
│   ├── MCCard.tsx           # MC listing card
│   ├── MCFilters.tsx        # Search and filter UI
│   └── ContactForm.tsx      # Contact form component
├── lib/
│   ├── supabase.ts          # Supabase client (public)
│   ├── supabase-admin.ts    # Supabase admin client
│   └── utils.ts             # Utility functions
├── types/
│   └── database.ts          # TypeScript types
├── supabase/
│   └── schema.sql           # Database schema
└── package.json
```

## Adding Your First MC

After setting up the database, you can add MCs directly via Supabase Studio:

1. Go to Supabase Dashboard > Table Editor
2. Insert into `mc_profiles`:
   - `name`: MC's full name
   - `slug`: URL-friendly version (e.g., "john-smith")
   - `email`: Contact email
   - `bio`: Short description
   - `profile_image`: URL to profile image
   - `languages`: Array of languages (e.g., `["English", "Mandarin"]`)
   - `featured`: Set to `true` for homepage display

3. Add packages to `mc_packages`:
   - Link via `mc_id`
   - Set `name`, `price`, `duration`, `inclusions` (array)
   - Mark most popular package with `popular: true`

4. Add reviews to `google_reviews`:
   - Top 5 reviews manually entered
   - Include `reviewer_name`, `rating`, `review_text`, `review_date`

## SEO Strategy

### Static Site Generation (SSG)
- Homepage (`/`)
- MC directory landing (`/wedding-mc-sydney`)

### Incremental Static Regeneration (ISR)
- Individual MC profiles (`/mc/[slug]`)
- Regenerates when data changes

### Server-Side Rendering (SSR)
- Filtered search results
- Admin dashboard

### Schema Markup
Add JSON-LD schema to MC profiles for rich snippets:
- LocalBusiness
- Person
- Service
- Review

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically:
- Detect Next.js
- Configure build settings
- Set up automatic deployments

## Building the Admin Dashboard

The admin dashboard needs to be built with these features:

### Dashboard Pages Needed:
1. `/admin` - Overview (total MCs, inquiries, etc.)
2. `/admin/mcs` - List and manage MCs
3. `/admin/mcs/new` - Add new MC
4. `/admin/mcs/[id]/edit` - Edit MC profile
5. `/admin/inquiries` - View all contact inquiries
6. `/admin/blog` - Manage blog posts
7. `/admin/blog/new` - Create new post

### Admin Auth:
- Simple password protection using middleware
- Check password against `ADMIN_PASSWORD` env var
- Store auth state in cookie/session

### Key Admin Features:
- Upload images to Supabase Storage
- WYSIWYG editor for blog posts
- Bulk import for MCs (CSV)
- Analytics dashboard
- Inquiry status tracking

## Email Notifications

The contact form sends three emails:

1. **To Admin** - New inquiry notification
2. **To MC** - If specific MC was selected
3. **To Couple** - Confirmation email

Configure SMTP settings in `.env.local` to enable emails.

## Performance Optimization

- Images automatically optimized via Next.js Image component
- Static pages cached at CDN level
- Supabase connection pooling
- Lazy loading for gallery images
- Debounced search filters

## SEO Checklist

- [x] Semantic HTML structure
- [x] Meta tags and Open Graph
- [x] Sitemap generation (add `/sitemap.xml` route)
- [x] Robots.txt (add `/robots.txt` route)
- [ ] Schema markup on MC profiles
- [ ] Blog posts for long-tail keywords
- [ ] Suburb-specific landing pages

## Future Enhancements

- [ ] MC availability calendar
- [ ] Online booking and payments (Stripe)
- [ ] MC self-service portal
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Wedding planning tools
- [ ] Venue recommendations

## Support

For issues or questions:
- Check the [Next.js docs](https://nextjs.org/docs)
- Review [Supabase docs](https://supabase.com/docs)
- Consult [Tailwind CSS docs](https://tailwindcss.com/docs)

## License

Private project for WedList.com.au

---

Built with ❤️ for Sydney couples finding their perfect wedding MC
