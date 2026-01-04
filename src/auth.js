// lib/auth.js
import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session) return null;

  try {
    return JSON.parse(session.value);
  } catch (e) {
    return null;
  }
}
