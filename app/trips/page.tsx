"use client";
import { useState } from "react";
import Link from "next/link";
import { MapPin, Bookmark, Trash2, ExternalLink, Clock, Users, DollarSign, ArrowLeft, Search, Share2 } from "lucide-react";
import { useTripStore } from "@/hooks/useTripStore";

const RESORT_EMOJIS: Record<string, string> = {
  wdw: "🏰", disneyland: "✨", paris: "🗼", tokyo: "🌸",
  hongkong: "🏮", shanghai: "🐉", "universal-orlando": "🎬",
};

function ShareButton({ tripId }: { tripId: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/trips/${tripId}`;
  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "My ParkPlan.ai Trip", url }); return; } catch { /* fallback */ }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleShare}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-500 transition-all"
      style={{ background: "rgba(78,205,196,0.1)", color: copied ? "#4ECDC4" : "#B8C9D9", border: "1px solid rgba(78,205,196,0.2)" }}>
      <Share2 size={11} />
      {copied ? "Copied!" : "Share"}
    </button>
  );
}

export default function TripsPage() {
  const { trips, deleteTrip, clearAll, ready } = useTripStore();
  const [search, setSearch] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = trips.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.resortName.toLowerCase().includes(search.toLowerCase())
  );

  if (!ready) return (
    <div className="min-h-screen bg-park-night flex items-center justify-center">
      <div className="text-park-gold animate-pulse font-display text-xl">Loading…</div>
    </div>
  );

  return (
    <main className="min-h-screen" style={{ background: "#0D1B2A" }}>
      {/* Header */}
      <header className="border-b px-4 sm:px-6 py-4 sticky top-0 z-10"
        style={{ borderColor: "rgba(245,200,66,0.12)", background: "rgba(13,27,42,0.97)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft size={16} className="text-park-mist group-hover:text-park-gold transition-colors" />
            <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center">
              <MapPin size={13} className="text-park-night" />
            </div>
            <span className="font-display font-700 text-lg text-park-cream hidden sm:block">
              Park<span className="text-park-gold">Plan</span><span className="text-park-mist text-xs font-body font-normal ml-1">.ai</span>
            </span>
          </Link>
          <Link href="/plan"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-600 text-park-night"
            style={{ background: "linear-gradient(135deg, #F5C842, #E8A020)" }}>
            + New Plan
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark size={18} className="text-park-gold" />
            <h1 className="font-display font-700 text-3xl text-park-cream">My Saved Trips</h1>
          </div>
          <p className="font-body text-park-mist text-sm">
            {trips.length === 0
              ? "No saved trips yet — start planning and hit save!"
              : `${trips.length} trip${trips.length !== 1 ? "s" : ""} saved on this device`}
          </p>
        </div>

        {/* Search + clear */}
        {trips.length > 0 && (
          <div className="flex gap-3 mb-6">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border"
              style={{ background: "rgba(26,46,69,0.5)", borderColor: "rgba(255,255,255,0.1)" }}>
              <Search size={14} className="text-park-mist flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search trips…"
                className="flex-1 bg-transparent text-sm font-body text-park-cream outline-none placeholder-park-mist/50"
              />
            </div>
            {confirmClear ? (
              <div className="flex gap-2">
                <button onClick={() => setConfirmClear(false)}
                  className="px-3 py-2 rounded-xl text-xs font-body border text-park-mist"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}>Cancel</button>
                <button onClick={() => { clearAll(); setConfirmClear(false); }}
                  className="px-3 py-2 rounded-xl text-xs font-body font-600 text-white"
                  style={{ background: "rgba(255,107,107,0.3)", border: "1px solid rgba(255,107,107,0.4)" }}>
                  Delete all
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)}
                className="px-3 py-2 rounded-xl text-xs font-body text-park-mist border transition-colors hover:text-park-coral"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Empty state */}
        {trips.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="font-display font-700 text-2xl text-park-cream mb-3">No trips saved yet</h2>
            <p className="font-body text-park-mist mb-8 max-w-sm mx-auto">
              Start a conversation with the AI planner, then hit the save button to keep your plans here.
            </p>
            <Link href="/plan"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-body font-700 text-park-night"
              style={{ background: "linear-gradient(135deg, #F5C842, #E8A020)" }}>
              Start Planning
            </Link>
          </div>
        )}

        {/* Trip grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((trip) => {
              const msgCount = trip.messages.filter((m) => m.role === "user").length;
              const preview = trip.messages.filter((m) => m.role === "assistant").pop()?.content.slice(0, 120) || "";
              const emoji = RESORT_EMOJIS[trip.resortId] || "🏖";
              return (
                <div key={trip.id}
                  className="group rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "rgba(26,46,69,0.4)", borderColor: "rgba(255,255,255,0.06)" }}>
                  {/* Card top */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{emoji}</span>
                        <div>
                          <h3 className="font-display font-700 text-base text-park-cream leading-tight">{trip.title}</h3>
                          <p className="text-[11px] text-park-mist font-body mt-0.5">{trip.resortName}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteTrip(trip.id)}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 flex-shrink-0">
                        <Trash2 size={13} className="text-park-mist hover:text-park-coral transition-colors" />
                      </button>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {trip.travelDates && (
                        <div className="flex items-center gap-1 text-[10px] text-park-mist font-body px-2 py-1 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.05)" }}>
                          <Clock size={9} className="text-park-gold" />{trip.travelDates}
                        </div>
                      )}
                      {trip.groupSize && (
                        <div className="flex items-center gap-1 text-[10px] text-park-mist font-body px-2 py-1 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.05)" }}>
                          <Users size={9} className="text-park-gold" />{trip.groupSize}
                        </div>
                      )}
                      {trip.budget && (
                        <div className="flex items-center gap-1 text-[10px] text-park-mist font-body px-2 py-1 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.05)" }}>
                          <DollarSign size={9} className="text-park-gold" />{trip.budget}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-[10px] text-park-mist/60 font-body px-2 py-1 rounded-lg"
                        style={{ background: "rgba(255,255,255,0.03)" }}>
                        {msgCount} message{msgCount !== 1 ? "s" : ""}
                      </div>
                    </div>

                    {/* Preview */}
                    {preview && (
                      <p className="text-xs text-park-mist/70 font-body leading-relaxed line-clamp-2">
                        {preview.replace(/\*\*/g, "").replace(/<[^>]*>/g, "")}…
                      </p>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="px-5 py-3 border-t flex items-center justify-between"
                    style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(13,27,42,0.4)" }}>
                    <span className="text-[10px] text-park-mist/50 font-body">
                      {new Date(trip.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <div className="flex items-center gap-2">
                      <ShareButton tripId={trip.id} />
                      <Link href={`/plan?resort=${trip.resortId}&load=${trip.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-600 transition-all"
                        style={{ background: "rgba(245,200,66,0.12)", color: "#F5C842", border: "1px solid rgba(245,200,66,0.25)" }}>
                        <ExternalLink size={11} />Open
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {search && filtered.length === 0 && trips.length > 0 && (
          <div className="text-center py-12">
            <p className="text-park-mist font-body">No trips match &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {/* Storage notice */}
        {trips.length > 0 && (
          <p className="text-[10px] text-park-mist/30 text-center font-body mt-10">
            Trips are saved locally on this device. Clearing browser data will remove them.
          </p>
        )}
      </div>
    </main>
  );
}
