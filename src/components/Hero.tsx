"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

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
    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1">
      <span className="text-xs font-bold text-white">{rating}</span>
      <Star size={10} className="fill-accent text-accent" />
    </div>
    <div className="absolute bottom-3 left-3 text-white">
      <p className="text-[10px] uppercase tracking-widest opacity-80">{location}</p>
      <h4 className="text-sm font-bold">{title}</h4>
    </div>
  </div>
);

export default function Hero({ heroImage = "/assets/hero_bg.png" }: { heroImage?: string }) {
  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          id="hero-bg-home"
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var customBg = localStorage.getItem('setting_hero_home');
              if (customBg) {
                document.getElementById('hero-bg-home').style.backgroundImage = "url('" + customBg + "')";
              }
            } catch (e) {}
          })();
        `}} />
        <div className="absolute inset-0 bg-navy-deep/50" />
      </div>

      <div className="container mx-auto px-4 sm:px-8 z-10 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <p className="text-accent uppercase tracking-widest font-bold text-xs sm:text-sm mb-4">
            Kenya&apos;s Premier Safari Experience
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6 text-white">
            Journey to All <br />
            <span className="text-accent">World Corners</span>
          </h1>
          <p className="text-base sm:text-lg text-white/80 mb-8 max-w-md mx-auto lg:mx-0">
            Unlock the wonders of the world: Your dream trip. 
            Our tours offer a diverse range of destinations 
            that cater to a wide variety of interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/tours"
              className="px-8 py-3 bg-accent text-navy font-bold rounded-lg hover:scale-105 active:scale-95 transition-all duration-300 text-center"
            >
              Explore Tours
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white/30 text-white font-bold rounded-lg hover:border-accent hover:text-accent transition-all duration-300 text-center"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>

        {/* Destination Cards — hidden on small mobile, shown md+ */}
        <div className="hidden md:flex relative items-center justify-center lg:justify-end gap-6 h-[320px] lg:h-[400px]">
          {/* Main Destination Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="z-20 w-[260px] lg:w-[300px] h-[180px] lg:h-[220px]"
          >
            <DestinationCard 
              image="/assets/hawaii_beach.png"
              location="USA, HAWAII"
              title="Hawaii Beach"
              rating={4.8}
            />
          </motion.div>

          {/* Secondary Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="z-10 w-[200px] lg:w-[240px] h-[140px] lg:h-[160px] opacity-60 -mr-16 lg:-mr-20"
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

      {/* Wave Transition */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] sm:h-[80px] lg:h-[100px] fill-navy-dark">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,-1.11,1200,0.47V120H0Z"></path>
        </svg>
      </div>
    </section>
  );
}
