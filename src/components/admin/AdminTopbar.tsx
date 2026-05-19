"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User as UserIcon, Bell } from "lucide-react";
import Image from "next/image";

export default function AdminTopbar() {
  const { data: session } = useSession();

  return (
    <header className="h-20 bg-navy border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30 backdrop-blur-md bg-navy/80">
      <div className="flex items-center gap-4">
        <h2 className="text-white font-bold font-outfit">Welcome, {session?.user?.name || "Admin"}</h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-white/40 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
        </button>

        <div className="h-8 w-px bg-white/10" />

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-white">{session?.user?.name}</p>
            <p className="text-[10px] text-accent uppercase tracking-widest font-bold">
              {(session?.user as any)?.role || "ADMIN"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/20 flex items-center justify-center text-accent font-bold">
            {session?.user?.name?.charAt(0) || <UserIcon size={18} />}
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="text-white/40 hover:text-red-400 transition-colors"
            title="Log Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
