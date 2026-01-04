"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import Link from "next/link";
import {
  ArrowLeft,
  History,
  ScanLine,
  CheckCircle2,
  XCircle,
  Loader2,
  QrCode,
  Maximize2,
  Sparkles,
} from "lucide-react";
import { Toaster, toast } from "sonner";

export default function CheckInPage() {
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([]);

  const scannerRef = useRef(null);

  useEffect(() => {
    // Konfigurasi Scanner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      verbose: false,
    };

    const scanner = new Html5QrcodeScanner("reader", config, false);
    scannerRef.current = scanner;

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText, decodedResult) {
      if (isProcessing) return;

      scanner.pause();
      setIsProcessing(true);
      handleCheckIn(decodedText, scanner);
    }

    function onScanFailure(error) {
      // Biarkan kosong
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((err) => console.error("Scanner clear error", err));
      }
    };
  }, []);

  const handleCheckIn = async (participantId, scannerInstance) => {
    const toastId = toast.loading("Memverifikasi tiket...");

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId }),
      });

      const json = await res.json();

      if (res.ok) {
        // --- SUKSES ---
        toast.dismiss(toastId);
        toast.success(`Welcome, ${json.data.name}!`);

        setScanResult({
          status: "success",
          message: "Check-in Berhasil!",
          data: json.data,
        });

        setHistory((prev) => [
          {
            time: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            name: json.data.name,
            ticketCode: json.data.ticketCode,
            status: "OK",
          },
          ...prev,
        ]);
      } else {
        // --- GAGAL ---
        toast.dismiss(toastId);
        toast.error(json.message || "Tiket Invalid");

        setScanResult({
          status: "error",
          message: json.message || "Data tidak ditemukan",
          data: null,
        });

        setHistory((prev) => [
          {
            time: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            name: "Unknown / Invalid",
            ticketCode: "-",
            status: "FAIL",
          },
          ...prev,
        ]);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Koneksi Error");
      setScanResult({
        status: "error",
        message: "Gagal terhubung server",
        data: null,
      });
    } finally {
      // Delay 3 detik sebelum lanjut scan
      setTimeout(() => {
        setIsProcessing(false);
        setScanResult(null);
        scannerInstance.resume();
      }, 3000);
    }
  };

  return (
    // UBAH TEMA KE LIGHT MODE
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 pt-28 md:pt-36 pb-20 flex flex-col items-center relative overflow-x-hidden">
      <Toaster position="top-center" richColors />

      {/* === BACKGROUND DECORATION (SAMA DENGAN HALAMAN LAIN) === */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/60 to-transparent -z-10" />
      <div className="fixed -top-20 -right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -z-10" />
      <div className="fixed top-40 -left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl -z-10" />

      {/* HEADER */}
      <div className="w-full max-w-md flex justify-between items-center px-6 mb-8 animate-fade-in-down">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-[10px] font-bold tracking-wide shadow-sm uppercase mb-2">
            <Sparkles size={12} /> Gate System
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <ScanLine className="text-indigo-600" /> Ticket Scanner
          </h1>
          <p className="text-slate-500 text-sm mt-1">Admin Gate Check-in</p>
        </div>
        <Link
          href="/admin"
          className="bg-white border border-slate-200 text-slate-500 p-2.5 rounded-full hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition shadow-sm active:scale-95"
        >
          <ArrowLeft size={20} />
        </Link>
      </div>

      {/* AREA SCANNER */}
      <div className="w-full max-w-md px-4 relative z-10 animate-fade-in-up">
        {/* Ubah border jadi putih agar terlihat seperti card */}
        <div className="bg-black rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-100/50 border-[4px] border-white relative aspect-square">
          <div
            id="reader"
            className="w-full h-full [&>div]:!shadow-none [&>div]:!border-none [&_video]:object-cover [&_video]:w-full [&_video]:h-full"
          ></div>

          {isProcessing && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in">
              <Loader2
                className="animate-spin text-indigo-500 mb-2"
                size={40}
              />
              <p className="text-white font-medium text-sm">
                Memproses Tiket...
              </p>
            </div>
          )}

          {!isProcessing && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                {/* Sudut-sudut fokus */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-indigo-500 rounded-br-lg" />

                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan-down opacity-80" />
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1 font-medium">
          <Maximize2 size={12} /> Pastikan QR Code berada di dalam kotak
        </p>
      </div>

      {/* HASIL SCAN (POP UP CARD - LIGHT THEME) */}
      <div className="w-full max-w-md px-4 mt-8 min-h-[120px]">
        {scanResult ? (
          <div
            className={`p-6 rounded-2xl border flex items-start gap-4 shadow-xl shadow-slate-100/50 animate-in slide-in-from-bottom-4 duration-300 bg-white ${
              scanResult.status === "success"
                ? "border-emerald-100"
                : "border-rose-100"
            }`}
          >
            <div
              className={`p-3 rounded-full shrink-0 ${
                scanResult.status === "success"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-100 text-rose-600"
              }`}
            >
              {scanResult.status === "success" ? (
                <CheckCircle2 size={28} />
              ) : (
                <XCircle size={28} />
              )}
            </div>
            <div>
              <h2
                className={`text-lg font-black leading-tight mb-1 ${
                  scanResult.status === "success"
                    ? "text-emerald-700"
                    : "text-rose-700"
                }`}
              >
                {scanResult.status === "success"
                  ? "Verifikasi Sukses"
                  : "Gagal Check-in"}
              </h2>
              <p className="text-sm text-slate-600 leading-snug">
                {scanResult.message}
              </p>

              {scanResult.data && (
                <div className="mt-3 flex flex-col gap-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-sm font-bold text-slate-900">
                    {scanResult.data.name}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Code: {scanResult.data.ticketCode}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Placeholder Light Theme */
          <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 bg-white/50 h-full">
            <QrCode size={32} className="mb-2 opacity-50" />
            <p className="text-sm font-medium">Siap Memindai...</p>
          </div>
        )}
      </div>

      {/* RIWAYAT SESI (LIGHT THEME CARD) */}
      <div className="w-full max-w-md px-4 mt-8">
        <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
          <div className="p-5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2">
            <History size={18} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Riwayat Sesi Ini
            </h3>
          </div>
          <div className="max-h-[250px] overflow-y-auto divide-y divide-slate-100 scrollbar-thin scrollbar-thumb-slate-200">
            {history.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Belum ada riwayat scan.
              </div>
            ) : (
              history.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 flex justify-between items-center hover:bg-slate-50 transition text-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 shadow-sm ${
                        item.status === "OK" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-900 truncate max-w-[150px]">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {item.time} •{" "}
                        <span className="font-mono">{item.ticketCode}</span>
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wide ${
                      item.status === "OK"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan-down {
          0% {
            top: 0;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-scan-down {
          animation: scan-down 2s linear infinite;
        }
        #reader__dashboard_section_csr span,
        #reader__dashboard_section_swaplink {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
