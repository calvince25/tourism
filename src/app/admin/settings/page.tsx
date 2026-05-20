"use client";

import { useState, useEffect } from "react";
import { Save, Globe, MessageCircle, Mail, Phone, Share2, Upload, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (res.ok) setSettings(data);
      } catch (error) {
        toast.error("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (key: string, value: string) => {
    setSaving(true);
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
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.media.length > 0) {
        const fileUrl = data.media[0].fileUrl;
        await handleSave(key, fileUrl);
        setSettings(prev => {
          const exists = prev.find(s => s.key === key);
          if (exists) {
            return prev.map(s => s.key === key ? { ...s, value: fileUrl } : s);
          } else {
            return [...prev, { key, value: fileUrl }];
          }
        });
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleResetHero = async (key: string) => {
    if (!confirm("Are you sure you want to reset this hero image to default?")) return;
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
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold font-outfit text-white mb-2">General Settings</h1>
        <p className="text-white/40 text-sm">Configure site-wide information and social links.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Site Config */}
        <div className="bg-navy-light/20 border border-white/5 rounded-[40px] p-10 space-y-8">
          <h3 className="text-xl font-bold font-outfit flex items-center gap-3">
            <Globe className="text-accent" size={24} /> Site Configuration
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Site Name</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-grow bg-navy border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                  value={getVal('site_name')}
                  onChange={(e) => updateLocalVal('site_name', e.target.value)}
                />
                <button 
                  onClick={() => handleSave('site_name', getVal('site_name'))}
                  className="p-3 bg-accent text-navy rounded-xl hover:scale-105 transition-all"
                >
                  <Save size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Site Email</label>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  className="flex-grow bg-navy border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                  value={getVal('site_email')}
                  onChange={(e) => updateLocalVal('site_email', e.target.value)}
                />
                <button 
                  onClick={() => handleSave('site_email', getVal('site_email'))}
                  className="p-3 bg-accent text-navy rounded-xl hover:scale-105 transition-all"
                >
                  <Save size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-navy-light/20 border border-white/5 rounded-[40px] p-10 space-y-8">
          <h3 className="text-xl font-bold font-outfit flex items-center gap-3">
            <Share2 className="text-accent" size={24} /> Social Presence
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">WhatsApp Number</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-grow bg-navy border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                  value={getVal('site_whatsapp')}
                  onChange={(e) => updateLocalVal('site_whatsapp', e.target.value)}
                />
                <button 
                  onClick={() => handleSave('site_whatsapp', getVal('site_whatsapp'))}
                  className="p-3 bg-accent text-navy rounded-xl hover:scale-105 transition-all"
                >
                  <Save size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Instagram URL</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-grow bg-navy border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                  value={getVal('social_instagram')}
                  onChange={(e) => updateLocalVal('social_instagram', e.target.value)}
                />
                <button 
                  onClick={() => handleSave('social_instagram', getVal('social_instagram'))}
                  className="p-3 bg-accent text-navy rounded-xl hover:scale-105 transition-all"
                >
                  <Save size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Hero Images Settings */}
      <div className="bg-navy-light/20 border border-white/5 rounded-[40px] p-10 space-y-8">
        <h3 className="text-xl font-bold font-outfit flex items-center gap-3 text-white">
          <Upload className="text-accent" size={24} /> Page Hero Images
        </h3>
        <p className="text-white/40 text-sm -mt-4">
          Upload custom full-width hero images for each core page. These will display edge-to-edge on the front-end.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "About Page", key: "hero_about", defaultVal: "/assets/hero_bg.png" },
            { label: "Destinations Page", key: "hero_destinations", defaultVal: "/assets/hero_bg.png" },
            { label: "Tours Page", key: "hero_tours", defaultVal: "/assets/hero_bg.png" },
            { label: "Blog Page", key: "hero_blog", defaultVal: "/assets/hero_bg.png" },
            { label: "FAQ Page", key: "hero_faq", defaultVal: "/assets/hero_bg.png" },
            { label: "Contact Page", key: "hero_contact", defaultVal: "/assets/hero_bg.png" },
          ].map((page) => {
            const currentVal = getVal(page.key) || page.defaultVal;
            const isUploading = uploadingKey === page.key;

            return (
              <div key={page.key} className="bg-navy border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all">
                <div>
                  <h4 className="font-bold text-white mb-2">{page.label}</h4>
                  <div className="relative h-36 bg-navy-deep rounded-2xl overflow-hidden border border-white/5 group">
                    <img 
                      src={currentVal} 
                      alt={page.label} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-navy/85 flex flex-col items-center justify-center">
                        <Loader2 className="text-accent animate-spin mb-2" size={24} />
                        <span className="text-xs text-white/60">Uploading...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <label className="flex-grow flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95">
                    <Upload size={16} className="text-accent pointer-events-none" />
                    Upload from Device
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleHeroUpload(page.key, e.target.files[0]);
                        }
                      }}
                      disabled={isUploading}
                    />
                  </label>
                  {getVal(page.key) && (
                    <button 
                      onClick={() => handleResetHero(page.key)}
                      className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all hover:scale-105"
                      title="Reset to default"
                    >
                      <X size={16} />
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
