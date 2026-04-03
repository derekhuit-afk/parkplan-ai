"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { MapPin, ArrowLeft, Sparkles, Calendar, Users, DollarSign, Copy, Check } from "lucide-react";
import { useTripStore, type SavedTrip } from "@/hooks/useTripStore";

const RESORT_EMOJIS: Record<string, string> = {
  wdw: "🏰", disneyland: "✨", paris: "🗼", tokyo: "🌸",
  hongkong: "🏮", shanghai: "🐉", "universal-orlando": "🎬",
};

function MessageBubble({ msg }: { msg: { role: string; content: string } }) {
  const fmt = (t: string) => t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
  if (msg.role === "user") return (
    <div className="flex justify-end">
      <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm font-body leading-relaxed"
        style={{ background: "rgba(245,200,66,0.12)", border: "1px solid rgba(245,200,66,0.22)", borderRadius: "18px 18px 4px 18px", color: "#FFF8E7" }}
        dangerouslySetInnerHTML={{ __html: fmt(msg.content) }} />
    </div>
  );
  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0 mt-1">
        <Sparkles size={12} className="text-park-night" />
      </div>
      <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm font-body leading-relaxed"
        style={{ background: "rgba(30,58,95,0.5)", border: "1px solid rgba(30,58,95,0.8)", borderRadius: "18px 18px 18px 4px", color: "#B8C9D9" }}
        dangerouslySetInnerHTML={{ __html: fmt(msg.content) }} />
    </div>
  );
}

export default function TripSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { trips, ready } = useTripStore();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const found = trips.find((t) => t.id === id);
    if (found) setTrip(found);
    else setNotFound(true);
  }, [ready, trips, id]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!ready) return (
    <div className="min-h-screen bg-park-night flex items-center justify-center">
      <div className="text-park-gold animate-pulse font-display text-xl">Loading…</div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-park-night flex flex-col items-center justify-center px-4 text-center">
      <div className="text-5xl mb-4">🗺️</div>
      <h1 className="font-display font-700 text-2xl text-park-cream mb-3">Trip not found</h1>
      <p className="text-park-mist font-body mb-6 max-w-sm">
        This trip is saved locally on the device that created it. Open that link on the same device to view it.
      </p>
      <Link href="/plan"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-body font-700 text-park-night"
        style={{ background: "linear-gradient(135deg, #F5C842, #E8A020)" }}>
        Start a new plan
      </Link>
    </div>
  );

  if (!trip) return null;
  const emoji = RESORT_EMOJIS[trip.resortId] || "🏖";
  const aiMessages = trip.messages.filter((m) => m.role === "assistant" && m.content.length > 50);
  const highlights = aiMessages.slice(-3);

  return (
    <main className="min-h-screen" style={{ background: "#0D1B2A" }}>
      <header className="border-b px-4 sm:px-6 py-4 sticky top-0 z-10"
        style={{ borderColor: "rgba(245,200,66,0.12)", background: "rgba(13,27,42,0.97)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/trips" className="flex items-center gap-2 group">
            <ArrowLeft size={16} className="text-park-mist group-hover:text-park-gold transition-colors" />
            <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center">
              <MapPin size={13} className="text-park-night" />
            </div>
            <span className="font-display font-700 text-base text-park-cream hidden sm:block">
              Park<span className="text-park-gold">Plan</span><span className="text-park-mist text-xs font-body font-normal ml-1">.ai</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={copyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body font-500 border transition-all"
              style={{ borderColor: "rgba(78,205,196,0.3)", color: copied ? "#4ECDC4" : "#B8C9D9" }}>
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copied!" : "Copy link"}
            </button>
            <Link href={`/plan?resort=${trip.resortId}&load=${trip.id}`}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-700 text-park-night"
              style={{ background: "linear-gradient(135deg, #F5C842, #E8A020)" }}>
              <Sparkles size={11} />Open in planner
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Trip hero */}
        <div className="mb-8">
          <div className="text-5xl mb-3">{emoji}</div>
          <h1 className="font-display font-700 text-3xl sm:text-4xl text-park-cream mb-2">{trip.title}</h1>
          <p className="font-body text-park-mist">{trip.resortName}</p>

          <div className="flex flex-wrap gap-3 mt-4">
            {trip.travelDates && (
              <div className="flex items-center gap-1.5 text-xs font-body text-park-mist px-3 py-1.5 rounded-full"
                style={{ background: "rgba(245,200,66,0.08)", border: "1px solid rgba(245,200,66,0.15)" }}>
                <Calendar size={11} className="text-park-gold" />{trip.travelDates}
              </div>
            )}
            {trip.groupSize && (
              <div className="flex items-center gap-1.5 text-xs font-body text-park-mist px-3 py-1.5 rounded-full"
                style={{ background: "rgba(78,205,196,0.08)", border: "1px solid rgba(78,205,196,0.15)" }}>
                <Users size={11} className="text-park-mint" />{trip.groupSize}
              </div>
            )}
            {trip.budget && (
              <div className="flex items-center gap-1.5 text-xs font-body text-park-mist px-3 py-1.5 rounded-full"
                style={{ background: "rgba(126,211,33,0.08)", border: "1px solid rgba(126,211,33,0.15)" }}>
                <DollarSign size={11} style={{ color: "#7ED321" }} />{trip.budget}
              </div>
            )}
          </div>
        </div>

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-widest font-body font-600 text-park-gold mb-4">AI Plan Highlights</p>
            <div className="space-y-3">
              {highlights.map((msg, i) => (
                <div key={i} className="p-4 rounded-2xl border text-sm font-body text-park-mist leading-relaxed"
                  style={{ background: "rgba(26,46,69,0.4)", borderColor: "rgba(255,255,255,0.06)" }}
                  dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong style='color:#FFF8E7'>$1</strong>").replace(/\n/g, "<br/>").slice(0, 600) + (msg.content.length > 600 ? "…" : "") }} />
              ))}
            </div>
          </div>
        )}

        {/* Full conversation */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest font-body font-600 text-park-gold mb-4">Full Conversation</p>
          <div className="space-y-4">
            {trip.messages.filter(m => !m.content.startsWith("🏰 Welcome")).map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs text-park-mist font-body mb-4">Want to continue planning this trip?</p>
          <Link href={`/plan?resort=${trip.resortId}&load=${trip.id}`}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-body font-700 text-park-night"
            style={{ background: "linear-gradient(135deg, #F5C842, #E8A020)", boxShadow: "0 8px 24px rgba(245,200,66,0.25)" }}>
            <Sparkles size={16} />Continue in AI Planner
          </Link>
          <p className="text-[10px] text-park-mist/40 font-body mt-3">
            Powered by ParkPlan.ai · Free forever
          </p>
        </div>
      </div>
    </main>
  );
}
