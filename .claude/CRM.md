# MC Couple Leads CRM Specification

Wedding MCs use the `/admin/` dashboard to manage couple enquiries through a pipeline (New → Contacted → Quoted → Booked → Completed → Lost).

---

## MC CRM Routes

| Route | Description |
|-------|-------------|
| `/admin/dashboard` | MC dashboard: KPI cards (total leads, pipeline summary, recent activity) |
| `/admin/leads` | Kanban pipeline of couple leads (default) + list view toggle |
| `/admin/leads/[leadId]` | Lead detail page: event info, activity timeline, notes, quote, stage selector |

---

## Overview

Wedding MCs use their CRM dashboard to track couple enquiries through a six-stage pipeline. Each lead records event details, notes, communication history, and quoted amount.

### Authentication
- MCs use email + password via Supabase Auth (shared login form)
- Profile role: `role: 'mc'` in profiles table
- Redirect to `/admin/dashboard` on login
- Super admin can create MC accounts from `/super-admin/crm/mcs/[mcId]`

---

## Pipeline Stages (Couple Leads)
1. **New** — Just received enquiry, no contact yet
2. **Contacted** — Reached out to couple, awaiting response
3. **Quoted** — Sent quote to couple
4. **Booked** — Couple confirmed booking + paid deposit
5. **Completed** — Event completed
6. **Lost** — Couple chose another MC or didn't proceed

---

## Database Tables

```sql
-- ============================================
-- COUPLE LEADS (couples enquiring about an MC)
-- ============================================
CREATE TABLE couple_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mc_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  couple_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_date DATE,
  venue TEXT,
  guest_count INTEGER,
  budget TEXT,                    -- Free text: "$2000-3000" or "TBD"
  stage TEXT NOT NULL DEFAULT 'new'
    CHECK (stage IN ('new','contacted','quoted','booked','completed','lost')),
  quoted_amount NUMERIC(10,2),
  source TEXT DEFAULT 'wedlist'   -- 'wedlist' | 'direct' | 'referral'
    CHECK (source IN ('wedlist','direct','referral')),
  follow_up_date DATE,            -- Next follow-up reminder
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- LEAD ACTIVITIES (notes, calls, emails, stage changes)
-- ============================================
CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES couple_leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL
    CHECK (type IN ('note','call','email','stage_change','quote_sent')),
  content TEXT,
  metadata JSONB DEFAULT '{}',    -- e.g. {"quote_amount": 2500, "old_stage": "new", "new_stage": "quoted"}
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_couple_leads_mc_id ON couple_leads(mc_id);
CREATE INDEX idx_couple_leads_stage ON couple_leads(mc_id, stage);
CREATE INDEX idx_couple_leads_event_date ON couple_leads(event_date);
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE couple_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "MC can manage own leads"
  ON couple_leads
  USING (mc_id = auth.uid());

CREATE POLICY "Admin can view all leads"
  ON couple_leads FOR SELECT
  USING (public.is_admin());

CREATE POLICY "MC can view own lead activities"
  ON lead_activities
  USING (
    EXISTS (
      SELECT 1 FROM couple_leads
      WHERE couple_leads.id = lead_activities.lead_id
      AND couple_leads.mc_id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all lead activities"
  ON lead_activities FOR SELECT
  USING (public.is_admin());
```

---

## MC CRM UI Requirements

### Dashboard (`/admin/dashboard`)

**KPI Cards:**
- Total leads (all stages combined)
- Booked this month (count)
- Average quoted amount
- Overdue follow-ups (count)

**Recent Activity Feed:**
- Last 5 activities: stage changes, notes added, quotes sent
- Timestamp + action description

**Quick Links:**
- "Browse All Leads" → `/admin/leads`
- "New Lead" button (creates new lead form)

### Kanban Pipeline View (`/admin/leads`)

**Default View:**
- 6 horizontal swimlanes: New → Contacted → Quoted → Booked → Completed → Lost
- Scrollable columns on mobile
- Lead cards per column:
  - Couple name (bold, truncated)
  - Event date (gray text, "12 Mar 2025" format)
  - Venue (secondary text)
  - Budget badge (e.g. "$2500")
  - Drag handle (can move between stages)
- Click card → lead detail page
- Hover: lift effect, shadow deepens

**List View Toggle:**
- Table format with columns: Couple Name | Event Date | Venue | Budget | Stage | Last Update
- Searchable by couple name/email/venue
- Filterable by stage
- Sort by date, budget, stage

### Lead Detail Page (`/admin/leads/[leadId]`)

**Header:**
- Couple name + event date + venue

**Event Info Panel:**
- Email + phone (clickable, copy-to-clipboard)
- Guest count
- Venue
- Event date
- Budget text field (editable)

**Quoted Amount Field:**
- Numeric input (editable)
- When changed, auto-log activity "quote_sent"

**Stage Selector:**
- Dropdown or pill buttons
- Changing stage auto-logs activity "stage_change"

**Follow-up Date:**
- Date picker
- Red badge if overdue
- Clear date option

**Activity Timeline:**
- Reverse-chronological list of all lead activities
- Activity icon per type (note, call, email, stage change, quote)
- Timestamp + content
- For stage changes: show "New → Contacted" format with timestamp
- For quotes: show amount + timestamp
- Show "You" for MC's own actions

**Notes Section:**
- Textarea for free-form notes
- "Add Note" button
- Shows all historical notes in timeline
- Each note shows timestamp + full text

**Delete Lead:**
- "Delete Lead" button (bottom, destructive styling)
- Confirmation dialog: "Are you sure? This cannot be undone."

---

## Design System for MC CRM

All MC CRM pages follow the design directives in `CLAUDE.md`:

### Card System
- Cards: `rounded-2xl`, `shadow-[0_2px_8px_rgba(227,28,95,0.15)]`
- Hover: `hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(227,28,95,0.25)]`
- Never use borders; depth via shadows only

### Kanban/Pipeline
- Horizontal layout with 6 scrollable columns (columns scroll on mobile, not entire page)
- Column header: stage name (uppercase, gray-500, medium weight)
- Cards in column: lead cards, drag-handle on left (lucide `GripVertical`)
- Empty state per column: icon + "No leads in {stage}"
- `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop reordering

### Badges & Status
- Status badges: pill shape (`rounded-full`), small font (`text-xs`)
- Stage colors (reference):
  - New: `bg-gray-100 text-gray-700`
  - Contacted: `bg-blue-50 text-blue-700`
  - Quoted: `bg-amber-50 text-amber-700`
  - Booked: `bg-green-50 text-green-700`
  - Completed: `bg-green-100 text-green-800`
  - Lost: `bg-red-50 text-red-700`
- Budget badge: `bg-rose-50 text-rose-700`

### Timeline/Activity Log
- Vertical line with circular icons per entry
- Icon size: 20px, muted gray color
- Entry timestamp: right-aligned, gray-500, `text-xs`
- Content: subject line (bold) + optional details below
- Divider: `border-l border-gray-200`

### Forms & Inputs
- All inputs: `rounded-lg`, `border border-gray-200`, `focus:border-rose-300 focus:ring-1 focus:ring-rose-100`
- Textareas: 4 rows default, expandable
- Date pickers: native HTML5 or calendar component
- Select dropdowns: styled with rose accent on focus

### Search & Filter
- Search bar: `rounded-full`, placeholder text, lucide `Search` icon
- Filters: pill buttons above list, active state highlighted in rose
- "Clear filters" link if any active

### Responsiveness
- Kanban columns scroll horizontally on mobile (prevent page scroll)
- Lead detail: card layout on mobile, panels on desktop (≥1024px)
- List view: card layout on mobile, table on desktop
- Single-column stacking on mobile for info panels

### Accessibility
- `data-testid` attributes on interactive elements (lead cards, stage columns, buttons)
- Keyboard navigation: Tab through cards, Enter to open detail, Arrow keys within kanban
- Focus rings: visible on all interactive elements (1px rose accent)
- ARIA labels on icon buttons (drag handle, delete, etc.)

---

## Implementation Checklist

- [ ] Couple Leads Database: `couple_leads` + `lead_activities` tables with RLS
- [ ] MC Auth: Update middleware to protect `/admin/*` routes, redirect to `/admin/dashboard`
- [ ] MC Dashboard: KPI cards + recent activity feed
- [ ] MC Kanban: 6-stage pipeline with drag-and-drop reordering
- [ ] MC List View: Table format with search/filter/sort
- [ ] MC Lead Detail: Event info + timeline + notes + quote + stage selector
- [ ] Design System: All cards/badges/timelines follow Dribbble style
- [ ] RLS Verification: MCs can only access own leads; super admin sees all
- [ ] Responsiveness: Test at 375px, 768px, 1024px+ viewports
- [ ] Accessibility: Keyboard nav, focus rings, ARIA labels
- [ ] E2E Tests: MC creates lead, moves through pipeline, adds notes/quotes

---

## References

- See [SUPER_ADMIN.md](./SUPER_ADMIN.md) for **Super Admin CRM** specification (`/super-admin/crm/mcs` routes).
- All design follows rules in [CLAUDE.md](./CLAUDE.md).
