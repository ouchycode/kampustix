"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DeleteButton({ eventId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Konfirmasi Browser (Bisa diganti modal kalau mau lebih fancy, tapi ini cukup)
    if (!confirm("Yakin mau hapus? Data peserta juga bakal ilang loh! 😱"))
      return;

    setIsDeleting(true);

    // Promise Toast untuk feedback real-time
    const promise = fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    }).then(async (res) => {
      if (!res.ok) throw new Error("Gagal menghapus");
      return res.json();
    });

    toast.promise(promise, {
      loading: "Menghapus event...",
      success: () => {
        router.refresh(); // Refresh data dashboard
        return "Event berhasil dihapus! 👋";
      },
      error: "Gagal menghapus event.",
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      title="Hapus Event"
      className="w-full h-full flex items-center justify-center transition-all text-slate-500 hover:text-rose-600 disabled:cursor-not-allowed"
    >
      {isDeleting ? (
        <Loader2 size={18} className="animate-spin text-rose-500" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  );
}
