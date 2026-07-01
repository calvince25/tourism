"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Users,
  MessageCircle,
  CheckCircle,
  Clock,
  Tag,
  MapPin,
  BookOpen,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";

type InquiryItem = {
  type: "BOOKING" | "CONTACT";
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
  // booking-specific
  travelDate: string | null;
  travelersAdults: number | null;
  travelersChildren: number | null;
  budgetRange: string | null;
  specialRequirements: string | null;
  // contact-specific
  message: string | null;
  destinationInterest: string | null;
};

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-accent/10 text-accent",
  CONTACTED: "bg-blue-500/10 text-blue-400",
  READ: "bg-blue-500/10 text-blue-400",
  BOOKED: "bg-green-500/10 text-green-400",
  REPLIED: "bg-green-500/10 text-green-400",
  QUOTED: "bg-purple-500/10 text-purple-400",
  CANCELLED: "bg-red-500/10 text-red-400",
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "BOOKING" | "CONTACT">("ALL");

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      if (res.ok) setInquiries(data);
      else toast.error("Failed to fetch inquiries");
    } catch {
      toast.error("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: string, status: string, type: string) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, type }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status } : i))
        );
        toast.success("Status updated");
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteInquiry = async (id: string, type: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry? This cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/inquiries?id=${id}&type=${type}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        toast.success("Inquiry deleted successfully");
      } else {
        toast.error("Failed to delete inquiry");
      }
    } catch {
      toast.error("Failed to delete inquiry");
    }
  };

  const visible =
    filter === "ALL" ? inquiries : inquiries.filter((i) => i.type === filter);

  const bookingCount = inquiries.filter((i) => i.type === "BOOKING").length;
  const contactCount = inquiries.filter((i) => i.type === "CONTACT").length;
  const newCount = inquiries.filter((i) => i.status === "NEW").length;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-outfit text-white mb-2">
          Inquiries
        </h1>
        <p className="text-white/40 text-sm">
          Manage booking requests and general contact messages in one place.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: inquiries.length, color: "text-white" },
          { label: "Unread / New", value: newCount, color: "text-accent" },
          { label: "Bookings", value: bookingCount, color: "text-amber-400" },
          { label: "Contact Msgs", value: contactCount, color: "text-sky-400" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-navy-light/20 border border-white/5 rounded-2xl px-6 py-5"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">
              {label}
            </p>
            <p className={`text-3xl font-bold font-outfit ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["ALL", "BOOKING", "CONTACT"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              filter === f
                ? "bg-accent text-navy"
                : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
            }`}
          >
            {f === "ALL" ? "All Inquiries" : f === "BOOKING" ? "🗓 Bookings" : "✉️ Messages"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-navy-light/20 border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/40">
              <tr>
                <th className="px-8 py-5">Type</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Details</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-white/20 italic">
                    Loading inquiries…
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-white/20 italic">
                    No inquiries received yet.
                  </td>
                </tr>
              ) : (
                visible.map((inq) => (
                  <tr
                    key={inq.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Type badge */}
                    <td className="px-8 py-5">
                      {inq.type === "BOOKING" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                          <BookOpen size={10} />
                          Booking
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-400/10 text-sky-400 text-[10px] font-bold uppercase tracking-wider">
                          <Mail size={10} />
                          Message
                        </span>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="px-8 py-5">
                      <p className="text-white font-bold">{inq.name}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <Mail size={10} /> {inq.email}
                        </span>
                        {inq.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={10} /> {inq.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Details */}
                    <td className="px-8 py-5 max-w-xs">
                      {inq.type === "BOOKING" ? (
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-white/5 px-2 py-1 rounded-lg text-[10px] font-bold text-white/60 flex items-center gap-1">
                            <Users size={10} />
                            {(inq.travelersAdults ?? 0) + (inq.travelersChildren ?? 0)} Pax
                          </span>
                          <span className="bg-white/5 px-2 py-1 rounded-lg text-[10px] font-bold text-white/60 flex items-center gap-1">
                            <Calendar size={10} />
                            {inq.travelDate
                              ? new Date(inq.travelDate).toLocaleDateString()
                              : "TBD"}
                          </span>
                          {inq.budgetRange && (
                            <span className="bg-white/5 px-2 py-1 rounded-lg text-[10px] font-bold text-white/60 flex items-center gap-1">
                              <Tag size={10} /> {inq.budgetRange}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {inq.destinationInterest && (
                            <p className="flex items-center gap-1 text-[10px] text-accent font-bold">
                              <MapPin size={10} /> {inq.destinationInterest}
                            </p>
                          )}
                          <p className="text-xs text-white/50 leading-snug line-clamp-2">
                            {inq.message}
                          </p>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          STATUS_STYLES[inq.status] ?? "bg-white/5 text-white/40"
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-8 py-5 text-white/40 text-sm whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            updateStatus(
                              inq.id,
                              inq.type === "CONTACT" ? "READ" : "CONTACTED",
                              inq.type
                            )
                          }
                          className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                          title={inq.type === "CONTACT" ? "Mark as Read" : "Mark as Contacted"}
                        >
                          <Clock size={16} />
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(
                              inq.id,
                              inq.type === "CONTACT" ? "REPLIED" : "BOOKED",
                              inq.type
                            )
                          }
                          className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-400/10 transition-all"
                          title={inq.type === "CONTACT" ? "Mark as Replied" : "Mark as Booked"}
                        >
                          <CheckCircle size={16} />
                        </button>
                        {inq.phone && (
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-[#25D366] hover:bg-[#25D366]/10 transition-all"
                            title="WhatsApp Customer"
                          >
                            <MessageCircle size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => deleteInquiry(inq.id, inq.type)}
                          className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all ml-2"
                          title="Delete Inquiry"
                        >
                          <Trash2 size={16} />
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
    </div>
  );
}
