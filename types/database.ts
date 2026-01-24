export interface MCProfile {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  profile_image: string | null;
  featured: boolean;
  languages: string[];
  google_reviews_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface MCPhoto {
  id: string;
  mc_id: string;
  url: string;
  alt_text: string | null;
  order_index: number;
  created_at: string;
}

export interface MCVideo {
  id: string;
  mc_id: string;
  platform: 'youtube' | 'vimeo';
  video_id: string;
  title: string | null;
  order_index: number;
  created_at: string;
}

export interface MCPackage {
  id: string;
  mc_id: string;
  name: string;
  price: number;
  duration: string | null;
  ideal_for: string | null;
  inclusions: string[];
  popular: boolean;
  order_index: number;
  created_at: string;
}

export interface MCAdditionalInfo {
  id: string;
  mc_id: string;
  response_time: string | null;
  booking_deposit: string | null;
  cancellation_policy: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoogleReview {
  id: string;
  mc_id: string;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  review_date: string | null;
  order_index: number;
  created_at: string;
}

export interface ContactInquiry {
  id: string;
  mc_id: string | null;
  couple_name: string;
  couple_email: string;
  couple_phone: string | null;
  wedding_date: string | null;
  venue: string | null;
  message: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MCProfileWithRelations extends MCProfile {
  photos?: MCPhoto[];
  videos?: MCVideo[];
  packages?: MCPackage[];
  additional_info?: MCAdditionalInfo;
  reviews?: GoogleReview[];
}

export interface ContactFormData {
  couple_name: string;
  couple_email: string;
  couple_phone?: string;
  wedding_date?: string;
  venue?: string;
  message?: string;
}
