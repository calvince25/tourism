import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destinations in Africa | WildpathAfrica",
  description: "Explore the most breathtaking destinations across Africa. Discover Kenya, Tanzania, Uganda, and more.",
};

export default async function DestinationsIndexPage() {
  let countries = [];
  try {
    countries = await prisma.country.findMany({
      where: { active: true },
      include: {
        coverImage: true,
        _count: {
          select: { destinations: { where: { status: "PUBLISHED" } } }
        }
      },
      orderBy: { sortOrder: "asc" }
    });
  } catch (error) {
    countries = [
      {
        id: "mock-1",
        name: "Kenya",
        slug: "kenya",
        flagEmoji: "🇰🇪",
        _count: { destinations: 5 }
      },
      {
        id: "mock-2",
        name: "Tanzania",
        slug: "tanzania",
        flagEmoji: "🇹🇿",
        _count: { destinations: 3 }
      }
    ];
  }

  let heroImage = "/assets/hero_bg.png";
  try {
    const heroSetting = await prisma.setting.findUnique({
      where: { key: "hero_destinations" }
    });
    if (heroSetting?.value) {
      heroImage = heroSetting.value;
    }
  } catch (error) {
    console.warn("Failed to fetch hero image setting:", error);
  }

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden text-center">
        <div className="absolute inset-0 bg-navy-dark opacity-60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="container mx-auto px-8 relative z-20">
          <p className="text-accent uppercase tracking-widest font-bold mb-4 animate-fade-in">Explore Africa</p>
          <h1 className="text-6xl md:text-8xl font-bold font-outfit mb-6">Our Destinations</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Discover breathtaking landscapes, extraordinary wildlife, and vibrant cultures across the continent.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-8">
          {countries.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
              <p className="text-white/40">Our team is mapping out new destinations. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {countries.map((country: any) => (
                <Link 
                  key={country.id} 
                  href={`/destinations/${country.slug}`}
                  className="group bg-navy-light/20 border border-white/5 rounded-[40px] overflow-hidden hover:border-accent/50 transition-all duration-500 flex flex-col relative"
                >
                  <div className="relative h-[400px] w-full overflow-hidden">
                    <Image
                      src={country.coverImage?.fileUrl || "/assets/placeholder.png"}
                      alt={country.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent opacity-90" />
                    
                    <div className="absolute top-6 right-6">
                       <span className="text-4xl drop-shadow-md">{country.flagEmoji}</span>
                    </div>

                    <div className="absolute bottom-10 left-8 right-8">
                      <h3 className="text-5xl font-bold font-outfit text-white mb-3 group-hover:text-accent transition-colors">
                        {country.name}
                      </h3>
                      <div className="flex items-center gap-2 text-white/80 font-medium text-lg">
                        <MapPin size={20} className="text-accent" />
                        <span>{country._count?.destinations || 0} Destinations to explore</span>
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
