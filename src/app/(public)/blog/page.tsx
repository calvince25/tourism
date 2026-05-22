import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/blog/BlogCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safari Blog | Travel Guides & Wildlife Stories | WildpathAfrica",
  description: "Stay updated with the latest safari tips, wildlife news, and travel guides from the heart of Africa.",
};

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  let posts: any[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { 
        featuredImage: true,
        author: { select: { name: true } }
      }
    });
  } catch (error) {
    console.error("Failed to fetch blog posts from database:", error);
    posts = [];
  }

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  let heroImage = "/assets/hero_bg.png";
  try {
    const dbPromise = prisma.setting.findUnique({
      where: { key: "hero_blog" }
    });
    const timeoutPromise = new Promise<any>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 2000)
    );
    const heroSetting = await Promise.race([dbPromise, timeoutPromise]);
    if (heroSetting?.value) {
      heroImage = heroSetting.value;
    }
  } catch (error) {
    console.warn("Failed to fetch hero image setting:", error);
  }

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-navy-dark opacity-60 z-10" />
        <div 
          id="hero-bg-blog"
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="container mx-auto px-8 relative z-20 text-center">
          <p className="text-accent uppercase tracking-widest font-bold mb-4">Stories from the Wild</p>
          <h1 className="text-6xl md:text-8xl font-bold font-outfit mb-6">Safari Blog</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            Expert guides, wildlife encounters, and essential travel tips to help you plan your dream African adventure.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-8">
          {posts.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
              <p className="text-white/40">Our writers are out on safari! New stories coming soon.</p>
            </div>
          ) : (
            <div className="space-y-24">
              {/* Featured Post */}
              {featuredPost && (
                <div className="group relative bg-navy-light/10 border border-white/5 rounded-[40px] overflow-hidden flex flex-col lg:flex-row hover:border-accent/30 transition-all duration-500">
                  <div className="lg:w-3/5 relative h-[400px] lg:h-auto overflow-hidden">
                    <img 
                      src={featuredPost.featuredImage?.fileUrl || "/assets/placeholder.png"} 
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="lg:w-2/5 p-12 lg:p-20 flex flex-col justify-center">
                    <span className="text-accent uppercase tracking-widest font-bold text-xs mb-6">FEATURED STORY</span>
                    <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-6 text-white group-hover:text-accent transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-white/60 mb-10 text-lg leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <a 
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-3 text-white font-bold bg-white/5 self-start px-8 py-4 rounded-full border border-white/10 hover:bg-accent hover:text-navy transition-all"
                    >
                      Read Article
                    </a>
                  </div>
                </div>
              )}

              {/* Remaining Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {remainingPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
