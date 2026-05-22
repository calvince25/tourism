import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, Share2, Facebook, Twitter, Link as LinkIcon, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props { params: { slug: string } }

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: { ogImage: true }
  });
  if (!post) return {};

  return {
    title: post.metaTitle || `${post.title} | WildpathAfrica Blog`,
    description: post.metaDescription || post.excerpt || "",
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      images: post.ogImage ? [{ url: post.ogImage.fileUrl }] : [],
    },
  };
}

export default async function BlogPostDetailPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: {
      featuredImage: true,
      author: { select: { name: true, profilePhoto: true } },
    }
  });

  if (!post || post.status !== "PUBLISHED") notFound();

  // Fetch related posts
  const relatedPosts = await prisma.blogPost.findMany({
    where: { 
      status: "PUBLISHED",
      NOT: { id: post.id },
      category: post.category
    },
    take: 3,
    include: { featuredImage: true }
  });

  return (
    <div className="min-h-screen bg-navy text-white">
      <Navbar />

      <article className="pb-24">
        {/* Post Hero */}
        <header className="relative h-[70vh] flex items-end pb-20 overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
          <Image 
            src={post.featuredImage?.fileUrl || "/assets/hero-bg.png"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="container mx-auto px-8 relative z-20">
            <div className="max-w-4xl">
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-xs mb-8 hover:gap-4 transition-all"
              >
                <ArrowLeft size={16} /> Back to Blog
              </Link>
              <span className="block bg-accent text-navy text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-fit mb-6">
                {post.category || "Safari Guide"}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold font-outfit mb-8 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-8 text-sm text-white/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent border border-accent/20">
                    {post.author?.name?.charAt(0) || "W"}
                  </div>
                  <span>{post.author?.name || "Wildpath Editor"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-accent" />
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-accent" />
                  {Math.ceil(post.content.split(" ").length / 200)} min read
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="container mx-auto px-8 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Sidebar / Sharing */}
            <div className="lg:col-span-1 hidden lg:block sticky top-32 h-fit">
              <div className="flex flex-col gap-6 text-white/40">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] [writing-mode:vertical-lr]">Share Story</p>
                <div className="w-px h-12 bg-white/10 mx-auto" />
                <button className="hover:text-accent transition-colors"><Facebook size={20} /></button>
                <button className="hover:text-accent transition-colors"><Twitter size={20} /></button>
                <button className="hover:text-accent transition-colors"><LinkIcon size={20} /></button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8">
              <div 
                className="prose prose-invert prose-xl max-w-none prose-headings:font-outfit prose-accent prose-p:leading-relaxed prose-p:text-white/70"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-20 pt-12 border-t border-white/5">
                <div className="flex flex-wrap gap-3">
                  {(post.tags as string[] || []).map(tag => (
                    <span key={tag} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm text-white/60">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Sidebar */}
            <div className="lg:col-span-3 space-y-12">
              <h3 className="text-xl font-bold font-outfit border-b border-accent pb-4">Read Next</h3>
              <div className="space-y-10">
                {relatedPosts.map(rp => (
                  <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block space-y-4">
                    <div className="relative aspect-video rounded-2xl overflow-hidden">
                      <Image 
                        src={rp.featuredImage?.fileUrl || "/assets/placeholder.png"} 
                        alt={rp.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-bold text-lg leading-snug group-hover:text-accent transition-colors">
                      {rp.title}
                    </h4>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
                      {new Date(rp.publishedAt || rp.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Newsletter Section */}
      <section className="bg-navy-dark py-24 border-t border-white/5">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto bg-accent rounded-[50px] p-12 md:p-20 text-center text-navy relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold font-outfit mb-6">Stay in the Wild Loop</h2>
              <p className="text-navy/70 text-lg mb-10 max-w-xl mx-auto">
                Get monthly safari tips, exclusive deals, and wildlife stories delivered straight to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="flex-grow bg-white/20 border border-navy/10 rounded-xl px-6 py-4 placeholder:text-navy/40 focus:bg-white/40 outline-none transition-all font-bold"
                />
                <button className="bg-navy text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
