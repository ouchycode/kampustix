import dbConnect from "@/lib/db";
import Participant from "@/models/Participant";
import Event from "@/models/Event"; // Opsional, buat ambil judul event
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { participantId } = await req.json();

    // 1. Cari Peserta
    const participant = await Participant.findById(participantId).populate(
      "eventId"
    );

    if (!participant) {
      return NextResponse.json(
        {
          success: false,
          message: "Tiket tidak valid / Peserta tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    // 2. Cek Pembayaran
    if (participant.status !== "paid" && participant.status !== "settlement") {
      return NextResponse.json(
        {
          success: false,
          message: "Tiket belum dibayar! Status: " + participant.status,
        },
        { status: 400 }
      );
    }

    // 3. Cek Apakah Sudah Check-in Sebelumnya?
    if (participant.hasCheckedIn) {
      return NextResponse.json(
        {
          success: false,
          message: "Peserta SUDAH Check-in sebelumnya!",
          data: {
            name: participant.name,
            checkInTime: participant.checkInTime,
          },
        },
        { status: 409 }
      ); // 409 Conflict
    }

    // 4. Lakukan Check-in
    participant.hasCheckedIn = true;
    participant.checkInTime = new Date();
    await participant.save();

    return NextResponse.json({
      success: true,
      message: "Check-in Berhasil!",
      data: {
        name: participant.name,
        email: participant.email,
        event: participant.eventId.title,
        ticketCode: participant.ticketCode,
      },
    });
  } catch (error) {
    console.error("Checkin Error:", error);
    return NextResponse.json(
      { success: false, message: "Format QR Code Salah" },
      { status: 500 }
    );
  }
}
