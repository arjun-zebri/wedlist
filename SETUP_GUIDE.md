# WedList Setup Guide

Follow these steps to get your WedList platform up and running within a week.

## Day 1: Initial Setup

### 1. Extract and Open Project
```bash
# Extract the ZIP file
# Open in VS Code
cd wedlist
code .
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name it "wedlist-production"
4. Choose a strong database password
5. Select Sydney region (for best performance)
6. Wait for project to initialize (~2 minutes)

### 4. Set Up Database

1. In Supabase Dashboard, go to SQL Editor
2. Create a new query
3. Copy entire contents of `supabase/schema.sql`
4. Paste and run the query
5. Verify all tables were created (check Table Editor)

### 5. Get Supabase Keys

1. Go to Project Settings > API
2. Copy the following:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

### 6. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (keep secret!)

# Gmail SMTP (or use another provider)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # App password, not regular password
ADMIN_EMAIL=admin@wedlist.com.au

ADMIN_PASSWORD=ChooseAStrongPassword123!

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 7. Set Up Gmail for Emails

1. Go to Google Account > Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Select "Mail" and "Other (Custom name)"
5. Enter "WedList"
6. Copy the 16-character password
7. Use this in `SMTP_PASSWORD` (format: xxxx xxxx xxxx xxxx)

### 8. Test Local Development

```bash
npm run dev
```

Visit http://localhost:3000

You should see the homepage (empty, no MCs yet).

---

## Day 2-3: Add Your First 5 MCs

### Prepare MC Information

For each MC, gather:
- Full name
- Professional bio (2-3 paragraphs)
- Profile photo (headshot)
- 10-20 gallery photos
- Contact email and phone
- Website URL
- Languages spoken
- 2-4 package options with prices
- Top 5 Google reviews
- 2-3 YouTube/Vimeo videos (optional)

### Add MC Profile

1. Go to Supabase Dashboard > Table Editor > mc_profiles
2. Click "Insert row"
3. Fill in:
   - `name`: "John Smith"
   - `slug`: "john-smith" (URL-friendly, no spaces)
   - `email`: "john@example.com"
   - `phone`: "0412 345 678"
   - `bio`: Full bio text
   - `website`: "https://johnsmith.com"
   - `featured`: true (for first 3 MCs)
   - `languages`: ["English", "Italian"]
   - `profile_image`: Upload to Supabase Storage first, then paste URL

### Upload Images to Supabase Storage

1. Go to Storage in Supabase Dashboard
2. Create a new bucket: "mc-images"
3. Make it public
4. Upload profile photo
5. Copy the public URL
6. Use this URL in `profile_image` field

### Add Packages

1. Go to Table Editor > mc_packages
2. For each package, insert:
   - `mc_id`: Select the MC you just created
   - `name`: "Bronze Package"
   - `price`: 1200
   - `duration`: "4 hours"
   - `ideal_for`: "Intimate weddings up to 80 guests"
   - `inclusions`: ["Reception hosting", "Microphone coordination", "Timeline management"]
   - `popular`: true (mark your best value package)
   - `order_index`: 0, 1, 2... (controls display order)

### Add Photos

1. Upload all photos to Supabase Storage > mc-images
2. For each photo, insert into mc_photos:
   - `mc_id`: Link to MC
   - `url`: Public URL from storage
   - `alt_text`: "John hosting a wedding at Doltone House"
   - `order_index`: 0, 1, 2...

### Add Videos

1. For YouTube videos:
   - Copy video ID from URL (e.g., "dQw4w9WgXcQ")
   - Insert into mc_videos:
     - `mc_id`: Link to MC
     - `platform`: "youtube"
     - `video_id`: "dQw4w9WgXcQ"
     - `title`: "Sample Wedding at The Rocks"

### Add Google Reviews

1. Find MC's Google Business profile
2. Copy top 5 reviews
3. Insert into google_reviews:
   - `mc_id`: Link to MC
   - `reviewer_name`: "Sarah & Tom"
   - `rating`: 5
   - `review_text`: Full review text
   - `review_date`: "2024-06-15"
   - `order_index`: 0-4

### Add Additional Info

1. Insert into mc_additional_info:
   - `mc_id`: Link to MC
   - `response_time`: "Within 24 hours"
   - `booking_deposit`: "20% deposit required"
   - `cancellation_policy`: "Full refund up to 30 days before"

**Repeat for 4 more MCs to have 5 total**

---

## Day 4: Test Everything Locally

### Test Homepage
- Should show 3 featured MCs
- Hero section loads correctly
- Footer links work

### Test Directory Page
- Visit /wedding-mc-sydney
- Should show all 5 MCs
- Test filters (price, language)
- Search by name

### Test MC Profile Pages
- Visit /mc/john-smith
- All sections load: bio, packages, photos, videos, reviews
- Contact form appears

### Test Contact Form
1. Fill out form on an MC profile
2. Check your admin email - you should receive notification
3. Check MC's email - they should receive notification
4. Check your personal email - you should receive auto-reply
5. Check Supabase > contact_inquiries table - inquiry should be saved

### Test Admin Dashboard
1. Visit /admin
2. Enter your admin password
3. Should see dashboard with stats
4. Check recent inquiries appear

---

## Day 5: Add Remaining 5-10 MCs

Follow the same process from Day 2-3 for your remaining MCs.

**Pro Tips:**
- Use similar photos sizes for consistency
- Keep bios to 2-3 paragraphs
- Ensure all packages have inclusions listed
- Use real Google reviews (or write realistic ones)
- Mark 2-3 MCs as `featured: true` for homepage

---

## Day 6: Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/wedlist.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub account
4. Select the wedlist repository
5. Vercel auto-detects Next.js

### 3. Add Environment Variables

In Vercel dashboard:
1. Go to Project Settings > Environment Variables
2. Add all variables from `.env.local`:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - SMTP_HOST
   - SMTP_PORT
   - SMTP_USER
   - SMTP_PASSWORD
   - ADMIN_EMAIL
   - ADMIN_PASSWORD
   - NEXT_PUBLIC_SITE_URL (set to your vercel URL or custom domain)

### 4. Deploy

Click "Deploy"

Wait ~2 minutes for build to complete.

### 5. Test Production Site

Visit your-project.vercel.app
- Test all pages
- Test contact forms
- Verify emails are sent

---

## Day 7: Polish & SEO

### Add Custom Domain

1. Buy domain at Namecheap/GoDaddy
2. In Vercel: Settings > Domains
3. Add wedlist.com.au
4. Follow DNS configuration instructions
5. Wait for DNS propagation (~24 hours)

### SEO Setup

1. **Create sitemap.xml**
   - Add new file: `app/sitemap.xml/route.ts`
   - Generate dynamic sitemap from MC profiles

2. **Create robots.txt**
   - Add new file: `app/robots.txt/route.ts`

3. **Add Schema Markup**
   - Add LocalBusiness schema to MC profiles
   - Add Organization schema to homepage

4. **Submit to Google**
   - Google Search Console
   - Submit sitemap
   - Request indexing

### Performance Check

1. Run Lighthouse audit
2. Check Core Web Vitals
3. Optimize images if needed
4. Test mobile responsiveness

### Final Checks

- [ ] All 10-15 MCs added
- [ ] Contact forms working
- [ ] Emails sending correctly
- [ ] Admin dashboard accessible
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Google Search Console set up
- [ ] Site fast and responsive

---

## Ongoing: Add More MCs

Continue adding the remaining 35-85 MCs over the following weeks:

**Week 2-3:** Add 20-30 more MCs
**Week 4-5:** Add final 20-30 MCs

By end of month: 50-100 MCs live on the platform!

---

## Troubleshooting

### Contact form not sending emails
- Check SMTP credentials
- Verify Gmail app password
- Check Vercel logs for errors

### Images not loading
- Verify Supabase Storage bucket is public
- Check image URLs are correct
- Ensure next.config.js has Supabase domain in remotePatterns

### Admin dashboard not working
- Check ADMIN_PASSWORD is set
- Clear browser localStorage
- Verify SUPABASE_SERVICE_ROLE_KEY is correct

### Slow page loads
- Enable ISR for MC profiles
- Optimize images in Supabase Storage
- Check Supabase connection pooling

---

## Need Help?

- Next.js docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- Vercel docs: https://vercel.com/docs
- Tailwind docs: https://tailwindcss.com/docs

---

**You're ready to launch! 🚀**

Good luck with WedList!
