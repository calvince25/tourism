"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import { useRef } from "react";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Heading1, 
  Heading2,
  Heading3,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "react-hot-toast";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor, onAddImage }: { editor: any; onAddImage: () => void }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-navy border-b border-white/5 rounded-t-xl sticky top-0 z-10">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive("bold") ? "text-accent bg-accent/10" : "text-white/40"}`}
        type="button"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive("italic") ? "text-accent bg-accent/10" : "text-white/40"}`}
        type="button"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive("heading", { level: 1 }) ? "text-accent bg-accent/10" : "text-white/40"}`}
        type="button"
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive("heading", { level: 2 }) ? "text-accent bg-accent/10" : "text-white/40"}`}
        type="button"
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive("heading", { level: 3 }) ? "text-accent bg-accent/10" : "text-white/40"}`}
        type="button"
      >
        <Heading3 size={18} />
      </button>
      
      <div className="w-px h-6 bg-white/10 mx-2 self-center" />

      <button
        onClick={onAddImage}
        className="p-2 rounded hover:bg-white/10 text-white/40"
        type="button"
        title="Insert Image"
      >
        <ImageIcon size={18} />
      </button>

      <div className="w-px h-6 bg-white/10 mx-2 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive("bulletList") ? "text-accent bg-accent/10" : "text-white/40"}`}
        type="button"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive("orderedList") ? "text-accent bg-accent/10" : "text-white/40"}`}
        type="button"
      >
        <ListOrdered size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive("blockquote") ? "text-accent bg-accent/10" : "text-white/40"}`}
        type="button"
      >
        <Quote size={18} />
      </button>
      <div className="w-px h-6 bg-white/10 mx-2 self-center" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-white/10 text-white/40"
        type="button"
      >
        <Undo size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-white/10 text-white/40"
        type="button"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        allowBase64: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none p-6 min-h-[300px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading image...");
    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedImageUrl = data.media[0]?.fileUrl;
        if (uploadedImageUrl && editor) {
          editor.chain().focus().setImage({ src: uploadedImageUrl }).run();
          toast.success("Image uploaded & inserted", { id: toastId });
        } else {
          throw new Error("Invalid response");
        }
      } else {
        throw new Error("Upload API failed");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image. Please try again.", { id: toastId });
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerImageSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden focus-within:border-accent/50 transition-colors bg-navy-deep/30">
      <MenuBar editor={editor} onAddImage={triggerImageSelect} />
      <EditorContent editor={editor} />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
}
