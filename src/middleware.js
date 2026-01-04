// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  // 1. Ambil cookie session
  const session = request.cookies.get("admin_session");
  const { pathname } = request.nextUrl;

  // 2. Jika user mencoba akses halaman /admin tapi TIDAK ada session
  if (pathname.startsWith("/admin") && !session) {
    // Tendang balik ke halaman home agar mereka login lewat modal
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Jika user SUDAH login tapi mencoba akses login lagi (opsional)
  // Bisa ditambahkan logika di sini jika perlu

  return NextResponse.next();
}

// Atur halaman mana saja yang harus dijaga oleh middleware
export const config = {
  matcher: ["/admin/:path*"],
};
