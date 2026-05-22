import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  MessageCircle, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import JsonLd from "@/components/shared/JsonLd";
import BookingButton from "@/components/shared/BookingButton";

interface Props { params: { slug: string } }

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let tour: any = null;
  try {
    tour = await prisma.tour.findUnique({
      where: { slug: params.slug },
      include: { ogImage: true }
    });
  } catch (e) {
    tour = { name: params.slug.charAt(0).toUpperCase() + params.slug.slice(1).replace(/-/g, ' '), slug: params.slug }
  }
  if (!tour) return {};

  return generateSEOMetadata({
    title: tour.metaTitle || tour.name,
    description: tour.metaDescription || tour.shortDescription || `Embark on the ${tour.name} with WildpathAfrica.`,
    path: `/tours/${tour.slug}`,
    ogImage: tour.ogImage?.fileUrl,
  });
}

export default async function TourDetailPage({ params }: Props) {
  let tour: any = null;
  try {
    tour = await prisma.tour.findUnique({
      where: { slug: params.slug },
      include: {
        coverImage: true,
        heroImage: true,
        itinerary: { orderBy: { dayNumber: 'asc' }, include: { photo: true } },
        destinations: { include: { destination: true } },
        faqs: true,
        gallery: { include: { media: true } },
      }
    });
  } catch (e) {
    tour = {
      id: "mock-tour",
      name: params.slug.charAt(0).toUpperCase() + params.slug.slice(1).replace(/-/g, ' '),
      slug: params.slug,
      shortDescription: "An unforgettable safari experience.",
      fullDescription: "<p>Explore the wild beauty of Africa on this curated safari adventure. From dawn game drives to sunset relaxation, every moment is crafted for wonder.</p>",
      durationDays: 7,
      durationNights: 6,
      groupSizeMin: 2,
      groupSizeMax: 12,
      difficulty: "MODERATE",
      travelStyle: "Safari",
      priceUsd: 2500,
      highlights: ["Expert Guided Game Drives", "Luxury Tented Camps", "Cultural Visits", "Sunset Sundowners"],
      included: ["All Accommodation", "Professional Guide", "Park Fees", "Bottled Water"],
      notIncluded: ["International Flights", "Travel Insurance", "Personal Tips"],
      status: "PUBLISHED",
      itinerary: [
        { id: "d1", dayNumber: 1, title: "Arrival & Welcome", description: "Transfer to your lodge and enjoy a welcome dinner.", location: "Nairobi", accommodation: "Luxury Hotel", mealsIncluded: "Dinner" },
        { id: "d2", dayNumber: 2, title: "First Safari Day", description: "Venture into the wilderness for your first game drive.", location: "Wilderness", accommodation: "Safari Camp", mealsIncluded: "Breakfast, Lunch, Dinner" },
      ],
      faqs: [],
      gallery: []
    }
  }

  if (!tour || (tour.status !== "PUBLISHED" && tour.id !== "mock-tour")) notFound();

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Tours", item: "/tours" },
    { name: tour.name, item: `/tours/${tour.slug}` },
  ];

  return (
    <div className="min-h-screen bg-navy text-white">
      <JsonLd type="breadcrumb" data={{ items: breadcrumbs }} />
      <JsonLd 
        type="service" 
        data={{ 
          name: tour.name, 
          description: tour.shortDescription || "Safari tour package.", 
          serviceType: "Safari Tour" 
        }} 
      />
      {tour.faqs && tour.faqs.length > 0 && (
        <JsonLd type="faq" data={{ faqs: tour.faqs }} />
      )}
      <Navbar />

      {/* Hero */}
      <section className="relative h-[80vh] flex items-end pb-24 overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
        <Image 
          src={tour.heroImage?.fileUrl || tour.coverImage?.fileUrl || "/assets/hero-bg.png"}
          alt={tour.name}
          fill
          className="object-cover"
          priority
        />
        <div className="container mx-auto px-8 relative z-20">
          <div className="max-w-4xl">
            <Link 
              href="/tours"
              className="inline-flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-xs mb-8 hover:gap-4 transition-all"
            >
              <ArrowLeft size={16} /> All Safari Tours
            </Link>
            <h1 className="text-5xl md:text-8xl font-bold font-outfit mb-8 leading-tight">
              {tour.name}
            </h1>
            
            <div className="flex flex-wrap gap-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-accent">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Duration</p>
                  <p className="font-bold">{tour.durationDays} Days / {tour.durationNights} Nights</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-accent">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Group Size</p>
                  <p className="font-bold">{tour.groupSizeMin} - {tour.groupSizeMax} Travellers</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-accent">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Style</p>
                  <p className="font-bold">{tour.travelStyle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-8 space-y-12 sm:space-y-20">
              {/* Overview */}
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl sm:text-4xl font-bold font-outfit text-white mb-6 sm:mb-8 border-l-4 border-accent pl-4 sm:pl-6">Tour Overview</h2>
                <div className="text-white/70 text-base sm:text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: tour.fullDescription || "" }} />
              </div>

              {/* Highlights */}
              {tour.highlights && (
                <div className="bg-navy-light/20 border border-white/5 rounded-2xl sm:rounded-[40px] p-6 sm:p-10 md:p-16">
                  <h3 className="text-2xl sm:text-3xl font-bold font-outfit mb-6 sm:mb-10">Experience Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(tour.highlights as string[]).map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <CheckCircle2 className="text-accent shrink-0 mt-1" size={20} />
                        <span className="text-white/80 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {tour.itinerary.length > 0 && (
                <div className="space-y-12">
                  <h2 className="text-4xl font-bold font-outfit">Detailed Itinerary</h2>
                  <div className="space-y-8 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-px before:bg-white/5">
                    {tour.itinerary.map((day: any) => (
                      <div key={day.id} className="relative pl-24 group">
                        <div className="absolute left-0 top-0 w-16 h-16 rounded-2xl bg-navy-light flex flex-col items-center justify-center border border-white/10 group-hover:border-accent transition-colors z-20">
                          <span className="text-[10px] font-bold uppercase text-white/40">Day</span>
                          <span className="text-2xl font-bold text-accent">{day.dayNumber}</span>
                        </div>
                        <div className="bg-navy-light/10 border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all">
                          <h4 className="text-2xl font-bold font-outfit mb-4">{day.title}</h4>
                          <div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest text-white/40 mb-6">
                            <span className="flex items-center gap-2"><MapPin size={14} className="text-accent" /> {day.location}</span>
                            {day.accommodation && <span className="flex items-center gap-2">🏠 {day.accommodation}</span>}
                            {day.mealsIncluded && <span className="flex items-center gap-2">🍽️ {day.mealsIncluded}</span>}
                          </div>
                          <p className="text-white/60 leading-relaxed mb-6">{day.description}</p>
                          {day.photo && (
                            <div className="relative h-64 rounded-2xl overflow-hidden border border-white/5">
                              <Image src={day.photo.fileUrl} alt={day.title} fill className="object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions / Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-green-500/5 border border-green-500/10 rounded-3xl p-10">
                  <h4 className="text-xl font-bold mb-6 flex items-center gap-3 text-green-400">
                    <CheckCircle2 size={24} /> What&apos;s Included
                  </h4>
                  <ul className="space-y-4">
                    {(tour.included as string[] || []).map((item, i) => (
                      <li key={i} className="text-white/60 text-sm flex items-start gap-3">
                        <span className="text-green-500 mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-10">
                  <h4 className="text-xl font-bold mb-6 flex items-center gap-3 text-red-400">
                    <XCircle size={24} /> Not Included
                  </h4>
                  <ul className="space-y-4">
                    {(tour.notIncluded as string[] || []).map((item, i) => (
                      <li key={i} className="text-white/60 text-sm flex items-start gap-3">
                        <span className="text-red-500 mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sticky Booking Sidebar */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32 space-y-6 sm:space-y-8">
                <div className="bg-navy-light/30 border border-accent/20 rounded-2xl sm:rounded-[40px] p-6 sm:p-10 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Zap size={120} className="text-accent" />
                  </div>
                  
                  <div className="mb-10">
                    <p className="text-white/40 text-sm font-medium mb-1">Safari Tour Price</p>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-bold font-outfit text-white">${tour.priceUsd?.toLocaleString()}</span>
                      <span className="text-white/40 text-sm mb-2">/ per person</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-white/40 text-sm">Experience Style</span>
                      <span className="font-bold text-sm">{tour.travelStyle}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-white/40 text-sm">Difficulty</span>
                      <span className="font-bold text-sm uppercase tracking-wider text-accent">{tour.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-white/40 text-sm">Best Time</span>
                      <span className="font-bold text-sm">Year Round</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <BookingButton
                      tourId={tour.id}
                      itemName={tour.name}
                      className="w-full bg-accent text-navy font-bold py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all text-lg shadow-lg shadow-accent/20"
                    >
                      Check Availability
                    </BookingButton>
                    <Link 
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254704059438"}?text=Hi%20WildpathAfrica!%20I%27d%20like%20to%20enquire%20about%20the%20${encodeURIComponent(tour.name)}%20package.`}
                      className="w-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#25D366]/20 transition-all"
                    >
                      <MessageCircle size={20} /> Chat with Specialist
                    </Link>
                  </div>
                </div>

                <div className="bg-navy-light/10 border border-white/5 rounded-3xl p-8">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck className="text-accent" size={18} /> Our Guarantee
                  </h4>
                  <p className="text-xs text-white/40 leading-relaxed">
                    All WildpathAfrica tours include 24/7 on-ground support, expert certified guides, and flexible booking protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
