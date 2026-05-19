"use client";

import { useState, useEffect } from "react";
import { Save, Globe, MessageCircle, Mail, Phone, Share2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const getVal = (key: string) => settings.find(s => s.key === key)?.value || "";

  const updateLocalVal = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
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
    </div>
  );
}
