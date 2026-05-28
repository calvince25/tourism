"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface DeleteButtonProps {
  id: string;
  type: "destinations" | "tours";
  name: string;
}

export default function DeleteButton({ id, type, name }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const noun = type === "destinations" ? "destination" : "tour";
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the ${noun} "${name}"?\nThis action cannot be undone and will delete all associated data.`
    );

    if (!isConfirmed) return;

    setIsDeleting(true);
    const toastId = toast.loading(`Deleting ${noun} "${name}"...`);

    try {
      const res = await fetch(`/api/${type}?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`${name} was successfully deleted.`, { id: toastId });
        router.refresh();
      } else {
        const data = await res.json();
        throw new Error(data.error || `Failed to delete ${noun}.`);
      }
    } catch (error: any) {
      console.error(`Error deleting ${noun}:`, error);
      toast.error(error.message || `Failed to delete ${noun}. Please try again.`, {
        id: toastId,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      title={`Delete ${name}`}
      className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
    >
      {isDeleting ? (
        <Loader2 size={18} className="animate-spin text-red-500" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  );
}
