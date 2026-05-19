"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const DestinationCard = ({ 
  image, 
  location, 
  title, 
  rating,
  className = "" 
}: { 
  image: string; 
  location: string; 
  title: string; 
  rating: number;
  className?: string;
}) => (
  <div className={`relative overflow-hidden rounded-2xl group ${className}`}>
    <Image 
      src={image} 
      alt={title} 
      width={300} 
      height={200} 
      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1">
      <span className="text-xs font-bold text-white">{rating}</span>
      <Star size={10} className="fill-accent text-accent" />
    </div>
    <div className="absolute bottom-4 left-4 text-white">
      <p className="text-[10px] uppercase tracking-widest opacity-80">{location}</p>
      <h4 className="text-sm font-bold">{title}</h4>
    </div>
  </div>
);

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[800px] w-full flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero_bg.png"
          alt="Mountain Landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-navy-deep/40" />
      </div>

      <div className="container mx-auto px-8 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-6">
            Journey to All <br />
            <span className="text-white">World Corners</span>
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-md">
            Unlock the wonders of the world: Your dream trip. 
            Our tours offer a diverse range of destinations 
            that cater to a wide variety of interests.
          </p>
          <button className="px-8 py-3 border-2 border-accent text-accent font-bold rounded-lg hover:bg-accent hover:text-navy transition-all duration-300">
            Book a Trip
          </button>
        </motion.div>

        <div className="relative flex items-center justify-center lg:justify-end gap-6 h-[400px]">
          {/* Main Destination Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="z-20 w-[320px] h-[220px]"
          >
            <DestinationCard 
              image="/assets/hawaii_beach.png"
              location="USA, HAWAII"
              title="Hawaii Beach"
              rating={4.8}
            />
            <div className="mt-4 flex gap-4">
              <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-accent hover:text-navy transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-accent hover:text-navy transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>

          {/* Secondary Card (Partial) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="z-10 w-[240px] h-[160px] opacity-60 -mr-20 lg:block hidden"
          >
            <DestinationCard 
              image="/assets/arctic_wonders.png"
              location="ICELAND"
              title="Arctic Wonders"
              rating={4.9}
            />
          </motion.div>
        </div>
      </div>

      {/* Wave Transition at the bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[100px] fill-navy-dark">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,-1.11,1200,0.47V120H0Z"></path>
        </svg>
      </div>
    </section>
  );
}
