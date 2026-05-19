"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Safari Inquiry",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, this would hit an API route that sends an email
      // and saves to the database. For now, we simulate success.
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "Safari Inquiry", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden text-center">
        <div className="absolute inset-0 bg-navy-dark opacity-60 z-10" />
        <div className="absolute inset-0 bg-[url('/assets/hero-bg.png')] bg-cover bg-center" />
        <div className="container mx-auto px-8 relative z-20">
          <h1 className="text-5xl md:text-7xl font-bold font-outfit mb-6">Contact Us</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Plan your adventure with Kenya&apos;s leading safari experts.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Info Side */}
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-bold font-outfit mb-8">Get in Touch</h2>
                <p className="text-white/60 leading-relaxed text-lg mb-12">
                  Have a question about our tours or want a custom itinerary? Fill out the form or reach us through our official channels.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-navy transition-all shrink-0">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Our Office</h4>
                    <p className="text-white/60">Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-navy transition-all shrink-0">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Phone & WhatsApp</h4>
                    <p className="text-white/60">+254 700 000 000</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-navy transition-all shrink-0">
                    <Mail size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Email Support</h4>
                    <p className="text-white/60">info@wildpathafrica.co.ke</p>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-white/5">
                <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-white/40">Chat with a Specialist</h4>
                <a 
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254704059438"}?text=Hi%20WildpathAfrica!%20I%27d%20like%20to%20chat%20about%20planning%20a%20safari.`}
                  className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
                >
                  <MessageCircle size={24} />
                  Connect via WhatsApp
                </a>
              </div>
            </div>

            {/* Form Side */}
            <div className="bg-navy-light/10 border border-white/5 rounded-[40px] p-10 md:p-16">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Email Address</label>
                    <input 
                      type="email" 
                      required
                      className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Subject</label>
                  <select 
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none appearance-none"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option className="bg-navy text-white" value="Safari Inquiry">Safari Inquiry</option>
                    <option className="bg-navy text-white" value="Beach Holiday">Beach Holiday</option>
                    <option className="bg-navy text-white" value="Custom Itinerary">Custom Itinerary</option>
                    <option className="bg-navy text-white" value="Corporate Travel">Corporate Travel</option>
                    <option className="bg-navy text-white" value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Message</label>
                  <textarea 
                    required
                    className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none h-40 resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-navy font-bold py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? "Sending..." : <><Send size={20} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
