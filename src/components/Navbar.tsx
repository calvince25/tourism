"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-transparent">
      <div className="text-2xl font-bold font-outfit tracking-tighter text-white">
        Wildpath<span className="text-accent">Africa</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <Link href="#about" className="text-sm font-medium hover:text-accent transition-colors text-white">About</Link>
        <Link href="#destination" className="text-sm font-medium hover:text-accent transition-colors text-white">Destination</Link>
        <Link href="#tours" className="text-sm font-medium hover:text-accent transition-colors text-white">Exclusive Tour</Link>
        <Link href="#reviews" className="text-sm font-medium hover:text-accent transition-colors text-white">Reviews</Link>
      </div>

      <div className="flex items-center gap-4 text-white">
        <Link href="#" className="hover:text-accent transition-colors">
          <Instagram size={20} />
        </Link>
        <Link href="#" className="hover:text-accent transition-colors">
          <Facebook size={20} />
        </Link>
        <Link href="#" className="hover:text-accent transition-colors">
          <Youtube size={20} />
        </Link>
      </div>
    </nav>
  );
}
