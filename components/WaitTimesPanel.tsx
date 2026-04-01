"use client";
import { useState, useEffect, useCallback } from "react";
import { Clock, RefreshCw, Zap, TrendingUp, AlertCircle } from "lucide-react";

interface RideWait {
  name: string;
  wait: number;
  isOpen: boolean;
  land: string;
}

interface ParkData {
  parkId: number;
  parkName: string;
  totalRides: number;
  openRides: number;
  avgWait: number;
  topWaits: RideWait[];
  walkOns: RideWait[];
}

interface WaitData {
  resort: string;
  fetchedAt: string;
  parks: ParkData[];
}

function WaitBar({ wait, max = 90 }: { wait: number; max?: number }) {
  const pct = Math.min((wait / max) * 100, 100);
  const color = wait <= 20 ? "#4ECDC4" : wait <= 45 ? "#F5C842" : "#FF6B6B";
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[11px] font-body font-600 w-10 text-right flex-shrink-0" style={{ color }}>
        {wait}m
      </span>
    </div>
  );
}

export default function WaitTimesPanel({ resortId }: { resortId: string }) {
  const [data, setData] = useState<WaitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activePark, setActivePark] = useState(0);
  const [tab, setTab] = useState<"top" | "walkons">("top");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/waittimes?resort=${resortId}`);
      if (!res.ok) throw new Error();
      const json: WaitData = await res.json();
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [resortId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // refresh every 5min
    return () => clearInterval(interval);
  }, [fetchData]);

  const park = data?.parks[activePark];

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(78,205,196,0.2)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "rgba(78,205,196,0.12)", background: "rgba(78,205,196,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(78,205,196,0.15)" }}>
            <Clock size={13} style={{ color: "#4ECDC4" }} />
          </div>
          <span className="font-body font-600 text-sm text-park-cream">Live Wait Times</span>
          {!loading && !error && (
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-park-mist font-body">Live</span>
            </div>
          )}
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <RefreshCw size={13} className={`text-park-mist ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Park tabs */}
      {data && data.parks.length > 1 && (
        <div className="flex gap-1 p-2 border-b overflow-x-auto" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {data.parks.map((p, i) => (
            <button
              key={p.parkId}
              onClick={() => setActivePark(i)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-body font-500 transition-all"
              style={
                activePark === i
                  ? { background: "rgba(78,205,196,0.15)", color: "#4ECDC4", border: "1px solid rgba(78,205,196,0.3)" }
                  : { color: "#B8C9D9", border: "1px solid transparent" }
              }
            >
              {p.parkName.replace("Disney ", "").replace("Universal ", "")}
            </button>
          ))}
        </div>
      )}

      <div className="p-4">
        {loading && (
          <div className="flex items-center justify-center py-8 gap-2">
            <RefreshCw size={16} className="text-park-mist animate-spin" />
            <span className="text-sm text-park-mist font-body">Fetching live data…</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 py-6 justify-center">
            <AlertCircle size={16} className="text-park-coral" />
            <span className="text-sm text-park-mist font-body">Park data unavailable right now</span>
          </div>
        )}

        {!loading && !error && park && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Open Rides", value: `${park.openRides}/${park.totalRides}`, color: "#4ECDC4" },
                { label: "Avg Wait", value: `${park.avgWait}m`, color: "#F5C842" },
                { label: "Walk-ons", value: String(park.walkOns.length), color: "#7ED321" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="p-2.5 rounded-xl text-center"
                  style={{ background: "rgba(30,58,95,0.5)", border: `1px solid ${color}18` }}
                >
                  <div className="font-display font-700 text-lg" style={{ color }}>{value}</div>
                  <div className="text-[10px] text-park-mist font-body">{label}</div>
                </div>
              ))}
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 mb-3 p-1 rounded-xl" style={{ background: "rgba(30,58,95,0.4)" }}>
              {(["top", "walkons"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-body font-500 transition-all"
                  style={
                    tab === t
                      ? { background: "rgba(245,200,66,0.15)", color: "#F5C842" }
                      : { color: "#B8C9D9" }
                  }
                >
                  {t === "top" ? <TrendingUp size={11} /> : <Zap size={11} />}
                  {t === "top" ? "Longest Waits" : "Walk-ons Now"}
                </button>
              ))}
            </div>

            {/* Ride list */}
            <div className="space-y-2">
              {tab === "top" && park.topWaits.length === 0 && (
                <p className="text-xs text-park-mist text-center py-3 font-body">Park may be closed or no wait data available</p>
              )}
              {tab === "walkons" && park.walkOns.length === 0 && (
                <p className="text-xs text-park-mist text-center py-3 font-body">No walk-ons right now — check back soon</p>
              )}
              {(tab === "top" ? park.topWaits : park.walkOns).map((ride, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] text-park-mist/50 font-body w-4 flex-shrink-0">{i + 1}</span>
                  <span className="text-xs text-park-cream font-body truncate flex-1 min-w-0">{ride.name}</span>
                  <WaitBar wait={ride.wait} />
                </div>
              ))}
            </div>

            {/* Last updated */}
            {data.fetchedAt && (
              <p className="text-[10px] text-park-mist/40 text-right mt-3 font-body">
                Updated {new Date(data.fetchedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
