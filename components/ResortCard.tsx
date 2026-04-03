"use client";
import Link from "next/link";
import { Star } from "lucide-react";

interface Resort {
  id: string; name: string; location: string; emoji: string;
  tagline: string; parks: number; accentColor: string; featured?: boolean;
}

const RESORTS: Resort[] = [
  { id: "wdw",               name: "Walt Disney World",    location: "Orlando, FL",       emoji: "🏰", tagline: "The Most Magical Place on Earth",         parks: 4, accentColor: "#FFD700", featured: true },
  { id: "disneyland",        name: "Disneyland Resort",    location: "Anaheim, CA",       emoji: "✨", tagline: "The Happiest Place on Earth",              parks: 2, accentColor: "#FF9EBB" },
  { id: "paris",             name: "Disneyland Paris",     location: "Chessy, France",    emoji: "🗼", tagline: "Où la Magie Prend Vie",                    parks: 2, accentColor: "#87CEEB" },
  { id: "tokyo",             name: "Tokyo Disney Resort",  location: "Urayasu, Japan",    emoji: "🌸", tagline: "A World of Harmony and Magic",             parks: 2, accentColor: "#FFB7C5" },
  { id: "hongkong",          name: "Hong Kong Disneyland", location: "Lantau Island, HK", emoji: "🏮", tagline: "Where Fantasy Meets Asia",                 parks: 1, accentColor: "#FFA500" },
  { id: "shanghai",          name: "Shanghai Disney Resort",location: "Pudong, China",    emoji: "🐉", tagline: "Authentically Disney, Distinctly Chinese",  parks: 1, accentColor: "#7FDB8A" },
  { id: "universal-orlando", name: "Universal Orlando",    location: "Orlando, FL",       emoji: "🎬", tagline: "Vacation Like You Mean It",                parks: 3, accentColor: "#C084FC" },
];

export default function ResortsSection() {
  return (
    <section id="resorts" className="py-20 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,215,0,0.65)", marginBottom: "10px" }}>
            Choose Your Destination
          </p>
          <h2 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", color: "#FFFFFF", marginBottom: "10px" }}>
            Every Magical Resort, Covered
          </h2>
          <p style={{ fontFamily: "var(--font-nunito)", fontSize: "1rem", color: "rgba(220,235,255,0.75)", maxWidth: "440px", margin: "0 auto" }}>
            Pick a resort and we&apos;ll build your perfect day — AI plans, live wait times, and all.
          </p>
        </div>

        {/* Resort list — vertical on mobile, grid on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RESORTS.map((resort) => (
            <div key={resort.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}>

              {/* Card body */}
              <div className="p-5">
                {/* Top row: emoji + featured badge */}
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontSize: "2rem", lineHeight: 1 }}>{resort.emoji}</span>
                  {resort.featured && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full"
                      style={{ background: "rgba(255,215,0,0.15)", border: "1px solid rgba(255,215,0,0.3)" }}>
                      <Star size={9} fill="#FFD700" style={{ color: "#FFD700" }} />
                      <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.6rem", fontWeight: 700, color: "#FFD700" }}>Popular</span>
                    </div>
                  )}
                </div>

                {/* Resort name — high contrast white */}
                <h3 style={{
                  fontFamily: "var(--font-cinzel)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "#FFFFFF",
                  marginBottom: "6px",
                  lineHeight: 1.25,
                }}>
                  {resort.name}
                </h3>

                {/* Tagline — light not script, readable */}
                <p style={{
                  fontFamily: "var(--font-nunito)",
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                  color: resort.accentColor,
                  marginBottom: "4px",
                  opacity: 0.9,
                }}>
                  &ldquo;{resort.tagline}&rdquo;
                </p>

                {/* Location */}
                <p style={{
                  fontFamily: "var(--font-nunito)",
                  fontSize: "0.75rem",
                  color: "rgba(200,220,255,0.55)",
                  marginBottom: "14px",
                }}>
                  {resort.location} · {resort.parks} {resort.parks === 1 ? "park" : "parks"}
                </p>

                {/* Plan button — full width, prominent */}
                <Link href={`/plan?resort=${resort.id}`}
                  className="btn-primary block text-center w-full"
                  style={{
                    padding: "0.75rem 1rem",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    borderRadius: "12px",
                  }}>
                  ✨ Plan {resort.name.split(" ")[0]} Trip
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="gold-divider mt-14" />
      </div>
    </section>
  );
}
