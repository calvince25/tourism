"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Menu, X } from "lucide-react";

const Tiktok = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

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
  const [socials, setSocials] = useState({
    instagram: "https://www.instagram.com/wildpathafrica?igsh=d25qYWs1cjI5Y3Fo",
    facebook: "https://www.facebook.com/share/1CRFai4pXV/",
    tiktok: "tiktok.com/@wildpathafrica",
    youtube: "",
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Try to load from localStorage first
    try {
      const ig = localStorage.getItem("setting_social_instagram");
      const fb = localStorage.getItem("setting_social_facebook");
      const tt = localStorage.getItem("setting_social_tiktok");
      const yt = localStorage.getItem("setting_social_youtube");
      if (ig || fb || tt || yt) {
        setSocials(prev => ({
          instagram: ig || prev.instagram,
          facebook: fb || prev.facebook,
          tiktok: tt || prev.tiktok,
          youtube: yt || prev.youtube,
        }));
      }
    } catch (_) {}

    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const ig = data.find(s => s.key === "social_instagram")?.value;
          const fb = data.find(s => s.key === "social_facebook")?.value;
          const tt = data.find(s => s.key === "social_tiktok")?.value;
          const yt = data.find(s => s.key === "social_youtube")?.value;
          setSocials(prev => ({
            instagram: ig || prev.instagram,
            facebook: fb || prev.facebook,
            tiktok: tt || prev.tiktok,
            youtube: yt || prev.youtube,
          }));
          try {
            if (ig) localStorage.setItem("setting_social_instagram", ig);
            if (fb) localStorage.setItem("setting_social_facebook", fb);
            if (tt) localStorage.setItem("setting_social_tiktok", tt);
            if (yt) localStorage.setItem("setting_social_youtube", yt);
          } catch (_) {}
        }
      })
      .catch(err => console.warn("Navbar socials fetch failed:", err));
  }, []);

  const formatUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const fbUrl = formatUrl(socials.facebook);
  const igUrl = formatUrl(socials.instagram);
  const ttUrl = formatUrl(socials.tiktok);
  const ytUrl = formatUrl(socials.youtube);

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
              {igUrl && <Link href={igUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="Instagram"><Instagram size={18} /></Link>}
              {fbUrl && <Link href={fbUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="Facebook"><Facebook size={18} /></Link>}
              {ttUrl && <Link href={ttUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="TikTok"><Tiktok size={18} /></Link>}
              {ytUrl && <Link href={ytUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="YouTube"><Youtube size={18} /></Link>}
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
            {igUrl && <Link href={igUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="Instagram"><Instagram size={22} /></Link>}
            {fbUrl && <Link href={fbUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="Facebook"><Facebook size={22} /></Link>}
            {ttUrl && <Link href={ttUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="TikTok"><Tiktok size={22} /></Link>}
            {ytUrl && <Link href={ytUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="YouTube"><Youtube size={22} /></Link>}
          </div>
        </div>
      )}
    </>
  );
}
