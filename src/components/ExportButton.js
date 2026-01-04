"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { FileSpreadsheet, Loader2, Download } from "lucide-react";
import { toast } from "sonner";

export default function ExportButton({ participants, eventTitle }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    // Validasi Data
    if (!participants || participants.length === 0) {
      toast.error("Belum ada data peserta untuk di-export.");
      return;
    }

    setIsExporting(true);

    try {
      // UX Delay (Simulasi loading agar user sadar proses berjalan)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 1. Format Data untuk Excel
      const dataToExport = participants.map((p, index) => ({
        No: index + 1,
        "Nama Peserta": p.name,
        Email: p.email,
        "Kode Tiket": p.ticketCode || "-",
        "Status Pembayaran": (p.status || "PENDING").toUpperCase(),
        "Status Check-in": p.hasCheckedIn ? "SUDAH" : "BELUM",
        "Waktu Daftar": new Date(p.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      // 2. Buat Worksheet
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);

      // 3. Styling Lebar Kolom (Auto Width)
      const columnWidths = [
        { wch: 5 }, // No
        { wch: 30 }, // Nama
        { wch: 35 }, // Email
        { wch: 15 }, // Kode
        { wch: 20 }, // Status Bayar
        { wch: 15 }, // Check-in
        { wch: 25 }, // Waktu
      ];
      worksheet["!cols"] = columnWidths;

      // 4. Buat Workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Peserta");

      // 5. Generate Nama File & Download
      const cleanTitle = eventTitle
        .replace(/[^a-zA-Z0-9]/g, "_")
        .substring(0, 30);
      const fileName = `Peserta_${cleanTitle}_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

      XLSX.writeFile(workbook, fileName);

      toast.success("Data berhasil didownload! 📂");
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunduh data excel.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`
        flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-emerald-200/50 transition-all duration-300
        ${
          isExporting
            ? "bg-emerald-400 cursor-not-allowed opacity-80"
            : "bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5 active:scale-95 border border-emerald-400"
        }
      `}
    >
      {isExporting ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <FileSpreadsheet size={18} />
          <span className="hidden sm:inline">Download Excel</span>
          <span className="sm:hidden">Excel</span>
        </>
      )}
    </button>
  );
}
