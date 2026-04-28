"use client";

import Navbar from "@/components/navbar";

export default function GeneratePage() {
  const generate = async () => {
    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDG9Q9mlDupgbAc6zU8tRAbfJJErWCVkNI",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
Generate STRICT JSON timetable.

Rules:
- 5 days (Monday–Friday)
- 6 slots each
- subjects: Math, Physics, CS, English
- no subject repeats in same day

Return ONLY JSON array.
No explanation. No text. No markdown.
                    `,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();

      console.log("RAW RESPONSE:", data);

      let text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!text) {
        alert("❌ Empty response from AI");
        return;
      }

      // CLEAN MARKDOWN
      text = text.replace(/```json|```/g, "").trim();

      console.log("CLEANED TEXT:", text);

      let json;

      try {
        json = JSON.parse(text);
      } catch (err) {
        console.error("❌ JSON PARSE FAILED:", text);

        alert("⚠️ AI returned invalid format. Try again.");
        return;
      }

      // BASIC VALIDATION
      if (!Array.isArray(json)) {
        alert("⚠️ Invalid structure from AI");
        return;
      }

      // SAVE
      localStorage.setItem("timetable", JSON.stringify(json));

      alert("✅ Timetable Generated!");
      window.location.href = "/timetable";

    } catch (err) {
      console.error("❌ GENERATION ERROR:", err);
      alert("❌ API failed");
    }
  };

  return (
    <div className="flex">
      <Navbar />

      <div className="p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">
          AI Timetable Generator
        </h1>

        <button
          onClick={generate}
          className="bg-red-600 text-white px-6 py-2 rounded"
        >
          Generate Timetable
        </button>
      </div>
    </div>
  );
}