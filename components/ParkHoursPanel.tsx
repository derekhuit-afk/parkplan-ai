"use client";
import { Clock, Star, DollarSign } from "lucide-react";

interface LLPrice {
  name: string;
  price?: { formatted: string };
  available?: boolean;
}

interface HoursData {
  open?: string;
  close?: string;
}

export default function ParkHoursPanel({
  hours,
  earlyEntry,
  llPrices,
  parkName,
}: {
  hours: HoursData | null;
  earlyEntry: HoursData | null;
  llPrices: LLPrice[];
  parkName: string;
}) {
  function fmt(iso?: string) {
    if (!iso) return "—";
    try { return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
    catch { return "—"; }
  }

  const llMultiPass = llPrices.find((p) => p.name?.toLowerCase().includes("multi pass"));
  const llSingles = llPrices.filter((p) => !p.name?.toLowerCase().includes("multi pass"));

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(78,205,196,0.18)" }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(78,205,196,0.1)", background: "rgba(78,205,196,0.05)" }}>
        <Clock size={13} style={{ color: "#4ECDC4" }} />
        <span className="font-body font-600 text-sm text-park-cream">Hours & Lightning Lane</span>
      </div>

      <div className="p-4 space-y-3">
        {/* Park hours */}
        {hours ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-park-mist font-body font-600 mb-0.5">Park Hours Today</p>
              <p className="font-display font-700 text-lg text-park-cream">
                {fmt(hours.open)} <span className="text-park-mist text-sm font-body font-400">–</span> {fmt(hours.close)}
              </p>
            </div>
            <div
              className="px-2.5 py-1 rounded-full text-[10px] font-body font-600"
              style={{ background: "rgba(78,205,196,0.12)", color: "#4ECDC4", border: "1px solid rgba(78,205,196,0.25)" }}
            >
              OPEN
            </div>
          </div>
        ) : (
          <p className="text-sm text-park-mist font-body">Hours not available</p>
        )}

        {/* Early Entry */}
        {earlyEntry && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(245,200,66,0.08)", border: "1px solid rgba(245,200,66,0.2)" }}>
            <Star size={11} style={{ color: "#F5C842" }} />
            <div>
              <span className="text-[10px] font-body font-600 text-park-gold">Early Entry</span>
              <span className="text-[10px] text-park-mist font-body ml-2">
                {fmt(earlyEntry.open)} – {fmt(earlyEntry.close)} · Resort guests only
              </span>
            </div>
          </div>
        )}

        {/* Lightning Lane pricing */}
        {(llMultiPass || llSingles.length > 0) && (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-park-mist font-body font-600 mb-2 flex items-center gap-1">
              <DollarSign size={9} />Lightning Lane Today
            </p>
            {llMultiPass && (
              <div className="flex items-center justify-between mb-1.5 px-3 py-2 rounded-xl" style={{ background: "rgba(126,211,33,0.08)", border: "1px solid rgba(126,211,33,0.2)" }}>
                <span className="text-xs text-park-cream font-body">Multi Pass</span>
                <span className="text-xs font-body font-700" style={{ color: llMultiPass.available ? "#7ED321" : "#FF6B6B" }}>
                  {llMultiPass.price?.formatted ?? "—"} {!llMultiPass.available && "· Sold Out"}
                </span>
              </div>
            )}
            {llSingles.slice(0, 2).map((ll, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b text-xs font-body" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <span className="text-park-mist truncate flex-1 min-w-0 pr-2">{ll.name.replace("Lightning Lane for ", "")}</span>
                <span className="font-600 flex-shrink-0" style={{ color: ll.available ? "#F5C842" : "#B8C9D9" }}>
                  {ll.price?.formatted ?? "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
