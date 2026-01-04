import dbConnect from "@/lib/db";
import Participant from "@/models/Participant";
import Event from "@/models/Event"; // Kita butuh data Event juga (Judul & Tanggal)
import { NextResponse } from "next/server";
import QRCode from "qrcode"; // Import QRCode di sini untuk server-side generation
import { sendTicketEmail } from "@/lib/mail"; // Import fungsi kirim email

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, eventId } = await req.json();

    if (!name || !email || !eventId) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // 1. Ambil Data Event (untuk judul & tanggal di email)
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { message: "Event tidak ditemukan" },
        { status: 404 }
      );
    }

    // 2. Simpan Peserta ke Database
    const ticketCode = `TIX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const participant = await Participant.create({
      name,
      email,
      eventId,
      ticketCode,
    });

    // 3. Generate QR Code di Server (Backend)
    // Kita generate di sini supaya bisa dikirim via email
    const qrDataUrl = await QRCode.toDataURL(ticketCode);

    // 4. KIRIM EMAIL (Proses di background agar user tidak menunggu terlalu lama)
    // Format tanggal cantik
    const formattedDate = new Date(event.date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Panggil fungsi kirim email (tanpa await agar return response lebih cepat, atau pakai await jika ingin memastikan terkirim)
    await sendTicketEmail({
      to: email,
      name: name,
      eventTitle: event.title,
      eventDate: formattedDate,
      ticketCode: ticketCode,
      qrDataUrl: qrDataUrl,
    });

    return NextResponse.json({ success: true, data: participant });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
