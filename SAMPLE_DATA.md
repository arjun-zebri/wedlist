# Sample Data for Testing

Use this data to quickly test your WedList platform with a sample MC.

## Sample MC Profile

```sql
-- Insert sample MC
INSERT INTO mc_profiles (name, slug, email, phone, bio, website, featured, languages, google_reviews_link)
VALUES (
  'James Williams',
  'james-williams',
  'james@example.com',
  '0412 345 678',
  'With over 10 years of experience hosting weddings across Sydney, James brings energy, professionalism, and a personal touch to every celebration. His warm personality and quick wit ensure your reception flows smoothly while keeping guests entertained throughout the evening. James specialises in multicultural weddings and is fluent in both English and Mandarin.',
  'https://jameswilliamsmс.com.au',
  true,
  ARRAY['English', 'Mandarin'],
  'https://g.page/example'
);
```

## Sample Packages

```sql
-- Get the MC ID first, then insert packages
INSERT INTO mc_packages (mc_id, name, price, duration, ideal_for, inclusions, popular, order_index)
VALUES 
  (
    '[MC_ID_HERE]',
    'Bronze Package',
    1200,
    '4 hours',
    'Intimate weddings up to 80 guests',
    ARRAY['Reception hosting', 'Microphone coordination', 'Timeline management', 'Pre-wedding consultation'],
    false,
    0
  ),
  (
    '[MC_ID_HERE]',
    'Silver Package',
    1800,
    '6 hours',
    'Standard weddings 80-150 guests',
    ARRAY['Reception hosting', 'Microphone coordination', 'Timeline management', 'Pre-wedding consultation', 'Ceremony hosting', 'Games and activities'],
    true,
    1
  ),
  (
    '[MC_ID_HERE]',
    'Gold Package',
    2500,
    '8 hours',
    'Large weddings 150+ guests',
    ARRAY['Reception hosting', 'Microphone coordination', 'Timeline management', 'Pre-wedding consultation', 'Ceremony hosting', 'Games and activities', 'Custom script writing', 'Unlimited venue visits'],
    false,
    2
  );
```

## Sample Reviews

```sql
INSERT INTO google_reviews (mc_id, reviewer_name, rating, review_text, review_date, order_index)
VALUES
  (
    '[MC_ID_HERE]',
    'Sarah & Michael Chen',
    5,
    'James was absolutely fantastic! He made our multicultural wedding seamless, switching between English and Mandarin effortlessly. Our guests are still talking about how entertaining and professional he was. Highly recommend!',
    '2024-11-15',
    0
  ),
  (
    '[MC_ID_HERE]',
    'Emma Thompson',
    5,
    'We couldn''t have asked for a better MC. James kept the energy high all night and made sure everything ran on time. He even helped calm my nerves before the speeches. Five stars!',
    '2024-10-22',
    1
  ),
  (
    '[MC_ID_HERE]',
    'David & Lisa Wong',
    5,
    'Professional, funny, and incredibly organized. James made our wedding reception flow perfectly. He knew exactly when to be serious and when to lighten the mood. Worth every penny!',
    '2024-09-08',
    2
  ),
  (
    '[MC_ID_HERE]',
    'Alexandra Martinez',
    5,
    'James hosted our wedding at Doltone House and was simply amazing. He engaged with all our guests and made everyone feel welcome. The night was perfect thanks to him!',
    '2024-08-19',
    3
  ),
  (
    '[MC_ID_HERE]',
    'Ryan & Jessica Lee',
    5,
    'Best decision we made for our wedding! James is professional, charming, and knows exactly how to work a room. Our reception was smooth sailing thanks to him.',
    '2024-07-30',
    4
  );
```

## Sample Additional Info

```sql
INSERT INTO mc_additional_info (mc_id, response_time, booking_deposit, cancellation_policy)
VALUES (
  '[MC_ID_HERE]',
  'Within 24 hours',
  '20% deposit required to secure booking',
  'Full refund if cancelled 30+ days before wedding. 50% refund 14-29 days. No refund within 14 days.'
);
```

## Sample Videos

```sql
-- If you have YouTube videos, add them like this:
INSERT INTO mc_videos (mc_id, platform, video_id, title, order_index)
VALUES
  (
    '[MC_ID_HERE]',
    'youtube',
    'dQw4w9WgXcQ',
    'Wedding at The Ivy Ballroom',
    0
  );
```

## Notes

1. Replace `[MC_ID_HERE]` with the actual UUID from the mc_profiles insert
2. Upload a profile image to Supabase Storage and update the profile
3. Upload 5-10 gallery photos to test the gallery feature
4. This gives you a complete MC profile to test all features

## Testing Checklist

After adding this sample data:

- [ ] Visit homepage - James should appear in featured section
- [ ] Visit /wedding-mc-sydney - James should appear in directory
- [ ] Visit /mc/james-williams - Full profile should load
- [ ] All 3 packages display correctly
- [ ] All 5 reviews display correctly
- [ ] Contact form works and sends emails
- [ ] Admin dashboard shows 1 MC in stats

## Quick SQL to Check Your Data

```sql
-- Check if MC was created
SELECT * FROM mc_profiles WHERE slug = 'james-williams';

-- Check packages
SELECT * FROM mc_packages WHERE mc_id = '[MC_ID]';

-- Check reviews
SELECT * FROM google_reviews WHERE mc_id = '[MC_ID]';

-- Check all inquiries
SELECT * FROM contact_inquiries ORDER BY created_at DESC LIMIT 10;
```
