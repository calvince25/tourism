"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, BadgeDollarSign } from "lucide-react";

export default function AboutUs() {
  return (
    <section id="about" className="py-24 bg-navy-dark">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[40px] overflow-hidden border-4 border-white/10 aspect-video lg:aspect-square"
          >
            <Image 
              src="/assets/agency_office.png" 
              alt="Our Office" 
              fill 
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl font-bold mb-8">About Us</h2>
            <div className="space-y-6 max-w-xl text-white/70 leading-relaxed mb-12">
              <p>
                Our team of travel experts is passionate about exploring the world and helping our clients do the same. 
                With years of experience in the travel industry, we have developed strong relationships with suppliers 
                and vendors around the world, allowing us to offer exclusive deals and insider access to some of 
                the world's most incredible destinations.
              </p>
              <p>
                At our travel agency, we believe that travel is more than just visiting new places - it's about 
                experiencing new cultures, meeting new people, and creating memories that last a lifetime.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="text-accent mb-2">
                  <ShieldCheck size={32} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">Reliability</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-accent mb-2">
                  <Clock size={32} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">All Fast</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-accent mb-2">
                  <BadgeDollarSign size={32} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">Profitability</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
