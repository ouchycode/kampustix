"use client";

import Link from "next/link";
import {
  Ticket,
  Target,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 pb-20 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* === BACKGROUND DECORATION === */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px]" />
        <div className="absolute top-40 -left-20 w-[300px] h-[300px] bg-blue-200/20 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-32 md:pt-40">
        {/* === HERO SECTION === */}
        <div className="text-center mb-20 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-[10px] font-bold tracking-widest uppercase shadow-sm mb-6">
            <Sparkles size={12} />
            <span>Tentang KampusTix</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
            Mendigitalkan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Pengalaman Event
            </span>{" "}
            Mahasiswa.
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            KampusTix hadir sebagai solusi cerdas untuk manajemen event kampus
            yang modern, cepat, dan transparan bagi penyelenggara maupun
            peserta.
          </p>
        </div>

        {/* === MAIN CONTENT (BENTO GRID STYLE) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {/* Card: Misi */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-4 animate-fade-in-up">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Misi Kami</h3>
            <p className="text-slate-500 leading-relaxed">
              Mempermudah akses informasi event kampus dan meniadakan proses
              pendaftaran manual yang merepotkan melalui sistem ticketing
              digital yang terintegrasi.
            </p>
          </div>

          {/* Card: Visi */}
          <div
            className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col gap-4 relative overflow-hidden animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10" />
            <div className="w-12 h-12 bg-white/10 text-indigo-300 rounded-2xl flex items-center justify-center border border-white/10">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-bold">Visi Kami</h3>
            <p className="text-slate-300 leading-relaxed">
              Menjadi platform ekosistem event mahasiswa terbesar di Indonesia
              yang mendukung kolaborasi kreatif dan pertumbuhan komunitas
              kampus.
            </p>
          </div>
        </div>

        {/* === KENAPA MEMILIH KAMI? === */}
        <div className="space-y-12 mb-20">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900">
              Mengapa KampusTix?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform text-indigo-600">
                <ShieldCheck size={32} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">
                Keamanan Terjamin
              </h4>
              <p className="text-sm text-slate-500 px-4">
                Sistem pembayaran otomatis yang aman melalui Midtrans Gateway.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform text-indigo-600">
                <Users size={32} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Mudah Digunakan</h4>
              <p className="text-sm text-slate-500 px-4">
                User interface yang intuitif untuk admin maupun pendaftar.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform text-indigo-600">
                <Ticket size={32} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">E-Ticket Instan</h4>
              <p className="text-sm text-slate-500 px-4">
                Dapatkan e-ticket QR Code secara instan setelah pembayaran
                sukses.
              </p>
            </div>
          </div>
        </div>

        {/* === CTA SECTION === */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <h2 className="text-3xl md:text-4xl font-black mb-6 relative z-10">
            Siap Membuat Event Pertamamu?
          </h2>
          <p className="text-indigo-100 mb-10 max-w-lg mx-auto relative z-10">
            Bergabunglah dengan puluhan organisasi mahasiswa lainnya dan buat
            manajemen acaramu jadi lebih profesional.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link
              href="/admin/create-event"
              className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold shadow-xl hover:bg-slate-50 transition-all flex items-center gap-2 group"
            >
              Mulai Sekarang{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-indigo-500/20 border border-white/30 backdrop-blur-md text-white rounded-full font-bold hover:bg-white/10 transition-all"
            >
              Jelajahi Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
