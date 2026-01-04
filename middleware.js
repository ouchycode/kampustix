// middleware.js
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Import konfigurasi auth dari src/auth.js

export default auth((req) => {
  // 1. Cek status login dari NextAuth
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // 2. Jika user akses halaman admin TAPI belum login
  if (pathname.startsWith("/admin") && !isLoggedIn) {
    // Redirect ke halaman login (Home)
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 3. Lanjut jika aman
  return NextResponse.next();
});

// Konfigurasi halaman mana yang kena middleware
export const config = {
  // Matcher: kena di semua route /admin, KECUALI file statis/gambar agar tidak berat
  matcher: ["/admin/:path*"],
};
