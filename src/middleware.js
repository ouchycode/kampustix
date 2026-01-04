// src/middleware.js
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Proteksi Halaman Admin
  if (pathname.startsWith("/admin") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // ✅ MATCHER STANDAR NEXT.JS + NEXTAUTH
  // Ini memastikan middleware berjalan di seluruh aplikasi (untuk cek session),
  // TAPI mengabaikan file statis, gambar, dan favicon agar website tidak lemot.
  // Regex ini juga memastikan Server Actions (POST) tidak terblokir.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
