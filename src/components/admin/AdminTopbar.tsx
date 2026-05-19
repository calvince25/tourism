"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User as UserIcon, Bell, Menu } from "lucide-react";

interface AdminTopbarProps {
  onMenuClick?: () => void;
}

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const { data: session } = useSession();

  return (
    <header className="h-20 bg-navy border-b border-white/5 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 backdrop-blur-md bg-navy/80">
      <div className="flex items-center gap-3 sm:gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
        )}
        <h2 className="text-white font-bold font-outfit text-sm sm:text-base line-clamp-1">
          Welcome, {session?.user?.name || "Admin"}
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <button className="text-white/40 hover:text-white transition-colors relative p-1">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>

        <div className="h-8 w-px bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white line-clamp-1">{session?.user?.name}</p>
            <p className="text-[10px] text-accent uppercase tracking-widest font-bold">
              {(session?.user as any)?.role || "ADMIN"}
            </p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/20 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm sm:text-base">
            {session?.user?.name?.charAt(0) || <UserIcon size={16} />}
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="text-white/40 hover:text-red-400 transition-colors p-1"
            title="Log Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
