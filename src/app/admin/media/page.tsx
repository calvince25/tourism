"use client";

import { useState, useEffect } from "react";
import MediaUploader from "@/components/admin/MediaUploader";
import Image from "next/image";
import { Trash2, Edit3, ExternalLink, Search } from "lucide-react";
import { toast } from "react-hot-toast";

const categories = ["All", "Hero", "Destinations", "Tours", "Blog", "General"];

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?category=${filter}`);
      const data = await res.json();
      if (res.ok) setMedia(data);
    } catch (error) {
      toast.error("Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [filter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMedia(media.filter(m => m.id !== id));
        toast.success("Image deleted");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const filteredMedia = media.filter(m => 
    m.originalName?.toLowerCase().includes(search.toLowerCase()) || 
    m.altText?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold font-outfit text-white mb-2">Media Library</h1>
          <p className="text-white/40 text-sm">Manage all your uploaded images and assets.</p>
        </div>
      </div>

      <MediaUploader onUploadComplete={() => fetchMedia()} />

      <div className="bg-navy-light/20 border border-white/5 rounded-3xl p-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  filter === cat 
                    ? "bg-accent text-navy" 
                    : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text" 
              placeholder="Search by name..."
              className="w-full bg-navy border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-white focus:border-accent outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-20 text-center text-white/20 italic border border-dashed border-white/10 rounded-2xl">
            No media found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredMedia.map(item => (
              <div key={item.id} className="group relative aspect-square bg-navy-deep rounded-2xl overflow-hidden border border-white/5 hover:border-accent/50 transition-all shadow-xl">
                <Image 
                  src={item.thumbnailUrl || item.fileUrl} 
                  alt={item.altText || ""} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/10 rounded-lg hover:bg-accent hover:text-navy transition-all" title="Edit details">
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-white/10 rounded-lg hover:bg-red-500 transition-all" 
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <a 
                    href={item.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-accent"
                  >
                    View Full <ExternalLink size={10} className="inline ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
