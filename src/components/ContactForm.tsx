"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "react-hot-toast";
import Turnstile from "@/components/shared/Turnstile";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Safari Inquiry",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim()) {
      return toast.error("Please enter your name.");
    }
    if (!formData.email.trim()) {
      return toast.error("Please enter your email.");
    }
    if (!formData.message.trim()) {
      return toast.error("Please enter your message.");
    }
    if (!turnstileToken) {
      return toast.error("Please complete the Turnstile spam protection check.");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "Safari Inquiry",
          message: "",
        });
      } else {
        toast.error(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-navy-light/10 border border-white/5 rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 md:p-16">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">
              Subject
            </label>
            <select
              className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none appearance-none"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            >
              <option className="bg-navy text-white" value="Safari Inquiry">
                Safari Inquiry
              </option>
              <option className="bg-navy text-white" value="Beach Holiday">
                Beach Holiday
              </option>
              <option className="bg-navy text-white" value="Custom Itinerary">
                Custom Itinerary
              </option>
              <option className="bg-navy text-white" value="Corporate Travel">
                Corporate Travel
              </option>
              <option className="bg-navy text-white" value="Other">
                Other
              </option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">
            Message
          </label>
          <textarea
            required
            className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none h-40 resize-none"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <Turnstile onVerify={(token) => setTurnstileToken(token)} />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-navy font-bold py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? "Sending..." : <><Send size={20} /> Send Message</>}
        </button>
      </form>
    </div>
  );
}
