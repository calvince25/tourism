"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import RichTextEditor from "./RichTextEditor";
import { Save, Info, List, DollarSign, Image as ImageIcon, MapPin, Calendar } from "lucide-react";

const tabs = [
  { id: "basic", name: "Basic Info", icon: Info },
  { id: "content", name: "Full Description", icon: List },
  { id: "pricing", name: "Pricing & Duration", icon: DollarSign },
  { id: "itinerary", name: "Itinerary", icon: MapPin },
  { id: "media", name: "Media", icon: ImageIcon },
];

export default function TourForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    shortDescription: initialData?.shortDescription || "",
    fullDescription: initialData?.fullDescription || "",
    priceKes: initialData?.priceKes || 0,
    priceUsd: initialData?.priceUsd || 0,
    durationDays: initialData?.durationDays || 1,
    durationNights: initialData?.durationNights || 0,
    travelStyle: initialData?.travelStyle || "Safari",
    difficulty: initialData?.difficulty || "MODERATE",
    status: initialData?.status || "DRAFT",
    featured: initialData?.featured || false,
    groupSizeMin: initialData?.groupSizeMin || 1,
    groupSizeMax: initialData?.groupSizeMax || 12,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/tours", {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: initialData?.id }),
      });
      
      if (res.ok) {
        toast.success(initialData ? "Tour updated" : "Tour created");
        router.push("/admin/tours");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to save tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sticky top-20 bg-navy/80 backdrop-blur-md z-30 py-4 -mx-4 px-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-white">
            {initialData ? `Edit ${initialData.name}` : "Add New Tour Package"}
          </h1>
          <p className="text-white/40 text-sm mt-1">Configure your safari adventure details.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-navy px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : <><Save size={20} /> Save Tour</>}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 sticky top-48 h-fit z-20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all whitespace-nowrap lg:w-full ${
                  activeTab === tab.id 
                    ? "bg-accent text-navy font-bold" 
                    : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{tab.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-grow bg-navy-light/20 border border-white/5 rounded-[40px] p-8 md:p-12 min-h-[600px]">
          {activeTab === "basic" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Tour Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Slug</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none transition-all"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Travel Style</label>
                  <select 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none appearance-none"
                    value={formData.travelStyle}
                    onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
                  >
                    <option value="Safari">Classic Safari</option>
                    <option value="Beach">Beach Holiday</option>
                    <option value="Mountain">Mountain Trekking</option>
                    <option value="Cultural">Cultural Experience</option>
                    <option value="Family">Family Adventure</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Difficulty</label>
                  <select 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none appearance-none"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="CHALLENGING">Challenging</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Short Description</label>
                <textarea 
                  maxLength={300}
                  className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none transition-all h-32"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
                <input 
                  type="checkbox" 
                  id="featured"
                  className="w-5 h-5 rounded border-white/10 bg-navy text-accent focus:ring-accent"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <label htmlFor="featured" className="text-sm font-bold text-white/80 cursor-pointer">
                  Feature this tour on the homepage
                </label>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-xl font-bold font-outfit">Full Tour Description</h3>
              <RichTextEditor 
                value={formData.fullDescription} 
                onChange={(val) => setFormData({ ...formData, fullDescription: val })} 
              />
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Price (USD)</label>
                  <input 
                    type="number" 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                    value={formData.priceUsd}
                    onChange={(e) => setFormData({ ...formData, priceUsd: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Price (KES)</label>
                  <input 
                    type="number" 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                    value={formData.priceKes}
                    onChange={(e) => setFormData({ ...formData, priceKes: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Duration (Days)</label>
                  <input 
                    type="number" 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Duration (Nights)</label>
                  <input 
                    type="number" 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                    value={formData.durationNights}
                    onChange={(e) => setFormData({ ...formData, durationNights: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}

          {["itinerary", "media"].includes(activeTab) && (
            <div className="py-20 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl">
              This tab is currently under development. Please save basic info first.
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
