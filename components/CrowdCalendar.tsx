"use client";
import { useState, useEffect, useCallback } from "react";
import { CalendarDays, Star, ChevronLeft, ChevronRight, Clock, Zap } from "lucide-react";

interface CrowdDay {
  date: string;
  dayOfWeek: string;
  dateLabel: string;
  isToday: boolean;
  isTomorrow: boolean;
  score: number;
  level: string;
  color: string;
  tip: string;
  factors: string[];
  hours: { open?: string; close?: string } | null;
  hasEarlyEntry: boolean;
  specialEvents: string[];
}

interface ForecastData {
  resort: string;
  days: CrowdDay[];
  bestDays: string[];
}

function fmtTime(iso?: string) {
  if (!iso) return "?";
  try { return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
  catch { return "?"; }
}

function CrowdBar({ score, color, isSelected }: { score: number; color: string; isSelected: boolean }) {
  const pct = (score / 10) * 100;
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
      <div className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color, opacity: isSelected ? 1 : 0.7 }} />
    </div>
  );
}

export default function CrowdCalendar({ resortId }: { resortId: string }) {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0); // 0=week1, 1=week2, etc.

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/crowd-forecast?resort=${resortId}`);
      if (res.ok) {
        const json: ForecastData = await res.json();
        setData(json);
        // Auto-select today
        if (json.days.length > 0) setSelectedDate(json.days[0].date);
      }
    } finally {
      setLoading(false);
    }
  }, [resortId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const weeks = data ? Math.ceil(data.days.length / 7) : 0;
  const visibleDays = data?.days.slice(weekOffset * 7, weekOffset * 7 + 7) || [];
  const selectedDay = data?.days.find(d => d.date === selectedDate) || null;
  const isBestDay = selectedDate ? data?.bestDays.includes(selectedDate) : false;

  if (loading) return (
    <div className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "20px" }}>
      <div className="h-4 w-32 rounded mb-4" style={{ background: "rgba(255,255,255,0.1)" }} />
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }} />
        ))}
      </div>
    </div>
  );

  if (!data || data.days.length === 0) return null;

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,215,0,0.05)" }}>
        <div className="flex items-center gap-2">
          <CalendarDays size={14} style={{ color: "#FFD700" }} />
          <span style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "0.8rem", color: "#FFFFFF" }}>
            30-Day Crowd Forecast
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.65rem", color: "rgba(220,235,255,0.5)", letterSpacing: "0.05em" }}>
          AI-estimated · Tap any day
        </span>
      </div>

      <div className="p-4 space-y-4">

        {/* Best days callout */}
        {data.bestDays.length > 0 && (
          <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
            style={{ background: "rgba(127,219,138,0.08)", border: "1px solid rgba(127,219,138,0.2)" }}>
            <Star size={14} style={{ color: "#7FDB8A", flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.75rem", color: "#7FDB8A", marginBottom: "2px" }}>
                Best days in the next 30
              </p>
              <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.72rem", color: "rgba(220,235,255,0.75)" }}>
                {data.bestDays.map(dateStr => {
                  const d = data.days.find(day => day.date === dateStr);
                  return d ? `${d.dayOfWeek} ${d.dateLabel}` : dateStr;
                }).join("  ·  ")}
              </p>
            </div>
          </div>
        )}

        {/* Week navigator */}
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
            disabled={weekOffset === 0}
            className="p-1.5 rounded-lg transition-all disabled:opacity-25"
            style={{ color: "rgba(220,235,255,0.7)" }}>
            <ChevronLeft size={15} />
          </button>
          <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.72rem", color: "rgba(220,235,255,0.5)", fontWeight: 600 }}>
            {weekOffset === 0 ? "This week" : weekOffset === 1 ? "Next week" : `Week ${weekOffset + 1}`}
          </span>
          <button
            onClick={() => setWeekOffset(Math.min(weeks - 1, weekOffset + 1))}
            disabled={weekOffset >= weeks - 1}
            className="p-1.5 rounded-lg transition-all disabled:opacity-25"
            style={{ color: "rgba(220,235,255,0.7)" }}>
            <ChevronRight size={15} />
          </button>
        </div>

        {/* 7-day grid for visible week */}
        <div className="grid grid-cols-7 gap-1.5">
          {visibleDays.map((day) => {
            const isSelected = selectedDate === day.date;
            const isBest = data.bestDays.includes(day.date);
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDate(isSelected ? null : day.date)}
                className="flex flex-col items-center rounded-xl pt-2 pb-2.5 px-0.5 transition-all relative"
                style={{
                  background: isSelected ? `${day.color}18` : "rgba(255,255,255,0.03)",
                  border: isSelected ? `1.5px solid ${day.color}55` : "1px solid rgba(255,255,255,0.07)",
                }}>
                {isBest && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                    style={{ background: "#7FDB8A" }}>
                    <Star size={7} fill="#00194B" style={{ color: "#00194B" }} />
                  </div>
                )}
                <span style={{
                  fontFamily: "var(--font-nunito)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: day.isToday ? "#FFD700" : "rgba(220,235,255,0.6)",
                  textTransform: "uppercase",
                  marginBottom: "3px",
                }}>
                  {day.isToday ? "Today" : day.isTomorrow ? "Tmrw" : day.dayOfWeek}
                </span>
                <span style={{
                  fontFamily: "var(--font-nunito)",
                  fontSize: "0.6rem",
                  color: "rgba(220,235,255,0.45)",
                  marginBottom: "5px",
                }}>
                  {day.dateLabel.split(" ")[1]}
                </span>
                {/* Score pill */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center mb-1.5"
                  style={{ background: `${day.color}22`, border: `1.5px solid ${day.color}55` }}>
                  <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.65rem", color: day.color }}>
                    {Math.round(day.score)}
                  </span>
                </div>
                <CrowdBar score={day.score} color={day.color} isSelected={isSelected} />
                <span style={{
                  fontFamily: "var(--font-nunito)",
                  fontSize: "0.55rem",
                  color: day.color,
                  fontWeight: 600,
                  marginTop: "3px",
                  letterSpacing: "0.03em",
                }}>
                  {day.level.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected day detail */}
        {selectedDay && (
          <div className="rounded-xl p-4 space-y-3 border"
            style={{ background: `${selectedDay.color}09`, borderColor: `${selectedDay.color}30` }}>

            {/* Date + level */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "0.95rem", color: "#FFFFFF" }}>
                  {new Date(selectedDay.date + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "long", month: "long", day: "numeric"
                  })}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span style={{
                    fontFamily: "var(--font-nunito)",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    color: selectedDay.color,
                  }}>
                    {selectedDay.level} Crowds
                  </span>
                  <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.7rem", color: "rgba(220,235,255,0.45)" }}>
                    {selectedDay.score.toFixed(1)}/10
                  </span>
                  {isBestDay && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(127,219,138,0.15)", border: "1px solid rgba(127,219,138,0.3)" }}>
                      <Star size={8} fill="#7FDB8A" style={{ color: "#7FDB8A" }} />
                      <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.6rem", fontWeight: 700, color: "#7FDB8A" }}>Best day</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Park hours */}
              {selectedDay.hours?.open && (
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end mb-0.5">
                    <Clock size={10} style={{ color: "rgba(220,235,255,0.5)" }} />
                    <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.6rem", color: "rgba(220,235,255,0.5)" }}>Park hours</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.75rem", color: "#FFFFFF" }}>
                    {fmtTime(selectedDay.hours.open)}–{fmtTime(selectedDay.hours.close)}
                  </span>
                  {selectedDay.hasEarlyEntry && (
                    <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.6rem", color: "#FFD700", marginTop: "2px" }}>
                      ✦ Early entry available
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* AI tip */}
            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Zap size={13} style={{ color: "#FFD700", flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.78rem", color: "rgba(220,235,255,0.9)", lineHeight: 1.5 }}>
                {selectedDay.tip}
              </p>
            </div>

            {/* Special events */}
            {selectedDay.specialEvents.length > 0 && (
              <div className="px-3 py-2 rounded-xl"
                style={{ background: "rgba(255,215,0,0.07)", border: "1px solid rgba(255,215,0,0.18)" }}>
                <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.72rem", color: "#FFD700", fontWeight: 700 }}>
                  ⭐ {selectedDay.specialEvents[0]}
                </p>
              </div>
            )}

            {/* Factors */}
            <div className="flex flex-wrap gap-1.5">
              {selectedDay.factors.map((f, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "var(--font-nunito)",
                    fontSize: "0.62rem",
                    color: "rgba(220,235,255,0.6)",
                  }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
