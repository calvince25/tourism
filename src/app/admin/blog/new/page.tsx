"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { compressImage } from "@/lib/image";

export default function NewBlogPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    status: "DRAFT",
  });

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset so the same file can be re-selected after removal
    e.target.value = "";

    const toastId = toast.loading("Optimizing & uploading cover image...");
    try {
      const compressed = await compressImage(file);
      const uploadData = new FormData();
      uploadData.append("files", compressed);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();

      if (res.ok) {
        const mediaFile = data.media?.[0];
        if (mediaFile) {
          setFeaturedImageId(mediaFile.id);
          setCoverPreview(mediaFile.fileUrl);
          toast.success("Cover image uploaded!", { id: toastId });
        } else {
          throw new Error("No media returned from upload");
        }
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      console.error("Cover upload error:", error);
      toast.error(error.message || "Failed to upload cover image", { id: toastId });
    }
  };

  const removeCover = () => {
    setFeaturedImageId(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const savePost = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Title and Content are required.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Saving blog post...");

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, featuredImageId }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Blog post saved successfully!", { id: toastId });
        router.push("/admin/blog");
      } else {
        throw new Error(data.error || "API failed");
      }
    } catch (error: any) {
      console.error("Save blog post error:", error);
      toast.error(error.message || "Failed to save blog post", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePost();
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold font-outfit text-white mb-2">Write Article</h1>
            <p className="text-white/40 text-sm">Create and publish a new professional story.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={savePost}
          disabled={loading}
          className="bg-accent text-navy px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
        >
          <Save size={20} />
          {loading ? "Saving…" : "Save Article"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Fields */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-navy-light/10 border border-white/5 p-8 rounded-3xl space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Article Title</label>
              <input 
                type="text" 
                required
                placeholder="e.g. 10 Days in the Serengeti: A Complete Guide"
                className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none text-xl font-semibold"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Excerpt / Short Description</label>
              <textarea 
                required
                placeholder="Brief summary of the article to capture readers' attention on list pages..."
                className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none h-28 resize-none text-sm leading-relaxed"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-2">Article Body</label>
            <RichTextEditor 
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          {/* Status Settings */}
          <div className="bg-navy-light/10 border border-white/5 p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold">Publishing Settings</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Status</label>
              <select 
                className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="bg-navy-light/10 border border-white/5 p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold">Cover Image</h3>
            
            {coverPreview ? (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 group bg-navy-deep">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/10 text-white hover:bg-accent hover:text-navy px-5 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={removeCover}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-accent/40 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-white/[0.01] hover:bg-white/[0.02]"
              >
                <Upload size={32} className="mx-auto text-white/20 mb-4" />
                <span className="block text-xs font-bold text-white/60 mb-1">Click to Upload Cover Image</span>
                <span className="block text-[10px] text-white/30">Supports WEBP, JPG, PNG</span>
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleCoverUpload} 
              className="hidden" 
              accept="image/*"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
