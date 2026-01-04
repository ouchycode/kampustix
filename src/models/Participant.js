import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketCode: { type: String, unique: true },

    // Status Check-in (Fitur sebelumnya)
    hasCheckedIn: { type: Boolean, default: false },
    checkInTime: { type: Date },

    // TAMBAHAN BARU: Status Pembayaran
    status: { type: String, default: "pending" }, // pending, paid, expired
    paymentToken: String, // Token dari Midtrans
  },
  { timestamps: true }
);

export default mongoose.models.Participant ||
  mongoose.model("Participant", ParticipantSchema);
