"use client";

import { useState } from "react";
import Script from "next/script";
import QRCode from "qrcode";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { toast } from "sonner";
import {
  Loader2,
  Download,
  User,
  Mail,
  CreditCard,
  Ticket,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import TicketPDF from "@/components/TicketPDF";

export default function RegistrationForm({
  eventId,
  price,
  eventTitle,
  isSoldOut,
}) {
  const [ticketUrl, setTicketUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  // --- HANDLE REGISTRASI & PEMBAYARAN ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target;
    const formData = {
      name: form.name.value,
      email: form.email.value,
      eventId: eventId,
    };

    try {
      // 1. Request Transaction Token ke API
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal memproses transaksi");

      // --- HELPER: JIKA SUKSES ---
      const handleSuccess = async () => {
        toast.success("Yeay! Tiket berhasil diamankan! 🎟️");

        // Generate QR Code
        const qrData = await QRCode.toDataURL(json.participantId);
        setTicketUrl(qrData);

        // Siapkan Data untuk PDF
        setTicketData({
          event: {
            title: eventTitle,
            date: new Date(), // Tanggal booking
            location: "Lihat Detail di Website",
          },
          participant: {
            name: formData.name,
            email: formData.email,
            ticketCode:
              "TIX-" + json.participantId.substring(0, 6).toUpperCase(),
          },
          qrCodeUrl: qrData,
        });

        setIsLoading(false);
      };

      // KASUS A: Event Gratis
      if (json.isFree) {
        await handleSuccess();
        return;
      }

      // KASUS B: Event Berbayar (Midtrans)
      if (window.snap) {
        window.snap.pay(json.token, {
          onSuccess: async function (result) {
            await handleSuccess();
          },
          onPending: function (result) {
            toast.info("Menunggu pembayaran... cek emailmu ya!");
            setIsLoading(false);
          },
          onError: function (result) {
            toast.error("Waduh, pembayaran gagal. Coba lagi ya!");
            setIsLoading(false);
          },
          onClose: function () {
            toast.warning("Pembayaran belum selesai, jangan menyerah! 🥹");
            setIsLoading(false);
          },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Terjadi kesalahan sistem 😭");
      setIsLoading(false);
    }
  };

  // --- TAMPILAN JIKA SOLD OUT ---
  if (isSoldOut) {
    return (
      <div className="bg-rose-50 p-8 rounded-2xl border border-rose-100 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-3xl animate-bounce">
          💔
        </div>
        <h2 className="text-xl font-bold text-rose-600 mb-2">
          Tiket Habis Terjual
        </h2>
        <p className="text-sm text-rose-400 font-medium leading-relaxed max-w-[200px]">
          Maaf banget bestie, kamu terlambat. Coba cek event lain ya!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Script Midtrans (Load hanya jika berbayar) */}
      {price > 0 && (
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />
      )}

      <div className="space-y-6">
        {/* === FORM INPUT STATE === */}
        {!ticketUrl && (
          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-4 animate-fade-in-up"
          >
            {/* Input Nama */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"
              >
                Nama Lengkap
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Contoh: Kevin Ardiansyah"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 hover:border-slate-300"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"
              >
                Alamat Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tiket@emailmu.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 hover:border-slate-300"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Helper Text */}
            <div className="bg-indigo-50 p-3 rounded-lg flex gap-2 items-start">
              <AlertCircle
                size={14}
                className="text-indigo-600 mt-0.5 shrink-0"
              />
              <p className="text-[11px] text-indigo-700 leading-snug">
                Pastikan email aktif. E-Ticket akan dikirim otomatis ke email
                tersebut setelah pembayaran sukses.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-2 ${
                isLoading
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : price === 0 ? (
                <>
                  <Ticket size={18} />
                  Dapatkan Tiket Gratis
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Bayar Sekarang
                </>
              )}
            </button>

            {price > 0 && (
              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                🔒 Secured by Midtrans Payment Gateway
              </p>
            )}
          </form>
        )}

        {/* === TAMPILAN SUKSES (TICKET STUB) === */}
        {ticketUrl && (
          <div className="animate-fade-in-up">
            <div className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
              {/* Efek Sobekan Tiket (Notch) */}
              {/* Warnanya disamakan dengan background parent (#F8F9FC) agar terlihat bolong */}
              <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#F8F9FC] rounded-full shadow-inner" />
              <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#F8F9FC] rounded-full shadow-inner" />

              <div className="text-center space-y-5">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-scale-in">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight">
                      Registration Success!
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Siapkan QR Code ini di lokasi acara.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm inline-block">
                  <img
                    src={ticketUrl}
                    alt="Tiket QR"
                    className="w-32 h-32 object-contain mix-blend-multiply"
                  />
                </div>

                <div className="text-xs text-slate-400 font-mono bg-slate-50 py-1.5 rounded-lg border border-slate-100">
                  {ticketData?.participant?.ticketCode || "TIX-123456"}
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="mt-4">
              {ticketData && (
                <PDFDownloadLink
                  document={
                    <TicketPDF
                      event={ticketData.event}
                      participant={ticketData.participant}
                      qrCodeUrl={ticketData.qrCodeUrl}
                    />
                  }
                  fileName={`${ticketData.participant.ticketCode}.pdf`}
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200"
                >
                  {({ loading }) =>
                    loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />{" "}
                        Menyiapkan PDF...
                      </>
                    ) : (
                      <>
                        <Download size={18} /> Download E-Ticket (PDF)
                      </>
                    )
                  }
                </PDFDownloadLink>
              )}
              <p className="text-[10px] text-center text-slate-400 mt-3">
                *Salinan tiket juga telah dikirim ke email kamu.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
