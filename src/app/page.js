import HomeClientView from "./HomeClientView";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Participant from "@/models/Participant";

// ✅ Wajib: Pastikan halaman ini selalu dirender ulang tiap request
// agar data kuota dan slot selalu fresh/real-time.
export const dynamic = "force-dynamic";

async function getEvents(query) {
  try {
    await dbConnect();

    // 1. Buat filter pencarian
    const filter = query ? { title: { $regex: query, $options: "i" } } : {};

    // 2. Ambil data event
    // Gunakan lean() agar return Plain Object, bukan Mongoose Document (lebih ringan)
    const eventsData = await Event.find(filter).sort({ createdAt: -1 }).lean();

    // Jika tidak ada event, langsung return array kosong
    if (!eventsData.length) return [];

    // 3. OPTIMASI: Hitung jumlah pendaftar menggunakan AGGREGATION
    // Daripada query satu-satu di dalam loop (lambat), kita ambil sekaligus.
    const eventIds = eventsData.map((e) => e._id);

    const participantsCounts = await Participant.aggregate([
      { $match: { eventId: { $in: eventIds } } }, // Cari participant yang eventId-nya ada di list
      { $group: { _id: "$eventId", count: { $sum: 1 } } }, // Kelompokkan by eventId & hitung
    ]);

    // Buat Map (Kamus) untuk akses cepat: { "id_event_A": 5, "id_event_B": 10 }
    const countMap = {};
    participantsCounts.forEach((item) => {
      // Convert ObjectId ke string untuk key
      countMap[item._id.toString()] = item.count;
    });

    // 4. Mapping data akhir & Serialisasi Data (Wajib untuk Next.js)
    const events = eventsData.map((evt) => ({
      ...evt,
      _id: evt._id.toString(), // Convert ObjectId ke String

      // ✅ Serialisasi Tanggal (PENTING): Client Component tidak terima Date Object
      date: evt.date ? evt.date.toISOString() : null,
      createdAt: evt.createdAt ? evt.createdAt.toISOString() : null,
      updatedAt: evt.updatedAt ? evt.updatedAt.toISOString() : null,

      // Ambil jumlah pendaftar dari Map, default 0 jika tidak ada
      registrantsCount: countMap[evt._id.toString()] || 0,

      // Pastikan angka aman
      quota: Number(evt.quota) || 0,
      price: Number(evt.price) || 0,
    }));

    return events;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export default async function Home({ searchParams }) {
  // ✅ Next.js 15: Await searchParams
  const params = await searchParams;
  const query = params?.q || "";

  const events = await getEvents(query);

  return (
    <main className="bg-slate-50 min-h-screen">
      <HomeClientView initialEvents={events} initialQuery={query} />
    </main>
  );
}
