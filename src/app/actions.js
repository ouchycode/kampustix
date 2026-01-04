"use server";

import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// --- LOGIN ACTION ---
export async function doLogin(formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  if (!username || !password) return "Username dan Password wajib diisi";

  try {
    await dbConnect();
    const user = await User.findOne({ username });
    if (!user) return "Username tidak ditemukan";

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return "Password salah";

    const cookieStore = await cookies();
    cookieStore.set(
      "admin_session",
      JSON.stringify({ id: user._id.toString(), role: user.role }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 Hari
        path: "/",
      }
    );

    return null; // Sukses
  } catch (error) {
    return "Terjadi kesalahan server";
  }
}

// --- LOGOUT ACTION (Paling Penting: Tanpa Redirect) ---
export async function handleLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");

  // Kembalikan status sukses agar Client bisa handle notifikasi
  return { success: true };
}
