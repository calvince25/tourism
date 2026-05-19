"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import RichTextEditor from "./RichTextEditor";
import WordCounter from "./WordCounter";
import { Save, Globe, Info, Search, Image as ImageIcon, HelpCircle, MapPin, Plus, Trash2, Upload } from "lucide-react";

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

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const thumbFileInputRef = useRef<HTMLInputElement>(null);

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

    // Media relations
    heroImageId: initialData?.heroImageId || null,
    thumbnailImageId: initialData?.thumbnailImageId || null,
  });

  // Previews
  const [heroPreview, setHeroPreview] = useState<string | null>(initialData?.heroImage?.fileUrl || null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(initialData?.thumbnailImage?.fileUrl || null);

  // FAQs
  const [faqs, setFaqs] = useState<any[]>(initialData?.faqs || []);

  // Attractions
  const [attractions, setAttractions] = useState<any[]>(initialData?.attractions || []);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading("Uploading hero image...");
    try {
      const uData = new FormData();
      uData.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: uData });
      if (res.ok) {
        const data = await res.json();
        const media = data.media[0];
        if (media) {
          setFormData(prev => ({ ...prev, heroImageId: media.id }));
          setHeroPreview(media.fileUrl);
          toast.success("Hero image uploaded", { id: toastId });
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Hero upload failed", { id: toastId });
    }
  };

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading("Uploading thumbnail...");
    try {
      const uData = new FormData();
      uData.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: uData });
      if (res.ok) {
        const data = await res.json();
        const media = data.media[0];
        if (media) {
          setFormData(prev => ({ ...prev, thumbnailImageId: media.id }));
          setThumbPreview(media.fileUrl);
          toast.success("Thumbnail image uploaded", { id: toastId });
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Thumbnail upload failed", { id: toastId });
    }
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "", sortOrder: faqs.length }]);
  };

  const handleFaqChange = (index: number, field: string, val: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: val };
    setFaqs(updated);
  };

  const handleDeleteFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleAddAttraction = () => {
    setAttractions([...attractions, { name: "", description: "", attractionType: "Wildlife", photoId: null, photo: null, sortOrder: attractions.length }]);
  };

  const handleAttractionChange = (index: number, field: string, val: any) => {
    const updated = [...attractions];
    updated[index] = { ...updated[index], [field]: val };
    setAttractions(updated);
  };

  const handleAttractionPhotoUpload = async (index: number, file: File) => {
    const toastId = toast.loading("Uploading attraction photo...");
    try {
      const uData = new FormData();
      uData.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: uData });
      if (res.ok) {
        const data = await res.json();
        const media = data.media[0];
        if (media) {
          const updated = [...attractions];
          updated[index] = { ...updated[index], photoId: media.id, photo: media };
          setAttractions(updated);
          toast.success("Photo uploaded!", { id: toastId });
        }
      }
    } catch (err) {
      toast.error("Upload failed", { id: toastId });
    }
  };

  const handleDeleteAttraction = (index: number) => {
    setAttractions(attractions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/destinations", {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          faqs: faqs.map((f, i) => ({ ...f, sortOrder: i })), 
          attractions: attractions.map((a, i) => ({ ...a, sortOrder: i })), 
          id: initialData?.id 
        }),
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
            {initialData ? `Edit ${formData.name || initialData.name}` : "Add New Destination"}
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

          {activeTab === "media" && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <h3 className="text-xl font-bold font-outfit text-white">Destination Media</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Hero Image */}
                <div className="bg-navy-deep/20 border border-white/5 p-8 rounded-3xl space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40">Hero Banner Image</span>
                  {heroPreview ? (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 group">
                      <img src={heroPreview} alt="Hero banner" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => heroFileInputRef.current?.click()}
                          className="bg-white/10 text-white hover:bg-accent hover:text-navy px-6 py-2.5 rounded-xl text-xs font-bold transition-all"
                        >
                          Change Banner
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => heroFileInputRef.current?.click()}
                      className="border border-dashed border-white/10 hover:border-accent/40 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-white/[0.01]"
                    >
                      <Upload size={32} className="mx-auto text-white/20 mb-4" />
                      <span className="text-xs font-bold text-white/60">Upload Hero Banner</span>
                    </div>
                  )}
                  <input type="file" ref={heroFileInputRef} onChange={handleHeroUpload} className="hidden" accept="image/*" />
                </div>

                {/* Thumbnail Image */}
                <div className="bg-navy-deep/20 border border-white/5 p-8 rounded-3xl space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40">Grid Thumbnail Image</span>
                  {thumbPreview ? (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 group">
                      <img src={thumbPreview} alt="Grid thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => thumbFileInputRef.current?.click()}
                          className="bg-white/10 text-white hover:bg-accent hover:text-navy px-6 py-2.5 rounded-xl text-xs font-bold transition-all"
                        >
                          Change Thumbnail
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => thumbFileInputRef.current?.click()}
                      className="border border-dashed border-white/10 hover:border-accent/40 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-white/[0.01]"
                    >
                      <Upload size={32} className="mx-auto text-white/20 mb-4" />
                      <span className="text-xs font-bold text-white/60">Upload Thumbnail</span>
                    </div>
                  )}
                  <input type="file" ref={thumbFileInputRef} onChange={handleThumbUpload} className="hidden" accept="image/*" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "faqs" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-outfit text-white">Destination FAQ Items</h3>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="bg-accent/10 text-accent hover:bg-accent hover:text-navy px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Plus size={16} /> Add FAQ Question
                </button>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-navy-light/10 border border-white/5 p-6 rounded-2xl space-y-4 relative group">
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(index)}
                      className="absolute top-4 right-4 text-white/20 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="space-y-2 pr-10">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Question</label>
                      <input 
                        type="text"
                        required
                        className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Answer</label>
                      <textarea 
                        required
                        className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm h-24"
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                {faqs.length === 0 && (
                  <div className="py-16 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl">
                    No FAQs added to this destination yet. Click "Add FAQ Question" to start.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "attractions" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-outfit text-white">Points of Interest & Attractions</h3>
                <button
                  type="button"
                  onClick={handleAddAttraction}
                  className="bg-accent/10 text-accent hover:bg-accent hover:text-navy px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Plus size={16} /> Add Attraction
                </button>
              </div>

              <div className="space-y-8">
                {attractions.map((attr, index) => (
                  <div key={index} className="bg-navy-light/10 border border-white/5 p-8 rounded-3xl relative group space-y-6">
                    <button
                      type="button"
                      onClick={() => handleDeleteAttraction(index)}
                      className="absolute top-6 right-6 text-white/20 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Attraction Name</label>
                          <input 
                            type="text"
                            required
                            className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm"
                            value={attr.name}
                            onChange={(e) => handleAttractionChange(index, "name", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Type</label>
                          <select 
                            className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm appearance-none"
                            value={attr.attractionType || "Wildlife"}
                            onChange={(e) => handleAttractionChange(index, "attractionType", e.target.value)}
                          >
                            <option value="Wildlife">Wildlife</option>
                            <option value="Marine">Marine</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Viewpoint">Viewpoint</option>
                            <option value="Adventure">Adventure</option>
                          </select>
                        </div>
                      </div>

                      {/* Attraction Photo Upload */}
                      <div className="bg-navy-deep/20 border border-white/5 p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-3 relative overflow-hidden min-h-[140px]">
                        {attr.photo?.fileUrl ? (
                          <div className="absolute inset-0 group">
                            <img src={attr.photo.fileUrl} alt={attr.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <label className="bg-white/15 text-white hover:bg-accent hover:text-navy px-4 py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-all">
                                Replace Photo
                                <input 
                                  type="file" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleAttractionPhotoUpload(index, file);
                                  }} 
                                  className="hidden" 
                                  accept="image/*" 
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload size={24} className="text-white/20" />
                            <label className="text-xs font-bold text-white/60 cursor-pointer hover:text-accent transition-colors">
                              Click to upload photo
                              <input 
                                type="file" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleAttractionPhotoUpload(index, file);
                                }} 
                                className="hidden" 
                                accept="image/*" 
                              />
                            </label>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Description</label>
                      <textarea 
                        className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm h-24"
                        value={attr.description || ""}
                        onChange={(e) => handleAttractionChange(index, "description", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                {attractions.length === 0 && (
                  <div className="py-16 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl">
                    No attractions added yet. Click "Add Attraction" to list a highlight point.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
