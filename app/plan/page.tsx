"use client";
import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Send, Sparkles, ArrowLeft, Clock, DollarSign, Hotel, Map, RotateCcw, Bookmark, BookmarkCheck, Trash2, ChevronDown } from "lucide-react";
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
  { icon: Map, label: "Build my itinerary", prompt: "Build me a full optimized day itinerary for my trip. What order should I do the rides?" },
  { icon: Clock, label: "Minimize wait times", prompt: "What's the best strategy to minimize wait times today? What are the walk-ons right now?" },
  { icon: DollarSign, label: "Full budget breakdown", prompt: "Give me a complete budget breakdown for my trip including tickets, food, hotel, and extras." },
  { icon: Hotel, label: "Best hotels", prompt: "What are the best hotel options for my budget — both on-site and off-site? Compare pros and cons." },
];

interface Message { role: "user" | "assistant"; content: string; }

function SaveTripModal({
  onSave, onCancel, resortName,
}: {
  onSave: (title: string, meta: { travelDates?: string; groupSize?: string; budget?: string }) => void;
  onCancel: () => void;
  resortName: string;
}) {
  const [title, setTitle] = useState(`${resortName} Trip`);
  const [dates, setDates] = useState("");
  const [group, setGroup] = useState("");
  const [budget, setBudget] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-md rounded-2xl border p-6" style={{ background: "#0D1B2A", borderColor: "rgba(255,215,0,0.25)" }}>
        <h3 className="font-display font-700 text-lg text-park-cream mb-1">Save This Trip</h3>
        <p className="text-xs text-park-mist font-body mb-5">Saved locally on this device. No account needed.</p>

        <div className="space-y-3">
          {[
            { label: "Trip name", val: title, set: setTitle, placeholder: `${resortName} Trip` },
            { label: "Travel dates (optional)", val: dates, set: setDates, placeholder: "e.g. June 12–15, 2025" },
            { label: "Group size (optional)", val: group, set: setGroup, placeholder: "e.g. 2 adults, 2 kids" },
            { label: "Budget (optional)", val: budget, set: setBudget, placeholder: "e.g. $3,000 total" },
          ].map(({ label, val, set, placeholder }) => (
            <div key={label}>
              <label className="text-[10px] uppercase tracking-widest text-park-mist font-body font-600 block mb-1">{label}</label>
              <input
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                className="w-full text-sm font-body text-park-cream rounded-xl px-3 py-2.5 outline-none"
                style={{ background: "rgba(30,58,95,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-body text-park-mist border" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            Cancel
          </button>
          <button
            onClick={() => onSave(title || `${resortName} Trip`, { travelDates: dates, groupSize: group, budget })}
            className="flex-1 py-2.5 rounded-xl text-sm font-body font-700 text-park-night"
            style={{ background: "linear-gradient(135deg, #FFD700, #FFA500, #C8860A)" }}
          >
            Save Trip
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanPageContent() {
  const searchParams = useSearchParams();
  const resortId = searchParams.get("resort") || "";
  const loadId = searchParams.get("load") || "";
  const resortName = RESORT_NAMES[resortId] || "your park";

  const { trips, ready, saveTrip, updateTrip, deleteTrip } = useTripStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showTripList, setShowTripList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Welcome message
  const welcomeMsg: Message = {
    role: "assistant",
    content: `🏰 Welcome to ParkPlan.ai! I'm your personal theme park AI.\n\n${resortName !== "your park" ? `I see you're heading to **${resortName}** — great choice! ` : ""}I have live wait times, today's weather, and park hours loaded. I can help you with:\n\n**🗺 Build your day** — optimized ride order using live wait data\n**💰 Budget breakdown** — tickets, food, hotel costs\n**🏨 Hotel picks** — on-site vs. off-site comparison\n**⏱ Right now** — walk-ons, shortest waits, best moves\n\nTell me about your trip or pick a quick start below! ✨`,
  };

  useEffect(() => {
    if (!ready) return;
    if (loadId) {
      const trip = trips.find((t) => t.id === loadId);
      if (trip) {
        setMessages(trip.messages);
        setActiveTripId(trip.id);
        setSaved(true);
        return;
      }
    }
    setMessages([welcomeMsg]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, loadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    setSaved(false);

    try {
      let liveContext = "";
      try {
        const ctxRes = await fetch(`/api/context?resort=${resortId || "wdw"}`);
        if (ctxRes.ok) liveContext = (await ctxRes.json()).contextText || "";
      } catch { /* optional */ }

      const systemPrompt = `You are ParkPlan.ai — a friendly, expert AI theme park trip planner specializing in Disney resorts and Universal parks.

You help families plan incredible park days. You provide optimized itineraries, budget breakdowns, hotel recommendations, Lightning Lane strategy, crowd predictions, dining tips, and insider secrets.

${resortId ? `The user is planning a trip to ${RESORT_NAMES[resortId] || resortId}.` : ""}

${liveContext ? `${liveContext}\n\nIncorporate this live data naturally in your answers. Mention specific current wait times and walk-ons when relevant.` : ""}

Be warm, enthusiastic, and specific. Use **bold** for section headers. Use emojis sparingly. Keep responses actionable. You are an independent planning tool, NOT affiliated with Disney or Universal.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Something went wrong — please try again!";
      const finalMessages: Message[] = [...newMessages, { role: "assistant", content: reply }];
      setMessages(finalMessages);

      // Auto-update saved trip if one is active
      if (activeTripId) {
        updateTrip(activeTripId, finalMessages);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection error — please try again! 🎡" }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, resortId, activeTripId, updateTrip]);

  const handleSaveTrip = (title: string, meta: { travelDates?: string; groupSize?: string; budget?: string }) => {
    const trip = saveTrip(messages, resortId, resortName === "your park" ? "Theme Park" : resortName, { ...meta, title });
    setActiveTripId(trip.id);
    setSaved(true);
    setShowSaveModal(false);
  };

  const handleDeleteActive = () => {
    if (activeTripId) {
      deleteTrip(activeTripId);
      setActiveTripId(null);
      setSaved(false);
    }
  };

  const loadTrip = (trip: SavedTrip) => {
    setMessages(trip.messages);
    setActiveTripId(trip.id);
    setSaved(true);
    setShowTripList(false);
  };

  const resetChat = () => {
    setMessages([welcomeMsg]);
    setActiveTripId(null);
    setSaved(false);
    setInput("");
    setShowTripList(false);
  };

  const fmt = (content: string) =>
    content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

  return (
    <div className="flex flex-col h-screen" style={{ background: "#00194B" }}>
      {showSaveModal && (
        <SaveTripModal
          resortName={resortName !== "your park" ? resortName : "My"}
          onSave={handleSaveTrip}
          onCancel={() => setShowSaveModal(false)}
        />
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b flex-shrink-0"
        style={{ borderColor: "rgba(255,215,0,0.12)", background: "rgba(0,25,75,0.97)", backdropFilter: "blur(16px)" }}>
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft size={16} className="text-park-mist group-hover:text-park-gold transition-colors" />
          <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center">
            <MapPin size={13} className="text-park-night" />
          </div>
          <span className="font-display font-700 text-lg text-park-cream hidden sm:block">
            Park<span className="text-park-gold">Plan</span><span className="text-park-mist text-xs font-body font-normal ml-1">.ai</span>
          </span>
        </Link>

        {/* Saved trips dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTripList(!showTripList)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body font-500 border transition-all"
            style={{ borderColor: "rgba(245,200,66,0.2)", color: trips.length > 0 ? "#FFD700" : "#B8C9D9" }}
          >
            <Bookmark size={12} />
            {trips.length > 0 ? `${trips.length} saved` : "My trips"}
            <ChevronDown size={10} className={`transition-transform ${showTripList ? "rotate-180" : ""}`} />
          </button>

          {showTripList && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border shadow-2xl z-40 overflow-hidden"
              style={{ background: "#0D1B2A", borderColor: "rgba(245,200,66,0.2)" }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <span className="text-xs font-body font-600 text-park-cream">Saved Trips</span>
                <Link href="/trips" className="text-[10px] text-park-gold font-body hover:underline" onClick={() => setShowTripList(false)}>
                  View all →
                </Link>
              </div>
              {trips.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-park-mist font-body">No saved trips yet.</p>
                  <p className="text-[10px] text-park-mist/60 font-body mt-1">Chat and hit save to keep your plans.</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {trips.slice(0, 8).map((trip) => (
                    <button key={trip.id} onClick={() => loadTrip(trip)}
                      className="w-full px-4 py-3 text-left border-b hover:bg-white/5 transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                      <div className="text-xs font-body font-600 text-park-cream truncate">{trip.title}</div>
                      <div className="text-[10px] text-park-mist font-body mt-0.5 flex items-center gap-2">
                        <span>{trip.resortName}</span>
                        <span className="opacity-50">·</span>
                        <span>{new Date(trip.savedAt).toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {messages.length > 1 && !saved && (
            <button onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body font-600 transition-all"
              style={{ background: "rgba(255,215,0,0.12)", color: "#FFD700", border: "1px solid rgba(245,200,66,0.25)" }}>
              <Bookmark size={12} /> Save
            </button>
          )}
          {saved && activeTripId && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body font-500"
              style={{ background: "rgba(78,205,196,0.1)", color: "#4ECDC4", border: "1px solid rgba(78,205,196,0.2)" }}>
              <BookmarkCheck size={12} /> Saved
            </div>
          )}
          {activeTripId && (
            <button onClick={handleDeleteActive} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
              <Trash2 size={14} className="text-park-mist hover:text-park-coral transition-colors" />
            </button>
          )}
          <button onClick={resetChat} className="flex items-center gap-1.5 text-xs text-park-mist hover:text-park-gold transition-colors p-1.5 rounded-lg hover:bg-white/5">
            <RotateCcw size={13} />
          </button>
        </div>
      </header>

      {/* Resort badge */}
      {resortName !== "your park" && (
        <div className="px-4 sm:px-6 py-2 flex-shrink-0 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-body text-park-mist">
              <Sparkles size={11} className="text-park-gold" />
              <span>{resortName}</span>
              {activeTripId && <span className="opacity-50">· Auto-saving</span>}
            </div>
            <Link href={`/resorts/${resortId}`} className="text-[10px] text-park-mist/50 hover:text-park-gold transition-colors font-body">
              Resort info →
            </Link>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5" onClick={() => setShowTripList(false)}>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0 mr-2.5 mt-1">
                  <Sparkles size={12} className="text-park-night" />
                </div>
              )}
              <div
                className="max-w-[85%] sm:max-w-[78%] px-4 py-3 text-sm font-body leading-relaxed"
                style={msg.role === "user"
                  ? { background: "rgba(255,215,0,0.12)", border: "1px solid rgba(245,200,66,0.22)", borderRadius: "18px 18px 4px 18px", color: "#FFF8E7" }
                  : { background: "rgba(18,41,110,0.5)", border: "1px solid rgba(30,58,95,0.8)", borderRadius: "18px 18px 18px 4px", color: "#B8C9D9" }}
                dangerouslySetInnerHTML={{ __html: fmt(msg.content) }}
              />
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0 mr-2.5 mt-1">
                <Sparkles size={12} className="text-park-night" />
              </div>
              <div className="px-4 py-3 rounded-2xl flex items-center gap-2"
                style={{ background: "rgba(18,41,110,0.5)", border: "1px solid rgba(30,58,95,0.8)", borderRadius: "18px 18px 18px 4px" }}>
                {[0, 150, 300].map((d) => (
                  <div key={d} className="w-2 h-2 rounded-full bg-park-gold animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-4 sm:px-6 pb-3 flex-shrink-0">
          <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
              <button key={label} onClick={() => sendMessage(prompt)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-body font-500 text-park-mist hover:text-park-gold border transition-all hover:border-park-gold/40 hover:bg-white/5 text-left"
                style={{ borderColor: "rgba(18,41,110,0.8)" }}>
                <Icon size={13} className="text-park-gold flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 border-t flex-shrink-0" style={{ borderColor: "rgba(245,200,66,0.1)" }}
        onClick={() => setShowTripList(false)}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 rounded-2xl p-3 border"
            style={{ background: "rgba(10,31,92,0.6)", borderColor: "rgba(255,215,0,0.1)", backdropFilter: "blur(8px)" }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask about your trip — dates, rides, budget, dining…"
              className="flex-1 bg-transparent border-none outline-none text-park-cream text-sm font-body resize-none placeholder-park-mist/50 leading-relaxed"
              rows={1}
              onInput={(e) => { const el = e.currentTarget; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; }}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-30"
              style={{ background: loading || !input.trim() ? "rgba(18,41,110,0.8)" : "linear-gradient(135deg, #FFD700, #FFA500, #C8860A)" }}>
              <Send size={15} className={loading || !input.trim() ? "text-park-mist" : "text-park-night"} />
            </button>
          </div>
          <p className="text-[10px] text-park-mist/40 text-center mt-2 font-body">
            Live park data · Free forever · Not affiliated with Disney or Universal
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-park-night"><div className="text-park-gold animate-pulse font-display text-xl">Loading…</div></div>}>
      <PlanPageContent />
    </Suspense>
  );
}
