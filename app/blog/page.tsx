import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Wedding MC Tips & Guides | WedList Blog",
  description:
    "Expert advice, tips, and guides for planning your Sydney wedding and choosing the perfect Master of Ceremonies.",
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  meta_description: string | null;
}

async function getBlogPosts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, featured_image, published_at, meta_description"
    )
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  return data as BlogPost[];
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Wedding MC Tips & Guides
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Expert advice for planning your perfect Sydney wedding
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {posts.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <p className="text-lg font-medium text-gray-900">
                  No blog posts yet
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Check back soon for expert wedding tips and advice!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
                  >
                    {post.featured_image ? (
                      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}

                    <div className="p-6">
                      <p className="text-xs text-gray-500">
                        {new Date(post.published_at).toLocaleDateString(
                          "en-AU",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-gray-700">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                          {post.excerpt}
                        </p>
                      )}
                      <p className="mt-4 text-sm font-medium text-gray-900">
                        Read more →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
