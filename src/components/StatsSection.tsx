"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Smile, Globe, ArrowRight, Shield, Zap, CircleDollarSign } from "lucide-react";
import Link from "next/link";

const StatItem = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string, label: string }) => (
  <div className="flex flex-col items-center text-center p-4 sm:p-6">
    <div className="p-3 bg-white/5 rounded-xl mb-3 text-accent">
      <Icon size={24} />
    </div>
    <h3 className="text-2xl sm:text-4xl font-bold mb-1">{value}</h3>
    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/60">{label}</p>
  </div>
);

export default function StatsSection() {
  return (
    <section className="bg-navy-dark py-16 sm:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side */}
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-3 mb-10 sm:mb-12 bg-navy/50 rounded-2xl sm:rounded-3xl border border-white/5 divide-x divide-white/10">
              <StatItem icon={Calendar} value="10+" label="Years Experience" />
              <StatItem icon={Smile} value="5K+" label="Happy Clients" />
              <StatItem icon={Globe} value="100+" label="Destinations" />
            </div>

            <div className="max-w-xl">
              <p className="text-white/70 leading-relaxed mb-6 text-sm sm:text-base">
                Our tours offer a diverse range of destinations that cater to a wide variety of interests. 
                From sun-drenched sandy beaches with crystal-clear blue oceans, to breathtaking mountain 
                landscapes, tranquil lakes, and lush forests, we&apos;ve got you covered.
              </p>
              <p className="text-white/70 leading-relaxed mb-8 text-sm sm:text-base">
                Don&apos;t miss out — the first 50 bookings receive a 15% discount on partner purchases.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                  <Shield size={18} className="text-accent" />
                  <span className="text-xs text-white/60">Trusted</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                  <Zap size={18} className="text-accent" />
                  <span className="text-xs text-white/60">Fast Booking</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                  <CircleDollarSign size={18} className="text-accent" />
                  <span className="text-xs text-white/60">Best Value</span>
                </div>
              </div>

              <Link href="/tours" className="inline-flex items-center gap-2 text-accent font-bold group hover:gap-4 transition-all">
                Explore our tours <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </div>

          {/* Right Side: Tilted Images — hidden on mobile to avoid overflow */}
          <div className="hidden lg:flex relative h-[500px] items-center justify-center">
            <motion.div 
              initial={{ rotate: -10, x: -50, opacity: 0 }}
              whileInView={{ rotate: -15, x: -100, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute w-[180px] h-[260px] xl:w-[200px] xl:h-[300px] rounded-2xl overflow-hidden border-8 border-white shadow-2xl z-10"
            >
              <Image src="/assets/arctic_wonders.png" alt="Travel 1" fill className="object-cover" />
            </motion.div>
            
            <motion.div 
              initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
              whileInView={{ rotate: -5, scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute w-[200px] h-[290px] xl:w-[220px] xl:h-[320px] rounded-2xl overflow-hidden border-8 border-white shadow-2xl z-20"
            >
              <Image src="/assets/hawaii_beach.png" alt="Travel 2" fill className="object-cover" />
            </motion.div>

            <motion.div 
              initial={{ rotate: 10, x: 50, opacity: 0 }}
              whileInView={{ rotate: 10, x: 80, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute w-[220px] h-[310px] xl:w-[240px] xl:h-[340px] rounded-2xl overflow-hidden border-8 border-white shadow-2xl z-30"
            >
              <Image src="/assets/mountain_stack.png" alt="Travel 3" fill className="object-cover" />
            </motion.div>
          </div>

          {/* Mobile: Simple image grid instead of tilted stack */}
          <div className="lg:hidden grid grid-cols-2 gap-4">
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <Image src="/assets/hawaii_beach.png" alt="Hawaii" fill className="object-cover" />
            </div>
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <Image src="/assets/arctic_wonders.png" alt="Arctic" fill className="object-cover" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
