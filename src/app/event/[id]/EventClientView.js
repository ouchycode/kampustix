"use client";

import Link from "next/link";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Share2,
  Users,
  Clock,
  Info,
  CheckCircle,
  Sparkles,
  TicketPercent,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import RegistrationForm from "./RegistrationForm";

export default function EventClientView({ event, isSoldOut, remaining }) {
  // --- 1. Format Data ---
  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate
    .toLocaleDateString("id-ID", { month: "short" })
    .toUpperCase();
  const fullDate = eventDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const time = eventDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // --- 2. Share Function ---
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link tersalin! Siap dibagikan ke bestie 🚀");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 pb-20 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      <Toaster position="top-center" richColors />

      {/* === BACKGROUND AMBIENCE (Senada dengan Home) === */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px]" />
        <div className="absolute top-40 -left-20 w-[300px] h-[300px] bg-blue-200/20 rounded-full blur-[80px]" />
      </div>

      {/* === MAIN CONTAINER === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 md:pt-32">
        {/* === TOP NAVIGATION === */}
        <div className="flex justify-between items-center mb-8 animate-fade-in-down">
          <Link
            href="/"
            className="group flex items-center gap-3 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
          >
            <div className="p-2.5 bg-white border border-slate-200 rounded-full group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all shadow-sm">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm">Kembali</span>
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Bagikan</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* === KOLOM KIRI: CONTENT (8 Cols) === */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. HERO IMAGE CARD */}
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-white bg-slate-200 animate-fade-in-up">
              <img
                src={event.image || "https://via.placeholder.com/800x400"}
                alt={event.title}
                className="w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-5 left-5 md:top-6 md:left-6">
                {isSoldOut ? (
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-rose-500 text-white shadow-lg shadow-rose-500/20 border border-rose-400 backdrop-blur-md flex items-center gap-1.5">
                    <TicketPercent size={14} /> SOLD OUT
                  </span>
                ) : (
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400 backdrop-blur-md flex items-center gap-1.5">
                    <Sparkles size={14} /> OPEN REGISTRATION
                  </span>
                )}
              </div>

              {/* Title & Location Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3 drop-shadow-md">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-white/90">
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                    <MapPin size={16} className="text-indigo-300" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                    <Calendar size={16} className="text-indigo-300" />
                    {fullDate}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. INFO GRID (Bento Style) */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              {/* Card Waktu */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                <div className="bg-indigo-50 text-indigo-600 w-14 h-14 rounded-xl flex flex-col items-center justify-center border border-indigo-100 shrink-0">
                  <span className="text-[10px] font-bold uppercase">
                    {month}
                  </span>
                  <span className="text-xl font-black leading-none">{day}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                    Waktu Acara
                  </p>
                  <p className="text-slate-800 font-bold text-lg flex items-center gap-2">
                    {time} WIB
                  </p>
                </div>
              </div>

              {/* Card Kuota */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center border shrink-0 ${
                    isSoldOut
                      ? "bg-rose-50 text-rose-500 border-rose-100"
                      : "bg-emerald-50 text-emerald-500 border-emerald-100"
                  }`}
                >
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                    Sisa Kuota
                  </p>
                  <p
                    className={`font-bold text-lg ${
                      isSoldOut ? "text-rose-600" : "text-slate-800"
                    }`}
                  >
                    {isSoldOut ? "Full Booked" : `${remaining} Seats`}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. DESKRIPSI EVENT */}
            <div
              className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              {/* Dekorasi Background Tipis */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10" />

              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Info size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Detail Acara
                </h3>
              </div>
              <article className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
                <div className="whitespace-pre-line text-justify">
                  {event.description}
                </div>
              </article>
            </div>
          </div>

          {/* === KOLOM KANAN: SIDEBAR FORM (Sticky) (4 Cols) === */}
          <div
            className="lg:col-span-4 relative animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            <div className="sticky top-32 space-y-6">
              {/* CARD UTAMA: HARGA & FORM */}
              <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-slate-100 overflow-hidden relative z-10">
                {/* Header Harga */}
                <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-3xl opacity-30"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                  <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <TicketPercent size={12} /> Harga Tiket
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-medium text-slate-400">
                      IDR
                    </span>
                    <span className="text-4xl font-black tracking-tight">
                      {event.price === 0
                        ? "FREE"
                        : (event.price / 1000).toLocaleString("id-ID") + "K"}
                    </span>
                  </div>
                </div>

                {/* Form Wrapper */}
                <div className="p-6">
                  <RegistrationForm
                    eventId={event._id}
                    price={event.price}
                    eventTitle={event.title}
                    isSoldOut={isSoldOut}
                  />

                  {/* Trust Badges */}
                  <div className="mt-6 pt-5 border-t border-dashed border-slate-200">
                    <ul className="space-y-2.5">
                      <li className="flex items-center gap-2.5 text-xs font-medium text-slate-500">
                        <CheckCircle
                          size={14}
                          className="text-emerald-500 shrink-0"
                        />
                        <span>E-Ticket dikirim otomatis ke Email</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-xs font-medium text-slate-500">
                        <CheckCircle
                          size={14}
                          className="text-emerald-500 shrink-0"
                        />
                        <span>Data aman & terenkripsi</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Banner Info */}
              {!isSoldOut && (
                <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 p-4 rounded-2xl flex gap-3 items-start shadow-sm">
                  <div className="mt-0.5 bg-white p-1.5 rounded-full shadow-sm text-indigo-600 shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-indigo-900">
                      Segera Amankan Tiketmu!
                    </p>
                    <p className="text-xs text-indigo-700/80 mt-1 leading-snug">
                      Kuota menipis. Jangan sampai menyesal karena kehabisan
                      slot, bestie!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
