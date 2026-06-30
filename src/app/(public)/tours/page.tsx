import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Clock, DollarSign, Users, ArrowRight, ShieldCheck, Zap, Heart } from "lucide-react";
import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = generateSEOMetadata({
  title: "Safari Tour Packages | Kenya Wildlife Tours",
  description: "Browse our curated selection of safari tour packages in Kenya. From Maasai Mara migrations to Amboseli elephant walks.",
  path: "/tours",
});

export const revalidate = 3600;

export default async function ToursIndexPage() {
  let tours: any[] = [];
  try {
    tours = await prisma.tour.findMany({
      where: { status: "PUBLISHED" },
      include: { coverImage: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Database connection failed fetching public tours list:", error);
    tours = [];
  }

  let heroImage = "/assets/hero_bg.png";
  try {
    const dbPromise = prisma.setting.findUnique({
      where: { key: "hero_tours" }
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
      <Breadcrumbs items={[{ name: "Tours", href: "/tours" }]} />

      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-center justify-center overflow-hidden text-center">
        <div className="absolute inset-0 bg-navy-dark opacity-60 z-10" />
        <div 
          id="hero-bg-tours"
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="container mx-auto px-4 sm:px-8 relative z-20 py-24">
          <p className="text-accent uppercase tracking-widest font-bold mb-4 text-xs sm:text-sm">Unforgettable Adventures</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-outfit mb-6">Safari Packages</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-base sm:text-lg">
            Curated wildlife experiences designed to take you deeper into the heart of Africa.
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 md:py-12 bg-navy-dark border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
            <div className="flex items-center gap-4 justify-center">
              <ShieldCheck className="text-accent shrink-0" size={32} />
              <div className="text-left">
                <p className="font-bold text-white uppercase tracking-wider text-xs">Safe &amp; Secure</p>
                <p className="text-white/40 text-[10px]">Fully licensed &amp; insured</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center sm:border-x sm:border-white/5">
              <Zap className="text-accent shrink-0" size={32} />
              <div className="text-left">
                <p className="font-bold text-white uppercase tracking-wider text-xs">Fast Booking</p>
                <p className="text-white/40 text-[10px]">Instant quote within 24h</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <Heart className="text-accent shrink-0" size={32} />
              <div className="text-left">
                <p className="font-bold text-white uppercase tracking-wider text-xs">Expert Guides</p>
                <p className="text-white/40 text-[10px]">Certified KMMG naturalists</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          {tours.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
              <p className="text-white/40">Our tour curators are designing new adventures. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {tours.map((tour) => (
                <Link 
                  key={tour.id} 
                  href={`/tours/${tour.slug}`}
                  className="group bg-navy-light/20 border border-white/5 rounded-[40px] overflow-hidden hover:border-accent/50 transition-all duration-500 flex flex-col"
                >
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image
                      src={tour.coverImage?.fileUrl || "/assets/placeholder.png"}
                      alt={tour.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="bg-accent text-navy text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        {tour.travelStyle}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <div>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Starting From</p>
                        <p className="text-2xl font-bold text-white font-outfit">
                          ${tour.priceUsd?.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2">
                        <Clock size={14} className="text-accent" />
                        {tour.durationDays} Days
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold mb-4 font-outfit text-white group-hover:text-accent transition-colors">
                      {tour.name}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-8">
                      {tour.shortDescription}
                    </p>
                    
                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
                        View Details
                      </span>
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-navy transition-all">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
