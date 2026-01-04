import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Participant from "@/models/Participant";
import { notFound } from "next/navigation";
import EventClientView from "./EventClientView"; // Kita buat ini di langkah 2

// 1. Generate Metadata (SEO) - Tetap sama
export async function generateMetadata({ params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const event = await Event.findById(id);
    if (!event) return { title: "Event Tidak Ditemukan" };

    return {
      title: `${event.title} - KampusTix`,
      description: event.description.substring(0, 150) + "...",
      openGraph: {
        images: [event.image || "https://via.placeholder.com/800x400"],
      },
    };
  } catch (e) {
    return { title: "Error" };
  }
}

// 2. Halaman Detail (Logic Server)
export default async function EventDetailPage({ params }) {
  await dbConnect();
  const { id } = await params;

  let eventData;
  try {
    // Ambil data event & convert ke Plain Object (biar bisa dikirim ke Client Component)
    const eventDoc = await Event.findById(id).lean();
    if (!eventDoc) return notFound();

    // Serialisasi _id dan date agar aman di Client Component
    eventData = {
      ...eventDoc,
      _id: eventDoc._id.toString(),
      date: eventDoc.date.toISOString(),
      price: Number(eventDoc.price) || 0, // Pastikan price jadi Number
    };
  } catch (e) {
    return notFound();
  }

  // Hitung Sisa Kuota
  const booked = await Participant.countDocuments({
    eventId: id,
    status: { $ne: "cancel" },
  });

  const quota = eventData.quota || 100;
  const isSoldOut = booked >= quota;
  const remaining = quota - booked;

  // Render UI Client dengan Animasi
  return (
    <EventClientView
      event={eventData}
      isSoldOut={isSoldOut}
      remaining={remaining}
    />
  );
}
