"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doLogin } from "@/app/actions";
import { X, User, Lock, Loader2, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Jika modal tertutup, jangan render apapun
  if (!isOpen) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.target);
    try {
      const errorMsg = await doLogin(formData);
      if (errorMsg) {
        setError(errorMsg);
        setLoading(false);
      } else {
        // Login Sukses -> Redirect ke Dashboard
        router.push("/admin");
        router.refresh();
      }
    } catch (e) {
      setError("Login Gagal, coba lagi nanti.");
      setLoading(false);
    }
  }

  return (
    // Overlay Container (Z-Index Tinggi)
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop Blur */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        {/* Tombol Close Absolute */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
        >
          <X size={20} />
        </button>

        {/* Header Modal (Dark Theme) */}
        <div className="bg-slate-900 p-8 pt-10 text-center relative overflow-hidden">
          {/* Dekorasi Background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600 rounded-full blur-[60px] opacity-40 -mr-10 -mt-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600 rounded-full blur-[50px] opacity-30 -ml-10 -mb-10"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-indigo-300 mb-4 border border-white/10 shadow-inner backdrop-blur-md">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              Admin Portal
            </h2>
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={10} /> Panitia Only
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl mb-6 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
              <XCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Username */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  placeholder="Masukkan username"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 hover:border-slate-300"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 hover:border-slate-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-4 ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Verifikasi...
                </>
              ) : (
                "Masuk Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper Icon for Error
function XCircle({ size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
