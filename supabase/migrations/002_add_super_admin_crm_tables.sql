-- ============================================
-- COUPLES LEADS (MCs managing couple enquiries)
-- ============================================
CREATE TABLE couple_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mc_id UUID NOT NULL REFERENCES mc_profiles(id) ON DELETE CASCADE,
  couple_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_date DATE,
  venue TEXT,
  guest_count INTEGER,
  budget TEXT,
  stage TEXT NOT NULL DEFAULT 'new'
    CHECK (stage IN ('new','contacted','quoted','booked','completed','lost')),
  quoted_amount NUMERIC(10,2),
  source TEXT DEFAULT 'wedlist'
    CHECK (source IN ('wedlist','direct','referral')),
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
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
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- MC CRM RECORDS (admin tracking MCs as leads)
-- ============================================
CREATE TABLE mc_crm_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mc_profile_id UUID UNIQUE REFERENCES mc_profiles(id) ON DELETE SET NULL,
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
  last_contact_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- MC OUTREACH LOG (calls, emails, meetings with MCs)
-- ============================================
CREATE TABLE mc_outreach_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mc_crm_record_id UUID NOT NULL REFERENCES mc_crm_records(id) ON DELETE CASCADE,
  type TEXT NOT NULL
    CHECK (type IN ('call','email','meeting','demo','other')),
  summary TEXT NOT NULL,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- INQUIRY ACTIVITIES (follow-ups for contact inquiries)
-- ============================================
CREATE TABLE inquiry_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_id UUID NOT NULL REFERENCES contact_inquiries(id) ON DELETE CASCADE,
  type TEXT NOT NULL
    CHECK (type IN ('note','call','email','status_change')),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- UPDATE CONTACT_INQUIRIES TABLE (add new fields)
-- ============================================
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'couple'
  CHECK (type IN ('couple','vendor'));

ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new'
  CHECK (status IN ('new','contacted','qualified','lost','closed'));

ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS vendor_type TEXT;

ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS company_name TEXT;

ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website'
  CHECK (source IN ('website','google','referral','social','other'));

ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES mc_profiles(id);

ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS follow_up_date DATE;

ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());

ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS event_type TEXT;

-- ============================================
-- UPDATE BLOG_POSTS TABLE (add author tracking)
-- ============================================
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES mc_profiles(id) ON DELETE SET NULL;

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title TEXT;

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_description TEXT;

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft'
  CHECK (status IN ('draft','published','archived'));

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_couple_leads_mc_id ON couple_leads(mc_id);
CREATE INDEX IF NOT EXISTS idx_couple_leads_stage ON couple_leads(mc_id, stage);
CREATE INDEX IF NOT EXISTS idx_couple_leads_event_date ON couple_leads(event_date);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_mc_crm_records_stage ON mc_crm_records(stage);
CREATE INDEX IF NOT EXISTS idx_mc_crm_records_listing_status ON mc_crm_records(listing_status);
CREATE INDEX IF NOT EXISTS idx_mc_crm_records_renewal_date ON mc_crm_records(renewal_date);
CREATE INDEX IF NOT EXISTS idx_mc_outreach_log_mc_id ON mc_outreach_log(mc_crm_record_id);
CREATE INDEX IF NOT EXISTS idx_mc_outreach_log_follow_up ON mc_outreach_log(follow_up_date);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_type ON contact_inquiries(type);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiry_activities_inquiry_id ON inquiry_activities(inquiry_id);

-- ============================================
-- TRIGGERS: updated_at auto-update
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_couple_leads_updated_at ON couple_leads;
CREATE TRIGGER update_couple_leads_updated_at BEFORE UPDATE ON couple_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mc_crm_records_updated_at ON mc_crm_records;
CREATE TRIGGER update_mc_crm_records_updated_at BEFORE UPDATE ON mc_crm_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_inquiries_updated_at ON contact_inquiries;
CREATE TRIGGER update_contact_inquiries_updated_at BEFORE UPDATE ON contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE couple_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE mc_crm_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mc_outreach_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_activities ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SUPER ADMIN USERS TABLE (for Supabase Auth integration)
-- ============================================
CREATE TABLE IF NOT EXISTS super_admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Helper function: check if current user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM super_admin_users
    WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- COUPLE LEADS policies
DROP POLICY IF EXISTS "MC can manage own couple leads" ON couple_leads;
CREATE POLICY "MC can manage own couple leads"
  ON couple_leads FOR ALL
  USING (mc_id = (SELECT id FROM mc_profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admin can view all couple leads" ON couple_leads;
CREATE POLICY "Admin can view all couple leads"
  ON couple_leads FOR SELECT
  USING (is_super_admin());

DROP POLICY IF EXISTS "Admin can manage all couple leads" ON couple_leads;
CREATE POLICY "Admin can manage all couple leads"
  ON couple_leads FOR ALL
  USING (is_super_admin());

-- LEAD ACTIVITIES policies
DROP POLICY IF EXISTS "MC can view own lead activities" ON lead_activities;
CREATE POLICY "MC can view own lead activities"
  ON lead_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couple_leads
      WHERE couple_leads.id = lead_activities.lead_id
      AND couple_leads.mc_id = (SELECT id FROM mc_profiles WHERE id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admin can view all lead activities" ON lead_activities;
CREATE POLICY "Admin can view all lead activities"
  ON lead_activities FOR SELECT
  USING (is_super_admin());

DROP POLICY IF EXISTS "Admin can manage all lead activities" ON lead_activities;
CREATE POLICY "Admin can manage all lead activities"
  ON lead_activities FOR ALL
  USING (is_super_admin());

-- MC CRM RECORDS policies
DROP POLICY IF EXISTS "Admin can manage all MC records" ON mc_crm_records;
CREATE POLICY "Admin can manage all MC records"
  ON mc_crm_records FOR ALL
  USING (is_super_admin());

-- MC OUTREACH LOG policies
DROP POLICY IF EXISTS "Admin can manage all outreach logs" ON mc_outreach_log;
CREATE POLICY "Admin can manage all outreach logs"
  ON mc_outreach_log FOR ALL
  USING (is_super_admin());

-- INQUIRY ACTIVITIES policies
DROP POLICY IF EXISTS "Admin can manage all inquiry activities" ON inquiry_activities;
CREATE POLICY "Admin can manage all inquiry activities"
  ON inquiry_activities FOR ALL
  USING (is_super_admin());

-- Update contact_inquiries RLS policies
DROP POLICY IF EXISTS "Public can insert inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Public read access" ON contact_inquiries;
DROP POLICY IF EXISTS "Public can create inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Admin can view inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Admin can manage inquiries" ON contact_inquiries;

CREATE POLICY "Public can create inquiries"
  ON contact_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can view inquiries"
  ON contact_inquiries FOR SELECT
  USING (is_super_admin() OR true);

CREATE POLICY "Admin can manage inquiries"
  ON contact_inquiries FOR ALL
  USING (is_super_admin());
