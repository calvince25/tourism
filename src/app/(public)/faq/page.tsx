import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { HelpCircle, ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import JsonLd from "@/components/shared/JsonLd";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = generateSEOMetadata({
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about booking safaris, payments, visas, and safety with WildpathAfrica.",
  path: "/faq",
});

export const revalidate = 3600;

export default async function FaqPage() {
  let faqs: any[] = [];
  try {
    faqs = await prisma.faq.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
  } catch (error) {
    console.error("Failed to fetch FAQs from database:", error);
    faqs = [];
  }

  // Group by category
  const groupedFaqs = faqs.reduce((acc: any, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  const categories = Object.keys(groupedFaqs);

  let heroImage = "/assets/hero_bg.png";
  try {
    const dbPromise = prisma.setting.findUnique({
      where: { key: "hero_faq" }
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
      <Breadcrumbs items={[{ name: "FAQ", href: "/faq" }]} />
      {faqs.length > 0 && <JsonLd type="faq" data={{ faqs: faqs.map((f: any) => ({ question: f.question, answer: f.answer })) }} />}

      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden text-center py-16 md:py-24">
        <div className="absolute inset-0 bg-navy-dark opacity-60 z-10" />
        <div 
          id="hero-bg-faq"
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="container mx-auto px-4 sm:px-8 relative z-20">
          <HelpCircle className="text-accent mx-auto mb-6" size={48} />
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-outfit mb-6">Common Questions</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-base sm:text-lg">
            Everything you need to know before embarking on your wild path through Africa.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <div className="space-y-16">
            {categories.map((category) => (
              <div key={category} className="space-y-8">
                <h2 className="text-2xl sm:text-3xl font-bold font-outfit text-accent border-l-4 border-accent pl-4 sm:pl-6">
                  {category}
                </h2>
                <div className="space-y-4">
                  {groupedFaqs[category].map((faq: any) => (
                    <details 
                      key={faq.id} 
                      className="group bg-navy-light/10 border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-accent/20 transition-all"
                    >
                      <summary className="font-bold text-base sm:text-lg cursor-pointer list-none flex justify-between items-center group-open:text-accent transition-colors">
                        {faq.question}
                        <ChevronDown className="text-accent group-open:rotate-180 transition-transform flex-shrink-0 ml-4" size={20} />
                      </summary>
                      <p className="mt-4 text-white/60 leading-relaxed text-sm md:text-base">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 p-6 sm:p-12 bg-accent/10 border border-accent/20 rounded-[40px] text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-white/60 mb-8 text-sm sm:text-base">
              Our safari consultants are ready to help you plan your perfect trip.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/contact"
                className="bg-accent text-navy font-bold px-10 py-4 rounded-xl hover:scale-105 transition-transform"
              >
                Contact Us
              </a>
              <a 
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254704059438"}?text=Hi%20WildpathAfrica!%20I%20have%20a%20question%20regarding%20your%20safari%20services.`}
                className="bg-white/10 text-white font-bold px-10 py-4 rounded-xl hover:bg-white/20 transition-all"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
