import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const {
      mcId,
      formData,
      profileImageUrl,
      existingPhotos,
      newPhotoUrls,
      packages,
      videos,
      reviews,
    } = body;

    // 1. Update MC profile
    const { error: mcError } = await supabaseAdmin
      .from("mc_profiles")
      .update({
        name: formData.name,
        slug: formData.slug,
        email: formData.email,
        phone: formData.phone || null,
        bio: formData.bio || null,
        website: formData.website || null,
        profile_image: profileImageUrl,
        languages: formData.languages
          ? formData.languages.split(",").map((l: string) => l.trim())
          : [],
        featured: formData.featured,
        google_reviews_link: formData.google_reviews_link || null,
      })
      .eq("id", mcId);

    if (mcError)
      throw new Error(`Failed to update profile: ${mcError.message}`);

    // 2. Delete ALL related data
    const { error: photosDelErr } = await supabaseAdmin
      .from("mc_photos")
      .delete()
      .eq("mc_id", mcId);
    if (photosDelErr)
      throw new Error(`Failed to delete photos: ${photosDelErr.message}`);

    const { error: packagesDelErr } = await supabaseAdmin
      .from("mc_packages")
      .delete()
      .eq("mc_id", mcId);
    if (packagesDelErr)
      throw new Error(`Failed to delete packages: ${packagesDelErr.message}`);

    const { error: videosDelErr } = await supabaseAdmin
      .from("mc_videos")
      .delete()
      .eq("mc_id", mcId);
    if (videosDelErr)
      throw new Error(`Failed to delete videos: ${videosDelErr.message}`);

    const { error: reviewsDelErr } = await supabaseAdmin
      .from("google_reviews")
      .delete()
      .eq("mc_id", mcId);
    if (reviewsDelErr)
      throw new Error(`Failed to delete reviews: ${reviewsDelErr.message}`);

    const { error: additionalDelErr } = await supabaseAdmin
      .from("mc_additional_info")
      .delete()
      .eq("mc_id", mcId);
    if (additionalDelErr)
      throw new Error(
        `Failed to delete additional info: ${additionalDelErr.message}`,
      );

    // 3. Insert photos
    const allPhotoUrls = [
      ...existingPhotos.map((p: any) => p.url),
      ...newPhotoUrls,
    ];
    for (let i = 0; i < allPhotoUrls.length; i++) {
      const { error } = await supabaseAdmin.from("mc_photos").insert({
        mc_id: mcId,
        url: allPhotoUrls[i],
        alt_text: `${formData.name} - Photo`,
        order_index: i,
      });
      if (error) throw new Error(`Failed to insert photo: ${error.message}`);
    }

    // 4. Insert packages
    const validPackages = packages.filter(
      (p: any) => p.name.trim() && p.price.trim(),
    );
    for (let i = 0; i < validPackages.length; i++) {
      const p = validPackages[i];
      const { error } = await supabaseAdmin.from("mc_packages").insert({
        mc_id: mcId,
        name: p.name.trim(),
        price: parseFloat(p.price),
        duration: p.duration.trim() || null,
        ideal_for: p.ideal_for.trim() || null,
        inclusions: p.inclusions
          ? p.inclusions.split("\n").filter((l: string) => l.trim())
          : [],
        popular: p.popular,
        order_index: i,
      });
      if (error) throw new Error(`Failed to insert package: ${error.message}`);
    }

    // 5. Insert videos
    const validVideos = videos.filter((v: any) => v.video_id.trim());
    for (let i = 0; i < validVideos.length; i++) {
      const v = validVideos[i];
      const { error } = await supabaseAdmin.from("mc_videos").insert({
        mc_id: mcId,
        platform: v.platform,
        video_id: v.video_id.trim(),
        title: v.title.trim() || null,
        order_index: i,
      });
      if (error) throw new Error(`Failed to insert video: ${error.message}`);
    }

    // 6. Insert reviews
    const validReviews = reviews.filter(
      (r: any) => r.reviewer_name.trim() && r.review_text.trim(),
    );
    for (let i = 0; i < validReviews.length; i++) {
      const r = validReviews[i];
      const { error } = await supabaseAdmin.from("google_reviews").insert({
        mc_id: mcId,
        reviewer_name: r.reviewer_name.trim(),
        rating: r.rating,
        review_text: r.review_text.trim(),
        review_date: r.review_date || null,
        order_index: i,
      });
      if (error) throw new Error(`Failed to insert review: ${error.message}`);
    }

    // 7. Insert additional info
    if (
      formData.response_time?.trim() ||
      formData.booking_deposit?.trim() ||
      formData.cancellation_policy?.trim()
    ) {
      const { error } = await supabaseAdmin.from("mc_additional_info").insert({
        mc_id: mcId,
        response_time: formData.response_time?.trim() || null,
        booking_deposit: formData.booking_deposit?.trim() || null,
        cancellation_policy: formData.cancellation_policy?.trim() || null,
      });
      if (error)
        throw new Error(`Failed to insert additional info: ${error.message}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
