"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Plane, 
  FileText, 
  Image as ImageIcon, 
  HelpCircle, 
  Star, 
  Mail, 
  Settings,
  Globe,
  X
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Countries", href: "/admin/countries", icon: Globe },
  { name: "Destinations", href: "/admin/destinations", icon: MapPin },
  { name: "Tours", href: "/admin/tours", icon: Plane },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Inquiries", href: "/admin/inquiries", icon: Mail },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  mobileOnClose?: () => void;
}

export default function AdminSidebar({ mobileOnClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (mobileOnClose) {
      mobileOnClose();
    }
  };

  return (
    <aside className="w-full bg-navy-deep flex flex-col h-full overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between">
        <Link href="/admin" onClick={handleLinkClick} className="text-xl font-bold font-outfit text-white">
          Wildpath<span className="text-accent">Africa</span>
          <span className="block text-[10px] text-white/40 uppercase tracking-widest mt-1">Admin Panel</span>
        </Link>
        {mobileOnClose && (
          <button
            onClick={mobileOnClose}
            className="lg:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? "bg-accent/10 text-accent border-l-4 border-accent" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={20} className={isActive ? "text-accent" : "group-hover:text-white"} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link 
          href="/"
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white transition-all text-sm"
        >
          <Globe size={18} />
          View Website
        </Link>
      </div>
    </aside>
  );
}
