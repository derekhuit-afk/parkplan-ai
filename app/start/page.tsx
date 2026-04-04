"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, ChevronRight, Sparkles, Calendar, Users } from "lucide-react";

const RESORTS = [
  { id: "wdw",               name: "Walt Disney World",    location: "Orlando, FL",    emoji: "🏰", popular: true },
  { id: "disneyland",        name: "Disneyland Resort",    location: "Anaheim, CA",    emoji: "✨" },
  { id: "paris",             name: "Disneyland Paris",     location: "France",         emoji: "🗼" },
  { id: "tokyo",             name: "Tokyo Disney Resort",  location: "Japan",          emoji: "🌸" },
  { id: "hongkong",          name: "Hong Kong Disneyland", location: "Hong Kong",      emoji: "🏮" },
  { id: "shanghai",          name: "Shanghai Disney",      location: "China",          emoji: "🐉" },
  { id: "universal-orlando", name: "Universal Orlando",    location: "Orlando, FL",    emoji: "🎬" },
];

const TRIP_TYPES = [
  { id: "today", emoji: "📍", label: "I'm at the park today", sub: "Live waits + real-time plan" },
  { id: "soon",  emoji: "📅", label: "Visiting in the next 30 days", sub: "Crowd forecast + advance planning" },
  { id: "later", emoji: "🗓", label: "Planning for later", sub: "Budgeting + what to book ahead" },
];

const GROUP_TYPES = [
  { id: "solo",   emoji: "🧑", label: "Solo" },
  { id: "couple", emoji: "👫", label: "Couple" },
  { id: "family", emoji: "👨‍👩‍👧", label: "Family with kids" },
  { id: "group",  emoji: "👥", label: "Group" },
];

export default function StartPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1=resort, 2=when, 3=who
  const [resort, setResort] = useState("");
  const [tripType, setTripType] = useState("");
  const [groupType, setGroupType] = useState("");

  const handleLaunch = () => {
    const selectedResort = RESORTS.find(r => r.id === resort);
    const groupLabel = GROUP_TYPES.find(g => g.id === groupType)?.label || "";
    const typeLabel = TRIP_TYPES.find(t => t.id === tripType)?.label || "";

    // Build a rich first prompt based on selections
    const prompt = `I'm planning a trip to ${selectedResort?.name}. ${typeLabel}. Traveling as: ${groupLabel}. Give me the most important things I need to know and a personalized plan.`;
    const encodedPrompt = encodeURIComponent(prompt);
    router.push(`/plan?resort=${resort}&autostart=${encodedPrompt}`);
  };

  const progress = step / 3;

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#00194B" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🏰</span>
          <span style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "1rem", color: "#FFD700" }}>ParkPlan.ai</span>
        </Link>
        <Link href="/plan" style={{ fontFamily: "var(--font-nunito)", fontSize: "0.75rem", color: "rgba(220,235,255,0.5)" }}>
          Skip →
        </Link>
      </header>

      {/* Progress bar */}
      <div className="px-5 mb-6 flex-shrink-0">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg, #FFD700, #FFA500)" }} />
        </div>
        <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.65rem", color: "rgba(220,235,255,0.4)", marginTop: "6px" }}>
          Step {step} of 3
        </p>
      </div>

      {/* Step content */}
      <div className="flex-1 px-5 overflow-y-auto">

        {/* STEP 1: Resort */}
        {step === 1 && (
          <div>
            <h1 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 800, fontSize: "1.6rem", color: "#FFFFFF", marginBottom: "6px" }}>
              Which resort?
            </h1>
            <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.85rem", color: "rgba(220,235,255,0.65)", marginBottom: "20px" }}>
              Pick your destination and we&apos;ll tailor everything to it.
            </p>
            <div className="space-y-2.5">
              {RESORTS.map((r) => (
                <button key={r.id} onClick={() => { setResort(r.id); setStep(2); }}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all active:scale-[0.98]"
                  style={{
                    background: resort === r.id ? "rgba(255,215,0,0.12)" : "rgba(255,255,255,0.05)",
                    border: resort === r.id ? "1.5px solid rgba(255,215,0,0.4)" : "1px solid rgba(255,255,255,0.1)",
                  }}>
                  <span style={{ fontSize: "2rem", lineHeight: 1 }}>{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "0.95rem", color: "#FFFFFF" }}>{r.name}</p>
                    <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.72rem", color: "rgba(220,235,255,0.5)", marginTop: "1px" }}>{r.location}</p>
                  </div>
                  {r.popular && (
                    <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.6rem", fontWeight: 700, color: "#FFD700", background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.25)", borderRadius: "20px", padding: "2px 8px" }}>
                      Popular
                    </span>
                  )}
                  <ChevronRight size={16} style={{ color: "rgba(220,235,255,0.3)", flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: When */}
        {step === 2 && (
          <div>
            <h1 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 800, fontSize: "1.6rem", color: "#FFFFFF", marginBottom: "6px" }}>
              When are you going?
            </h1>
            <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.85rem", color: "rgba(220,235,255,0.65)", marginBottom: "20px" }}>
              This changes what advice the AI gives you.
            </p>
            <div className="space-y-3">
              {TRIP_TYPES.map((t) => (
                <button key={t.id} onClick={() => { setTripType(t.id); setStep(3); }}
                  className="w-full flex items-center gap-4 px-5 py-5 rounded-2xl text-left transition-all active:scale-[0.98]"
                  style={{
                    background: tripType === t.id ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.05)",
                    border: tripType === t.id ? "1.5px solid rgba(255,215,0,0.35)" : "1px solid rgba(255,255,255,0.1)",
                  }}>
                  <span style={{ fontSize: "2rem" }}>{t.emoji}</span>
                  <div>
                    <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.95rem", color: "#FFFFFF" }}>{t.label}</p>
                    <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.72rem", color: "rgba(220,235,255,0.5)", marginTop: "2px" }}>{t.sub}</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-5"
              style={{ fontFamily: "var(--font-nunito)", fontSize: "0.72rem", color: "rgba(220,235,255,0.4)" }}>
              ← Back
            </button>
          </div>
        )}

        {/* STEP 3: Who */}
        {step === 3 && (
          <div>
            <h1 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 800, fontSize: "1.6rem", color: "#FFFFFF", marginBottom: "6px" }}>
              Who&apos;s going?
            </h1>
            <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.85rem", color: "rgba(220,235,255,0.65)", marginBottom: "20px" }}>
              We&apos;ll tailor ride recommendations and tips to your group.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {GROUP_TYPES.map((g) => (
                <button key={g.id} onClick={() => setGroupType(g.id)}
                  className="flex flex-col items-center gap-2 py-5 rounded-2xl transition-all active:scale-[0.97]"
                  style={{
                    background: groupType === g.id ? "rgba(255,215,0,0.12)" : "rgba(255,255,255,0.05)",
                    border: groupType === g.id ? "1.5px solid rgba(255,215,0,0.4)" : "1px solid rgba(255,255,255,0.1)",
                  }}>
                  <span style={{ fontSize: "2.2rem" }}>{g.emoji}</span>
                  <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.85rem", color: "#FFFFFF" }}>{g.label}</span>
                </button>
              ))}
            </div>

            <button onClick={() => setStep(2)} className="mt-5"
              style={{ fontFamily: "var(--font-nunito)", fontSize: "0.72rem", color: "rgba(220,235,255,0.4)" }}>
              ← Back
            </button>
          </div>
        )}
      </div>

      {/* Bottom CTA — shows on step 3 */}
      {step === 3 && groupType && (
        <div className="flex-shrink-0 px-5 pb-8 pt-4">
          <button onClick={handleLaunch}
            className="btn-primary w-full"
            style={{ padding: "1.1rem", fontSize: "1.05rem", fontWeight: 800 }}>
            <Sparkles size={20} />
            Build My Plan
          </button>
        </div>
      )}
    </div>
  );
}
