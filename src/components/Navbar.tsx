"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/destinations", label: "Destinations" },
  { href: "/tours", label: "Tours" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-navy/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold font-outfit tracking-tighter text-white z-50">
            Wildpath<span className="text-accent">Africa</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-accent transition-colors text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Social + Mobile Hamburger */}
          <div className="flex items-center gap-3 text-white">
            <div className="hidden sm:flex items-center gap-3">
              <Link href="#" className="hover:text-accent transition-colors"><Instagram size={18} /></Link>
              <Link href="https://www.facebook.com/share/1CRFai4pXV/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Facebook size={18} /></Link>
              <Link href="#" className="hover:text-accent transition-colors"><Youtube size={18} /></Link>
            </div>
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors z-50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-navy/98 backdrop-blur-xl flex flex-col pt-24 pb-10 px-8 md:hidden">
          <nav className="flex flex-col gap-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-bold font-outfit py-4 border-b border-white/5 text-white hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Icons in mobile menu */}
          <div className="flex items-center gap-6 text-white mt-8">
            <Link href="#" className="hover:text-accent transition-colors"><Instagram size={22} /></Link>
            <Link href="https://www.facebook.com/share/1CRFai4pXV/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Facebook size={22} /></Link>
            <Link href="#" className="hover:text-accent transition-colors"><Youtube size={22} /></Link>
          </div>
        </div>
      )}
    </>
  );
}
