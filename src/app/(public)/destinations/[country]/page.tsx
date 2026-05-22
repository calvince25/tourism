import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DestinationCard from '@/components/destinations/DestinationCard'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'

interface Props { params: { country: string } }

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let country: any = null;
  try {
    country = await prisma.country.findUnique({ where: { slug: params.country } })
  } catch (e) {
    country = { name: params.country.charAt(0).toUpperCase() + params.country.slice(1), slug: params.country }
  }

  if (!country) return {}
  return {
    title: `${country.name} Destinations | WildpathAfrica`,
    description: `Explore all WildpathAfrica safari and travel destinations in ${country.name}. Find tours, experiences, and packages for every traveller.`,
    alternates: { canonical: `https://wildpathafrica.co.ke/destinations/${country.slug}` },
    openGraph: {
      title: `${country.name} Destinations | WildpathAfrica`,
      url: `https://wildpathafrica.co.ke/destinations/${country.slug}`,
      siteName: 'WildpathAfrica',
    },
  }
}

export default async function CountryDestinationsPage({ params }: Props) {
  let country: any = null;
  try {
    country = await prisma.country.findUnique({
      where: { slug: params.country, active: true },
      include: {
        destinations: {
          where: { status: 'PUBLISHED' },
          orderBy: { sortOrder: 'asc' },
          include: { thumbnailImage: true, heroImage: true },
        },
      },
    })
  } catch (e) {
    country = {
      id: 'mock',
      name: params.country.charAt(0).toUpperCase() + params.country.slice(1),
      slug: params.country,
      flagEmoji: '🌍',
      destinations: [
        { id: '1', name: 'Sample Destination', slug: 'sample', shortTeaser: 'A beautiful place to explore.' }
      ]
    }
  }

  if (!country) notFound()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wildpathafrica.co.ke/' },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: 'https://wildpathafrica.co.ke/destinations/' },
      { '@type': 'ListItem', position: 3, name: country.name, item: `https://wildpathafrica.co.ke/destinations/${country.slug}/` },
    ],
  }

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero Banner */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-navy-dark opacity-60 z-10" />
        <div className="absolute inset-0 bg-[url('/assets/hero-bg.png')] bg-cover bg-center" />
        <div className="container mx-auto px-8 relative z-20 text-center">
          <p className="text-accent uppercase tracking-widest font-bold mb-4 animate-fade-in">Experience the Magic of</p>
          <h1 className="text-6xl md:text-8xl font-bold font-outfit mb-6">
            {country.flagEmoji} {country.name}
          </h1>
          <nav className="flex items-center justify-center gap-3 text-sm text-white/60 font-medium">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-accent transition-colors">Destinations</Link>
            <span>/</span>
            <span className="text-white">{country.name}</span>
          </nav>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-24">
        <div className="container mx-auto px-8">
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

// Add Link import
import Link from 'next/link'
