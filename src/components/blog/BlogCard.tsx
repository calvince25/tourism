import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User } from "lucide-react";

export default function BlogCard({ post }: { post: any }) {
  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="group bg-navy-light/20 border border-white/5 rounded-3xl overflow-hidden hover:border-accent/50 transition-all duration-500"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={post.featuredImage?.fileUrl || "/assets/placeholder.png"}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-80" />
        <div className="absolute top-6 left-6">
          <span className="bg-accent text-navy text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
            {post.category || "Safari Guide"}
          </span>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex items-center gap-6 text-xs text-white/40 mb-4 font-medium">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-accent" />
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <User size={14} className="text-accent" />
            {post.author?.name || "Wildpath Editor"}
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-4 font-outfit text-white group-hover:text-accent transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-6">
          {post.excerpt}
        </p>
        
        <div className="pt-6 border-t border-white/5 flex items-center gap-2 text-accent text-sm font-bold">
          Read Full Article <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
