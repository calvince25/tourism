import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { MapPin, Compass, BookOpen, Layers, ArrowRight } from "lucide-react";

export const metadata: Metadata = generateSEOMetadata({
  title: "Sitemap - Explore Our Safaris & Destinations",
  description: "Navigate all pages on WildpathAfrica. Find your perfect Kenyan safari tour, explore destinations like Maasai Mara, and read our latest travel blog posts.",
  path: "/sitemap",
});

export const dynamic = "force-dynamic";

export default async function SitemapPage() {
  let countries: any[] = [];
  let tours: any[] = [];
  let posts: any[] = [];
  let heroImage = "/assets/hero_bg.png";

  try {
    // Fetch hero image setting
    const heroSetting = await prisma.setting.findUnique({
      where: { key: "hero_home" },
    });
    if (heroSetting?.value) {
      heroImage = heroSetting.value;
    }

    // Fetch dynamic content
    [countries, tours, posts] = await Promise.all([
      prisma.country.findMany({
        where: { active: true },
        include: {
          destinations: {
            where: { status: "PUBLISHED" },
            orderBy: { name: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.tour.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { name: "asc" },
      }),
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
      }),
    ]);
  } catch (error) {
    console.error("SitemapPage: Database fetch failed:", error);
  }

  const staticPages = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Destinations", path: "/destinations" },
    { name: "Safari Tours", path: "/tours" },
    { name: "Travel Blog", path: "/blog" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-navy text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[35vh] flex items-center justify-center overflow-hidden text-center">
        <div className="absolute inset-0 bg-navy-dark opacity-70 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="container mx-auto px-4 sm:px-8 relative z-20 pt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-outfit mb-4">Sitemap</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-base sm:text-lg">
            Where Every Path Leads to Wonder. Explore all our pages, destinations, and custom safari itineraries.
          </p>
        </div>
      </section>

      {/* Sitemap Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Column 1: Core Pages */}
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 hover:bg-white/[0.03] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Layers size={20} />
                </div>
                <h2 className="text-2xl font-bold font-outfit">Main Pages</h2>
              </div>
              <ul className="space-y-4">
                {staticPages.map((page) => (
                  <li key={page.path}>
                    <Link 
                      href={page.path} 
                      className="group flex items-center justify-between py-2 border-b border-white/5 hover:text-accent transition-colors"
                    >
                      <span className="font-medium">{page.name}</span>
                      <div className="flex items-center gap-2 text-xs text-white/40 group-hover:text-accent transition-colors">
                        <span>{page.path}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Safari Tours */}
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 hover:bg-white/[0.03] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Compass size={20} />
                </div>
                <h2 className="text-2xl font-bold font-outfit">Safari Packages</h2>
              </div>
              {tours.length > 0 ? (
                <ul className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  {tours.map((tour) => (
                    <li key={tour.id}>
                      <Link 
                        href={`/tours/${tour.slug}`}
                        className="group flex items-center justify-between py-2 border-b border-white/5 hover:text-accent transition-colors"
                      >
                        <span className="font-medium line-clamp-1">{tour.name}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-accent transition-all shrink-0 ml-2" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/40 italic">No safari packages published yet.</p>
              )}
            </div>

            {/* Column 3: Destinations by Country */}
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 hover:bg-white/[0.03] transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <MapPin size={20} />
                </div>
                <h2 className="text-2xl font-bold font-outfit">Destinations</h2>
              </div>
              {countries.length > 0 ? (
                <div className="space-y-6">
                  {countries.map((country) => (
                    <div key={country.id} className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                      <Link 
                        href={`/destinations/${country.slug}`}
                        className="text-lg font-bold text-accent hover:underline mb-2 block"
                      >
                        {country.flagEmoji || "📍"} {country.name}
                      </Link>
                      {country.destinations.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-2 pl-4">
                          {country.destinations.map((dest: any) => (
                            <li key={dest.id}>
                              <Link 
                                href={`/destinations/${country.slug}/${dest.slug}`}
                                className="group flex items-center justify-between py-1 text-sm text-white/70 hover:text-white transition-colors"
                              >
                                <span className="line-clamp-1">{dest.name}</span>
                                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-accent transition-all shrink-0 ml-2" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-white/40 italic pl-4">No destinations listed.</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 italic">No destinations published yet.</p>
              )}
            </div>

            {/* Column 4: Blog Articles */}
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 hover:bg-white/[0.03] transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <BookOpen size={20} />
                </div>
                <h2 className="text-2xl font-bold font-outfit">Travel Articles</h2>
              </div>
              {posts.length > 0 ? (
                <ul className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  {posts.map((post) => (
                    <li key={post.id}>
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="group flex items-center justify-between py-2 border-b border-white/5 hover:text-accent transition-colors"
                      >
                        <span className="font-medium line-clamp-1">{post.title}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-accent transition-all shrink-0 ml-2" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/40 italic">No blog posts published yet.</p>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
