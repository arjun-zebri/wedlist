# Super Admin Specification

The super admin (site owner) interface at `/super-admin/` manages the entire Wedlist platform:
1. **Blog Management** — Create, edit, publish blog posts
2. **Inquiries Management** — View and manage couple/vendor inquiries
3. **MC CRM** — Track MCs as business leads (recruitment, onboarding, revenue, churn)

---

## Super Admin Routes

| Route | Description |
|-------|-------------|
| `/super-admin` | Dashboard: KPI cards (inquiries, MC pipeline, blog stats) |
| `/super-admin/blog` | Blog post list + create/edit interface |
| `/super-admin/blog/[postId]` | Edit blog post (draft/published, preview) |
| `/super-admin/inquiries` | Inquiry list (filters by type: couple, vendor) |
| `/super-admin/inquiries/[inquiryId]` | Inquiry detail: message, contact info, followup |
| `/super-admin/crm` | MC CRM dashboard (overview + quick stats) |
| `/super-admin/crm/mcs` | MC pipeline kanban + list view |
| `/super-admin/crm/mcs/[mcId]` | MC detail: listing info, revenue, outreach log |

---

## Module 1: Blog Management (`/super-admin/blog`)

### Overview
Super admin can create, edit, draft, and publish blog posts. Posts support markdown, featured images, and SEO metadata.

### Database Table

```sql
-- ============================================
-- BLOG POSTS
-- ============================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,           -- URL-friendly slug
  content TEXT NOT NULL,               -- Markdown content
  featured_image_url TEXT,             -- Supabase storage URL
  excerpt TEXT,                        -- Short description (SEO)
  author_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published','archived')),
  seo_title TEXT,                      -- Meta title
  seo_description TEXT,                -- Meta description
  published_at TIMESTAMPTZ,            -- Publish timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage all blog posts"
  ON blog_posts
  USING (public.is_admin());

CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');
```

### UI Requirements

**Blog List (`/super-admin/blog`):**
- Table: Title | Status | Author | Published Date | Actions
- Filters: by status (Draft, Published, Archived)
- Search by title/slug
- Sort by date, status
- Actions: Edit, View, Delete (soft archive), Publish/Unpublish
- "New Post" button (top-right)

**Blog Editor (`/super-admin/blog/[postId]`):**
- **Header**: Post title input + slug (auto-generates from title)
- **Featured Image**: Upload field + preview (1200x600px recommended)
- **Content Panel**:
  - Markdown textarea with toolbar (bold, italic, headers, lists, code)
  - Live preview on right (desktop) or below (mobile)
  - Supports code blocks with syntax highlighting
- **SEO Panel** (collapsible):
  - SEO Title input (60 chars max)
  - SEO Description textarea (160 chars max)
  - Excerpt textarea
- **Publishing**:
  - Status dropdown (Draft, Published, Archived)
  - Publish/schedule button (set publish_at timestamp)
  - Preview link (if published)
- **Save** button (auto-saves draft every 30 seconds)

**Design System Application:**
- Markdown editor: `rounded-lg`, `border border-gray-200`, syntax highlighting
- Preview: `prose` classes for typography
- Status badges: Draft=gray-50, Published=green-50, Archived=red-50
- Buttons: Rose accent for primary CTAs

---

## Module 2: Inquiries Management (`/super-admin/inquiries`)

### Overview
Super admin views all inquiries from couples and vendors. Track inquiry type, status, contact info, and follow-up activity.

### Database Table

```sql
-- ============================================
-- INQUIRIES (from contact forms)
-- ============================================
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL
    CHECK (type IN ('couple','vendor')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  event_date DATE,                    -- For couple inquiries
  event_type TEXT,                    -- e.g. "wedding", "corporate", "other"
  venue TEXT,                         -- For couple inquiries
  guest_count INTEGER,                -- For couple inquiries
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','contacted','qualified','lost','closed')),
  vendor_type TEXT,                   -- For vendor inquiries: 'mc', 'photographer', 'venue', etc.
  company_name TEXT,                  -- For vendor inquiries
  source TEXT DEFAULT 'website'       -- Where inquiry came from: 'website', 'google', 'referral'
    CHECK (source IN ('website','google','referral','social','other')),
  notes TEXT,                         -- Admin notes
  assigned_to UUID REFERENCES profiles(id),  -- Admin user assigned to follow up
  follow_up_date DATE,                -- Next follow-up reminder
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INQUIRY ACTIVITIES (follow-ups, notes, emails sent)
-- ============================================
CREATE TABLE inquiry_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  type TEXT NOT NULL
    CHECK (type IN ('note','call','email','status_change')),
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_inquiries_type ON inquiries(type);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX idx_inquiry_activities_inquiry_id ON inquiry_activities(inquiry_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage all inquiries"
  ON inquiries
  USING (public.is_admin());

CREATE POLICY "Admin can manage all inquiry activities"
  ON inquiry_activities
  USING (public.is_admin());
```

### UI Requirements

**Inquiry List (`/super-admin/inquiries`):**
- Tabs: All | Couples | Vendors
- Table: Name | Type | Email | Status | Created | Last Update | Actions
- Filters: by status (New, Contacted, Qualified, Lost, Closed), by source
- Search by name/email/company
- Sort by date, status
- Actions: View, Edit notes, Assign, Delete
- "Filter" button (side panel with advanced filters)

**Inquiry Detail (`/super-admin/inquiries/[inquiryId]`):**
- **Header**: Name + type badge (Couple/Vendor) + status badge
- **Contact Info**:
  - Email (clickable link)
  - Phone (clickable link)
  - Company name (vendor only)
- **Event Details** (couple only):
  - Event type, date, venue, guest count
- **Business Details** (vendor only):
  - Vendor type, company, services offered
- **Inquiry Message**: Full message text in quote box
- **Metadata**:
  - Source (website, google, referral, etc.)
  - Created date
  - Assigned to (dropdown)
  - Follow-up date (date picker, red badge if overdue)
- **Status Selector**: Dropdown (New, Contacted, Qualified, Lost, Closed)
- **Admin Notes**: Textarea
- **Activity Timeline**:
  - Reverse-chronological entries
  - Type (note, call, email, status_change) with icon
  - Content + timestamp
  - "Add Activity" button
- **Actions**:
  - "Send Email" (opens draft email modal)
  - "Log Call" (quick note entry)
  - "Close Inquiry" (move to Closed)
  - "Delete" (with confirmation)

**Activity Entry Modal:**
- Type dropdown: Note | Call | Email | Status Change
- Content textarea: What was said/done
- "Save Activity" button

**Design System Application:**
- Status badges: New=gray-50, Contacted=blue-50, Qualified=green-50, Lost=red-50, Closed=gray-100
- Type badges: Couple=rose-50, Vendor=amber-50
- Cards/panels: rounded-xl, shadow-[0_2px_8px_rgba(227,28,95,0.15)]
- Timeline: Vertical divider, icons, timestamps

---

## Module 3: MC CRM (`/super-admin/crm/mcs`)

### Overview
Super admin manages MCs as business leads. Track recruitment funnel, trial/paid status, revenue, renewals, and outreach activity.

### Pipeline Stages (MC Business Leads)
1. **Prospect** — Identified but not yet contacted
2. **Trial** — Offered trial, waiting for signup
3. **Listed** — Live on wedlist (trial or free listing)
4. **Active** — Paying subscription or premium listing
5. **Churned** — Cancelled subscription or inactive for 90+ days

### Database Table (Shared with MC CRM)

```sql
-- ============================================
-- MC CRM RECORDS (admin view of MCs as leads)
-- ============================================
CREATE TABLE mc_crm_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mc_profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  stage TEXT NOT NULL DEFAULT 'prospect'
    CHECK (stage IN ('prospect','trial','listed','active','churned')),
  listing_status TEXT DEFAULT 'free'
    CHECK (listing_status IN ('free','trial','paid','expired','rejected')),
  plan_type TEXT
    CHECK (plan_type IN ('trial','free','standard','premium','custom') OR plan_type IS NULL),
  monthly_revenue NUMERIC(10,2) DEFAULT 0,
  renewal_date DATE,
  notes TEXT,
  last_contact_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- MC OUTREACH LOG
-- ============================================
CREATE TABLE mc_outreach_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mc_crm_record_id UUID NOT NULL REFERENCES mc_crm_records(id) ON DELETE CASCADE,
  type TEXT NOT NULL
    CHECK (type IN ('call','email','meeting','demo','other')),
  summary TEXT NOT NULL,
  follow_up_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_mc_crm_records_stage ON mc_crm_records(stage);
CREATE INDEX idx_mc_crm_records_listing_status ON mc_crm_records(listing_status);
CREATE INDEX idx_mc_crm_records_renewal_date ON mc_crm_records(renewal_date);
CREATE INDEX idx_mc_outreach_log_mc_id ON mc_outreach_log(mc_crm_record_id);
CREATE INDEX idx_mc_outreach_log_follow_up ON mc_outreach_log(follow_up_date);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE mc_crm_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mc_outreach_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage all MC records"
  ON mc_crm_records
  USING (public.is_admin());

CREATE POLICY "Admin can manage all outreach logs"
  ON mc_outreach_log
  USING (public.is_admin());
```

### UI Requirements

**MC CRM Dashboard (`/super-admin/crm`):**
- KPI Cards (top):
  - Total MCs (all stages)
  - Active listings (stage='listed' OR stage='active')
  - Monthly Recurring Revenue (MRR) sum
  - Churned this month
  - Upcoming renewals (next 7 days)
- Quick links: "Browse Pipeline" → `/super-admin/crm/mcs`

**MC Pipeline (`/super-admin/crm/mcs`):**
- Kanban view (default):
  - 5 horizontal swimlanes: Prospect → Trial → Listed → Active → Churned
  - MC cards: name, email, listing status badge, MRR (green), last contact date
  - Drag-and-drop between stages
  - Empty state per column: icon + "No {stage} MCs"
- List view toggle:
  - Table: Name | Email | Stage | Listing Status | MRR | Renewal Date | Last Contact | Actions
  - Searchable by name/email
  - Filterable by stage + listing_status
  - Sort by MRR, renewal date, last contact

**MC Detail (`/super-admin/crm/mcs/[mcId]`):**
- **Header**: MC name + link to public profile + status badges
- **Listing Info**:
  - Listing status dropdown (free/trial/paid/expired/rejected)
  - Plan type dropdown (trial/free/standard/premium/custom)
  - "View Profile" button (links to `/mcs/{slug}`)
- **Revenue Section**:
  - Current MRR: numeric input (inline editable)
  - Plan type: dropdown
  - Renewal date: date picker
  - Annual revenue calc (MRR × 12)
- **Stage Section**: Dropdown selector (prospect/trial/listed/active/churned)
- **Internal Notes**: Textarea
- **Outreach Log Timeline**:
  - Reverse-chronological entries
  - Type (call, email, meeting, demo, other) with icon
  - Summary + timestamp
  - "Follow-up due: {date}" if set
  - "Log Outreach" button
- **Actions**:
  - "Create Login" (create account + send email if no mc_profile_id)
  - "Export" (download MC info as PDF)
  - "Archive" (soft delete)

**Outreach Log Entry Modal:**
- Type dropdown: Call | Email | Meeting | Demo | Other
- Summary textarea: "What was discussed?"
- Follow-up date picker: "When to follow up?"
- "Log Activity" button

**Design System Application:**
- Cards: `rounded-2xl`, `shadow-[0_2px_8px_rgba(227,28,95,0.15)]`, `hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(227,28,95,0.25)]`
- Status badges: Prospect=gray-50, Trial=blue-50, Listed=amber-50, Active=green-50, Churned=red-50
- MRR text: Green (#10B981)
- Renewal date: Red badge if within 7 days
- Timeline: Icon + divider + timestamp

---

## Authentication & Authorization

- Super admin only: role check in middleware
- Redirect non-admin users away from `/super-admin/*`
- All routes protected by `public.is_admin()` RLS policy

---

## Design System for Super Admin

All pages follow the directives in `CLAUDE.md`:

### Card System
- Cards: `rounded-2xl`, `shadow-[0_2px_8px_rgba(227,28,95,0.15)]`
- Hover: `hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(227,28,95,0.25)]`
- Never use borders; depth via shadows only

### Kanban/Pipeline
- Horizontal layout with scrollable columns on mobile
- Column header: stage name (uppercase, gray-500, medium weight)
- Cards: drag handle (left), content, drag handle (GripVertical icon)
- Empty state: icon + "No {items}"
- `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop

### Status Badges
- Pill shape (`rounded-full`), small font (`text-xs`)
- Colors: Gray, Blue, Amber, Green, Red (based on stage/status)

### Timeline/Activity Log
- Vertical line with circular icons
- Icon: 20px, muted gray
- Timestamp: right-aligned, gray-500, `text-xs`
- Content: subject line (bold) + optional details
- Divider: `border-l border-gray-200`

### Forms
- Inputs: `rounded-lg`, `border border-gray-200`, `focus:border-rose-300 focus:ring-1 focus:ring-rose-100`
- Textareas: 4 rows default, expandable
- Dropdowns: styled pill buttons or select
- Date pickers: native HTML5 or calendar component

### Search & Filter
- Search bar: `rounded-full`, placeholder, lucide `Search` icon
- Filters: pill buttons, active state highlighted in rose
- "Clear filters" link if any active

---

## Implementation Checklist

### Blog Management
- [ ] Create `blog_posts` table with markdown + SEO fields
- [ ] Build blog list page (`/super-admin/blog`) with filters
- [ ] Build blog editor (`/super-admin/blog/[postId]`) with markdown + preview
- [ ] Implement publish/draft/archive status workflow
- [ ] Featured image upload integration (Supabase storage)

### Inquiries Management
- [ ] Create `inquiries` + `inquiry_activities` tables
- [ ] Build inquiry list page with type/status filters
- [ ] Build inquiry detail page with activity timeline
- [ ] Implement status workflow (New → Contacted → Qualified → Closed)
- [ ] Add assignment + follow-up date tracking

### MC CRM
- [ ] Create `mc_crm_records` + `mc_outreach_log` tables (if not already)
- [ ] Build MC CRM dashboard with KPI cards
- [ ] Build MC pipeline kanban view (5 stages)
- [ ] Build MC detail page with revenue + outreach log
- [ ] Implement drag-and-drop stage movement
- [ ] Implement "Create Login" for new MCs

### Design & Polish
- [ ] All pages follow Dribbble card system (rounded-2xl, shadows, hover lift)
- [ ] Status badges color-coded by stage
- [ ] Timeline components with icons and timestamps
- [ ] Responsive: columns scroll on mobile, full-width on desktop
- [ ] Accessibility: data-testid, keyboard nav, focus rings

---

## References

- See [CRM.md](./CRM.md) for **MC Couple Leads CRM** specification (`/admin/leads` routes).
- All design follows rules in [CLAUDE.md](./CLAUDE.md).
