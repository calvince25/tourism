import Link from "next/link";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

const Tiktok = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default async function Footer() {
  let destinations: any[] = [];
  try {
    destinations = await prisma.destination.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
      take: 6,
      include: {
        country: true,
      },
    });
  } catch (error) {
    console.error("Footer: Failed to fetch top destinations:", error);
  }

  let tours: any[] = [];
  try {
    tours = await prisma.tour.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [
        { featured: "desc" },
        { name: "asc" }
      ],
      take: 6,
    });
  } catch (error) {
    console.error("Footer: Failed to fetch top tours:", error);
  }

  let settings: any[] = [];
  try {
    settings = await prisma.setting.findMany();
  } catch (error) {
    console.error("Footer: Failed to fetch settings:", error);
  }

  const getSetting = (key: string, defaultValue: string) => {
    return settings.find(s => s.key === key)?.value || defaultValue;
  };

  const facebookLink = getSetting("social_facebook", "https://www.facebook.com/share/1CRFai4pXV/");
  const instagramLink = getSetting("social_instagram", "https://www.instagram.com/wildpathafrica?igsh=d25qYWs1cjI5Y3Fo");
  const tiktokLink = getSetting("social_tiktok", "tiktok.com/@wildpathafrica");
  const youtubeLink = getSetting("social_youtube", "");

  const formatUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const fbUrl = formatUrl(facebookLink);
  const igUrl = formatUrl(instagramLink);
  const ttUrl = formatUrl(tiktokLink);
  const ytUrl = formatUrl(youtubeLink);

  return (
    <footer className="bg-navy-dark text-white/70 py-12 md:py-20 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="text-2xl font-bold font-outfit tracking-tighter text-white">
              Wildpath<span className="text-accent">Africa</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Where Every Path Leads to Wonder. Kenya&apos;s premier safari and tourism company, offering expert-guided wildlife adventures.
            </p>
            <div className="flex items-center gap-4">
              {fbUrl && (
                <Link href={fbUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent hover:text-navy transition-all" title="Facebook">
                  <Facebook size={18} />
                </Link>
              )}
              {igUrl && (
                <Link href={igUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent hover:text-navy transition-all" title="Instagram">
                  <Instagram size={18} />
                </Link>
              )}
              {ttUrl && (
                <Link href={ttUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent hover:text-navy transition-all" title="TikTok">
                  <Tiktok size={18} />
                </Link>
              )}
              {ytUrl && (
                <Link href={ytUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent hover:text-navy transition-all" title="YouTube">
                  <Youtube size={18} />
                </Link>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold font-outfit uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/destinations" className="hover:text-accent transition-colors">Destinations</Link></li>
              <li><Link href="/tours" className="hover:text-accent transition-colors">Safari Tours</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Travel Blog</Link></li>
              <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 3: Kenya Destinations */}
          <div className="space-y-6">
            <h4 className="text-white font-bold font-outfit uppercase tracking-wider text-sm">Top Destinations</h4>
            <ul className="space-y-4 text-sm">
              {destinations.length > 0 ? (
                destinations.map((dest) => (
                  <li key={dest.id}>
                    <Link href={`/destinations/${dest.country.slug}/${dest.slug}`} className="hover:text-accent transition-colors">
                      {dest.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-white/40 italic">No destinations published</li>
              )}
            </ul>
          </div>

          {/* Column 4: Top Tours */}
          <div className="space-y-6">
            <h4 className="text-white font-bold font-outfit uppercase tracking-wider text-sm">Top Tours</h4>
            <ul className="space-y-4 text-sm">
              {tours.length > 0 ? (
                tours.map((tour) => (
                  <li key={tour.id}>
                    <Link href={`/tours/${tour.slug}`} className="hover:text-accent transition-colors">
                      {tour.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-white/40 italic">No tours published</li>
              )}
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-bold font-outfit uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="text-accent">📍</span>
                Nairobi, Kenya
              </li>
              <li className="flex gap-3">
                <span className="text-accent">📞</span>
                +254 704 059 438
              </li>
              <li className="flex gap-3">
                <span className="text-accent">📧</span>
                info@wildpathafrica.co.ke
              </li>
            </ul>
            <Link 
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254704059438"}?text=Hi%20WildpathAfrica!%20I%27d%20like%20to%20chat%20about%20your%20safari%20packages.`} 
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </Link>
          </div>
        </div>

        <div className="mt-10 md:mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} WildpathAfrica. All rights reserved. Designed by <a href="https://www.growthlab.co.ke" target="_blank" rel="noopener noreferrer" className="hover:text-accent font-bold transition-colors">GrowthLab Limited</a>.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
