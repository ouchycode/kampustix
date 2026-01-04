// src/auth.js
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Konfigurasi NextAuth
export const {
  handlers, // <--- INI WAJIB ADA AGAR ERROR HILANG
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Logic Login
      authorize: async (credentials) => {
        // Ganti ini dengan logic cek database/env kamu yang sebenarnya
        const user = null;

        // Contoh Hardcode sementara (Hapus nanti jika sudah connect DB)
        if (
          credentials.username === "admin" &&
          credentials.password === "admin123"
        ) {
          return { id: "1", name: "Admin", email: "admin@example.com" };
        }

        // Return user jika sukses, return null jika gagal
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/", // Redirect jika belum login
  },
  secret: process.env.AUTH_SECRET, // Wajib ada di .env
});
