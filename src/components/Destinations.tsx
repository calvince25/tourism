"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Destinations({ initialCountries }: { initialCountries: any[] }) {
  const [activeTab, setActiveTab] = useState(initialCountries[0]?.name || "Kenya");

  const activeCountry = initialCountries.find(c => c.name === activeTab);

  return (
    <section id="destination" className="py-24 bg-navy-dark border-t border-white/5">
      <div className="container mx-auto px-8 text-center">
        <h2 className="text-6xl font-bold mb-16 font-outfit">Destinations</h2>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-20">
          {initialCountries.map((country) => (
            <button
              key={country.id}
              onClick={() => setActiveTab(country.name)}
              className={`text-2xl font-bold font-outfit transition-all duration-300 relative pb-2 ${
                activeTab === country.name ? "text-accent" : "text-white/40 hover:text-white"
              }`}
            >
              {country.name}
              {activeTab === country.name && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl text-white/60 mb-12">Discover the wonders of {activeTab}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeCountry?.destinations.map((dest: any) => (
                <Link 
                  key={dest.id} 
                  href={`/destinations/${activeCountry.slug}/${dest.slug}`}
                  className="bg-navy/50 border border-white/10 rounded-3xl overflow-hidden text-left hover:border-accent/50 transition-all group"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={dest.thumbnailImage?.fileUrl || "/assets/placeholder.png"}
                      alt={dest.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-60" />
                    <div className="absolute bottom-6 left-6">
                      <h4 className="text-2xl font-bold text-white mb-1">{dest.name}</h4>
                      <p className="text-accent text-sm font-medium">Explore More →</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-white/60 line-clamp-2 text-sm leading-relaxed">
                      {dest.shortTeaser || "Experience the breathtaking beauty and unique culture of this incredible destination."}
                    </p>
                  </div>
                </Link>
              ))}
              
              {(!activeCountry?.destinations || activeCountry.destinations.length === 0) && (
                <div className="col-span-full py-20 text-white/40 border border-dashed border-white/10 rounded-3xl">
                  More destinations coming soon to {activeTab}.
                </div>
              )}
            </div>

            {activeCountry?.destinations.length > 0 && (
              <div className="mt-16">
                <Link 
                  href={`/destinations/${activeCountry.slug}`}
                  className="inline-flex items-center gap-2 text-accent font-bold hover:gap-4 transition-all"
                >
                  View All {activeTab} Destinations <span className="text-2xl">→</span>
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
