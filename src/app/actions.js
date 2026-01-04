"use server";

import { signIn, signOut } from "@/auth"; // Import dari src/auth.js
import { AuthError } from "next-auth";

// Action untuk Login
export async function doLogin(formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    // Panggil fungsi login NextAuth
    await signIn("credentials", {
      username,
      password,
      redirect: false, // Jangan redirect di server, biar client yang handle
    });

    return null; // Null artinya sukses (tidak ada error)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Username atau Password salah!";
        default:
          return "Terjadi kesalahan sistem.";
      }
    }
    throw error;
  }
}

// Action untuk Logout
export async function handleLogout() {
  await signOut({ redirectTo: "/" });
}
