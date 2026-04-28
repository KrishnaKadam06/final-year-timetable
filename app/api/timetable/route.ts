import { connectDB } from "@/lib/db";
import Timetable from "@/models/timetable";

// ✅ GET → fetch data
export async function GET() {
  try {
    await connectDB();

    const data = await Timetable.find();

    console.log("📥 FETCHED:", data);

    return Response.json(data);
  } catch (error) {
    console.error("❌ GET ERROR:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

// ✅ POST → save data
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("🔥 DATA RECEIVED:", body);

    const cleaned = body.map((day: any) => ({
      day: day.day,
      slots: day.slots.map((s: any) =>
        s ? s : { subject: "", faculty: "" }
      ),
    }));

    await Timetable.deleteMany({});
    await Timetable.insertMany(cleaned);

    console.log("✅ SAVED");

    return Response.json({ message: "Saved successfully" });
  } catch (error) {
    console.error("❌ POST ERROR:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}