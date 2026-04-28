import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema(
  {
    subject: { type: String, default: "" },
    faculty: { type: String, default: "" },
  },
  { _id: false }
);

const DaySchema = new mongoose.Schema({
  day: String,
  slots: {
    type: [SlotSchema],
    default: [],
  },
});

export default mongoose.models.Timetable ||
  mongoose.model("Timetable", DaySchema);