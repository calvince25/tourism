"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-transparent">
      <div className="text-2xl font-bold font-outfit tracking-tighter text-white">
        Wildpath<span className="text-accent">Africa</span>
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-sm font-medium hover:text-accent transition-colors text-white">Home</Link>
        <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors text-white">About</Link>
        <Link href="/destinations" className="text-sm font-medium hover:text-accent transition-colors text-white">Destinations</Link>
        <Link href="/tours" className="text-sm font-medium hover:text-accent transition-colors text-white">Tours</Link>
        <Link href="/blog" className="text-sm font-medium hover:text-accent transition-colors text-white">Blog</Link>
        <Link href="/faq" className="text-sm font-medium hover:text-accent transition-colors text-white">FAQ</Link>
        <Link href="/contact" className="text-sm font-medium hover:text-accent transition-colors text-white">Contact</Link>
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
