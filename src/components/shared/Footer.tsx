import Link from "next/link";
import { Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white/70 py-20 border-t border-white/5">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="text-2xl font-bold font-outfit tracking-tighter text-white">
              Wildpath<span className="text-accent">Africa</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Where Every Path Leads to Wonder. Kenya&apos;s premier safari and tourism company, offering expert-guided wildlife adventures.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent hover:text-navy transition-all">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent hover:text-navy transition-all">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent hover:text-navy transition-all">
                <Twitter size={18} />
              </Link>
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
              <li><Link href="/destinations/kenya/maasai-mara" className="hover:text-accent transition-colors">Maasai Mara</Link></li>
              <li><Link href="/destinations/kenya/amboseli" className="hover:text-accent transition-colors">Amboseli</Link></li>
              <li><Link href="/destinations/kenya/diani-beach" className="hover:text-accent transition-colors">Diani Beach</Link></li>
              <li><Link href="/destinations/kenya/lake-nakuru" className="hover:text-accent transition-colors">Lake Nakuru</Link></li>
              <li><Link href="/destinations/kenya/lamu" className="hover:text-accent transition-colors">Lamu Island</Link></li>
              <li><Link href="/destinations/kenya/nairobi" className="hover:text-accent transition-colors">Nairobi</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
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

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} WildpathAfrica. All rights reserved.</p>
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
