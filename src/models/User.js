import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username wajib diisi"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password wajib diisi"],
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
