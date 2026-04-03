"use client";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

interface Resort {
  id: string; name: string; location: string; emoji: string;
  tagline: string; parks: number; accentColor: string; featured?: boolean;
}

const RESORTS: Resort[] = [
  { id: "wdw",               name: "Walt Disney World",    location: "Orlando, FL",       emoji: "🏰", tagline: "The Most Magical Place on Earth",        parks: 4, accentColor: "#FFD700", featured: true },
  { id: "disneyland",        name: "Disneyland Resort",    location: "Anaheim, CA",       emoji: "✨", tagline: "The Happiest Place on Earth",             parks: 2, accentColor: "#FF9EBB" },
  { id: "paris",             name: "Disneyland Paris",     location: "Chessy, France",    emoji: "🗼", tagline: "Où la Magie Prend Vie",                   parks: 2, accentColor: "#87CEEB" },
  { id: "tokyo",             name: "Tokyo Disney Resort",  location: "Urayasu, Japan",    emoji: "🌸", tagline: "A World of Harmony and Magic",            parks: 2, accentColor: "#FFB7C5" },
  { id: "hongkong",          name: "Hong Kong Disneyland", location: "Lantau Island, HK", emoji: "🏮", tagline: "Where Fantasy Meets Asia",                parks: 1, accentColor: "#FFA500" },
  { id: "shanghai",          name: "Shanghai Disney",      location: "Pudong, China",     emoji: "🐉", tagline: "Authentically Disney, Distinctly Chinese", parks: 1, accentColor: "#7FDB8A" },
  { id: "universal-orlando", name: "Universal Orlando",    location: "Orlando, FL",       emoji: "🎬", tagline: "Vacation Like You Mean It",               parks: 3, accentColor: "#C084FC" },
];

export default function ResortsSection() {
  return (
    <section id="resorts" className="py-24 px-5 sm:px-8 relative">
      <div className="max-w-6xl mx-auto">

        {/* Section header — simple */}
        <div className="text-center mb-12">
          <p className="font-body text-xs font-700 uppercase tracking-[0.2em] mb-3"
            style={{ color: "rgba(255,215,0,0.7)", fontFamily: "var(--font-nunito)" }}>
            Choose Your Destination
          </p>
          <h2 className="font-display font-700 mb-3"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#FFF8E7", fontFamily: "var(--font-cinzel)" }}>
            Every Magical Resort, Covered
          </h2>
          <p className="font-body text-base max-w-md mx-auto"
            style={{ color: "rgba(200,216,240,0.7)", fontFamily: "var(--font-nunito)" }}>
            Pick a resort and we&apos;ll build your perfect day — AI plans, live waits, and all.
          </p>
        </div>

        {/* Resort grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {RESORTS.map((resort) => (
            <Link key={resort.id} href={`/resorts/${resort.id}`}
              className="card group relative p-6 flex flex-col">

              {/* Top color line */}
              <div className="absolute top-0 left-8 right-8 h-px rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${resort.accentColor}70, transparent)` }} />

              {resort.featured && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-body font-700"
                  style={{ background: "rgba(255,215,0,0.1)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.25)" }}>
                  <Star size={8} fill="#FFD700" /> Popular
                </div>
              )}

              <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 w-fit"
                style={{ filter: `drop-shadow(0 4px 12px ${resort.accentColor}50)` }}>
                {resort.emoji}
              </div>

              <h3 className="font-display font-700 text-base leading-snug mb-1"
                style={{ color: "#FFF8E7", fontFamily: "var(--font-cinzel)" }}>
                {resort.name}
              </h3>

              <p className="text-script text-sm mb-3 leading-snug"
                style={{ color: `${resort.accentColor}cc`, fontSize: "0.85rem" }}>
                &ldquo;{resort.tagline}&rdquo;
              </p>

              <p className="font-body text-xs mb-5" style={{ color: "rgba(200,216,240,0.5)", fontFamily: "var(--font-nunito)" }}>
                {resort.location} · {resort.parks} {resort.parks === 1 ? "park" : "parks"}
              </p>

              {/* Plan CTA inline */}
              <Link href={`/plan?resort=${resort.id}`}
                className="mt-auto btn-primary text-xs py-2.5 px-4 w-full justify-center font-700"
                onClick={(e) => e.stopPropagation()}
                style={{ fontSize: "0.8rem", padding: "0.6rem 1rem" }}>
                Plan This Resort →
              </Link>
            </Link>
          ))}
        </div>

        <div className="gold-divider" />
      </div>
    </section>
  );
}
