"use client";

import Link from "next/link";
import {
  Search,
  MapPin,
  Calendar,
  Ticket,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function HomeClientView({
  initialEvents = [],
  initialQuery = "",
}) {
  // ✅ 1. FORMAT HARGA ROBUST
  // Menangani angka, string, nol, dan null agar tidak error
  const formatPrice = (price) => {
    // Paksa ubah ke number dulu
    const numPrice = Number(price);

    // Cek jika NaN atau 0 atau negatif
    if (isNaN(numPrice) || numPrice === 0) return "Free";

    // Format "K" (Ribuan)
    if (numPrice >= 1000) {
      // Hilangkan desimal berlebih, misal 50.5K
      return `IDR ${(numPrice / 1000).toLocaleString("id-ID", {
        maximumFractionDigits: 1,
      })}K`;
    }

    // Jika harga di bawah 1000 perak (jarang, tapi buat jaga-jaga)
    return `IDR ${numPrice.toLocaleString("id-ID")}`;
  };

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* === BACKGROUND DECORATION === */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50/80 to-transparent" />
        <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 pt-28 md:pt-32">
        {/* === HERO SECTION === */}
        <div className="flex flex-col items-center text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-[11px] font-bold tracking-wider shadow-sm mb-4 hover:shadow-md transition-all cursor-default uppercase">
            <Sparkles size={12} />
            <span>Kampus Vibes Only</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-3 leading-tight">
            Cari Event Seru <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Di Kampusmu
            </span>
          </h1>

          <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-8">
            Seminar, Workshop, Konser, atau Lomba? Temukan semuanya di sini.
            Langsung gas tanpa ribet!
          </p>

          <form
            action="/"
            method="GET"
            className="relative w-full max-w-md group z-10"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Search size={18} />
            </div>
            <input
              name="q"
              type="text"
              // Pastikan nilai default sinkron dengan URL
              defaultValue={initialQuery}
              placeholder="Cari event (ex: Webinar, Musik)..."
              className="w-full pl-11 pr-12 py-3 rounded-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-lg shadow-slate-200/50 text-slate-700 text-sm font-medium placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-transform active:scale-95 shadow-sm"
            >
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* === GRID DAFTAR EVENT === */}
        {initialEvents && initialEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialEvents.map((evt, index) => {
              // ✅ 2. KALKULASI SINKRON & AMAN
              // Paksa convert ke Number untuk mencegah operasi matematika string
              const quota = Number(evt.quota) || 0;
              // Jika registrantsCount belum ada di DB, anggap 0
              const registered = evt.registrantsCount
                ? Number(evt.registrantsCount)
                : 0;

              // Pastikan sisa tidak pernah minus (Math.max)
              const remaining = Math.max(0, quota - registered);
              const isSoldOut = remaining === 0;

              return (
                <Link
                  href={`/event/${evt._id}`}
                  key={evt._id}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={
                        evt.image ||
                        "https://via.placeholder.com/800x400?text=No+Image"
                      }
                      alt={evt.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                    {/* Badge Status */}
                    <div
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${
                        isSoldOut
                          ? "bg-rose-500 text-white"
                          : "bg-emerald-500 text-white"
                      }`}
                    >
                      {isSoldOut ? "Sold Out" : "Open"}
                    </div>

                    {/* Badge Harga */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                      <Ticket size={14} className="text-indigo-600" />
                      {formatPrice(evt.price)}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mb-2">
                      <div className="flex items-center gap-1.5 text-indigo-600">
                        <Calendar size={14} />
                        {evt.date
                          ? new Date(evt.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Tanggal TBD"}
                      </div>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <div className="flex items-center gap-1.5 truncate max-w-[120px]">
                        <MapPin size={14} />
                        <span className="truncate">
                          {evt.location || "Online"}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {evt.title}
                    </h2>

                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {evt.description ||
                        "Simak detail lengkap acara ini segera."}
                    </p>

                    {/* Footer Slot */}
                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span
                        className={`text-xs font-medium ${
                          isSoldOut
                            ? "text-rose-500 font-bold"
                            : "text-slate-500"
                        }`}
                      >
                        {isSoldOut ? "Tiket Habis" : `Sisa ${remaining} Slot`}
                      </span>

                      <span className="text-indigo-600 text-xs font-bold flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Lihat Detail <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 animate-fade-in-up">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
              <Search size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Tidak ada event ditemukan
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
              Coba cari dengan kata kunci lain atau reset filter.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
