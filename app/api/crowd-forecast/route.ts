import { NextRequest, NextResponse } from "next/server";

const RESORT_PARK_IDS: Record<string, string> = {
  wdw:               "75ea578a-adc8-4116-a54d-dccb60765ef9",
  disneyland:        "7340550b-c14d-4def-80bb-acdb51d49a66",
  paris:             "dae968d5-630d-4719-8b06-3d107e944401",
  tokyo:             "3cc919f1-d16d-43e0-8c3f-1dd269bd1a42",
  hongkong:          "bd0eb47b-2f02-4d4d-90fa-cb3a68988e3b",
  shanghai:          "ddc4357c-c148-4b36-9888-07894fe75e83",
  "universal-orlando":"267615cc-8943-4c2a-ae2c-5da728ca591f",
};

interface ScheduleEntry {
  date: string; type: string; description?: string;
  openingTime?: string; closingTime?: string;
  purchases?: { name: string; price?: { formatted: string }; available?: boolean }[];
}

function scoreCrowd(dateStr: string, entries: ScheduleEntry[]) {
  const d = new Date(dateStr + "T12:00:00");
  const dow = d.getDay(); const month = d.getMonth(); const day = d.getDate();
  let score = 5.0; const factors: string[] = [];

  if (dow === 6) { score += 2.2; factors.push("Saturday"); }
  else if (dow === 0) { score += 1.8; factors.push("Sunday"); }
  else if (dow === 5) { score += 1.0; factors.push("Friday"); }
  else if (dow === 1) { score += 0.3; factors.push("Monday"); }
  else if (dow === 2 || dow === 3) { score -= 1.0; factors.push("Tue/Wed (best)"); }
  else if (dow === 4) { score -= 0.5; factors.push("Thursday"); }

  const mmdd = month * 100 + day;
  if (mmdd >= 1220 || mmdd <= 107) { score += 3.0; factors.push("Holiday season"); }
  else if (mmdd >= 610 && mmdd <= 820) { score += 1.5; factors.push("Summer break"); }
  else if (mmdd >= 315 && mmdd <= 415) { score += 1.8; factors.push("Spring break"); }
  else if (mmdd >= 1120 && mmdd <= 1130) { score += 2.2; factors.push("Thanksgiving week"); }
  else if ((mmdd >= 201 && mmdd <= 308) || (mmdd >= 901 && mmdd <= 1020)) { score -= 1.5; factors.push("Off-peak"); }

  const hasNightEvent = entries.some(s => s.type === "TICKETED_EVENT" && !s.description?.toLowerCase().includes("early"));
  if (hasNightEvent) { score += 0.8; factors.push("After-hours event"); }

  const op = entries.find(s => s.type === "OPERATING");
  if (op?.closingTime) {
    const h = new Date(op.closingTime).getHours();
    if (h >= 22) { score += 0.4; factors.push("Extended hours"); }
    if (h <= 19) { score -= 0.6; factors.push("Early close"); }
  }

  score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

  let level: string, color: string, tip: string;
  if (score <= 2.5) { level = "Very Low"; color = "#4ECDC4"; tip = "Ghost town. Walk on to almost everything."; }
  else if (score <= 4) { level = "Low"; color = "#7FDB8A"; tip = "Short waits. No Lightning Lane needed."; }
  else if (score <= 5.5) { level = "Moderate"; color = "#FFD700"; tip = "20–40 min waits. Arrive at rope drop."; }
  else if (score <= 7) { level = "Busy"; color = "#F5A623"; tip = "Buy Lightning Lane Multi Pass. Hit headliners early and after 7pm."; }
  else if (score <= 8.5) { level = "Very Busy"; color = "#FF8C42"; tip = "60–90 min waits expected. Individual Lightning Lane for top 2 rides."; }
  else { level = "Packed"; color = "#FF6B6B"; tip = "Consider another park. Arrive 45 min before open if committed."; }

  return { score, level, color, tip, factors };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resortId = searchParams.get("resort") || "wdw";
  const parkId = RESORT_PARK_IDS[resortId] || RESORT_PARK_IDS.wdw;

  try {
    const schedRes = await fetch(`https://api.themeparks.wiki/v1/entity/${parkId}/schedule`, { next: { revalidate: 3600 } });
    const schedData = schedRes.ok ? await schedRes.json() : { schedule: [] };

    const schedMap: Record<string, ScheduleEntry[]> = {};
    for (const entry of schedData.schedule || []) {
      const dk = (entry.date as string)?.slice(0, 10) || "";
      if (!schedMap[dk]) schedMap[dk] = [];
      schedMap[dk].push(entry as ScheduleEntry);
    }

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = [];

    for (let i = 0; i < 30; i++) {
      const d = new Date(today); d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const entries = schedMap[dateStr] || [];
      const op = entries.find(s => s.type === "OPERATING");
      const events = entries.filter(s => s.type === "TICKETED_EVENT" && !s.description?.toLowerCase().includes("early"));
      const earlyEntry = entries.find(s => s.description?.toLowerCase().includes("early"));
      const crowd = scoreCrowd(dateStr, entries);

      days.push({
        date: dateStr,
        dayOfWeek: d.toLocaleDateString("en-US", { weekday: "short" }),
        dateLabel: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        isToday: i === 0,
        isTomorrow: i === 1,
        ...crowd,
        hours: op ? { open: op.openingTime, close: op.closingTime } : null,
        hasEarlyEntry: !!earlyEntry,
        specialEvents: events.map(e => e.description || "Special event"),
      });
    }

    const bestDays = [...days].sort((a, b) => a.score - b.score).slice(0, 3).map(d => d.date);
    return NextResponse.json({ resort: resortId, days, bestDays });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
