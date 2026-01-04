import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { NextResponse } from "next/server";

// ✅ NEW: Handler untuk mengambil 1 Event spesifik (GET BY ID)
// Ini wajib ada agar halaman Edit mendapatkan data terbaru & lengkap
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // Next.js 15 await params

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { message: "Event tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: event });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil event", error: error.message },
      { status: 500 }
    );
  }
}

// Handler untuk UPDATE (PUT)
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // ✅ FORCE CONVERT TO NUMBER
    // Kita pastikan price & quota dikonversi jadi number sebelum masuk DB
    // Jika user kirim string kosong atau invalid, kita set default 0
    const price =
      body.price !== "" && body.price !== undefined ? Number(body.price) : 0;
    const quota =
      body.quota !== "" && body.quota !== undefined ? Number(body.quota) : 0;

    const updateData = {
      title: body.title,
      description: body.description,
      date: body.date,
      location: body.location,
      image: body.image,
      price: price,
      quota: quota,
    };

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return NextResponse.json(
        { message: "Event tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Event berhasil diperbarui",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem", error: error.message },
      { status: 500 }
    );
  }
}

// Handler untuk DELETE (Tetap sama)
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Event.findByIdAndDelete(id);
    return NextResponse.json({ message: "Event berhasil dihapus" });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menghapus event", error: error.message },
      { status: 500 }
    );
  }
}
