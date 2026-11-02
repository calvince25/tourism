import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import JsonLd from "@/components/shared/JsonLd";
import ContactForm from "@/components/ContactForm";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export const metadata: Metadata = generateSEOMetadata({
  title: "Contact Us - Safari Consultants & Guides",
  description: "Plan your adventure with Kenya's leading safari experts. Get in touch for custom itineraries, quotes, and booking inquiries.",
  path: "/contact",
});

export const revalidate = 3600;

export default async function ContactPage() {
  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Contact Us", item: "/contact" },
  ];

  let heroImage = "/assets/hero_bg.png";
  try {
    const dbPromise = prisma.setting.findUnique({
      where: { key: "hero_contact" }
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
      <Breadcrumbs items={[{ name: "Contact Us", href: "/contact" }]} />
      <JsonLd type="contactPage" />

      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden text-center">
        <div className="absolute inset-0 bg-navy-dark opacity-60 z-10" />
        <div 
          id="hero-bg-contact"
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="container mx-auto px-4 sm:px-8 relative z-20 py-20">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-outfit mb-6">Contact Us</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-base sm:text-lg">
            Plan your adventure with Kenya&apos;s leading safari experts.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Info Side */}
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-bold font-outfit mb-8">Get in Touch</h2>
                <p className="text-white/60 leading-relaxed text-lg mb-12">
                  Have a question about our tours or want a custom itinerary? Fill out the form or reach us through our official channels.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-navy transition-all shrink-0">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Our Office</h4>
                    <p className="text-white/60">Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-navy transition-all shrink-0">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Phone & WhatsApp</h4>
                    <p className="text-white/60">+254 704 059 438</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-navy transition-all shrink-0">
                    <Mail size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Email Support</h4>
                    <p className="text-white/60">info@wildpathafrica.co.ke</p>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-white/5">
                <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-white/40">Chat with a Specialist</h4>
                <a 
                  href={buildWhatsAppHref("Hi WildpathAfrica! I'd like to chat about planning a safari.")}
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
                >
                  <MessageCircle size={24} />
                  Connect via WhatsApp
                </a>
              </div>
            </div>

            {/* Form Side */}
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
          <div className="bg-navy-light/10 border border-white/5 rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-outfit mb-4">Plan a safari or holiday with WildpathAfrica</h2>
              <p className="text-white/70 leading-relaxed">
                WildpathAfrica is based in Nairobi, Kenya. The current published tour catalogue includes Kenya group-joining safaris, self-drive and coast itineraries, plus trips for Tanzania, South Africa, and Zanzibar. The destination directory focuses on published places in Kenya. Browse our <Link href="/tours" className="text-accent underline underline-offset-4">tours</Link> and <Link href="/destinations" className="text-accent underline underline-offset-4">destinations</Link> to compare the options already listed; each package page describes its own route and details.
              </p>
              <p className="text-white/70 leading-relaxed mt-4">
                You can contact us about a safari inquiry, beach holiday, custom itinerary, corporate travel, or another question using the form above. These are enquiry topics, not a confirmation that a particular date, package, or service is available. If you have a specific tour in mind, include its name or page link so the team can understand what you are asking about.
              </p>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-outfit mb-3">Helpful details to include</h3>
              <p className="text-white/70 leading-relaxed">
                Only your name, email address, and message are required by the form; the phone field is optional. In your message, you may include the destinations or experiences you are considering, your approximate travel dates, the number of travellers, where you expect to start, and whether you are asking about a published group-joining trip or a private or custom option. These details are suggestions to help explain your request, not booking requirements.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-white/70 leading-relaxed">
                <li>For wildlife travel, name a park or safari package you would like to discuss.</li>
                <li>For a coast or beach holiday, mention the relevant place or tour page.</li>
                <li>For a custom or corporate enquiry, describe the trip purpose and any known dates.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-outfit mb-3">Review package details before you book</h3>
              <p className="text-white/70 leading-relaxed">
                Routes, dates, prices, inclusions, and exclusions are specific to each published package and can differ between tours. Review the itinerary page for the trip you are considering and ask the team to clarify anything that is not stated there. An enquiry is a way to request information; please confirm the current package details directly with WildpathAfrica before making travel arrangements.
              </p>
              <p className="text-white/70 leading-relaxed mt-4">
                Prefer to start a conversation directly? Use the phone number, email address, or WhatsApp button shown above. The WhatsApp button opens a pre-filled message for you to review; it is not sent until you choose to send it in WhatsApp.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/tours" className="bg-accent text-navy font-bold px-7 py-3 rounded-xl hover:scale-105 transition-transform">Browse tours</Link>
              <Link href="/destinations" className="bg-white/10 text-white font-bold px-7 py-3 rounded-xl hover:bg-white/20 transition-all">Explore destinations</Link>
              <Link href="/faq" className="bg-white/10 text-white font-bold px-7 py-3 rounded-xl hover:bg-white/20 transition-all">Read FAQs</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
