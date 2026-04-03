"use client";
import { useState, useCallback } from "react";
import { Sparkles, RefreshCw, Clock, MapPin, Zap } from "lucide-react";

interface RideWait { name: string; wait: number | null; isOpen: boolean; }

interface OptStep {
  time: string;
  action: string;
  type: "ride" | "show" | "food" | "tip";
  wait?: number;
  color: string;
}

const TYPE_COLORS = { ride: "#F5C842", show: "#BD10E0", food: "#F5A623", tip: "#4ECDC4" };
const TYPE_ICONS = { ride: "🎢", show: "🎭", food: "🍔", tip: "💡" };

export default function ItineraryOptimizer({
  resortId,
  parkId,
  parkName,
  rides,
}: {
  resortId: string;
  parkId: string;
  parkName: string;
  rides: RideWait[];
}) {
  const [plan, setPlan] = useState<OptStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastBuilt, setLastBuilt] = useState<Date | null>(null);
  const [preferences, setPreferences] = useState({ thrillLevel: "any", withKids: false, lunchTime: "1pm" });

  const buildPlan = useCallback(async () => {
    setLoading(true);
    try {
      const openRides = rides.filter((r) => r.isOpen && r.wait !== null).sort((a, b) => (a.wait ?? 0) - (b.wait ?? 0));
      const topWaits = [...rides].filter((r) => r.isOpen && r.wait !== null).sort((a, b) => (b.wait ?? 0) - (a.wait ?? 0)).slice(0, 3);

      const waitSummary = openRides.slice(0, 10).map((r) => `${r.name}: ${r.wait}min`).join(", ");
      const walkOns = openRides.filter((r) => (r.wait ?? 0) <= 15).map((r) => r.name).slice(0, 4).join(", ");
      const busyRides = topWaits.map((r) => `${r.name} (${r.wait}min)`).join(", ");

      const prompt = `You are a Disney park optimization expert. Build an optimized 4-hour afternoon itinerary (starting now) for ${parkName}.

LIVE DATA RIGHT NOW:
- Walk-ons (≤15min): ${walkOns || "none right now"}
- Longest waits: ${busyRides}
- All open rides by wait: ${waitSummary}
- Preferences: thrill level=${preferences.thrillLevel}, with kids=${preferences.withKids}, lunch at ${preferences.lunchTime}

Return ONLY a JSON array with this exact structure (no markdown, no explanation):
[
  {"time": "2:00 PM", "action": "Ride name or activity", "type": "ride|show|food|tip", "wait": 15},
  ...
]

Rules:
- Include 6-8 steps covering the next 3-4 hours
- Start with walk-ons while crowds build
- Leave longest waits for when they typically drop (late afternoon for most MK rides)
- Add 1 food/snack break, 1 show if timing works, 2-3 insider tips
- type must be exactly: ride, show, food, or tip
- wait field only for rides (integer minutes), omit for shows/food/tip`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system: "You are a theme park optimization AI. Return only valid JSON arrays, no markdown.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed: { time: string; action: string; type: string; wait?: number }[] = JSON.parse(clean);

      const steps: OptStep[] = parsed.map((s) => ({
        time: s.time,
        action: s.action,
        type: (["ride","show","food","tip"].includes(s.type) ? s.type : "tip") as OptStep["type"],
        wait: s.wait,
        color: TYPE_COLORS[(s.type as keyof typeof TYPE_COLORS)] || "#B8C9D9",
      }));

      setPlan(steps);
      setLastBuilt(new Date());
    } catch {
      setPlan([{ time: "Now", action: "Could not build plan — check connection", type: "tip", color: "#FF6B6B" }]);
    } finally {
      setLoading(false);
    }
  }, [rides, parkName, preferences]);

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(255,107,107,0.2)" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,107,107,0.1)", background: "rgba(255,107,107,0.05)" }}>
        <div className="flex items-center gap-2">
          <Zap size={13} style={{ color: "#FF6B6B" }} />
          <span className="font-body font-600 text-sm text-park-cream">Live Itinerary Optimizer</span>
        </div>
        {lastBuilt && (
          <span className="text-[9px] text-park-mist/50 font-body">
            Built {lastBuilt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </span>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Preferences */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[9px] uppercase tracking-widest text-park-mist font-body font-600 block mb-1">Thrill</label>
            <select
              value={preferences.thrillLevel}
              onChange={(e) => setPreferences((p) => ({ ...p, thrillLevel: e.target.value }))}
              className="w-full text-xs font-body text-park-cream rounded-lg px-2 py-1.5 outline-none"
              style={{ background: "rgba(30,58,95,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <option value="any">Any</option>
              <option value="thrill">Thrills only</option>
              <option value="family">Family-friendly</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-widest text-park-mist font-body font-600 block mb-1">Kids</label>
            <button
              onClick={() => setPreferences((p) => ({ ...p, withKids: !p.withKids }))}
              className="w-full text-xs font-body rounded-lg px-2 py-1.5 transition-all"
              style={{
                background: preferences.withKids ? "rgba(245,200,66,0.15)" : "rgba(30,58,95,0.6)",
                border: `1px solid ${preferences.withKids ? "rgba(245,200,66,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: preferences.withKids ? "#F5C842" : "#B8C9D9",
              }}
            >
              {preferences.withKids ? "✓ Yes" : "No kids"}
            </button>
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-widest text-park-mist font-body font-600 block mb-1">Lunch</label>
            <select
              value={preferences.lunchTime}
              onChange={(e) => setPreferences((p) => ({ ...p, lunchTime: e.target.value }))}
              className="w-full text-xs font-body text-park-cream rounded-lg px-2 py-1.5 outline-none"
              style={{ background: "rgba(30,58,95,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <option value="noon">Noon</option>
              <option value="1pm">1pm</option>
              <option value="2pm">2pm</option>
              <option value="skip">Skip</option>
            </select>
          </div>
        </div>

        {/* Build button */}
        <button
          onClick={buildPlan}
          disabled={loading || rides.filter((r) => r.isOpen).length === 0}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-body font-700 text-park-night text-sm transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg, #FF6B6B, #BD10E0)" }}
        >
          {loading ? <RefreshCw size={15} className="animate-spin text-white" /> : <Sparkles size={15} className="text-white" />}
          <span className="text-white">{loading ? "Building your optimal plan…" : plan.length > 0 ? "Rebuild with Live Data" : "Build My Plan Right Now"}</span>
        </button>

        {rides.filter((r) => r.isOpen).length === 0 && (
          <p className="text-xs text-park-mist/50 font-body text-center">Load live wait times first</p>
        )}

        {/* Plan steps */}
        {plan.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest font-body font-600 text-park-mist/60 mb-1">Your optimized plan</p>
            {plan.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                {/* Timeline dot */}
                <div className="flex flex-col items-center flex-shrink-0 pt-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: step.color }} />
                  {i < plan.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: "rgba(255,255,255,0.08)", minHeight: "16px" }} />}
                </div>
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-body font-600" style={{ color: step.color }}>{step.time}</span>
                    <span className="text-[10px]">{TYPE_ICONS[step.type]}</span>
                    {step.wait !== undefined && (
                      <div className="flex items-center gap-0.5 text-[9px] font-body" style={{ color: step.color }}>
                        <Clock size={8} />{step.wait}m wait
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-body text-park-cream leading-snug">{step.action}</p>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t text-[10px] text-park-mist/40 font-body" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <MapPin size={9} />{parkName} · Based on live wait data · Rebuild any time
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
