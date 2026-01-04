"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Mail,
  Ticket,
  ShieldCheck,
  CreditCard,
  UserCheck,
} from "lucide-react";

export default function HelpCenter() {
  const [activeTab, setActiveTab] = useState("umum");
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "umum",
      question: "Apa itu KampusTix?",
      answer:
        "KampusTix adalah platform manajemen event khusus mahasiswa untuk mempermudah pendaftaran, pembayaran, hingga sistem check-in peserta menggunakan QR Code secara digital.",
    },
    {
      category: "pembayaran",
      question: "Bagaimana cara melakukan pembayaran?",
      answer:
        "Pembayaran dapat dilakukan melalui berbagai kanal seperti E-Wallet (Gopay/OVO), Transfer Bank (VA), maupun QRIS yang tersedia saat Anda mengklik tombol beli tiket.",
    },
    {
      category: "tiket",
      question: "Tiket saya belum masuk ke email, apa yang harus dilakukan?",
      answer:
        "Pastikan Anda mengecek folder Spam. Jika dalam 1x24 jam tiket belum diterima, silakan hubungi panitia event atau gunakan fitur bantuan dengan melampirkan bukti bayar.",
    },
    {
      category: "umum",
      question: "Apakah KampusTix gratis untuk penyelenggara?",
      answer:
        "Kami menyediakan paket dasar gratis untuk organisasi mahasiswa. Untuk fitur premium seperti ekspor data massal dan analitik mendalam, silakan hubungi tim sales kami.",
    },
    {
      category: "akun",
      question: "Bagaimana cara menjadi admin event?",
      answer:
        "Anda dapat menghubungi administrator kampus Anda untuk mendapatkan akses akun panitia atau mendaftar melalui formulir pengajuan pengurus acara di halaman utama.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeTab === "semua" || faq.category === activeTab)
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 pb-20 relative overflow-hidden">
      {/* === BACKGROUND DECORATION === */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/60 to-transparent" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200/20 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-32 md:pt-40">
        {/* === HEADER SECTION === */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Pusat <span className="text-indigo-600">Bantuan</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Temukan jawaban untuk pertanyaan Anda seputar penggunaan platform
            KampusTix.
          </p>
        </div>

        {/* === SEARCH BAR === */}
        <div className="relative max-w-2xl mx-auto mb-12 animate-fade-in-up">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Cari pertanyaan... (cth: Pembayaran)"
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-indigo-100/50 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* === CATEGORY TABS === */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-in-up">
          {["semua", "umum", "pembayaran", "tiket", "akun"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                activeTab === cat
                  ? "bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-200"
                  : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* === FAQ LIST (ACCORDION) === */}
        <div className="space-y-4 mb-20 animate-fade-in-up">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white border border-slate-100 rounded-[1.5rem] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none outline-none">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                      <HelpCircle size={18} />
                    </div>
                    <span className="font-bold text-slate-800">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={20}
                    className="text-slate-400 group-open:rotate-180 transition-transform"
                  />
                </summary>
                <div className="px-6 pb-6 pt-0 ml-12 text-slate-500 leading-relaxed text-sm">
                  {faq.answer}
                </div>
              </details>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">
                Pertanyaan tidak ditemukan...
              </p>
            </div>
          )}
        </div>

        {/* === CONTACT CARDS === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-indigo-200 transition-colors group">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageCircle size={28} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Hubungi WhatsApp</h4>
              <p className="text-xs text-slate-500">Respon cepat (Jam Kerja)</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-purple-200 transition-colors group">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail size={28} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Kirim Email</h4>
              <p className="text-xs text-slate-500">support@kampustix.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
