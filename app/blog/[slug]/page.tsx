import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string;
  meta_title: string | null;
  meta_description: string | null;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as BlogPost;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="relative min-h-screen bg-gradient-to-br from-white via-white to-rose-50/30">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#E31C5F]/8 to-pink-200/6 rounded-full filter blur-3xl opacity-50"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100/8 to-blue-100/4 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        {/* Breadcrumb */}
        <div className="relative border-b border-gray-100 bg-white/80 backdrop-blur-sm px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              <Link href="/blog" className="text-gray-500 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-medium text-gray-900">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <article className="relative px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <header className="mb-8">
              <p className="text-sm font-medium text-gray-500">
                {new Date(post.published_at).toLocaleDateString("en-AU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 font-display sm:text-5xl leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-6 text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
              )}
            </header>

            {post.featured_image && (
              <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl shadow-[0_2px_8px_rgba(227,28,95,0.08)]">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Article Content */}
            <div
              className="prose prose-lg prose-gray max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-gray-900 prose-a:underline hover:prose-a:text-gray-700
                prose-strong:text-gray-900
                prose-ul:list-disc prose-ol:list-decimal
                prose-li:text-gray-700
                prose-blockquote:border-l-4 prose-blockquote:border-gray-900 prose-blockquote:pl-4 prose-blockquote:italic
                prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-gray-900
                prose-pre:bg-gray-900 prose-pre:text-white
                prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
          </div>
        </article>

        {/* CTA Section */}
        <section className="relative border-t border-gray-100 bg-white/80 backdrop-blur-sm px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 font-display">
              Ready to Find Your Wedding MC?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Browse our directory of professional Sydney wedding MCs
            </p>
            <div className="mt-8">
              <Link
                href="/wedding-mc-sydney"
                className="group inline-flex items-center rounded-xl bg-[#E31C5F] px-8 py-3 text-base font-semibold text-white hover:bg-[#C4184F] shadow-[0_2px_8px_rgba(227,28,95,0.25)] transition-colors duration-200"
              >
                Browse Wedding MCs
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </section>

        {/* Back to Blog */}
        <section className="relative bg-white/80 backdrop-blur-sm px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#E31C5F] transition-colors duration-200"
            >
              ← Back to all posts
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// Simple content formatter (converts markdown-style headers to HTML)
function formatContent(content: string): string {
  // Convert markdown headers to HTML
  let formatted = content
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^- (.*$)/gim, "<li>$1</li>");

  // Wrap lists
  formatted = formatted.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");

  // Wrap in paragraphs
  formatted = "<p>" + formatted + "</p>";

  // Clean up extra paragraph tags
  formatted = formatted
    .replace(/<p><h/g, "<h")
    .replace(/<\/h1><\/p>/g, "</h1>")
    .replace(/<\/h2><\/p>/g, "</h2>")
    .replace(/<\/h3><\/p>/g, "</h3>")
    .replace(/<p><ul>/g, "<ul>")
    .replace(/<\/ul><\/p>/g, "</ul>")
    .replace(/<p><\/p>/g, "");

  return formatted;
}
