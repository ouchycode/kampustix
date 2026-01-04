import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Participant from "@/models/Participant";
import AdminCharts from "@/components/AdminCharts";
import DeleteButton from "@/components/DeleteButton";
import Link from "next/link";
import {
  LayoutDashboard,
  ExternalLink,
  Wallet,
  Users,
  CalendarDays,
  Plus,
  Eye,
  Pencil,
  Sparkles,
  TrendingUp,
} from "lucide-react";

// Supaya data selalu fresh saat admin buka (tidak di-cache)
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await dbConnect();

  // === 1. LOGIC DATA FETCHING ===
  const totalEvents = await Event.countDocuments();
  const totalParticipants = await Participant.countDocuments();

  // Hitung Revenue (Paid / Settlement)
  const paidParticipants = await Participant.countDocuments({
    $or: [{ status: "paid" }, { status: "settlement" }],
  });

  // Asumsi harga rata-rata atau ambil dari database jika perlu
  const totalRevenue = paidParticipants * 50000;

  // Format Rupiah Helper
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Agregasi Grafik Peserta per Event
  const events = await Event.find({}).sort({ createdAt: -1 }).lean();

  const eventStats = await Promise.all(
    events.map(async (evt) => {
      const count = await Participant.countDocuments({ eventId: evt._id });
      return {
        title:
          evt.title.substring(0, 15) + (evt.title.length > 15 ? "..." : ""),
        count: count,
      };
    })
  );

  // Agregasi Pie Chart Status Pembayaran
  const pendingCount = await Participant.countDocuments({ status: "pending" });
  const failedCount = await Participant.countDocuments({
    $or: [{ status: "expire" }, { status: "cancel" }, { status: "deny" }],
  });

  const paymentStats = [
    { name: "Pending", value: pendingCount },
    { name: "Sukses", value: paidParticipants },
    { name: "Gagal", value: failedCount },
  ];

  // === 2. RENDER UI ===
  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 pb-20 overflow-x-hidden selection:bg-indigo-500 selection:text-white relative">
      {/* === BACKGROUND DECORATION (Senada dengan Halaman Lain) === */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/60 to-transparent" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px]" />
        <div className="absolute top-40 -left-20 w-[300px] h-[300px] bg-blue-200/20 rounded-full blur-[80px]" />
      </div>

      {/* Container Utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 pt-28 md:pt-36 space-y-8">
        {/* === HEADER SECTION === */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-down">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide shadow-sm mb-3 hover:shadow-md transition-all cursor-default select-none">
              <Sparkles size={14} />
              <span>ADMIN PORTAL</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 drop-shadow-sm mb-2">
              Dashboard{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Overview
              </span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base max-w-xl">
              Pantau performa event, analisis pendapatan, dan kelola peserta
              secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-bold hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">Lihat Website</span>
            </Link>
          </div>
        </div>

        {/* === STATS CARDS === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Card 1: Revenue */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-300 group relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Total Pendapatan
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                {formatRupiah(totalRevenue)}
              </h2>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                <TrendingUp size={12} />
                <span>{paidParticipants} Transaksi Sukses</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-inner">
              <Wallet size={26} />
            </div>
            {/* Background Blob Decor */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
          </div>

          {/* Card 2: Participants */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 group">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Total Peserta
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                {totalParticipants}
              </h2>
              <Link
                href="/admin/checkin"
                className="text-xs text-blue-600 font-bold inline-flex items-center gap-1 hover:underline decoration-blue-200 underline-offset-2"
              >
                Scan Check-in <ExternalLink size={10} />
              </Link>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 shadow-inner">
              <Users size={26} />
            </div>
          </div>

          {/* Card 3: Events */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-purple-100/40 transition-all duration-300 group">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Event Aktif
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                {totalEvents}
              </h2>
              <Link
                href="/admin/create-event"
                className="text-xs text-purple-600 font-bold inline-flex items-center gap-1 hover:underline decoration-purple-200 underline-offset-2"
              >
                Buat Event Baru <Plus size={10} />
              </Link>
            </div>
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-inner">
              <CalendarDays size={26} />
            </div>
          </div>
        </div>

        {/* === CHARTS SECTION === */}
        <div
          className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Analitik Data
              </h3>
              <p className="text-xs text-slate-500">
                Statistik visual performa event
              </p>
            </div>
          </div>
          <AdminCharts eventStats={eventStats} paymentStats={paymentStats} />
        </div>

        {/* === TABLE SECTION === */}
        <div
          className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          {/* Table Header Action */}
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Manajemen Event
                </h3>
                <p className="text-xs text-slate-500">
                  Daftar semua event yang telah dibuat
                </p>
              </div>
            </div>
            <Link
              href="/admin/create-event"
              className="flex items-center gap-2 bg-slate-900 text-white text-sm px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-0.5 active:scale-95"
            >
              <Plus size={16} /> Tambah Event
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-5 pl-8">Event Name</th>
                  <th className="p-5 whitespace-nowrap">Date</th>
                  <th className="p-5 whitespace-nowrap">Location</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((evt) => (
                  <tr
                    key={evt._id}
                    className="hover:bg-slate-50/80 transition duration-200 group"
                  >
                    <td className="p-5 pl-8 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {evt.title}
                    </td>
                    <td className="p-5 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-md text-slate-600 text-xs font-semibold group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-200">
                        {new Date(evt.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="p-5 text-slate-500 whitespace-nowrap">
                      {evt.location}
                    </td>

                    {/* Action Buttons */}
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Tombol Lihat */}
                        <Link
                          href={`/admin/event/${evt._id}`}
                          target="_blank"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                          title="Lihat Detail"
                        >
                          <Eye size={16} />
                        </Link>

                        {/* Tombol Edit */}
                        <Link
                          href={`/admin/edit-event/${evt._id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-all"
                          title="Edit Event"
                        >
                          <Pencil size={16} />
                        </Link>

                        {/* Tombol Delete */}
                        {/* Wrapper ini memastikan DeleteButton punya style yg sama */}
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all cursor-pointer">
                          <DeleteButton eventId={evt._id.toString()} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {events.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
              <div className="w-16 h-16 bg-white rounded-full border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                <CalendarDays size={32} className="text-slate-300" />
              </div>
              <p className="font-bold text-slate-600">
                Belum ada event yang dibuat.
              </p>
              <p className="text-xs mt-1 max-w-xs mx-auto">
                Mulai dengan membuat event pertamamu untuk melihat data di sini.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
