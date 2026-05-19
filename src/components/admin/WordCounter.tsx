"use client";

import { useMemo } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface WordCounterProps {
  content: string;
  target?: number;
}

export default function WordCounter({ content, target = 1200 }: WordCounterProps) {
  const wordCount = useMemo(() => {
    if (!content) return 0;
    // Remove HTML tags and count words
    const plainText = content.replace(/<[^>]*>/g, " ");
    return plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, [content]);

  const isComplete = wordCount >= target;

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
      isComplete 
        ? "bg-green-500/10 text-green-400 border border-green-500/20" 
        : "bg-red-500/10 text-red-400 border border-red-500/20"
    }`}>
      {isComplete ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
      <span>{wordCount.toLocaleString()} / {target.toLocaleString()} Words</span>
      {isComplete ? " ✅" : " ⚠️ Content too short for SEO"}
    </div>
  );
}
