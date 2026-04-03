"use client";
import { useState, useEffect, useCallback } from "react";
import { Users, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ForecastDay {
  date: string;
  rainChance: number;
}

interface ScheduleDay {
  date: string;
  type: string;
  description?: string;
  openingTime?: string;
  closingTime?: string;
}

// Crowd scoring algorithm — uses schedule events + day-of-week + seasonality
function scoreCrowd(
  dateStr: string,
  rainChance: number,
  scheduleDay: ScheduleDay[]
): { score: number; level: string; color: string; factors: string[] } {
  const d = new Date(dateStr + "T12:00:00");
  const dow = d.getDay(); // 0=Sun, 6=Sat
  const month = d.getMonth(); // 0-indexed
  const day = d.getDate();

  let score = 5; // base out of 10
  const factors: string[] = [];

  // Weekend bump
  if (dow === 0 || dow === 6) { score += 2; factors.push("Weekend +2"); }
  else if (dow === 5) { score += 1; factors.push("Friday +1"); }
  else if (dow === 2 || dow === 3) { score -= 1; factors.push("Midweek -1"); }

  // Seasonal adjustments
  if (month === 11 || (month === 0 && day <= 7)) { score += 3; factors.push("Holiday season +3"); }
  else if ((month === 5 || month === 6 || month === 7) && dow >= 5) { score += 2; factors.push("Summer weekend +2"); }
  else if (month === 6 || month === 7) { score += 1; factors.push("Summer +1"); }
  else if ((month === 2 && day >= 10) || (month === 3 && day <= 20)) { score += 2; factors.push("Spring break +2"); }
  else if (month === 0 || month === 1 || (month === 8 && dow < 5)) { score -= 1.5; factors.push("Off-peak -1.5"); }

  // Special events from schedule
  const hasSpecialEvent = scheduleDay.some((s) =>
    s.type === "TICKETED_EVENT" && !s.description?.toLowerCase().includes("early")
  );
  if (hasSpecialEvent) { score += 1; factors.push("Special event +1"); }

  // Park closing early = lower crowd window
  const opHours = scheduleDay.find((s) => s.type === "OPERATING");
  if (opHours?.closingTime) {
    const closeHour = new Date(opHours.closingTime).getHours();
    if (closeHour < 20) { score -= 0.5; factors.push("Early close -0.5"); }
    if (closeHour >= 23) { score += 0.5; factors.push("Extended hours +0.5"); }
  }

  // Rain reduces outdoor crowd but not total closures
  if (rainChance >= 70) { score -= 2; factors.push(`Heavy rain ${rainChance}% -2`); }
  else if (rainChance >= 40) { score -= 1; factors.push(`Rain ${rainChance}% -1`); }

  score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

  let level: string;
  let color: string;
  if (score <= 3) { level = "Low"; color = "#4ECDC4"; }
  else if (score <= 5) { level = "Moderate"; color = "#7ED321"; }
  else if (score <= 7) { level = "Busy"; color = "#F5C842"; }
  else if (score <= 8.5) { level = "Very Busy"; color = "#F5A623"; }
  else { level = "Packed"; color = "#FF6B6B"; }

  return { score, level, color, factors };
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CrowdForecast({ resortId, parkId }: { resortId: string; parkId?: string }) {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [schedule, setSchedule] = useState<Record<string, ScheduleDay[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [wxRes, schedRes] = await Promise.all([
        fetch(`/api/weather?resort=${resortId}`),
        parkId ? fetch(`https://api.themeparks.wiki/v1/entity/${parkId}/schedule`) : Promise.resolve(null),
      ]);

      const wxData = wxRes.ok ? await wxRes.json() : null;
      const schedData = schedRes?.ok ? await schedRes.json() : null;

      if (wxData?.forecast) setForecast(wxData.forecast);

      // Index schedule by date
      const schedMap: Record<string, ScheduleDay[]> = {};
      for (const entry of schedData?.schedule || []) {
        const dateKey = entry.date?.slice(0, 10) || "";
        if (!schedMap[dateKey]) schedMap[dateKey] = [];
        schedMap[dateKey].push(entry);
      }
      setSchedule(schedMap);
    } finally {
      setLoading(false);
    }
  }, [resortId, parkId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div className="rounded-2xl border p-5 animate-pulse" style={{ background: "rgba(26,46,69,0.4)", borderColor: "rgba(189,16,224,0.15)" }}>
      <div className="h-4 w-28 bg-white/10 rounded mb-3" />
      <div className="h-16 bg-white/5 rounded" />
    </div>
  );

  if (forecast.length === 0) return null;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(189,16,224,0.2)" }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(189,16,224,0.1)", background: "rgba(189,16,224,0.05)" }}>
        <Users size={13} style={{ color: "#BD10E0" }} />
        <span className="font-body font-600 text-sm text-park-cream">Crowd Forecast</span>
        <span className="text-[10px] text-park-mist/60 font-body ml-auto">7-day prediction</span>
      </div>

      <div className="p-4">
        {/* 7-day strip */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {forecast.slice(0, 7).map((day, i) => {
            const { score, level, color } = scoreCrowd(day.date, day.rainChance, schedule[day.date] || []);
            const d = new Date(day.date + "T12:00:00");
            const isToday = i === 0;
            const isSelected = selectedDay === i;
            const barH = Math.max(12, Math.round((score / 10) * 56));

            return (
              <button
                key={day.date}
                onClick={() => setSelectedDay(isSelected ? null : i)}
                className="flex flex-col items-center gap-1 py-2 px-0.5 rounded-xl transition-all"
                style={isSelected ? { background: `${color}15`, border: `1px solid ${color}40` } : {}}
              >
                <span className="text-[9px] font-body font-600 uppercase tracking-wide"
                  style={{ color: isToday ? "#F5C842" : "#B8C9D9" }}>
                  {isToday ? "Today" : DAYS[d.getDay()]}
                </span>
                {/* Bar */}
                <div className="w-full flex items-end justify-center h-14">
                  <div
                    className="w-4 rounded-t-sm transition-all duration-500"
                    style={{ height: barH, background: color, opacity: isSelected ? 1 : 0.75 }}
                  />
                </div>
                <span className="text-[9px] font-body font-600" style={{ color }}>{score.toFixed(0)}/10</span>
                <span className="text-[8px] text-park-mist/70 font-body">{level}</span>
              </button>
            );
          })}
        </div>

        {/* Selected day detail */}
        {selectedDay !== null && forecast[selectedDay] && (() => {
          const day = forecast[selectedDay];
          const { score, level, color, factors } = scoreCrowd(day.date, day.rainChance, schedule[day.date] || []);
          const d = new Date(day.date + "T12:00:00");
          const schedEntries = schedule[day.date] || [];
          const opHours = schedEntries.find((s) => s.type === "OPERATING");
          const events = schedEntries.filter((s) => s.type === "TICKETED_EVENT");
          const Icon = score <= 5 ? TrendingDown : score >= 7 ? TrendingUp : Minus;

          return (
            <div className="border-t pt-4 space-y-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body font-600 text-sm text-park-cream">
                    {d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Icon size={12} style={{ color }} />
                    <span className="text-sm font-body font-600" style={{ color }}>{level} crowds</span>
                    <span className="text-xs text-park-mist/60 font-body">({score}/10)</span>
                  </div>
                </div>
                {opHours && (
                  <div className="text-right">
                    <p className="text-[10px] text-park-mist/60 font-body">Park hours</p>
                    <p className="text-xs font-body text-park-cream">
                      {opHours.openingTime ? new Date(opHours.openingTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "?"}
                      {" – "}
                      {opHours.closingTime ? new Date(opHours.closingTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "?"}
                    </p>
                  </div>
                )}
              </div>

              {events.length > 0 && (
                <div className="text-xs font-body px-3 py-2 rounded-xl" style={{ background: "rgba(245,200,66,0.08)", color: "#F5C842" }}>
                  ⭐ Special event: {events[0].description || "Ticketed event"}
                </div>
              )}

              {day.rainChance >= 30 && (
                <div className="text-xs font-body px-3 py-2 rounded-xl" style={{ background: "rgba(78,205,196,0.08)", color: "#4ECDC4" }}>
                  🌧 {day.rainChance}% rain — factor into outdoor ride timing
                </div>
              )}

              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-park-mist/60 font-body font-600">Score factors</p>
                {factors.map((f, i) => (
                  <div key={i} className="text-[10px] text-park-mist/60 font-body flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-park-mist/30 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {selectedDay === null && (
          <p className="text-[10px] text-park-mist/40 text-center font-body">Tap any day for crowd details</p>
        )}
      </div>
    </div>
  );
}
