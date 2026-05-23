"use client";

import { useState, useEffect } from "react";
import { Save, Globe, MessageCircle, Mail, Phone, Share2, Upload, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

// Canvas-based image compression function to convert to high-quality WebP before upload
const compressImage = (file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    // Only compress images
    if (!file.type.startsWith("image/")) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize keeping aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file); // Fallback to original
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export to WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }
            // Create a new File object with a .webp extension
            const originalName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
            const compressedFile = new File([blob], `${originalName}.webp`, {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<Record<string, "compressing" | "uploading" | "saving" | null>>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const dbData = await res.json();
        if (res.ok && Array.isArray(dbData)) {
          // Sync database settings to localStorage
          dbData.forEach((s: any) => {
            if (s.key && s.value !== undefined) {
              localStorage.setItem('setting_' + s.key, s.value);
            }
          });
          setSettings(dbData);
        } else {
          throw new Error("Invalid setting response");
        }
      } catch (error) {
        console.warn("Failed to fetch settings from DB, falling back to localStorage:", error);
        // Load settings from localStorage
        const localSettings: any[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('setting_')) {
            localSettings.push({
              key: k.replace('setting_', ''),
              value: localStorage.getItem(k) || ""
            });
          }
        }
        setSettings(localSettings);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (key: string, value: string) => {
    setSaving(true);
    // Synchronize to localStorage
    try {
      localStorage.setItem('setting_' + key, value);
    } catch (e) {}

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        toast.success(`Updated ${key.replace('_', ' ')}`);
      }
    } catch (error) {
      toast.error("Save failed (saved locally only)");
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpload = async (key: string, file: File) => {
    setUploadStatus(prev => ({ ...prev, [key]: "compressing" }));
    
    let fileToUpload = file;
    try {
      fileToUpload = await compressImage(file);
    } catch (compressError) {
      console.warn("Client-side compression failed, uploading original:", compressError);
    }

    setUploadStatus(prev => ({ ...prev, [key]: "uploading" }));

    // Use dedicated settings upload endpoint (handles upload + save atomically)
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("key", key);

    try {
      const res = await fetch("/api/settings/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.fileUrl) {
        setUploadStatus(prev => ({ ...prev, [key]: "saving" }));
        const fileUrl = data.fileUrl;
        // Sync localStorage
        try { localStorage.setItem('setting_' + key, fileUrl); } catch (_) {}
        setSettings(prev => {
          const exists = prev.find(s => s.key === key);
          if (exists) {
            return prev.map(s => s.key === key ? { ...s, value: fileUrl } : s);
          } else {
            return [...prev, { key, value: fileUrl }];
          }
        });
        toast.success("Hero image updated successfully!");
      } else {
        const msg = data.message || data.error || "Upload failed";
        toast.error(msg);
        console.error("Settings upload error response:", data);
      }
    } catch (error) {
      console.error("Settings hero upload exception:", error);
      toast.error("Network error during upload. Please try again.");
    } finally {
      setUploadStatus(prev => ({ ...prev, [key]: null }));
    }
  };

  const handleResetHero = async (key: string) => {
    if (!confirm("Are you sure you want to reset this hero image to default?")) return;
    try {
      localStorage.removeItem('setting_' + key);
    } catch (e) {}
    try {
      await handleSave(key, "");
      setSettings(prev => prev.map(s => s.key === key ? { ...s, value: "" } : s));
    } catch (e) {
      toast.error("Failed to reset");
    }
  };

  const getVal = (key: string) => settings.find(s => s.key === key)?.value || "";

  const updateLocalVal = (key: string, value: string) => {
    setSettings(prev => {
      const exists = prev.find(s => s.key === key);
      if (exists) {
        return prev.map(s => s.key === key ? { ...s, value } : s);
      } else {
        return [...prev, { key, value }];
      }
    });
  };

  if (loading) return <div className="p-10 animate-pulse text-white/20">Loading settings...</div>;

  return (
    <div className="space-y-6 sm:space-y-10">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-outfit text-white mb-2">General Settings</h1>
        <p className="text-white/40 text-sm">Configure site-wide information and social links.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        {/* Site Config */}
        <div className="bg-navy-light/20 border border-white/5 rounded-3xl sm:rounded-[40px] p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          <h3 className="text-lg sm:text-xl font-bold font-outfit flex items-center gap-3">
            <Globe className="text-accent" size={24} /> Site Configuration
          </h3>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Site Name</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-sm sm:text-base"
                  value={getVal('site_name')}
                  onChange={(e) => updateLocalVal('site_name', e.target.value)}
                />
                <button 
                  onClick={() => handleSave('site_name', getVal('site_name'))}
                  className="w-full sm:w-auto px-6 py-3 bg-accent text-navy rounded-xl hover:scale-[1.03] transition-all flex items-center justify-center gap-2 shrink-0 font-bold text-sm"
                >
                  <Save size={18} />
                  <span>Save</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Site Email</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-sm sm:text-base"
                  value={getVal('site_email')}
                  onChange={(e) => updateLocalVal('site_email', e.target.value)}
                />
                <button 
                  onClick={() => handleSave('site_email', getVal('site_email'))}
                  className="w-full sm:w-auto px-6 py-3 bg-accent text-navy rounded-xl hover:scale-[1.03] transition-all flex items-center justify-center gap-2 shrink-0 font-bold text-sm"
                >
                  <Save size={18} />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-navy-light/20 border border-white/5 rounded-3xl sm:rounded-[40px] p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          <h3 className="text-lg sm:text-xl font-bold font-outfit flex items-center gap-3">
            <Share2 className="text-accent" size={24} /> Social Presence
          </h3>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">WhatsApp Number</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-sm sm:text-base"
                  value={getVal('site_whatsapp')}
                  onChange={(e) => updateLocalVal('site_whatsapp', e.target.value)}
                />
                <button 
                  onClick={() => handleSave('site_whatsapp', getVal('site_whatsapp'))}
                  className="w-full sm:w-auto px-6 py-3 bg-accent text-navy rounded-xl hover:scale-[1.03] transition-all flex items-center justify-center gap-2 shrink-0 font-bold text-sm"
                >
                  <Save size={18} />
                  <span>Save</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Instagram URL</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-sm sm:text-base"
                  value={getVal('social_instagram')}
                  onChange={(e) => updateLocalVal('social_instagram', e.target.value)}
                />
                <button 
                  onClick={() => handleSave('social_instagram', getVal('social_instagram'))}
                  className="w-full sm:w-auto px-6 py-3 bg-accent text-navy rounded-xl hover:scale-[1.03] transition-all flex items-center justify-center gap-2 shrink-0 font-bold text-sm"
                >
                  <Save size={18} />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Hero Images Settings */}
      <div className="bg-navy-light/20 border border-white/5 rounded-3xl sm:rounded-[40px] p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
        <h3 className="text-lg sm:text-xl font-bold font-outfit flex items-center gap-3 text-white">
          <Upload className="text-accent" size={24} /> Page Hero Images
        </h3>
        <p className="text-white/40 text-sm -mt-4">
          Upload custom full-width hero images for each core page. These will display edge-to-edge on the front-end.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "Home Page", key: "hero_home", defaultVal: "/assets/hero_bg.png" },
            { label: "About Page", key: "hero_about", defaultVal: "/assets/hero_bg.png" },
            { label: "Destinations Page", key: "hero_destinations", defaultVal: "/assets/hero_bg.png" },
            { label: "Tours Page", key: "hero_tours", defaultVal: "/assets/hero_bg.png" },
            { label: "Blog Page", key: "hero_blog", defaultVal: "/assets/hero_bg.png" },
            { label: "FAQ Page", key: "hero_faq", defaultVal: "/assets/hero_bg.png" },
            { label: "Contact Page", key: "hero_contact", defaultVal: "/assets/hero_bg.png" },
          ].map((page) => {
            const currentVal = getVal(page.key) || page.defaultVal;
            const status = uploadStatus[page.key];
            const isUploading = !!status;

            return (
              <div key={page.key} className="bg-navy border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all">
                <div>
                  <h4 className="font-bold text-white mb-2">{page.label}</h4>
                  <div className="relative h-36 bg-navy-deep rounded-2xl overflow-hidden border border-white/5 group">
                    <img 
                      src={currentVal} 
                      alt={page.label} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-navy/90 flex flex-col items-center justify-center p-4 text-center">
                        <div className="relative flex items-center justify-center mb-2">
                          <Loader2 className="text-accent animate-spin" size={28} />
                          <div className="absolute w-12 h-12 rounded-full border border-accent/20 animate-ping opacity-70"></div>
                        </div>
                        <span className="text-xs font-semibold text-white uppercase tracking-wider animate-pulse">
                          {status === "compressing" && "Optimizing..."}
                          {status === "uploading" && "Uploading..."}
                          {status === "saving" && "Saving..."}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label className={`flex-grow flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Upload size={16} className="text-accent pointer-events-none" />
                    Upload from Device
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleHeroUpload(page.key, e.target.files[0]);
                          e.target.value = "";
                        }
                      }}
                      disabled={isUploading}
                    />
                  </label>
                  {getVal(page.key) && (
                    <button 
                      onClick={() => handleResetHero(page.key)}
                      className="flex items-center justify-center gap-2 sm:p-3 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all hover:scale-105 text-sm font-bold sm:font-normal shrink-0"
                      title="Reset to default"
                    >
                      <X size={16} />
                      <span className="sm:hidden">Reset to default</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
