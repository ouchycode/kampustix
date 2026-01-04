import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Participant from "@/models/Participant";
import ExportButton from "@/components/ExportButton";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Wallet,
  Sparkles,
  Clock,
  Ticket,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEventDetail({ params }) {
  const { id } = await params;

  await dbConnect();

  // 1. Ambil Data Event
  const event = await Event.findById(id).lean();
  if (!event) return notFound();

  // 2. Ambil Data Peserta
  const participants = await Participant.find({ eventId: id })
    .sort({ createdAt: -1 })
    .lean();

  // 3. Hitung Statistik
  const totalPeserta = participants.length;
  const sudahCheckIn = participants.filter((p) => p.hasCheckedIn).length;
  const paid = participants.filter(
    (p) => p.status === "paid" || p.status === "settlement"
  ).length;

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 pb-20 overflow-x-hidden selection:bg-indigo-500 selection:text-white relative">
      {/* === BACKGROUND DECORATION (Sama dengan Dashboard) === */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/60 to-transparent" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px]" />
        <div className="absolute top-40 -left-20 w-[300px] h-[300px] bg-blue-200/20 rounded-full blur-[80px]" />
      </div>

      {/* Container Utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 pt-28 md:pt-36 space-y-8">
        {/* === HEADER SECTION === */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-in-down">
          <div className="w-full md:w-auto">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-4 transition-colors group"
            >
              <div className="p-1 rounded-full bg-white border border-slate-200 group-hover:border-indigo-200 transition-colors">
                <ArrowLeft size={14} />
              </div>
              Kembali ke Dashboard
            </Link>

            <div className="flex items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-[10px] font-bold tracking-wide shadow-sm uppercase">
                <Sparkles size={12} /> Event Detail
              </div>
              {participants.length === 0 && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                  Belum ada peserta
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm font-medium text-slate-600">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                <Calendar size={16} className="text-indigo-500" />
                {new Date(event.date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                <MapPin size={16} className="text-indigo-500" />
                {event.location}
              </div>
            </div>
          </div>

          {/* Tombol Export */}
          {participants.length > 0 && (
            <div className="w-full md:w-auto flex justify-end">
              <ExportButton
                participants={JSON.parse(JSON.stringify(participants))}
                eventTitle={event.title}
              />
            </div>
          )}
        </div>

        {/* === STATS CARDS === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Card 1: Total Pendaftar */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 group">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Total Pendaftar
              </p>
              <h2 className="text-3xl font-black text-slate-900">
                {totalPeserta}
              </h2>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-inner">
              <Users size={26} />
            </div>
          </div>

          {/* Card 2: Sudah Check-in */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-emerald-100/40 transition-all duration-300 group">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Sudah Check-in
              </p>
              <h2 className="text-3xl font-black text-slate-900">
                {sudahCheckIn}
              </h2>
            </div>
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 shadow-inner">
              <CheckCircle2 size={26} />
            </div>
          </div>

          {/* Card 3: Tiket Terbayar */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-300 group">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Pembayaran Sukses
              </p>
              <h2 className="text-3xl font-black text-slate-900">{paid}</h2>
            </div>
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-inner">
              <Wallet size={26} />
            </div>
          </div>
        </div>

        {/* === TABEL PESERTA === */}
        <div
          className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          {/* Table Header */}
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Daftar Peserta
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time data pendaftaran
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-5 pl-8">No</th>
                  <th className="p-5">Nama Peserta</th>
                  <th className="p-5">Status Bayar</th>
                  <th className="p-5">Kode Tiket</th>
                  <th className="p-5 text-center">Check-in</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {participants.length > 0 ? (
                  participants.map((p, index) => {
                    // Logic Status Warna
                    let statusClass =
                      "bg-slate-100 text-slate-600 border-slate-200";
                    let statusLabel = p.status || "PENDING";

                    if (p.status === "paid" || p.status === "settlement") {
                      statusClass =
                        "bg-emerald-50 text-emerald-600 border-emerald-100";
                      statusLabel = "PAID";
                    } else if (p.status === "pending") {
                      statusClass =
                        "bg-amber-50 text-amber-600 border-amber-100";
                    } else if (
                      ["expire", "cancel", "deny"].includes(p.status)
                    ) {
                      statusClass = "bg-rose-50 text-rose-600 border-rose-100";
                    }

                    return (
                      <tr
                        key={p._id}
                        className="hover:bg-slate-50/80 transition duration-200"
                      >
                        <td className="p-5 pl-8 font-bold text-slate-400">
                          {index + 1}
                        </td>
                        <td className="p-5">
                          <p className="font-bold text-slate-900 text-base">
                            {p.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">
                            {p.email}
                          </p>
                        </td>
                        <td className="p-5">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${statusClass}`}
                          >
                            {statusLabel}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-600 bg-slate-100/50 px-2 py-1.5 rounded-lg border border-slate-200 border-dashed">
                            <Ticket size={12} className="text-slate-400" />
                            {p.ticketCode || "-"}
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          {p.hasCheckedIn ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wide">
                              <CheckCircle2 size={14} /> Sudah
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wide opacity-80">
                              <XCircle size={14} /> Belum
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-16 text-center text-slate-400 bg-slate-50/30"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                          <Users size={32} className="text-slate-300" />
                        </div>
                        <p className="font-bold text-slate-600">
                          Belum ada pendaftar.
                        </p>
                        <p className="text-xs mt-1">
                          Bagikan event ini agar mahasiswa mulai mendaftar!
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Tabel */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center md:text-left">
            <p className="text-xs text-slate-500 font-medium">
              Menampilkan total{" "}
              <span className="font-bold text-slate-900">
                {participants.length}
              </span>{" "}
              peserta untuk event ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
