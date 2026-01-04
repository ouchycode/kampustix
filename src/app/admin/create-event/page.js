"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UploadCloud,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Type,
  AlignLeft,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { Toaster, toast } from "sonner";

export default function CreateEvent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  // Handler untuk mengolah file gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        // Limit 2MB agar database tidak bengkak
        toast.error("Ukuran gambar terlalu besar! Maksimal 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Untuk pratinjau di UI
        setImageBase64(reader.result); // Data yang akan dikirim ke DB
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target;
    const priceValue = Number(form.price.value);
    const quotaValue = Number(form.quota.value);

    if (priceValue < 0 || quotaValue < 1) {
      toast.error("Harga tidak boleh minus & Kuota minimal 1");
      setIsLoading(false);
      return;
    }

    if (!imageBase64) {
      toast.error("Harap unggah gambar event!");
      setIsLoading(false);
      return;
    }

    const data = {
      title: form.title.value,
      description: form.description.value,
      date: form.date.value,
      location: form.location.value,
      image: imageBase64, // Mengirim string base64
      price: priceValue,
      quota: quotaValue,
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Event Berhasil Dibuat! 🚀");
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1500);
      } else {
        const json = await res.json();
        toast.error(json.message || "Gagal membuat event.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 pb-20 selection:bg-indigo-500 selection:text-white relative overflow-hidden flex justify-center py-12 px-4">
      <Toaster position="top-center" richColors />

      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/60 to-transparent -z-10" />
      <div className="fixed -top-20 -right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -z-10" />
      <div className="fixed top-40 -left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl -z-10" />

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
              <Sparkles size={32} />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
              Buat Event Baru
            </h1>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              Unggah poster terbaik untuk menarik perhatian pendaftar!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Input Judul */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Judul Event
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Type size={18} />
                </div>
                <input
                  name="title"
                  type="text"
                  placeholder="Contoh: Webinar AI Masa Depan"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 hover:border-slate-300"
                  required
                />
              </div>
            </div>

            {/* Input Deskripsi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Deskripsi Lengkap
              </label>
              <div className="relative group">
                <div className="absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <AlignLeft size={18} />
                </div>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Jelaskan detail seru acaranya di sini..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 resize-none hover:border-slate-300"
                  required
                ></textarea>
              </div>
            </div>

            {/* Grid: Harga & Kuota */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Harga Tiket (IDR)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <DollarSign size={18} />
                  </div>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    placeholder="0 = Gratis"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 hover:border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Kuota Peserta
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Users size={18} />
                  </div>
                  <input
                    name="quota"
                    type="number"
                    min="1"
                    placeholder="Contoh: 100"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 hover:border-slate-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Grid: Tanggal & Lokasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Tanggal & Waktu
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Calendar size={18} />
                  </div>
                  <input
                    name="date"
                    type="datetime-local"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 hover:border-slate-300 cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Lokasi
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <MapPin size={18} />
                  </div>
                  <input
                    name="location"
                    type="text"
                    placeholder="Online / Aula Kampus"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 hover:border-slate-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Upload Gambar (Base64) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Banner Event (Gambar)
              </label>

              {!imagePreview ? (
                <div className="relative group">
                  <label className="flex flex-col items-center justify-center w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 hover:border-indigo-400 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-10 h-10 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500 font-medium">
                        Klik untuk unggah poster
                      </p>
                      <p className="text-[10px] text-slate-400">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageBase64("");
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-4 ${
                isLoading
                  ? "bg-slate-400 cursor-not-allowed shadow-none"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <UploadCloud size={20} /> Publish Event Sekarang
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
