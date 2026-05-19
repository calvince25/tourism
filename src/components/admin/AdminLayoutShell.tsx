"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-navy text-white">
      {/* Desktop Sidebar (visible only on lg screens and up) */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer (visible only on md screens and down, slides in/out) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-navy-dark/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        {/* Sidebar content drawer */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-64 bg-navy-deep border-r border-white/5 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar mobileOnClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-10 flex-grow container mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
