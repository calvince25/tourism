"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit3, Trash2, Calendar, FileText, Globe } from "lucide-react";
import { toast } from "react-hot-toast";

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch posts");
      }
    } catch (error: any) {
      console.error("Fetch posts error:", error);
      toast.error(error.message || "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const toastId = toast.loading("Deleting post...");
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
        toast.success("Post deleted successfully", { id: toastId });
      } else {
        const data = await res.json();
        throw new Error(data.error || "API failed");
      }
    } catch (error: any) {
      console.error("Delete post error:", error);
      toast.error(error.message || "Failed to delete post", { id: toastId });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold font-outfit text-white mb-2">Safari Blog</h1>
          <p className="text-white/40 text-sm">Manage blog posts, travel guides, and articles.</p>
        </div>
        <Link 
          href="/admin/blog/new"
          className="bg-accent text-navy px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          Write Article
        </Link>
      </div>

      <div className="bg-navy-light/20 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/40">
            <tr>
              <th className="px-8 py-6">Blog Post</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6">Published Date</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-white/40">
                  Loading articles...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-white/20 italic">
                  No articles written yet. Click &quot;Write Article&quot; to get started.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-xl text-accent">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold">{post.title}</p>
                        <p className="text-xs text-white/40">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      post.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/40'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-white/60">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-accent" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft / Unscheduled"}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-accent hover:bg-accent/10 transition-all"
                      >
                        <Edit3 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
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
