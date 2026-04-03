"use client";
import Link from "next/link";
import { MapPin, ArrowRight, Star } from "lucide-react";

export interface Resort {
  id: string; name: string; location: string; emoji: string;
  tagline: string; parks: number; accentColor: string; featured?: boolean;
}

const RESORTS: Resort[] = [
  { id: "wdw",              name: "Walt Disney World",    location: "Orlando, FL",      emoji: "🏰", tagline: "The Most Magical Place on Earth",       parks: 4, accentColor: "#FFD700",  featured: true },
  { id: "disneyland",       name: "Disneyland Resort",    location: "Anaheim, CA",      emoji: "✨", tagline: "The Happiest Place on Earth",            parks: 2, accentColor: "#FF9EBB" },
  { id: "paris",            name: "Disneyland Paris",     location: "Chessy, France",   emoji: "🗼", tagline: "Où la Magie Prend Vie",                  parks: 2, accentColor: "#87CEEB" },
  { id: "tokyo",            name: "Tokyo Disney Resort",  location: "Urayasu, Japan",   emoji: "🌸", tagline: "A World of Harmony and Magic",           parks: 2, accentColor: "#FFB7C5" },
  { id: "hongkong",         name: "Hong Kong Disneyland", location: "Lantau Island, HK",emoji: "🏮", tagline: "Where Fantasy Meets Asia",               parks: 1, accentColor: "#FFA500" },
  { id: "shanghai",         name: "Shanghai Disney",      location: "Pudong, China",    emoji: "🐉", tagline: "Authentically Disney, Distinctly Chinese",parks: 1, accentColor: "#7FDB8A" },
  { id: "universal-orlando",name: "Universal Orlando",    location: "Orlando, FL",      emoji: "🎬", tagline: "Vacation Like You Mean It",              parks: 3, accentColor: "#C084FC" },
];

function ResortCard({ resort }: { resort: Resort }) {
  return (
    <Link href={`/resorts/${resort.id}`}
      className="group relative flex flex-col p-5 rounded-2xl overflow-hidden transition-all duration-400"
      style={{
        background: "linear-gradient(135deg, rgba(18,41,110,0.65) 0%, rgba(10,31,92,0.75) 50%, rgba(61,26,120,0.35) 100%)",
        border: `1px solid rgba(255,215,0,0.12)`,
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,215,0,0.08)",
      }}>

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 30% 30%, ${resort.accentColor}18 0%, transparent 70%)`, boxShadow: `inset 0 1px 0 ${resort.accentColor}30` }} />

      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${resort.accentColor}60, transparent)` }} />

      {/* Featured badge */}
      {resort.featured && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-body font-700"
          style={{ background: "rgba(255,215,0,0.12)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.3)" }}>
          <Star size={8} fill="#FFD700" /> Most Visited
        </div>
      )}

      {/* Emoji with glow */}
      <div className="text-4xl mb-3.5 transition-transform duration-300 group-hover:scale-115 w-fit"
        style={{ filter: `drop-shadow(0 4px 16px ${resort.accentColor}60)` }}>
        {resort.emoji}
      </div>

      {/* Name */}
      <h3 className="font-display font-700 text-base leading-tight mb-1.5 transition-colors duration-200"
        style={{ color: "#FFF8E7", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
        {resort.name}
      </h3>

      {/* Tagline */}
      <p className="font-script text-sm mb-3 leading-snug italic"
        style={{ color: `${resort.accentColor}cc` }}>
        &ldquo;{resort.tagline}&rdquo;
      </p>

      {/* Location + parks */}
      <div className="flex items-center gap-1.5 text-xs font-body mb-4"
        style={{ color: "rgba(200,216,240,0.6)" }}>
        <MapPin size={10} style={{ color: resort.accentColor }} />
        <span>{resort.location}</span>
        <span className="ml-auto" style={{ color: "rgba(200,216,240,0.4)" }}>
          {resort.parks} {resort.parks === 1 ? "park" : "parks"}
        </span>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-1.5 text-xs font-body font-700 mt-auto group-hover:gap-2.5 transition-all duration-200"
        style={{ color: resort.accentColor }}>
        Plan this resort
        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

export default function ResortsSection() {
  return (
    <section id="resorts" className="py-24 sm:py-32 px-4 sm:px-6 relative">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(61,26,120,0.15) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto relative">

        {/* Section header */}
        <div className="text-center mb-14">
          <p className="font-body text-[11px] uppercase tracking-[0.25em] font-700 mb-3"
            style={{ color: "#FFD700" }}>
            ✦ All Magical Destinations ✦
          </p>
          <h2 className="font-display font-700 mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FFF8E7" }}>
            Every Disney & Universal{" "}
            <span className="text-shimmer">Resort, Worldwide</span>
          </h2>
          <p className="font-body max-w-xl mx-auto"
            style={{ color: "rgba(200,216,240,0.8)", fontSize: "1rem" }}>
            From Orlando to Tokyo, our AI knows every park, every ride, every shortcut.
            Pick your destination and we&apos;ll conjure your perfect day.
          </p>
        </div>

        {/* Resort grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {RESORTS.map((resort) => (
            <ResortCard key={resort.id} resort={resort} />
          ))}
        </div>

        {/* Decorative divider */}
        <div className="castle-divider mt-16" />
      </div>
    </section>
  );
}
