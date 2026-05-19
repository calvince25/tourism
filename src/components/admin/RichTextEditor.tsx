"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Heading1, 
  Heading2 
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
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
  const editor = useEditor({
    extensions: [StarterKit],
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

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden focus-within:border-accent/50 transition-colors bg-navy-deep/30">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
