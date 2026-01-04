import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Participant from "@/models/Participant";
import { NextResponse } from "next/server";

// ✅ 1. Paksa Next.js agar tidak menyimpan cache (Solusi data tidak update)
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    let filter = {};
    if (query) {
      filter = {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { location: { $regex: query, $options: "i" } },
        ],
      };
    }

    const events = await Event.find(filter).sort({ date: 1 }).lean();

    const eventsWithQuota = await Promise.all(
      events.map(async (evt) => {
        const booked = await Participant.countDocuments({
          eventId: evt._id,
          status: { $ne: "cancel" },
        });

        // ✅ 2. PERBAIKAN KRUSIAL: Pastikan quota ditarik sebagai Number
        // Jika data lama kosong, gunakan 100, tapi pastikan hasilnya Number
        const maxQuota = Number(evt.quota) || 100;
        const price = Number(evt.price) || 0;

        return {
          ...evt,
          _id: evt._id.toString(), // Bersihkan ID agar tidak error di Client
          price: price, // Pastikan price dikirim sebagai angka
          quota: maxQuota, // Pastikan quota dikirim sebagai angka
          booked: booked,
          isSoldOut: booked >= maxQuota,
          remaining: maxQuota - booked,
        };
      })
    );

    return NextResponse.json({ success: true, data: eventsWithQuota });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // ✅ 3. Sanitasi Data sebelum masuk DB
    const sanitizedBody = {
      ...body,
      price: Number(body.price) || 0,
      quota: Number(body.quota) || 0,
    };

    const event = await Event.create(sanitizedBody);
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
