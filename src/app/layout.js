import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cookies } from "next/headers";
import { Toaster } from "sonner"; // ✅ 1. Import Toaster

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: "KampusTix",
  description: "Platform Event Kampus",
};

export default async function RootLayout({ children }) {
  // ✅ 2. Cek apakah ada cookie "admin_session"
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("admin_session");

  return (
    <html lang="id">
      <body
        className={`${font.className} antialiased bg-slate-50 text-slate-900`}
      >
        {/* Kirim status login ke Navbar */}
        <Navbar isLoggedIn={isLoggedIn} />

        {/* Render halaman utama */}
        <main className="min-h-screen">{children}</main>

        <Footer />

        {/* ✅ 3. Pasang Wadah Notifikasi (Toaster) */}
        {/* richColors: Mengaktifkan warna (Hijau=Sukses, Merah=Gagal) */}
        {/* closeButton: Menambahkan tombol 'x' kecil */}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
