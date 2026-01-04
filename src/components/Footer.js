import Link from "next/link";
import {
  Ticket,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Linkedin,
  Heart,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        {/* === GRID CONTENT === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Kolom 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                <Ticket size={20} fill="currentColor" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Kampus<span className="text-indigo-600">Tix</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Platform manajemen event kampus #1. <br />
              Daftar, bayar, dan nikmati keseruan event mahasiswa tanpa ribet.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Menu</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-indigo-600 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>{" "}
                  Cari Event
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-indigo-600 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>{" "}
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-indigo-600 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>{" "}
                  Pusat Bantuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Legal & Admin */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Akses</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="/login"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Login Panitia / Admin
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kontak */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <span>Daerah Tangerang, Banten, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-indigo-600 shrink-0" />
                <a
                  href="mailto:support@kampustix.id"
                  className="hover:text-indigo-600 transition-colors"
                >
                  support@kampustix.id
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-indigo-600 shrink-0" />
                <span>+62 812-1933-4093</span>
              </li>
            </ul>
          </div>
        </div>

        {/* === COPYRIGHT === */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>&copy; {currentYear} KampusTix. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with{" "}
            <Heart size={12} className="text-rose-500 fill-rose-500" /> in
            Tangerang
          </p>
        </div>
      </div>
    </footer>
  );
}
