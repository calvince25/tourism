"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import RichTextEditor from "./RichTextEditor";
import { 
  Save, 
  Info, 
  List, 
  DollarSign, 
  Image as ImageIcon, 
  MapPin, 
  Plus, 
  Trash2, 
  Upload, 
  ArrowUp, 
  ArrowDown,
  Users
} from "lucide-react";

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

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

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
    groupSizeMax: initialData?.groupSizeMax || 16,
    coverImageId: initialData?.coverImageId || null,
    heroImageId: initialData?.heroImageId || null,
  });

  // Previews
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.coverImage?.fileUrl || null);
  const [heroPreview, setHeroPreview] = useState<string | null>(initialData?.heroImage?.fileUrl || null);

  // Itinerary days
  const [itinerary, setItinerary] = useState<any[]>(initialData?.itinerary || []);

  // Gallery items
  const [gallery, setGallery] = useState<any[]>(initialData?.gallery || []);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading("Uploading cover image...");
    try {
      const uData = new FormData();
      uData.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: uData });
      if (res.ok) {
        const data = await res.json();
        const media = data.media[0];
        if (media) {
          setFormData(prev => ({ ...prev, coverImageId: media.id }));
          setCoverPreview(media.fileUrl);
          toast.success("Cover image uploaded successfully!", { id: toastId });
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Cover upload failed", { id: toastId });
    }
  };

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
          toast.success("Hero banner uploaded successfully!", { id: toastId });
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Hero upload failed", { id: toastId });
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const toastId = toast.loading(`Uploading ${files.length} gallery image(s)...`);
    try {
      const uData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uData.append("files", files[i]);
      }
      const res = await fetch("/api/upload", { method: "POST", body: uData });
      if (res.ok) {
        const data = await res.json();
        const newItems = data.media.map((media: any) => ({
          mediaId: media.id,
          media: media
        }));
        setGallery(prev => [...prev, ...newItems]);
        toast.success("Gallery images added!", { id: toastId });
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Gallery upload failed", { id: toastId });
    }
  };

  const handleDeleteGalleryItem = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  const moveGalleryItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === gallery.length - 1) return;
    const updated = [...gallery];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setGallery(updated);
  };

  const handleAddItineraryDay = () => {
    setItinerary(prev => [
      ...prev,
      {
        dayNumber: prev.length + 1,
        title: "",
        description: "",
        location: "",
        mealsIncluded: "Breakfast",
        accommodation: "",
        photoId: null,
        photo: null
      }
    ]);
  };

  const handleItineraryDayChange = (index: number, field: string, val: any) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: val };
    setItinerary(updated);
  };

  const handleItineraryPhotoUpload = async (index: number, file: File) => {
    const toastId = toast.loading("Uploading day photo...");
    try {
      const uData = new FormData();
      uData.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: uData });
      if (res.ok) {
        const data = await res.json();
        const media = data.media[0];
        if (media) {
          const updated = [...itinerary];
          updated[index] = { ...updated[index], photoId: media.id, photo: media };
          setItinerary(updated);
          toast.success("Photo uploaded successfully!", { id: toastId });
        }
      }
    } catch (err) {
      toast.error("Upload failed", { id: toastId });
    }
  };

  const handleDeleteItineraryDay = (index: number) => {
    const filtered = itinerary.filter((_, i) => i !== index);
    // Recalculate day numbers
    const updated = filtered.map((day, i) => ({
      ...day,
      dayNumber: i + 1
    }));
    setItinerary(updated);
  };

  const moveItineraryDay = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === itinerary.length - 1) return;
    const updated = [...itinerary];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    // Recalculate day numbers for correct sequential mapping
    const reindexed = updated.map((day, i) => ({
      ...day,
      dayNumber: i + 1
    }));
    setItinerary(reindexed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        id: initialData?.id,
        itinerary: itinerary.map((day, i) => ({
          title: day.title,
          description: day.description,
          location: day.location,
          mealsIncluded: day.mealsIncluded,
          accommodation: day.accommodation,
          photoId: day.photoId,
          dayNumber: i + 1
        })),
        gallery: gallery.map((item, i) => ({
          mediaId: item.mediaId || item.id || item.media?.id
        }))
      };

      const res = await fetch("/api/tours", {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(initialData ? "Tour package updated" : "Tour package created");
        router.push("/admin/tours");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to save tour package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sticky top-20 bg-navy/80 backdrop-blur-md z-30 py-4 -mx-4 px-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-white">
            {initialData ? `Edit ${formData.name || initialData.name}` : "Add New Tour Package"}
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
        {/* Navigation Sidebar */}
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

        {/* Dynamic Panels */}
        <div className="flex-grow bg-navy-light/20 border border-white/5 rounded-[40px] p-8 md:p-12 min-h-[600px]">
          
          {/* Panel: Basic Info */}
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
                    onChange={(e) => {
                      const name = e.target.value;
                      const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                      setFormData({ ...formData, name, slug: autoSlug });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Slug <span className="text-white/20 font-normal normal-case tracking-normal">(auto-generated)</span></label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white/60 focus:border-accent outline-none transition-all"
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
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Status</label>
                  <select 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none appearance-none"
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

          {/* Panel: Full Description */}
          {activeTab === "content" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-xl font-bold font-outfit">Full Tour Description</h3>
              <RichTextEditor 
                value={formData.fullDescription} 
                onChange={(val) => setFormData({ ...formData, fullDescription: val })} 
              />
            </div>
          )}

          {/* Panel: Pricing & Capacity */}
          {activeTab === "pricing" && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Price (USD)</label>
                  <input 
                    type="number" 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                    value={formData.priceUsd}
                    onChange={(e) => setFormData({ ...formData, priceUsd: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Price (KES)</label>
                  <input 
                    type="number" 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                    value={formData.priceKes}
                    onChange={(e) => setFormData({ ...formData, priceKes: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Duration (Days)</label>
                  <input 
                    type="number" 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Duration (Nights)</label>
                  <input 
                    type="number" 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                    value={formData.durationNights}
                    onChange={(e) => setFormData({ ...formData, durationNights: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Min Group Size</label>
                  <input 
                    type="number" 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                    value={formData.groupSizeMin}
                    onChange={(e) => setFormData({ ...formData, groupSizeMin: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Max Group Size</label>
                  <input 
                    type="number" 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                    value={formData.groupSizeMax}
                    onChange={(e) => setFormData({ ...formData, groupSizeMax: parseInt(e.target.value) || 16 })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Panel: Itinerary Editor */}
          {activeTab === "itinerary" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-outfit text-white">Daily Itinerary Days</h3>
                <button
                  type="button"
                  onClick={handleAddItineraryDay}
                  className="bg-accent/10 text-accent hover:bg-accent hover:text-navy px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Plus size={16} /> Add Itinerary Day
                </button>
              </div>

              <div className="space-y-8">
                {itinerary.map((day, index) => (
                  <div key={index} className="bg-navy-light/10 border border-white/5 p-8 rounded-3xl relative group space-y-6">
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveItineraryDay(index, "up")}
                        disabled={index === 0}
                        className="text-white/20 hover:text-white disabled:opacity-30 p-2 rounded-lg hover:bg-white/5 transition-all"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItineraryDay(index, "down")}
                        disabled={index === itinerary.length - 1}
                        className="text-white/20 hover:text-white disabled:opacity-30 p-2 rounded-lg hover:bg-white/5 transition-all"
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItineraryDay(index)}
                        className="text-white/20 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h4 className="text-accent font-bold font-outfit text-lg">Day {day.dayNumber}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Day Title</label>
                          <input 
                            type="text"
                            required
                            className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm"
                            value={day.title}
                            onChange={(e) => handleItineraryDayChange(index, "title", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Location / Region</label>
                          <input 
                            type="text"
                            className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm"
                            value={day.location || ""}
                            onChange={(e) => handleItineraryDayChange(index, "location", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Day Photo Upload */}
                      <div className="bg-navy-deep/20 border border-white/5 p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-3 relative overflow-hidden min-h-[140px]">
                        {day.photo?.fileUrl ? (
                          <div className="absolute inset-0 group">
                            <img src={day.photo.fileUrl} alt={day.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <label className="bg-white/15 text-white hover:bg-accent hover:text-navy px-4 py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-all">
                                Replace Photo
                                <input 
                                  type="file" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleItineraryPhotoUpload(index, file);
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
                              Click to upload day photo
                              <input 
                                type="file" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleItineraryPhotoUpload(index, file);
                                }} 
                                className="hidden" 
                                accept="image/*" 
                              />
                            </label>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Meals Included</label>
                        <input 
                          type="text"
                          placeholder="e.g. Breakfast, Lunch, Dinner"
                          className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm"
                          value={day.mealsIncluded || ""}
                          onChange={(e) => handleItineraryDayChange(index, "mealsIncluded", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Accommodation</label>
                        <input 
                          type="text"
                          placeholder="e.g. Keekorok Lodge or similar"
                          className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm"
                          value={day.accommodation || ""}
                          onChange={(e) => handleItineraryDayChange(index, "accommodation", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Description</label>
                      <textarea 
                        className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm h-24"
                        value={day.description || ""}
                        onChange={(e) => handleItineraryDayChange(index, "description", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                {itinerary.length === 0 && (
                  <div className="py-16 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl">
                    No itinerary days added to this tour package yet. Click "Add Itinerary Day" to start.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Panel: Media Section */}
          {activeTab === "media" && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <h3 className="text-xl font-bold font-outfit text-white">Tour Cover & Hero Images</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cover Image Upload */}
                <div className="bg-navy-deep/20 border border-white/5 p-8 rounded-3xl space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40">Tour Cover Image (Grid)</span>
                  {coverPreview ? (
                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/10 group">
                      <img src={coverPreview} alt="Tour cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => coverFileInputRef.current?.click()}
                          className="bg-white/10 text-white hover:bg-accent hover:text-navy px-6 py-2.5 rounded-xl text-xs font-bold transition-all"
                        >
                          Change Cover Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => coverFileInputRef.current?.click()}
                      className="border border-dashed border-white/10 hover:border-accent/40 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-white/[0.01] aspect-[4/3] flex flex-col justify-center items-center"
                    >
                      <Upload size={32} className="text-white/20 mb-4" />
                      <span className="text-xs font-bold text-white/60">Upload Cover Image</span>
                    </div>
                  )}
                  <input type="file" ref={coverFileInputRef} onChange={handleCoverUpload} className="hidden" accept="image/*" />
                </div>

                {/* Hero Image Upload */}
                <div className="bg-navy-deep/20 border border-white/5 p-8 rounded-3xl space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40">Tour Hero Banner</span>
                  {heroPreview ? (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 group">
                      <img src={heroPreview} alt="Tour hero banner" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => heroFileInputRef.current?.click()}
                          className="bg-white/10 text-white hover:bg-accent hover:text-navy px-6 py-2.5 rounded-xl text-xs font-bold transition-all"
                        >
                          Change Banner Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => heroFileInputRef.current?.click()}
                      className="border border-dashed border-white/10 hover:border-accent/40 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-white/[0.01] aspect-video flex flex-col justify-center items-center"
                    >
                      <Upload size={32} className="text-white/20 mb-4" />
                      <span className="text-xs font-bold text-white/60">Upload Hero Banner</span>
                    </div>
                  )}
                  <input type="file" ref={heroFileInputRef} onChange={handleHeroUpload} className="hidden" accept="image/*" />
                </div>
              </div>

              {/* Gallery Multi-Photo Manager */}
              <div className="border-t border-white/5 pt-10 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold font-outfit text-white">Media Gallery</h3>
                    <p className="text-white/40 text-xs mt-1">Upload high-res photos to display in the tour carousel gallery.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="bg-accent/10 text-accent hover:bg-accent hover:text-navy px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    <Plus size={16} /> Upload Photos
                  </button>
                  <input type="file" ref={galleryFileInputRef} onChange={handleGalleryUpload} className="hidden" multiple accept="image/*" />
                </div>

                {gallery.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {gallery.map((item, index) => {
                      const fileUrl = item.media?.fileUrl || item.fileUrl;
                      return (
                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group bg-navy-deep">
                          {fileUrl && (
                            <img src={fileUrl} alt="Gallery item" className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity">
                            <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl">
                              <button
                                type="button"
                                onClick={() => moveGalleryItem(index, "up")}
                                disabled={index === 0}
                                className="text-white hover:text-accent disabled:opacity-30 p-1"
                                title="Move Left"
                              >
                                <ArrowUp size={14} className="-rotate-90" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveGalleryItem(index, "down")}
                                disabled={index === gallery.length - 1}
                                className="text-white hover:text-accent disabled:opacity-30 p-1"
                                title="Move Right"
                              >
                                <ArrowDown size={14} className="-rotate-90" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryItem(index)}
                              className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-bold transition-all"
                            >
                              Remove Photo
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl">
                    No gallery images added yet. Click "Upload Photos" to add highlights.
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
