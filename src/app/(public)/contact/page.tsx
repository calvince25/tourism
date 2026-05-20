import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import JsonLd from "@/components/shared/JsonLd";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = generateSEOMetadata({
  title: "Contact Us - Safari Consultants & Guides",
  description: "Plan your adventure with Kenya's leading safari experts. Get in touch for custom itineraries, quotes, and booking inquiries.",
  path: "/contact",
});

export default async function ContactPage() {
  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Contact Us", item: "/contact" },
  ];

  let heroImage = "/assets/hero_bg.png";
  try {
    const heroSetting = await prisma.setting.findUnique({
      where: { key: "hero_contact" }
    });
    if (heroSetting?.value) {
      heroImage = heroSetting.value;
    }
  } catch (error) {
    console.warn("Failed to fetch hero image setting:", error);
  }

  return (
    <div className="min-h-screen bg-navy">
      <JsonLd type="breadcrumb" data={{ items: breadcrumbItems }} />
      <Navbar />

      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden text-center">
        <div className="absolute inset-0 bg-navy-dark opacity-60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="container mx-auto px-8 relative z-20">
          <h1 className="text-5xl md:text-7xl font-bold font-outfit mb-6">Contact Us</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Plan your adventure with Kenya&apos;s leading safari experts.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
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
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254704059438"}?text=Hi%20WildpathAfrica!%20I%27d%20like%20to%20chat%20about%20planning%20a%20safari.`}
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
    </div>
  );
}
