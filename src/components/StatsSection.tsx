"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Smile, Globe, ArrowRight, Shield, Zap, CircleDollarSign } from "lucide-react";

const StatItem = ({ icon: Icon, value, label }: { icon: any, value: string, label: string }) => (
  <div className="flex flex-col items-center text-center p-6 border-r border-white/10 last:border-r-0">
    <div className="p-3 bg-white/5 rounded-xl mb-4 text-accent">
      <Icon size={28} />
    </div>
    <h3 className="text-4xl font-bold mb-1">{value}</h3>
    <p className="text-xs uppercase tracking-widest text-white/60">{label}</p>
  </div>
);

export default function StatsSection() {
  return (
    <section className="bg-navy-dark py-24 relative overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side: Stats and Info */}
          <div>
            <div className="grid grid-cols-3 mb-12 bg-navy/50 rounded-3xl border border-white/5">
              <StatItem icon={Calendar} value="10" label="Years of Experience" />
              <StatItem icon={Smile} value="5000" label="Satisfied Clients" />
              <StatItem icon={Globe} value="100" label="Countries Covered" />
            </div>

            <div className="max-w-xl">
              <p className="text-white/70 leading-relaxed mb-8">
                Our tours offer a diverse range of destinations that cater to a wide variety of interests. 
                From sun-drenched sandy beaches with crystal-clear blue oceans, to breathtaking mountain 
                landscapes, tranquil lakes, and lush forests, we've got you covered.
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                Don't waste your chance! We have a tempting offer for the first 50 people who apply 
                for the tour will receive a 15% discount on purchases from our partners.
              </p>
              
              <div className="flex items-center gap-6 mb-10">
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                  <Shield size={18} className="text-accent" />
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                  <Zap size={18} className="text-accent" />
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                  <CircleDollarSign size={18} className="text-accent" />
                </div>
                <button className="flex items-center gap-2 text-accent font-bold group">
                  Learn more <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Tilted Images */}
          <div className="relative h-[500px] flex items-center justify-center">
            <motion.div 
              initial={{ rotate: -10, x: -50, opacity: 0 }}
              whileInView={{ rotate: -15, x: -100, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute w-[200px] h-[300px] rounded-2xl overflow-hidden border-8 border-white shadow-2xl z-10"
            >
              <Image src="/assets/arctic_wonders.png" alt="Travel 1" fill className="object-cover" />
            </motion.div>
            
            <motion.div 
              initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
              whileInView={{ rotate: -5, scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute w-[220px] h-[320px] rounded-2xl overflow-hidden border-8 border-white shadow-2xl z-20"
            >
              <Image src="/assets/hawaii_beach.png" alt="Travel 2" fill className="object-cover" />
            </motion.div>

            <motion.div 
              initial={{ rotate: 10, x: 50, opacity: 0 }}
              whileInView={{ rotate: 10, x: 80, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute w-[240px] h-[340px] rounded-2xl overflow-hidden border-8 border-white shadow-2xl z-30"
            >
              <Image src="/assets/mountain_stack.png" alt="Travel 3" fill className="object-cover" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
