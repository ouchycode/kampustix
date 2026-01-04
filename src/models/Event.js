import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Judul event wajib diisi"], // Pesan error kustom
      trim: true, // Hapus spasi berlebih di awal/akhir
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Tanggal event wajib diisi"],
    },
    location: {
      type: String,
      required: [true, "Lokasi event wajib diisi"],
      trim: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Harga tidak boleh negatif"], // Mencegah harga minus
    },
    quota: {
      type: Number,
      default: 0, // Pastikan defaultnya sesuai keinginan (misal 0 atau 100)
      min: [0, "Kuota tidak boleh negatif"], // Mencegah kuota minus
    },
  },
  {
    timestamps: true, // Otomatis createAt & updatedAt
  }
);

// PENTING: Cek mongoose.models.Event dulu untuk mencegah error "OverwriteModelError" saat hot-reload Next.js
const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

export default Event;
