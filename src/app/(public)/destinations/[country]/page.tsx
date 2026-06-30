import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DestinationCard from '@/components/destinations/DestinationCard'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import Breadcrumbs from "@/components/shared/Breadcrumbs"
import { generateSEOMetadata } from "@/lib/seo"

interface Props { params: { country: string } }

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const countries = await prisma.country.findMany({ where: { active: true }, select: { slug: true } });
    return countries.map((c) => ({ country: c.slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let country: any = null;
  try {
    country = await prisma.country.findUnique({ where: { slug: params.country } })
  } catch (e) {
    console.error("Failed to fetch country metadata:", e);
  }

  if (!country) return {}
  
  return generateSEOMetadata({
    title: `${country.name} Destinations | Safari & Travel Packages`,
    description: `Explore all WildpathAfrica safari and travel destinations in ${country.name}. Find tours, experiences, and packages for every traveller.`,
    path: `/destinations/${country.slug}`,
  });
}

export default async function CountryDestinationsPage({ params }: Props) {
  let country: any = null;
  try {
    country = await prisma.country.findUnique({
      where: { slug: params.country, active: true },
      include: {
        coverImage: true,
        destinations: {
          where: { status: 'PUBLISHED' },
          orderBy: { sortOrder: 'asc' },
          include: { thumbnailImage: true, heroImage: true },
        },
      },
    })
  } catch (e) {
    console.error("Failed to fetch country destinations:", e);
  }

  if (!country) notFound()

  const coverUrl = country.coverImage?.fileUrl || "/assets/hero-bg.png";

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <Breadcrumbs items={[
        { name: "Destinations", href: "/destinations" },
        { name: country.name, href: `/destinations/${country.slug}` }
      ]} />

      {/* Hero Banner */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-navy-dark opacity-60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${coverUrl}')` }}
        />
        <div className="container mx-auto px-4 sm:px-8 relative z-20 text-center">
          <p className="text-accent uppercase tracking-widest font-bold mb-4 animate-fade-in">Experience the Magic of</p>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold font-outfit mb-6">
            {country.flagEmoji} {country.name}
          </h1>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4">Discover {country.name}</h2>
              <p className="text-white/60 leading-relaxed">
                Explore our curated selection of breathtaking destinations across {country.name}. From wild savannahs to pristine beaches, find your next adventure.
              </p>
            </div>
            <p className="text-white/40 text-sm font-medium">
              SHOWING {country.destinations.length} DESTINATIONS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {country.destinations.map((dest: any) => (
              <DestinationCard key={dest.id} destination={dest} countrySlug={country.slug} />
            ))}
          </div>

          {country.destinations.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
              <p className="text-white/40">No destinations found for this country yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
