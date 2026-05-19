"use client";

import { useState, useRef } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface MediaUploaderProps {
  onUploadComplete?: (media: any[]) => void;
  multiple?: boolean;
}

export default function MediaUploader({ onUploadComplete, multiple = true }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Successfully uploaded ${data.media.length} file(s)`);
        if (onUploadComplete) onUploadComplete(data.media);
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
        multiple={multiple}
        accept="image/*"
        className="hidden"
      />
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-accent/50 hover:bg-white/5 ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        {uploading ? (
          <div className="text-center">
            <Loader2 className="text-accent animate-spin mx-auto mb-4" size={40} />
            <p className="text-white font-bold">Uploading files...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="text-accent" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload from Device</h3>
            <p className="text-white/40 text-sm">Drag and drop images here, or click to browse</p>
          </div>
        )}
      </div>
    </div>
  );
}
