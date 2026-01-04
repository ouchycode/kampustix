import dbConnect from "@/lib/db";
import Participant from "@/models/Participant";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json(
      { success: false, message: "Event ID required" },
      { status: 400 }
    );
  }

  const participants = await Participant.find({ eventId }).sort({
    createdAt: -1,
  });
  return NextResponse.json({ success: true, data: participants });
}
