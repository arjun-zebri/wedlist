-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- MC Profiles Table
CREATE TABLE mc_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  profile_image TEXT,
  featured BOOLEAN DEFAULT false,
  languages TEXT[] DEFAULT ARRAY['English'],
  google_reviews_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- MC Photos Table
CREATE TABLE mc_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mc_id UUID REFERENCES mc_profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- MC Videos Table
CREATE TABLE mc_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mc_id UUID REFERENCES mc_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'vimeo')),
  video_id TEXT NOT NULL,
  title TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- MC Packages Table
CREATE TABLE mc_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mc_id UUID REFERENCES mc_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration TEXT,
  ideal_for TEXT,
  inclusions TEXT[],
  popular BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- MC Additional Info Table
CREATE TABLE mc_additional_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mc_id UUID REFERENCES mc_profiles(id) ON DELETE CASCADE,
  response_time TEXT,
  booking_deposit TEXT,
  cancellation_policy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Google Reviews Table (top 5 manually added)
CREATE TABLE google_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mc_id UUID REFERENCES mc_profiles(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_date DATE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Contact Inquiries Table
CREATE TABLE contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mc_id UUID REFERENCES mc_profiles(id) ON DELETE SET NULL,
  couple_name TEXT NOT NULL,
  couple_email TEXT NOT NULL,
  couple_phone TEXT,
  wedding_date DATE,
  venue TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX idx_mc_profiles_slug ON mc_profiles(slug);
CREATE INDEX idx_mc_profiles_featured ON mc_profiles(featured);
CREATE INDEX idx_mc_photos_mc_id ON mc_photos(mc_id);
CREATE INDEX idx_mc_videos_mc_id ON mc_videos(mc_id);
CREATE INDEX idx_mc_packages_mc_id ON mc_packages(mc_id);
CREATE INDEX idx_google_reviews_mc_id ON google_reviews(mc_id);
CREATE INDEX idx_contact_inquiries_mc_id ON contact_inquiries(mc_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_mc_profiles_updated_at BEFORE UPDATE ON mc_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mc_additional_info_updated_at BEFORE UPDATE ON mc_additional_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE mc_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mc_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mc_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mc_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mc_additional_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read policies (for non-authenticated users)
CREATE POLICY "Public can view published MC profiles" ON mc_profiles FOR SELECT USING (true);
CREATE POLICY "Public can view MC photos" ON mc_photos FOR SELECT USING (true);
CREATE POLICY "Public can view MC videos" ON mc_videos FOR SELECT USING (true);
CREATE POLICY "Public can view MC packages" ON mc_packages FOR SELECT USING (true);
CREATE POLICY "Public can view MC additional info" ON mc_additional_info FOR SELECT USING (true);
CREATE POLICY "Public can view Google reviews" ON google_reviews FOR SELECT USING (true);
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (published = true);

-- Public insert policy for contact inquiries
CREATE POLICY "Public can create contact inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);

-- Note: Admin write policies will be handled via service role key in the admin dashboard

insert into storage.buckets (id, name, public) values ('mc-images', 'mc-images', true);

-- Set up storage policies
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'mc-images' );

create policy "Authenticated users can upload"
on storage.objects for insert
with check ( bucket_id = 'mc-images' );

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON mc_profiles;
DROP POLICY IF EXISTS "Public read access" ON mc_photos;
DROP POLICY IF EXISTS "Public read access" ON mc_videos;
DROP POLICY IF EXISTS "Public read access" ON mc_packages;
DROP POLICY IF EXISTS "Public read access" ON mc_additional_info;
DROP POLICY IF EXISTS "Public read access" ON google_reviews;

-- MC Profiles
CREATE POLICY "Public read access" ON mc_profiles
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert" ON mc_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update" ON mc_profiles
  FOR UPDATE USING (true);

-- MC Photos
CREATE POLICY "Public read access" ON mc_photos
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert" ON mc_photos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update" ON mc_photos
  FOR UPDATE USING (true);

-- MC Videos
CREATE POLICY "Public read access" ON mc_videos
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert" ON mc_videos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update" ON mc_videos
  FOR UPDATE USING (true);

-- MC Packages
CREATE POLICY "Public read access" ON mc_packages
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert" ON mc_packages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update" ON mc_packages
  FOR UPDATE USING (true);

-- MC Additional Info
CREATE POLICY "Public read access" ON mc_additional_info
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert" ON mc_additional_info
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update" ON mc_additional_info
  FOR UPDATE USING (true);

-- Google Reviews
CREATE POLICY "Public read access" ON google_reviews
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert" ON google_reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update" ON google_reviews
  FOR UPDATE USING (true);

-- Contact Inquiries (for the contact form)
CREATE POLICY "Public can insert inquiries" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access" ON contact_inquiries
  FOR SELECT USING (true);

  -- Blog Posts policies
DROP POLICY IF EXISTS "Public read access" ON blog_posts;

CREATE POLICY "Public read published posts" ON blog_posts
  FOR SELECT USING (published = true OR true);

CREATE POLICY "Service role can insert" ON blog_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update" ON blog_posts
  FOR UPDATE USING (true);

CREATE POLICY "Service role can delete" ON blog_posts
  FOR DELETE USING (true);