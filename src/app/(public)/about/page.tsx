import Navbar from "@/components/Navbar";
import { Shield, Zap, TrendingUp, Users, Heart, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | WildpathAfrica - Our Story & Values",
  description: "Learn about WildpathAfrica's mission, values, and our commitment to sustainable tourism and community empowerment in Kenya.",
};

const values = [
  { 
    title: "Reliability", 
    desc: "We deliver what we promise, ensuring your safety and comfort at every turn.",
    icon: Shield,
    color: "bg-blue-500/10 text-blue-400"
  },
  { 
    title: "Fast Service", 
    desc: "Quick turnarounds for quotes and inquiries because your time is precious.",
    icon: Zap,
    color: "bg-yellow-500/10 text-yellow-400"
  },
  { 
    title: "Impact", 
    desc: "We reinvest in local communities and conservation to keep Africa wild.",
    icon: TrendingUp,
    color: "bg-green-500/10 text-green-400"
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden text-center">
        <div className="absolute inset-0 bg-navy-dark opacity-60 z-10" />
        <div className="absolute inset-0 bg-[url('/assets/hero-bg.png')] bg-cover bg-center" />
        <div className="container mx-auto px-8 relative z-20">
          <p className="text-accent uppercase tracking-widest font-bold mb-4">Our Story</p>
          <h1 className="text-6xl md:text-8xl font-bold font-outfit mb-6">About WildpathAfrica</h1>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-square bg-navy-light/20 rounded-[40px] overflow-hidden border border-white/5">
                <img 
                  src="/assets/about-image.png" 
                  alt="WildpathAfrica Team" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-accent p-10 rounded-3xl hidden md:block">
                <p className="text-navy font-bold text-4xl font-outfit">10+</p>
                <p className="text-navy/60 font-bold uppercase tracking-widest text-xs">Years Experience</p>
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold font-outfit leading-tight">
                Empowering Communities Through <span className="text-accent">Authentic Travel</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
                WildpathAfrica was founded on a simple yet powerful belief: that travel should be more than just a holiday—it should be a bridge between cultures and a catalyst for conservation. 
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                Based in the heart of Nairobi, our team of expert guides and consultants has spent over a decade exploring every corner of Kenya. We don&apos;t just book tours; we craft experiences that stay with you forever.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div className="space-y-2">
                  <h4 className="text-3xl font-bold text-white font-outfit">500+</h4>
                  <p className="text-white/40 uppercase tracking-widest text-xs font-bold">Safaris Led</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-3xl font-bold text-white font-outfit">98%</h4>
                  <p className="text-white/40 uppercase tracking-widest text-xs font-bold">Client Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-navy-dark border-y border-white/5">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold font-outfit mb-6">Our Core Values</h2>
            <p className="text-white/40 max-w-xl mx-auto">The principles that guide every decision we make at WildpathAfrica.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value) => (
              <div key={value.title} className="bg-navy/50 border border-white/5 rounded-3xl p-10 hover:border-accent/30 transition-all group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${value.color}`}>
                  <value.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-outfit group-hover:text-accent transition-colors">{value.title}</h3>
                <p className="text-white/60 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-24">
        <div className="container mx-auto px-8">
          <div className="bg-gradient-to-r from-navy-deep to-navy-light/20 border border-white/5 rounded-[50px] p-12 md:p-24 text-center">
            <h2 className="text-4xl md:text-6xl font-bold font-outfit mb-8">Ready to Start Your Journey?</h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-12 text-lg">
              Whether it&apos;s your first time in Africa or you&apos;re a seasoned traveller, we&apos;re here to make your wild path extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a 
                href="/tours"
                className="bg-accent text-navy font-bold px-12 py-5 rounded-2xl hover:scale-105 transition-transform text-lg"
              >
                Browse Tours
              </a>
              <a 
                href="/contact"
                className="bg-white/5 text-white font-bold px-12 py-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-lg"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
