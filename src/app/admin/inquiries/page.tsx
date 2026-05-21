"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, Users, MessageCircle, MoreVertical, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      if (res.ok) setInquiries(data);
    } catch (error) {
      toast.error("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
        toast.success("Status updated");
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-outfit text-white mb-2">Booking Inquiries</h1>
        <p className="text-white/40 text-sm">Manage client requests and safari bookings.</p>
      </div>

      <div className="bg-navy-light/20 border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/40">
            <tr>
              <th className="px-8 py-6">Customer</th>
              <th className="px-8 py-6">Details</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6">Date Received</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {inquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div>
                    <p className="text-white font-bold">{inq.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-white/40">
                      <span className="flex items-center gap-1"><Mail size={12} /> {inq.email}</span>
                      <span className="flex items-center gap-1"><Phone size={12} /> {inq.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-white/5 px-2 py-1 rounded-lg text-[10px] font-bold text-white/60 flex items-center gap-1">
                      <Users size={10} /> {inq.travelersAdults + inq.travelersChildren} Pax
                    </span>
                    <span className="bg-white/5 px-2 py-1 rounded-lg text-[10px] font-bold text-white/60 flex items-center gap-1">
                      <Calendar size={10} /> {inq.travelDate ? new Date(inq.travelDate).toLocaleDateString() : 'TBD'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    inq.status === 'NEW' ? 'bg-accent/10 text-accent' : 
                    inq.status === 'CONTACTED' ? 'bg-blue-500/10 text-blue-400' :
                    inq.status === 'BOOKED' ? 'bg-green-500/10 text-green-400' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {inq.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-white/40 text-sm">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => updateStatus(inq.id, 'CONTACTED')}
                      className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                      title="Mark as Contacted"
                    >
                      <Clock size={18} />
                    </button>
                    <button 
                      onClick={() => updateStatus(inq.id, 'BOOKED')}
                      className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-400/10 transition-all"
                      title="Mark as Booked"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <a 
                      href={`https://wa.me/${inq.phone?.replace(/[^0-9]/g, '')}`} 
                      target="_blank"
                      className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-[#25D366] hover:bg-[#25D366]/10 transition-all"
                      title="WhatsApp Customer"
                    >
                      <MessageCircle size={18} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-white/20 italic">
                  No inquiries received yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
