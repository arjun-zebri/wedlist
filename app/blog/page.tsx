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

      <main className="relative min-h-screen bg-gradient-to-br from-white via-white to-rose-50/30" style={{ overflow: 'clip' }}>
        {/* Background orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#E31C5F]/10 to-pink-200/8 rounded-full filter blur-3xl opacity-60 animate-drift-slow"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100/10 to-blue-100/6 rounded-full filter blur-3xl opacity-40 animate-float animation-delay-2000"></div>

        {/* Hero Section */}
        <section className="relative bg-white/80 backdrop-blur-sm px-4 pt-28 pb-16 sm:pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E31C5F]"></div>
              <span className="text-xs font-semibold text-gray-700">WedList Blog</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-display sm:text-5xl">
              Wedding MC Tips & Guides
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Expert advice for planning your perfect Sydney wedding
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="relative px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-[0_2px_8px_rgba(227,28,95,0.08)]">
                <p className="text-lg font-semibold text-gray-900 font-display">
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
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(227,28,95,0.08)] hover:shadow-[0_6px_16px_rgba(227,28,95,0.12)] hover:-translate-y-1 transition-[transform,box-shadow] duration-300"
                  >
                    {post.featured_image ? (
                      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-gradient-to-br from-rose-50 via-gray-50 to-gray-100" />
                    )}

                    <div className="p-6">
                      <p className="text-xs font-medium text-gray-500">
                        {new Date(post.published_at).toLocaleDateString(
                          "en-AU",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-gray-900 font-display group-hover:text-[#E31C5F] transition-colors duration-200">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm text-gray-600 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <p className="mt-4 text-sm font-medium text-[#E31C5F]">
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
