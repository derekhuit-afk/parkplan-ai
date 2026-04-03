"use client";
import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Send, Sparkles, ArrowLeft, Clock, DollarSign, Hotel, Map, RotateCcw, Bookmark, BookmarkCheck, Trash2, ChevronDown } from "lucide-react";
import { useTripStore, type SavedTrip } from "@/hooks/useTripStore";

const RESORT_NAMES: Record<string, string> = {
  wdw: "Walt Disney World",
  disneyland: "Disneyland Resort",
  paris: "Disneyland Paris",
  tokyo: "Tokyo Disney Resort",
  hongkong: "Hong Kong Disneyland",
  shanghai: "Shanghai Disney Resort",
  "universal-orlando": "Universal Orlando Resort",
};

const QUICK_PROMPTS = [
  { icon: Map,       label: "Build my itinerary",      prompt: "Build me a full optimized day itinerary. What's the best order to do the rides given current wait times?" },
  { icon: Clock,     label: "Minimize wait times",     prompt: "What rides are walk-ons right now and what's the best strategy to avoid long waits today?" },
  { icon: DollarSign,label: "Full budget breakdown",   prompt: "Give me a complete budget breakdown — tickets, food, hotel, and any extras." },
  { icon: Hotel,     label: "Best hotels nearby",      prompt: "What are the best hotels for my trip? Compare on-site vs off-site options and prices." },
];

interface Message { role: "user" | "assistant"; content: string; }

function SaveModal({ onSave, onCancel, resortName }: {
  onSave: (title: string, meta: { travelDates?: string; groupSize?: string; budget?: string }) => void;
  onCancel: () => void;
  resortName: string;
}) {
  const [title, setTitle] = useState(`${resortName} Trip`);
  const [dates, setDates] = useState("");
  const [group, setGroup] = useState("");
  const [budget, setBudget] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "#0A1F5C", border: "1px solid rgba(255,215,0,0.25)" }}>
        <h3 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "1.1rem", color: "#FFF8E7", marginBottom: "4px" }}>
          Save This Trip
        </h3>
        <p className="font-body text-xs mb-5" style={{ color: "rgba(220,235,255,0.75)", fontFamily: "var(--font-nunito)" }}>
          Saved on this device. No account needed.
        </p>
        <div className="space-y-3">
          {[
            { label: "Trip name", val: title, set: setTitle, ph: `${resortName} Trip` },
            { label: "Travel dates (optional)", val: dates, set: setDates, ph: "e.g. June 12–15, 2025" },
            { label: "Group (optional)", val: group, set: setGroup, ph: "e.g. 2 adults, 2 kids" },
            { label: "Budget (optional)", val: budget, set: setBudget, ph: "e.g. $3,000 total" },
          ].map(({ label, val, set, ph }) => (
            <div key={label}>
              <label className="font-body text-[10px] uppercase tracking-widest block mb-1" style={{ color: "rgba(255,215,0,0.6)", fontFamily: "var(--font-nunito)" }}>{label}</label>
              <input value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                className="w-full text-sm font-body rounded-xl px-3 py-2.5 outline-none"
                style={{ background: "rgba(0,25,75,0.6)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFF8E7", fontFamily: "var(--font-nunito)" }} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-body"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(200,216,240,0.7)", fontFamily: "var(--font-nunito)" }}>Cancel</button>
          <button onClick={() => onSave(title || `${resortName} Trip`, { travelDates: dates, groupSize: group, budget })}
            className="btn-primary flex-1 py-2.5 text-sm">Save Trip</button>
        </div>
      </div>
    </div>
  );
}

function PlanContent() {
  const searchParams = useSearchParams();
  const resortId = searchParams.get("resort") || "";
  const loadId = searchParams.get("load") || "";
  const resortName = RESORT_NAMES[resortId] || "Your Park";

  const { trips, ready, saveTrip, updateTrip, deleteTrip } = useTripStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showTrips, setShowTrips] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const welcome: Message = {
    role: "assistant",
    content: `🏰 **Welcome to ParkPlan.ai!**${resortName !== "Your Park" ? `\n\nPlanning **${resortName}**? I have live wait times, today\'s weather, and park hours loaded.` : "\n\nI have live wait times, weather, and park hours ready."}\n\nTap a button below to get started, or ask me anything!`,
  };

  useEffect(() => {
    if (!ready) return;
    if (loadId) {
      const trip = trips.find((t) => t.id === loadId);
      if (trip) { setMessages(trip.messages); setActiveTripId(trip.id); setSaved(true); return; }
    }
    setMessages([welcome]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, loadId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = useCallback(async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    const next: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resortId: resortId || "wdw",
          // Strip leading assistant messages — Anthropic requires first message to be "user"
          messages: next
            .map((m) => ({ role: m.role, content: m.content }))
            .filter((_, i, arr) => {
              // Find the first user message index and only include from there
              const firstUser = arr.findIndex((m) => m.role === "user");
              return i >= firstUser;
            }),
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, something went wrong — please try again!";
      const final: Message[] = [...next, { role: "assistant", content: reply }];
      setMessages(final);
      if (activeTripId) updateTrip(activeTripId, final);
    } catch {
      setMessages([...next, { role: "assistant", content: "⚠️ Connection issue — please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, resortId, activeTripId, updateTrip]);

  const handleSave = (title: string, meta: { travelDates?: string; groupSize?: string; budget?: string }) => {
    const trip = saveTrip(messages, resortId, resortName, { ...meta, title });
    setActiveTripId(trip.id); setSaved(true); setShowSave(false);
  };

  const loadTrip = (trip: SavedTrip) => {
    setMessages(trip.messages); setActiveTripId(trip.id); setSaved(true); setShowTrips(false);
  };

  const reset = () => { setMessages([welcome]); setActiveTripId(null); setSaved(false); setInput(""); setShowTrips(false); };

  const fmt = (text: string) =>
    text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

  return (
    <div className="flex flex-col h-[100dvh]" style={{ background: "#00194B" }}>
      {showSave && <SaveModal resortName={resortName} onSave={handleSave} onCancel={() => setShowSave(false)} />}

      {/* ── Header ────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b"
        style={{ background: "rgba(0,25,75,0.97)", borderColor: "rgba(255,215,0,0.12)", backdropFilter: "blur(16px)" }}>

        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft size={16} style={{ color: "rgba(220,235,255,0.75)" }} className="group-hover:text-yellow-300 transition-colors" />
          <span className="text-lg">🏰</span>
          <span style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "1rem", color: "#FFD700" }}>
            ParkPlan<span style={{ color: "rgba(220,235,255,0.55)", fontWeight: 400 }}>.ai</span>
          </span>
        </Link>

        {/* Resort label */}
        {resortName !== "Your Park" && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body"
            style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", color: "#FFD700", fontFamily: "var(--font-nunito)" }}>
            ✦ {resortName}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Saved trips dropdown */}
          <div className="relative">
            <button onClick={() => setShowTrips(!showTrips)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body border transition-all"
              style={{ borderColor: "rgba(255,215,0,0.2)", color: trips.length > 0 ? "#FFD700" : "rgba(220,235,255,0.65)", fontFamily: "var(--font-nunito)" }}>
              <Bookmark size={12} />
              {trips.length > 0 ? `${trips.length}` : "Trips"}
              <ChevronDown size={10} className={`transition-transform ${showTrips ? "rotate-180" : ""}`} />
            </button>
            {showTrips && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border shadow-2xl z-40 overflow-hidden"
                style={{ background: "#0A1F5C", borderColor: "rgba(255,215,0,0.2)" }}>
                <div className="px-4 py-3 border-b flex items-center justify-between"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="text-xs font-body font-600" style={{ color: "#FFF8E7", fontFamily: "var(--font-nunito)" }}>Saved Trips</span>
                  <Link href="/trips" className="text-[10px] hover:underline" style={{ color: "#FFD700", fontFamily: "var(--font-nunito)" }}
                    onClick={() => setShowTrips(false)}>View all →</Link>
                </div>
                {trips.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs font-body" style={{ color: "rgba(220,235,255,0.65)", fontFamily: "var(--font-nunito)" }}>No saved trips yet</p>
                  </div>
                ) : trips.slice(0, 6).map((trip) => (
                  <button key={trip.id} onClick={() => loadTrip(trip)}
                    className="w-full px-4 py-3 text-left border-b hover:bg-white/5 transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    <div className="text-xs font-body font-600 truncate" style={{ color: "#FFF8E7", fontFamily: "var(--font-nunito)" }}>{trip.title}</div>
                    <div className="text-[10px] font-body mt-0.5" style={{ color: "rgba(220,235,255,0.65)", fontFamily: "var(--font-nunito)" }}>
                      {trip.resortName} · {new Date(trip.savedAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save button */}
          {messages.length > 1 && !saved && (
            <button onClick={() => setShowSave(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body border transition-all"
              style={{ background: "rgba(255,215,0,0.1)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.25)", fontFamily: "var(--font-nunito)" }}>
              <Bookmark size={12} /> Save
            </button>
          )}
          {saved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body"
              style={{ background: "rgba(127,219,202,0.1)", color: "#7FDBCA", border: "1px solid rgba(127,219,202,0.2)", fontFamily: "var(--font-nunito)" }}>
              <BookmarkCheck size={12} /> Saved
            </div>
          )}
          {activeTripId && (
            <button onClick={() => { deleteTrip(activeTripId); setActiveTripId(null); setSaved(false); }}
              className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
              <Trash2 size={13} style={{ color: "rgba(220,235,255,0.55)" }} />
            </button>
          )}
          <button onClick={reset} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <RotateCcw size={14} style={{ color: "rgba(220,235,255,0.65)" }} />
          </button>
        </div>
      </header>

      {/* ── Messages ──────────────────────── */}
      <div className={messages.length <= 1 ? "flex-shrink-0 px-4 pt-5 pb-2" : "flex-1 overflow-y-auto px-4 py-5 min-h-0"} onClick={() => setShowTrips(false)}>
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5 text-base"
                  style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)", flexShrink: 0 }}>
                  🏰
                </div>
              )}
              <div className="max-w-[85%] sm:max-w-[78%] px-4 py-3 text-sm font-body leading-relaxed"
                style={msg.role === "user"
                  ? { background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: "18px 18px 4px 18px", color: "#FFF8E7", fontFamily: "var(--font-nunito)" }
                  : { background: "rgba(18,41,110,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px 18px 18px 4px", color: "#E0EEFF", fontFamily: "var(--font-nunito)" }}
                dangerouslySetInnerHTML={{ __html: fmt(msg.content) }} />
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2.5 text-base"
                style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)" }}>
                🏰
              </div>
              <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                style={{ background: "rgba(18,41,110,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px 18px 18px 4px" }}>
                {[0,150,300].map((d) => (
                  <div key={d} className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: "#FFD700", animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* ── Quick Prompt Buttons ───────────── */}
      {messages.length <= 1 && (
        <div className="flex-shrink-0 px-4 pb-4" onClick={() => setShowTrips(false)}>
          <p style={{
            fontFamily: "var(--font-nunito)",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,215,0,0.6)",
            textAlign: "center",
            marginBottom: "10px",
          }}>
            Quick Start
          </p>
          <div className="max-w-2xl mx-auto flex flex-col gap-3">
            {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
              <button key={label} onClick={() => send(prompt)}
                className="flex items-center gap-4 w-full text-left transition-all active:scale-[0.98]"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,215,0,0.22)",
                  borderRadius: "16px",
                  padding: "1rem 1.1rem",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-nunito)",
                }}>
                {/* Icon orb */}
                <div className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(255,215,0,0.14)",
                    border: "1px solid rgba(255,215,0,0.25)",
                  }}>
                  <Icon size={20} style={{ color: "#FFD700" }} />
                </div>
                {/* Label */}
                <span style={{
                  fontSize: "0.98rem",
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}>
                  {label}
                </span>
                {/* Arrow */}
                <span style={{
                  marginLeft: "auto",
                  color: "rgba(255,215,0,0.5)",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}>
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spacer — pushes input to bottom when in initial state */}
      {messages.length <= 1 && <div className="flex-1" />}

      {/* ── Input Bar ─────────────────────── */}
      <div className="flex-shrink-0 px-4 pb-5 pt-3 border-t" style={{ borderColor: "rgba(255,215,0,0.1)" }}
        onClick={() => setShowTrips(false)}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-3 rounded-2xl px-4 py-3"
            style={{ background: "rgba(18,41,110,0.6)", border: "1px solid rgba(255,215,0,0.15)" }}>
            <textarea ref={textareaRef} value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything about your trip…"
              rows={1}
              className="flex-1 bg-transparent border-none outline-none text-sm resize-none leading-relaxed"
              style={{ color: "#FFF8E7", fontFamily: "var(--font-nunito)", maxHeight: "100px" }}
              onInput={(e) => { const el = e.currentTarget; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 100) + "px"; }} />
            <button onClick={() => send()} disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
              style={{ background: loading || !input.trim() ? "rgba(18,41,110,0.8)" : "linear-gradient(135deg, #FFD700, #FFA500)" }}>
              <Send size={16} style={{ color: loading || !input.trim() ? "rgba(220,235,255,0.55)" : "#00194B" }} />
            </button>
          </div>
          <p className="text-[10px] text-center mt-2 font-body" style={{ color: "rgba(220,235,255,0.45)", fontFamily: "var(--font-nunito)" }}>
            Live park data · Free forever · Not affiliated with Disney or Universal
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={
      <div className="h-[100dvh] flex items-center justify-center" style={{ background: "#00194B" }}>
        <div className="text-center">
          <div className="text-4xl mb-3">🏰</div>
          <p style={{ fontFamily: "var(--font-cinzel)", color: "#FFD700", fontSize: "1rem" }}>Loading your magic…</p>
        </div>
      </div>
    }>
      <PlanContent />
    </Suspense>
  );
}
