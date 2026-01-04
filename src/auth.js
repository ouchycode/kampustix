import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // LOGIKA PENGECEKAN PASSWORD DI SINI
      authorize: async (credentials) => {
        const { username, password } = credentials;

        // Cek Hardcode: Username "admin" & Password "admin123"
        if (username === "admin" && password === "admin123") {
          // Jika benar, kembalikan data user (Dummy Data)
          return {
            id: "1",
            name: "Super Admin",
            email: "admin@kampustix.com",
            role: "admin",
          };
        }

        // Jika salah, kembalikan null (Login Gagal)
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/", // Jika user belum login, lempar ke home
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt", // Wajib pakai JWT untuk credential login
  },
});
