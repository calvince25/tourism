import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = generateSEOMetadata({
  title: "Destinations in Africa | Safari Destinations",
  description: "Explore the most breathtaking destinations across Africa. Discover Kenya, Tanzania, Uganda, and more.",
  path: "/destinations",
});

export const revalidate = 3600;

export default async function DestinationsIndexPage() {
  let countries: any[] = [];
  try {
    countries = await prisma.country.findMany({
      where: { active: true },
      include: {
        coverImage: true,
        destinations: {
          where: { status: "PUBLISHED" },
          orderBy: { sortOrder: "asc" },
          select: { name: true, slug: true },
        },
        _count: {
          select: { destinations: { where: { status: "PUBLISHED" } } }
        }
      },
      orderBy: { sortOrder: "asc" }
    });
  } catch (error) {
    console.error("Database connection failed fetching public countries list:", error);
    countries = [];
  }

  let heroImage = "/assets/hero_bg.png";
  try {
    const dbPromise = prisma.setting.findUnique({
      where: { key: "hero_destinations" }
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
      <Breadcrumbs items={[{ name: "Destinations", href: "/destinations" }]} />

      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-center justify-center overflow-hidden text-center">
        <div className="absolute inset-0 bg-navy-dark opacity-60 z-10" />
        <div 
          id="hero-bg-destinations"
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="container mx-auto px-4 sm:px-8 relative z-20 py-24">
          <p className="text-accent uppercase tracking-widest font-bold mb-4 text-xs sm:text-sm animate-fade-in">Explore Africa</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-outfit mb-6">Our Destinations</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-base sm:text-lg">
            Discover breathtaking landscapes, extraordinary wildlife, and vibrant cultures across the continent.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-8 max-w-5xl space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit mb-4">Explore Kenya destinations and African tours</h2>
            <p className="text-white/70 leading-relaxed">
              This directory is built from the active country and published destination pages in the WildpathAfrica catalogue. The current Kenya listings include wildlife destinations such as Maasai Mara, Amboseli, Tsavo, and Nairobi National Park; inland places including Lake Naivasha and Hell&apos;s Gate and Lake Nakuru; and coastal destinations such as Mombasa, Diani Beach, and Watamu. Open a destination page for the information available about that specific place.
            </p>
            <p className="text-white/70 leading-relaxed mt-4">
              The published <Link href="/tours" className="text-accent underline underline-offset-4">tour catalogue</Link> also contains itineraries for Tanzania&apos;s Moshi and Arusha, Cape Town in South Africa, and Zanzibar. Those are listed as tour packages; they are not additional active country cards in this directory. Use the tour page to review the route and package-specific details.
            </p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-outfit mb-3">Choosing where to go</h3>
            <p className="text-white/70 leading-relaxed">
              Start with the experience you want to explore—wildlife and national parks, lakes and landscapes, a coastal stay, or a named multi-stop itinerary. Then compare the published pages for their destinations and route, and consider your own travel dates, available time, and preferred travel style. There is no single route or package that suits every traveller.
            </p>
            <p className="text-white/70 leading-relaxed mt-4">
              Package details such as dates, prices, inclusions, and exclusions vary by tour. Check the individual itinerary rather than assuming that a detail on one package applies to another. If you are considering a combination of destinations that is not shown as a published tour, use the <Link href="/contact" className="text-accent underline underline-offset-4">contact page</Link> to ask the team about it.
            </p>
          </div>

          {countries.some((country: any) => country.destinations.length > 0) && (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-outfit mb-4">Browse individual destination pages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {countries.flatMap((country: any) => country.destinations.map((destination: { name: string; slug: string }) => (
                  <Link
                    key={destination.slug}
                    href={`/destinations/${country.slug}/${destination.slug}`}
                    className="rounded-xl border border-white/10 bg-navy-light/10 px-5 py-4 text-white/80 hover:border-accent/50 hover:text-accent transition-colors"
                  >
                    {destination.name}
                  </Link>
                )))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/tours" className="bg-accent text-navy font-bold px-7 py-3 rounded-xl hover:scale-105 transition-transform">Browse safari tours</Link>
            <Link href="/contact" className="bg-white/10 text-white font-bold px-7 py-3 rounded-xl hover:bg-white/20 transition-all">Ask about an itinerary</Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          {countries.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
              <p className="text-white/40">Our team is mapping out new destinations. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
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

                    <div className="absolute bottom-8 left-6 right-6 sm:bottom-10 sm:left-8 sm:right-8">
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-outfit text-white mb-2 sm:mb-3 group-hover:text-accent transition-colors">
                        {country.name}
                      </h3>
                      <div className="flex items-center gap-2 text-white/80 font-medium text-base sm:text-lg">
                        <MapPin size={18} className="text-accent shrink-0" />
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
