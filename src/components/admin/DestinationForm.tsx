"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import RichTextEditor from "./RichTextEditor";
import WordCounter from "./WordCounter";
import { Save, Globe, Info, Search, Image as ImageIcon, HelpCircle, MapPin } from "lucide-react";

const tabs = [
  { id: "basic", name: "Basic Info", icon: Info },
  { id: "content", name: "Content", icon: Search },
  { id: "seo", name: "SEO", icon: Globe },
  { id: "media", name: "Media", icon: ImageIcon },
  { id: "faqs", name: "FAQs", icon: HelpCircle },
  { id: "attractions", name: "Attractions", icon: MapPin },
];

export default function DestinationForm({ initialData, countries }: { initialData?: any; countries: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    countryId: initialData?.countryId || (countries.length > 0 ? countries[0].id : ""),
    shortTeaser: initialData?.shortTeaser || "",
    status: initialData?.status || "DRAFT",
    sortOrder: initialData?.sortOrder || 0,
    
    // Rich content
    contentIntro: initialData?.contentIntro || "",
    contentWhyVisit: initialData?.contentWhyVisit || "",
    contentWildlife: initialData?.contentWildlife || "",
    contentCulture: initialData?.contentCulture || "",
    
    // SEO
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    focusKeyword: initialData?.focusKeyword || "",
    
    // Stats
    language: initialData?.language || "",
    currency: initialData?.currency || "",
    bestSeason: initialData?.bestSeason || "",
    parkEntryResident: initialData?.parkEntryResident || "",
    parkEntryNonResident: initialData?.parkEntryNonResident || "",
    visaRequired: initialData?.visaRequired || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/destinations", {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: initialData?.id }),
      });
      
      if (res.ok) {
        toast.success(initialData ? "Destination updated" : "Destination created");
        router.push("/admin/destinations");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to save destination");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sticky top-20 bg-navy/80 backdrop-blur-md z-30 py-4 -mx-4 px-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-white">
            {initialData ? `Edit ${initialData.name}` : "Add New Destination"}
          </h1>
          <div className="mt-2">
            <WordCounter content={formData.contentIntro + formData.contentWhyVisit + formData.contentWildlife + formData.contentCulture} />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-navy px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : <><Save size={20} /> Save Destination</>}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Tab Navigation */}
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

        {/* Tab Content */}
        <div className="flex-grow bg-navy-light/20 border border-white/5 rounded-[40px] p-8 md:p-12 min-h-[600px]">
          {activeTab === "basic" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Destination Name</label>
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
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Country</label>
                  <select 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none transition-all appearance-none"
                    value={formData.countryId}
                    onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
                  >
                    {countries.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Status</label>
                  <select 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none transition-all appearance-none"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Short Teaser (Max 200 chars)</label>
                <textarea 
                  maxLength={200}
                  className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none transition-all h-32"
                  value={formData.shortTeaser}
                  onChange={(e) => setFormData({ ...formData, shortTeaser: e.target.value })}
                />
                <div className="text-right text-xs text-white/20">
                  {formData.shortTeaser.length} / 200
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Language</label>
                  <input 
                    type="text" 
                    className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Currency</label>
                  <input 
                    type="text" 
                    className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Best Season</label>
                  <input 
                    type="text" 
                    className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none"
                    value={formData.bestSeason}
                    onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-outfit">Main Introduction</h3>
                <RichTextEditor 
                  value={formData.contentIntro} 
                  onChange={(val) => setFormData({ ...formData, contentIntro: val })} 
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-outfit">Why Visit {formData.name || "this destination"}?</h3>
                <RichTextEditor 
                  value={formData.contentWhyVisit} 
                  onChange={(val) => setFormData({ ...formData, contentWhyVisit: val })} 
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-outfit">Wildlife & Nature</h3>
                <RichTextEditor 
                  value={formData.contentWildlife} 
                  onChange={(val) => setFormData({ ...formData, contentWildlife: val })} 
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-outfit">Culture & Community</h3>
                <RichTextEditor 
                  value={formData.contentCulture} 
                  onChange={(val) => setFormData({ ...formData, contentCulture: val })} 
                />
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Meta Title (65 Chars Max)</label>
                <input 
                  type="text" 
                  maxLength={65}
                  className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                />
                <div className="text-right text-xs">
                  <span className={formData.metaTitle.length > 60 ? "text-red-400" : "text-white/20"}>
                    {formData.metaTitle.length} / 65
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Meta Description (165 Chars Max)</label>
                <textarea 
                  maxLength={165}
                  className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none h-32"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                />
                <div className="text-right text-xs text-white/20">
                  {formData.metaDescription.length} / 165
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Focus Keyword</label>
                <input 
                  type="text" 
                  className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                  value={formData.focusKeyword}
                  onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                />
              </div>
            </div>
          )}

          {["media", "faqs", "attractions"].includes(activeTab) && (
            <div className="py-20 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl">
              This tab is currently under development. Please save basic info and content first.
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
