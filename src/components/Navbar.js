"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Lock,
  Ticket,
  LayoutDashboard,
  LogOut,
  Info,
  HelpCircle,
} from "lucide-react";

// Components & Actions
import LoginModal from "@/components/LoginModal";
import { handleLogout } from "@/app/actions";

export default function Navbar({ isLoggedIn }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efek Scroll untuk Glassmorphism
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi Logout Sempurna
  const onLogout = async () => {
    const toastId = toast.loading("Menghapus sesi...");

    try {
      const result = await handleLogout();

      if (result?.success) {
        toast.success("Berhasil Logout 👋", { id: toastId });

        // Delay 1 detik agar user sempat melihat pesan sukses
        setTimeout(() => {
          // Paksa reload penuh ke homepage agar cookies benar-benar bersih di semua state
          window.location.href = "/";
        }, 1000);
      }
    } catch (error) {
      toast.error("Gagal logout, silakan coba lagi.", { id: toastId });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-3"
            : "bg-transparent border-b border-transparent py-4 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* --- 1. LOGO & MAIN LINKS --- */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                <Ticket size={22} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-none">
                  Kampus<span className="text-indigo-600">Tix</span>
                </span>
                <span className="hidden sm:block text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
                  Event Mahasiswa
                </span>
              </div>
            </Link>

            {/* Navigasi Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/about"
                className={`text-sm font-bold transition-colors hover:text-indigo-600 ${
                  isScrolled ? "text-slate-600" : "text-slate-700"
                }`}
              >
                About
              </Link>
              <Link
                href="/help"
                className={`text-sm font-bold transition-colors hover:text-indigo-600 ${
                  isScrolled ? "text-slate-600" : "text-slate-700"
                }`}
              >
                Bantuan
              </Link>
            </nav>
          </div>

          {/* --- 2. ACTION BUTTONS --- */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Nav Icons (About & Help) */}
            <div className="flex md:hidden items-center gap-1">
              <Link
                href="/about"
                title="About"
                className={`p-2 rounded-full transition-all ${
                  isScrolled
                    ? "text-slate-600 hover:bg-slate-100"
                    : "text-slate-700 hover:bg-white/40"
                }`}
              >
                <Info size={20} />
              </Link>
              <Link
                href="/help"
                title="Pusat Bantuan"
                className={`p-2 rounded-full transition-all ${
                  isScrolled
                    ? "text-slate-600 hover:bg-slate-100"
                    : "text-slate-700 hover:bg-white/40"
                }`}
              >
                <HelpCircle size={20} />
              </Link>
            </div>

            {isLoggedIn ? (
              <>
                <Link
                  href="/admin"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                    isScrolled
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 border-transparent shadow-md shadow-indigo-200"
                      : "bg-white/30 text-indigo-700 border-white/50 hover:bg-white backdrop-blur-sm"
                  }`}
                >
                  <LayoutDashboard size={16} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <button
                  onClick={onLogout}
                  title="Logout"
                  className={`p-2.5 rounded-full transition-all duration-300 border ${
                    isScrolled
                      ? "bg-rose-50 text-rose-500 hover:bg-rose-100 border-rose-100"
                      : "bg-white/40 text-rose-600 border-white/50 hover:bg-white backdrop-blur-sm"
                  }`}
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className={`group flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                  isScrolled
                    ? "bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200"
                    : "bg-white/40 text-slate-800 border-white/50 hover:bg-white hover:text-indigo-600 backdrop-blur-md shadow-sm"
                }`}
              >
                <Lock
                  size={16}
                  className={`transition-colors ${
                    isScrolled
                      ? "text-slate-400 group-hover:text-slate-600"
                      : "text-indigo-600"
                  }`}
                />
                <span className="hidden xs:inline">Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MODAL */}
      {!isLoggedIn && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      )}
    </>
  );
}
