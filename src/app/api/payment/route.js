import dbConnect from "@/lib/db";
import Participant from "@/models/Participant";
import Event from "@/models/Event";
import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, eventId } = await req.json();

    // 1. Validasi Event & Ambil Harga
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { message: "Event tidak valid" },
        { status: 404 }
      );
    }

    const ticketPrice = event.price || 0; // Ambil harga, default 0 jika tidak ada

    // 2. Buat ID Unik (Order ID & Kode Tiket)
    const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const ticketCode = `TIX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 3. Simpan Peserta ke Database (Status Awal: Pending)
    const participant = await Participant.create({
      name,
      email,
      eventId,
      ticketCode,
      status: "pending",
    });

    // --- LOGIKA KHUSUS JIKA GRATIS (HARGA 0) ---
    if (ticketPrice === 0) {
      // Langsung tandai sukses tanpa ke Midtrans
      participant.status = "paid";
      await participant.save();

      return NextResponse.json({
        success: true,
        isFree: true, // Flag untuk frontend
        participantId: participant._id,
      });
    }

    // --- LOGIKA MIDTRANS (JIKA BERBAYAR) ---

    // Inisialisasi Snap
    let snap = new midtransClient.Snap({
      isProduction: false, // Sandbox
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    // Parameter Transaksi Midtrans
    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: ticketPrice, // ✅ SUDAH DINAMIS
      },
      customer_details: {
        first_name: name,
        email: email,
      },
      item_details: [
        {
          id: eventId,
          price: ticketPrice, // ✅ SUDAH DINAMIS
          quantity: 1,
          name: `Tiket: ${event.title.substring(0, 40)}`, // Midtrans limit 50 char
        },
      ],
    };

    // Minta Token ke Midtrans
    const transaction = await snap.createTransaction(parameter);

    // Simpan token ke database
    participant.paymentToken = transaction.token;
    await participant.save();

    return NextResponse.json({
      success: true,
      token: transaction.token,
      participantId: participant._id,
    });
  } catch (error) {
    console.error("Payment Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
