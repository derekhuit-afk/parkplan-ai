"use client";
import { useState, useEffect, useCallback } from "react";
import { TrendingUp, Clock } from "lucide-react";

interface TrendEntry { ride: string; dayOfWeek: number; hour: number; avg: number; samples: number; }

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const HOURS = ["8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm"];

function waitColor(w: number) {
  if (w <= 15) return "#4ECDC4"; if (w <= 30) return "#7FDB8A";
  if (w <= 50) return "#FFD700"; if (w <= 75) return "#F5A623";
  return "#FF6B6B";
}

export default function WaitTrends({ parkId, parkName }: { parkId: string; parkName: string }) {
  const [trends, setTrends] = useState<TrendEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSamples, setTotalSamples] = useState(0);
  const [selectedRide, setSelectedRide] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const r = await fetch(`/api/wait-history?park_id=${encodeURIComponent(parkId)}`);
      if (r.ok) {
        const data = await r.json();
        setTrends(data.aggregated || []);
        setTotalSamples(data.totalSamples || 0);
      }
    } finally { setLoading(false); }
  }, [parkId]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const rides = [...new Set(trends.map(t => t.ride))].slice(0, 12);

  if (loading) return (
    <div className="rounded-2xl border p-5 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="h-4 w-32 rounded mb-3" style={{ background: "rgba(255,255,255,0.1)" }} />
      <div className="h-16 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
    </div>
  );

  if (totalSamples < 10) {
    return (
      <div className="rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} style={{ color: "#FFD700" }} />
          <span style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "0.8rem", color: "#FFFFFF" }}>
            Wait Time Trends
          </span>
        </div>
        <div className="text-center py-4">
          <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.8rem", color: "rgba(220,235,255,0.6)", marginBottom: "6px" }}>
            Building historical data…
          </p>
          <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.72rem", color: "rgba(220,235,255,0.4)" }}>
            {totalSamples} samples collected so far. Check back after using the dashboard live a few times.
          </p>
          <div className="mt-3 px-3 py-2 rounded-xl" style={{ background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.15)" }}>
            <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.7rem", color: "rgba(255,215,0,0.8)" }}>
              💡 Open the Dashboard while at the park to start logging wait times automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const rideData = selectedRide
    ? trends.filter(t => t.ride === selectedRide)
    : [];

  // Best time to visit per day of week
  const bestByDay = DAYS.map((day, dow) => {
    const dayTrends = trends.filter(t => t.dayOfWeek === dow && t.samples >= 2);
    if (!dayTrends.length) return null;
    const avgWait = Math.round(dayTrends.reduce((s, t) => s + t.avg, 0) / dayTrends.length);
    return { day, dow, avgWait };
  }).filter(Boolean) as { day: string; dow: number; avgWait: number }[];

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <TrendingUp size={13} style={{ color: "#FFD700" }} />
          <span style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "0.78rem", color: "#FFFFFF" }}>
            Historical Wait Trends
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.6rem", color: "rgba(220,235,255,0.4)" }}>
          {totalSamples} samples · {parkName}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Best days */}
        {bestByDay.length > 0 && (
          <div>
            <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(220,235,255,0.5)", marginBottom: "8px" }}>
              Average waits by day
            </p>
            <div className="grid grid-cols-7 gap-1">
              {bestByDay.map(({ day, avgWait }) => (
                <div key={day} className="flex flex-col items-center gap-1">
                  <div className="w-full rounded-sm" style={{ height: `${Math.max(8, (avgWait / 60) * 40)}px`, background: waitColor(avgWait), opacity: 0.8 }} />
                  <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.55rem", color: "rgba(220,235,255,0.5)" }}>{day}</span>
                  <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.6rem", fontWeight: 700, color: waitColor(avgWait) }}>{avgWait}m</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best hours */}
        {selectedRide && rideData.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(220,235,255,0.5)" }}>
                {selectedRide} — by hour
              </p>
              <button onClick={() => setSelectedRide(null)} style={{ fontFamily: "var(--font-nunito)", fontSize: "0.6rem", color: "rgba(220,235,255,0.4)" }}>clear</button>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {HOURS.map((hourLabel, hi) => {
                const hourData = rideData.filter(t => t.hour === hi + 8);
                if (!hourData.length) return null;
                const avg = Math.round(hourData.reduce((s, t) => s + t.avg, 0) / hourData.length);
                return (
                  <div key={hourLabel} className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="w-6 rounded-sm" style={{ height: `${Math.max(6, (avg / 90) * 36)}px`, background: waitColor(avg) }} />
                    <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.5rem", color: "rgba(220,235,255,0.4)" }}>{hourLabel}</span>
                    <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.55rem", fontWeight: 700, color: waitColor(avg) }}>{avg}m</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ride selector */}
        {rides.length > 0 && (
          <div>
            <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(220,235,255,0.5)", marginBottom: "8px" }}>
              Tap a ride to see hourly breakdown
            </p>
            <div className="flex flex-wrap gap-1.5">
              {rides.map(ride => {
                const rideTrends = trends.filter(t => t.ride === ride);
                const overallAvg = Math.round(rideTrends.reduce((s, t) => s + t.avg * t.samples, 0) / Math.max(1, rideTrends.reduce((s, t) => s + t.samples, 0)));
                return (
                  <button key={ride}
                    onClick={() => setSelectedRide(ride === selectedRide ? null : ride)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all"
                    style={{
                      background: selectedRide === ride ? `${waitColor(overallAvg)}15` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${selectedRide === ride ? waitColor(overallAvg) + "50" : "rgba(255,255,255,0.08)"}`,
                    }}>
                    <Clock size={9} style={{ color: waitColor(overallAvg) }} />
                    <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.68rem", color: "#FFFFFF" }}>{ride.split(" ").slice(0, 3).join(" ")}</span>
                    <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.65rem", fontWeight: 700, color: waitColor(overallAvg) }}>{overallAvg}m avg</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
