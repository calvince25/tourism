"use client";

import { useState } from "react";
import { X, Calendar, Users, DollarSign, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import Turnstile from "./Turnstile";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourId?: string;
  destinationId?: string;
  itemName: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  tourId,
  destinationId,
  itemName,
}: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    travelDate: "",
    travelersAdults: 1,
    travelersChildren: 0,
    budgetRange: "",
    accommodationPref: "Mid-range",
    specialRequirements: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error("Please enter your name.");
    if (!formData.email.trim()) return toast.error("Please enter your email.");
    if (!turnstileToken) return toast.error("Please complete the spam check.");

    setLoading(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tourId,
          destinationId,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Inquiry submitted successfully! Our agents will contact you shortly.");
        onClose();
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          whatsapp: "",
          travelDate: "",
          travelersAdults: 1,
          travelersChildren: 0,
          budgetRange: "",
          accommodationPref: "Mid-range",
          specialRequirements: "",
        });
      } else {
        toast.error(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy-dark/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-navy-light/90 border border-white/10 rounded-[32px] overflow-hidden max-h-[90vh] flex flex-col shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-navy-dark/40">
          <div>
            <h3 className="text-xl font-bold font-outfit text-white">Request a Quote</h3>
            <p className="text-xs text-white/50">Inquiry for: <span className="text-accent font-bold">{itemName}</span></p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Full Name *</label>
              <input
                type="text"
                required
                className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email Address *</label>
              <input
                type="email"
                required
                className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Phone Number</label>
              <input
                type="tel"
                className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">WhatsApp Number</label>
              <input
                type="tel"
                className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                <Calendar size={12} className="text-accent" /> Travel Date
              </label>
              <input
                type="date"
                className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm appearance-none"
                value={formData.travelDate}
                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                <Users size={12} className="text-accent" /> Adults
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm"
                value={formData.travelersAdults}
                onChange={(e) => setFormData({ ...formData, travelersAdults: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                <Users size={12} className="text-accent" /> Children
              </label>
              <input
                type="number"
                min="0"
                required
                className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm"
                value={formData.travelersChildren}
                onChange={(e) => setFormData({ ...formData, travelersChildren: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                <DollarSign size={12} className="text-accent" /> Budget Range (USD)
              </label>
              <select
                className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm appearance-none"
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
              >
                <option value="">Select budget range...</option>
                <option value="Under $1500">Under $1,500</option>
                <option value="$1500 - $3000">$1,500 - $3,000</option>
                <option value="$3000 - $5000">$3,000 - $5,000</option>
                <option value="$5000+">$5,000+</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Accommodation</label>
              <select
                className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm appearance-none"
                value={formData.accommodationPref}
                onChange={(e) => setFormData({ ...formData, accommodationPref: e.target.value })}
              >
                <option value="Budget">Budget / Camping</option>
                <option value="Mid-range">Mid-range / Tented Camp</option>
                <option value="Luxury">Luxury Lodge</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Special Requirements & Interests</label>
            <textarea
              className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm h-24 resize-none"
              placeholder="E.g. dietary requirements, single room occupancy, targeted wildlife species..."
              value={formData.specialRequirements}
              onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
            />
          </div>

          <Turnstile onVerify={setTurnstileToken} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-navy font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {loading ? "Submitting Inquiry..." : <><Send size={16} /> Send Booking Inquiry</>}
          </button>
        </form>
      </div>
    </div>
  );
}
