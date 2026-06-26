import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import FadeIn from '@/components/animations/FadeIn'
import { Calendar, MapPin, Clock, Globe, Shield, Zap, TrendingUp } from 'lucide-react'
import { generateSEOMetadata } from '@/lib/seo'
import JsonLd from '@/components/shared/JsonLd'
import BookingButton from '@/components/shared/BookingButton'

interface Props { params: { country: string; slug: string } }

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let destination: any = null;
  try {
    destination = await prisma.destination.findUnique({
      where: { slug: params.slug },
      include: { country: true, ogImage: true }
    })
  } catch (e) {
    console.error("Failed to fetch destination metadata:", e);
  }
  if (!destination) return {}

  return generateSEOMetadata({
    title: destination.metaTitle || destination.name,
    description: destination.metaDescription || destination.shortTeaser || `Explore ${destination.name} in ${destination.country.name} with WildpathAfrica.`,
    path: `/destinations/${destination.country.slug}/${destination.slug}`,
    ogImage: destination.ogImage?.fileUrl,
  });
}

export default async function DestinationDetailPage({ params }: Props) {
  let dest: any = null;
  try {
    dest = await prisma.destination.findUnique({
      where: { slug: params.slug },
      include: {
        country: true,
        heroImage: true,
        gallery: { include: { media: true } },
        faqs: true,
        attractions: { include: { photo: true } },
      }
    })
  } catch (e) {
    console.error("Failed to fetch destination details:", e);
  }

  if (!dest || dest.country.slug !== params.country) notFound()

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Destinations", item: "/destinations" },
    { name: dest.name, item: `/destinations/${dest.country.slug}/${dest.slug}` },
  ];

  return (
    <div className="min-h-screen bg-navy text-white">
      <JsonLd type="breadcrumb" data={{ items: breadcrumbs }} />
      <JsonLd 
        type="localBusiness" 
        data={{
          name: dest.name,
          description: dest.contentIntro || "African tourism destination.",
          url: `https://wildpathafrica.co.ke/destinations/${dest.country.slug}/${dest.slug}`,
          addressLocality: dest.name,
          addressCountry: "KE"
        }} 
      />
      {dest.faqs && dest.faqs.length > 0 && (
        <JsonLd type="faq" data={{ faqs: dest.faqs }} />
      )}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-navy/40 via-navy/20 to-navy" />
        <Image
          src={dest.heroImage?.fileUrl || "/assets/hero-bg.png"}
          alt={dest.name}
          fill
          priority
          className="object-cover"
        />
        <div className="container mx-auto px-4 sm:px-8 relative z-20">
          <div className="max-w-3xl">
            <FadeIn>
              <p className="text-accent uppercase tracking-widest font-bold mb-4">
                Discover {dest.country.name}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold font-outfit mb-8 leading-tight">
                {dest.name}
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <Calendar className="text-accent" />
                  <span>Best: {dest.bestSeason}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="text-accent" />
                  <span>{dest.language}</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-accent" />
                  <span>{dest.currency}</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Destination Overview Section */}
      <section className="py-12 bg-navy-light/10 border-y border-white/5">
        <div className="container mx-auto px-4 sm:px-8">
          <h2 className="text-3xl font-bold font-outfit mb-8 text-left">Destination Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="bg-navy-light/20 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Best Time</span>
              <span className="text-base sm:text-lg font-bold text-accent mt-2">{dest.bestSeason || "All Year"}</span>
            </div>
            <div className="bg-navy-light/20 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Language</span>
              <span className="text-base sm:text-lg font-bold text-white mt-2">{dest.language || "English / Swahili"}</span>
            </div>
            <div className="bg-navy-light/20 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Currency</span>
              <span className="text-base sm:text-lg font-bold text-white mt-2">{dest.currency || "KES / USD"}</span>
            </div>
            <div className="bg-navy-light/20 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Visa Info</span>
              <span className={`text-base sm:text-lg font-bold mt-2 ${dest.visaRequired ? "text-accent" : "text-green-400"}`}>
                {dest.visaRequired ? "Required" : "Not Required"}
              </span>
            </div>
            <div className="col-span-2 md:col-span-1 bg-navy-light/20 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Park Fees (Res / Non-Res)</span>
              <span className="text-sm font-bold text-white mt-2">
                {dest.parkEntryResident || "Free"} / {dest.parkEntryNonResident || "Free"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-12 sm:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            <div className="lg:col-span-2 space-y-16">
              {/* Introduction */}
              <div className="prose prose-invert max-w-none">
                <h2 className="text-4xl font-bold font-outfit text-white mb-8 border-l-4 border-accent pl-6">Introduction</h2>
                <div 
                  className="text-white/70"
                  dangerouslySetInnerHTML={{ __html: dest.contentIntro || "" }}
                />
              </div>

              {/* Why Visit */}
              <div className="bg-navy-light/20 rounded-3xl p-6 sm:p-10 border border-white/5 prose prose-invert max-w-none">
                <h2 className="text-3xl font-bold font-outfit mb-8 text-white">Why Visit {dest.name}?</h2>
                <div 
                  className="text-white/70"
                  dangerouslySetInnerHTML={{ __html: dest.contentWhyVisit || "" }}
                />
              </div>

              {/* Wildlife & Nature */}
              {dest.contentWildlife && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-bold font-outfit text-white mb-6 border-l-4 border-accent pl-6 flex items-center gap-3">
                    <Zap size={24} className="text-accent" /> Wildlife & Nature
                  </h2>
                  <div 
                    className="text-white/70"
                    dangerouslySetInnerHTML={{ __html: dest.contentWildlife }}
                  />
                </div>
              )}

              {/* Culture & Community */}
              {dest.contentCulture && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-bold font-outfit text-white mb-6 border-l-4 border-accent pl-6 flex items-center gap-3">
                    <TrendingUp size={24} className="text-accent" /> Culture & Community
                  </h2>
                  <div 
                    className="text-white/70"
                    dangerouslySetInnerHTML={{ __html: dest.contentCulture }}
                  />
                </div>
              )}

              {/* Attractions */}
              {dest.attractions && dest.attractions.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold font-outfit text-white mb-8 border-l-4 border-accent pl-6">
                    Attractions & Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {dest.attractions.map((attr: any) => (
                      <div key={attr.id} className="bg-navy-light/20 border border-white/5 rounded-3xl overflow-hidden flex flex-col group">
                        {attr.photo?.fileUrl && (
                          <div className="relative aspect-video w-full overflow-hidden bg-navy">
                            <Image 
                              src={attr.photo.fileUrl} 
                              alt={attr.name} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                          </div>
                        )}
                        <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                          <div>
                            {attr.attractionType && (
                              <span className="text-[10px] text-accent font-bold uppercase tracking-widest">
                                {attr.attractionType}
                              </span>
                            )}
                            <h3 className="text-xl font-bold text-white mt-1">{attr.name}</h3>
                            <p className="text-white/60 text-sm mt-3 leading-relaxed">{attr.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {dest.gallery.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold font-outfit mb-8 border-l-4 border-accent pl-6 text-white">Destination Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {dest.gallery.map((item: any, i: number) => (
                      <div key={i} className="relative h-64 rounded-2xl overflow-hidden group">
                        <Image
                          src={item.media.fileUrl}
                          alt={`${dest.name} gallery ${i}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {dest.faqs.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold font-outfit border-l-4 border-accent pl-6 text-white">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {dest.faqs.map((faq: any, i: number) => (
                      <details key={i} className="group bg-navy-light/10 border border-white/5 rounded-2xl p-6">
                        <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center group-open:text-accent transition-colors">
                          {faq.question}
                          <span className="text-accent group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-white/60 leading-relaxed">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="sticky top-32 bg-navy-light/30 border border-accent/20 rounded-3xl p-6 sm:p-10 backdrop-blur-xl">
                {dest.thumbnailImage?.fileUrl && (
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/5 mb-8">
                    <Image
                      src={dest.thumbnailImage.fileUrl}
                      alt={`${dest.name} Cover`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="text-2xl font-bold font-outfit mb-6">Plan Your Trip</h3>
                <p className="text-white/60 text-sm mb-8">
                  Ready to experience {dest.name}? Get a customized safari quote today.
                </p>
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Park Entry (Res)</span>
                    <span>{dest.parkEntryResident}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Park Entry (Non-Res)</span>
                    <span>{dest.parkEntryNonResident}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Visa Info</span>
                    <span className={dest.visaRequired ? "text-accent" : "text-green-400"}>
                      {dest.visaRequired ? "Required" : "Not Required"}
                    </span>
                  </div>
                </div>
                <BookingButton
                  destinationId={dest.id}
                  itemName={dest.name}
                  className="w-full bg-accent text-navy font-bold py-4 rounded-xl hover:scale-105 transition-transform"
                >
                  Request a Quote
                </BookingButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


