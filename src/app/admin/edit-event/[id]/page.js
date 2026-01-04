"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Type,
  DollarSign,
  Users,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Save,
  X,
  Loader2,
  PencilLine,
  UploadCloud,
} from "lucide-react";
import { Toaster, toast } from "sonner";

export default function EditEventPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: "",
    price: 0,
    quota: 0,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // ✅ PERBAIKAN: Fetch langsung ke ID spesifik, bukan fetch all lalu find
        // Ini memastikan kita dapat data Price & Quota yang benar dari DB
        const res = await fetch(`/api/events/${id}`, { cache: "no-store" });
        const json = await res.json();

        if (!res.ok) {
          toast.error(json.message || "Event tidak ditemukan");
          router.push("/admin");
          return;
        }

        const event = json.data;

        // Format tanggal
        let formattedDate = "";
        if (event.date) {
          const dateObj = new Date(event.date);
          dateObj.setMinutes(
            dateObj.getMinutes() - dateObj.getTimezoneOffset()
          );
          formattedDate = dateObj.toISOString().slice(0, 16);
        }

        setFormData({
          title: event.title || "",
          description: event.description || "",
          date: formattedDate,
          location: event.location || "",
          image: event.image || "",
          // ✅ Pastikan value tidak undefined agar React tidak komplain uncontrolled input
          price: event.price !== undefined ? event.price : 0,
          quota: event.quota !== undefined ? event.quota : 0,
        });

        setImagePreview(event.image || null);
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Gagal mengambil data event");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id, router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        // 2MB
        toast.error("Ukuran gambar terlalu besar! Maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // ✅ Payload bersih: Konversi angka di sini
      const payload = {
        ...formData,
        price: Number(formData.price),
        quota: Number(formData.quota),
      };

      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Event Berhasil Diupdate! 🎉");
        router.refresh(); // Refresh cache Next.js
        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Gagal update event.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FC] gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">
          Memuat data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 pb-20 relative overflow-hidden flex justify-center py-12 px-4">
      <Toaster position="top-center" richColors />

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/60 to-transparent -z-10" />

      <div className="w-full max-w-2xl animate-fade-in-up mt-20">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-6 transition-colors group"
        >
          <div className="p-1 rounded-full bg-white border border-slate-200 group-hover:border-indigo-200 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Batal & Kembali
        </Link>

        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-slate-100 relative overflow-hidden">
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <PencilLine size={32} />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2 text-center">
              Edit Event
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* INPUTS */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Judul Event
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Type size={18} />
                </div>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Harga Tiket (IDR)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <DollarSign size={18} />
                  </div>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Total Kuota
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Users size={18} />
                  </div>
                  <input
                    name="quota"
                    type="number"
                    min="1"
                    value={formData.quota}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Tanggal & Waktu
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Calendar size={18} />
                  </div>
                  <input
                    name="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Lokasi
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Banner Event
              </label>
              <div className="relative rounded-xl overflow-hidden border border-slate-200 group/img">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400">
                    <ImageIcon size={48} />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
                  <UploadCloud size={32} className="mb-2" />
                  <span className="text-xs font-bold">
                    Klik untuk Ganti Gambar
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-100">
              <Link
                href="/admin"
                className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 active:scale-95"
              >
                <X size={18} /> Batal
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isSaving
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 shadow-lg"
                }`}
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}{" "}
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
