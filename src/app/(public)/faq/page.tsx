import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { HelpCircle, ChevronDown } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | WildpathAfrica",
  description: "Find answers to common questions about booking safaris, payments, visas, and safety with WildpathAfrica.",
};

export default async function FaqPage() {
  let faqs: any[] = [];
  try {
    faqs = await prisma.faq.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
  } catch (error) {
    faqs = [
      {
        id: "mock-1",
        category: "Booking",
        question: "How far in advance should I book?",
        answer: "We recommend booking at least 3-6 months in advance, especially for the high season."
      },
      {
        id: "mock-2",
        category: "Visas",
        question: "Do I need a visa to visit Kenya?",
        answer: "Yes, most nationalities require an eTA which must be applied for before travel."
      }
    ];
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
    const heroSetting = await prisma.setting.findUnique({
      where: { key: "hero_faq" }
    });
    if (heroSetting?.value) {
      heroImage = heroSetting.value;
    }
  } catch (error) {
    console.warn("Failed to fetch hero image setting:", error);
  }

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden text-center">
        <div className="absolute inset-0 bg-navy-dark opacity-60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="container mx-auto px-8 relative z-20">
          <HelpCircle className="text-accent mx-auto mb-6" size={48} />
          <h1 className="text-5xl md:text-7xl font-bold font-outfit mb-6">Common Questions</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Everything you need to know before embarking on your wild path through Africa.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-8 max-w-4xl">
          <div className="space-y-16">
            {categories.map((category) => (
              <div key={category} className="space-y-8">
                <h2 className="text-3xl font-bold font-outfit text-accent border-l-4 border-accent pl-6">
                  {category}
                </h2>
                <div className="space-y-4">
                  {groupedFaqs[category].map((faq: any) => (
                    <details 
                      key={faq.id} 
                      className="group bg-navy-light/10 border border-white/5 rounded-2xl p-6 hover:border-accent/20 transition-all"
                    >
                      <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center group-open:text-accent transition-colors">
                        {faq.question}
                        <ChevronDown className="text-accent group-open:rotate-180 transition-transform" size={20} />
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

          <div className="mt-20 p-12 bg-accent/10 border border-accent/20 rounded-[40px] text-center">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-white/60 mb-8">
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
