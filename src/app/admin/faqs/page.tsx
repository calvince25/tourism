"use client";

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, HelpCircle, Check, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function FaqsAdminPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "", category: "Booking" });

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faqs");
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch FAQs");
      }
    } catch (error: any) {
      console.error("Fetch FAQs error:", error);
      toast.error(error.message || "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) return;
    const toastId = toast.loading("Adding FAQ...");

    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFaq),
      });
      const data = await res.json();
      if (res.ok) {
        setFaqs([...faqs, data]);
        toast.success("FAQ added successfully", { id: toastId });
        setShowAddForm(false);
        setNewFaq({ question: "", answer: "", category: "Booking" });
      } else {
        throw new Error(data.error || "API failed");
      }
    } catch (error: any) {
      console.error("Add FAQ error:", error);
      toast.error(error.message || "Failed to add FAQ", { id: toastId });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const toastId = toast.loading("Updating status...");
    try {
      const res = await fetch("/api/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setFaqs(faqs.map(f => f.id === id ? { ...f, status: nextStatus } : f));
        toast.success("Status updated", { id: toastId });
      } else {
        throw new Error(data.error || "API failed");
      }
    } catch (error: any) {
      console.error("Toggle FAQ status error:", error);
      toast.error(error.message || "Failed to update status", { id: toastId });
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    const toastId = toast.loading("Deleting FAQ...");
    try {
      const res = await fetch(`/api/faqs?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setFaqs(faqs.filter(f => f.id !== id));
        toast.success("FAQ deleted successfully", { id: toastId });
      } else {
        throw new Error(data.error || "API failed");
      }
    } catch (error: any) {
      console.error("Delete FAQ error:", error);
      toast.error(error.message || "Failed to delete FAQ", { id: toastId });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold font-outfit text-white mb-2">FAQs</h1>
          <p className="text-white/40 text-sm">Manage frequently asked questions for your guests.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-accent text-navy px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          {showAddForm ? "Cancel" : "Add FAQ"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddFaq} className="bg-navy-light/10 border border-white/5 p-8 rounded-3xl space-y-6 max-w-xl">
          <h3 className="text-xl font-bold text-white">New FAQ</h3>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Category</label>
            <select 
              className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
              value={newFaq.category}
              onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
            >
              <option value="Booking">Booking</option>
              <option value="Payment">Payment</option>
              <option value="Visas">Visas & Documents</option>
              <option value="Safety">Safety & Health</option>
              <option value="Planning">Planning & Packing</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Question</label>
            <input 
              type="text" 
              required
              placeholder="e.g. What is the baggage allowance on safari flights?"
              className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Answer</label>
            <textarea 
              required
              placeholder="Provide a clear, detailed answer..."
              className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none h-36 resize-none"
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            />
          </div>
          <button type="submit" className="bg-accent text-navy font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform">
            Save FAQ
          </button>
        </form>
      )}

      <div className="bg-navy-light/20 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/40">
            <tr>
              <th className="px-8 py-6">FAQ Details</th>
              <th className="px-8 py-6">Category</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-white/40">
                  Loading FAQs...
                </td>
              </tr>
            ) : faqs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-white/20 italic">
                  No FAQs found.
                </td>
              </tr>
            ) : (
              faqs.map((faq) => (
                <tr key={faq.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6 max-w-md">
                    <div className="space-y-1">
                      <p className="text-white font-bold text-sm">{faq.question}</p>
                      <p className="text-xs text-white/55 line-clamp-2">{faq.answer}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-semibold text-white/60">{faq.category}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      faq.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {faq.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleToggleStatus(faq.id, faq.status)}
                        className={`p-2 bg-white/5 rounded-lg transition-all ${
                          faq.status === 'ACTIVE' 
                            ? 'text-red-400 hover:bg-red-400/10 hover:text-red-500' 
                            : 'text-green-400 hover:bg-green-400/10 hover:text-green-500'
                        }`}
                        title={faq.status === 'ACTIVE' ? "Deactivate" : "Activate"}
                      >
                        {faq.status === 'ACTIVE' ? <X size={18} /> : <Check size={18} />}
                      </button>
                      <button 
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        title="Delete FAQ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
