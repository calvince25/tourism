"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, Check, X, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      console.warn("DB offline, loading mock reviews.");
      setReviews([
        {
          id: "mock-rev-1",
          travellerName: "Alice Johnson",
          travellerEmail: "alice@example.com",
          travellerCountry: "United Kingdom",
          rating: 5,
          reviewText: "We had a spectacular 7-day tour with WildpathAfrica. The guides were exceptionally knowledgeable, and the camps were highly premium.",
          status: "PENDING",
          featured: false,
          tour: { name: "Classic Kenya Safari Tour" },
          createdAt: new Date().toISOString()
        },
        {
          id: "mock-rev-2",
          travellerName: "Bob Smith",
          travellerEmail: "bob@example.com",
          travellerCountry: "United States",
          rating: 4,
          reviewText: "Overall a very solid trip, saw the Big Five on day three! Highly recommended.",
          status: "APPROVED",
          featured: true,
          destination: { name: "Maasai Mara National Reserve" },
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
        toast.success(`Review status updated to ${newStatus}`);
      } else {
        throw new Error("API failed");
      }
    } catch (error) {
      setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
      toast.success(`Mock: Review status updated to ${newStatus}`);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    const nextFeatured = !currentFeatured;
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, featured: nextFeatured }),
      });
      if (res.ok) {
        setReviews(reviews.map(r => r.id === id ? { ...r, featured: nextFeatured } : r));
        toast.success(nextFeatured ? "Review featured" : "Review un-featured");
      } else {
        throw new Error("API failed");
      }
    } catch (error) {
      setReviews(reviews.map(r => r.id === id ? { ...r, featured: nextFeatured } : r));
      toast.success(nextFeatured ? "Mock: Review featured" : "Mock: Review un-featured");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== id));
        toast.success("Review deleted successfully");
      } else {
        throw new Error("API failed");
      }
    } catch (error) {
      setReviews(reviews.filter(r => r.id !== id));
      toast.success("Mock: Review deleted successfully");
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold font-outfit text-white mb-2">Traveler Reviews</h1>
        <p className="text-white/40 text-sm">Approve, reject, or feature reviews left by your travelers.</p>
      </div>

      <div className="bg-navy-light/20 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/40">
            <tr>
              <th className="px-8 py-6">Traveler</th>
              <th className="px-8 py-6">Review Content</th>
              <th className="px-8 py-6">Target</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-white/40">
                  Loading reviews...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-white/20 italic">
                  No reviews found.
                </td>
              </tr>
            ) : (
              reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-white font-bold">{rev.travellerName}</p>
                      <p className="text-xs text-white/40">{rev.travellerEmail || "No Email"}</p>
                      {rev.travellerCountry && <p className="text-[10px] text-accent font-semibold">{rev.travellerCountry}</p>}
                    </div>
                  </td>
                  <td className="px-8 py-6 max-w-sm">
                    <div className="space-y-2">
                      <div className="flex gap-0.5 text-accent">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            size={14} 
                            fill={idx < rev.rating ? "currentColor" : "transparent"} 
                            className={idx < rev.rating ? "text-accent" : "text-white/10"}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed italic">&quot;{rev.reviewText}&quot;</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs text-white/60">
                      {rev.tour?.name || rev.destination?.name || "General Feedback"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${
                        rev.status === 'APPROVED' 
                          ? 'bg-green-500/10 text-green-400' 
                          : rev.status === 'PENDING' 
                          ? 'bg-yellow-500/10 text-yellow-400' 
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {rev.status}
                      </span>
                      <button 
                        onClick={() => handleToggleFeatured(rev.id, rev.featured)}
                        className={`text-[10px] font-semibold w-fit px-2 py-0.5 rounded border transition-colors ${
                          rev.featured 
                            ? 'bg-accent/10 border-accent/20 text-accent' 
                            : 'bg-white/5 border-white/10 text-white/30 hover:text-white/60'
                        }`}
                      >
                        {rev.featured ? "Featured ★" : "Not Featured"}
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {rev.status !== 'APPROVED' && (
                        <button 
                          onClick={() => handleUpdateStatus(rev.id, 'APPROVED')}
                          className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-400/10 transition-all"
                          title="Approve Review"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      {rev.status !== 'REJECTED' && (
                        <button 
                          onClick={() => handleUpdateStatus(rev.id, 'REJECTED')}
                          className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          title="Reject Review"
                        >
                          <X size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        title="Delete Review"
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
