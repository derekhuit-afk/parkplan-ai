"use client";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

export interface Resort {
  id: string;
  name: string;
  location: string;
  emoji: string;
  tagline: string;
  parks: number;
  color: string;
  accentColor: string;
  featured?: boolean;
}

const RESORTS: Resort[] = [
  {
    id: "wdw",
    name: "Walt Disney World",
    location: "Orlando, FL",
    emoji: "🏰",
    tagline: "The Most Magical Place on Earth",
    parks: 4,
    color: "rgba(30,58,95,0.7)",
    accentColor: "#F5C842",
    featured: true,
  },
  {
    id: "disneyland",
    name: "Disneyland Resort",
    location: "Anaheim, CA",
    emoji: "✨",
    tagline: "The Happiest Place on Earth",
    parks: 2,
    color: "rgba(30,58,95,0.7)",
    accentColor: "#FF6B6B",
  },
  {
    id: "paris",
    name: "Disneyland Paris",
    location: "Chessy, France",
    emoji: "🗼",
    tagline: "Où la Magie Prend Vie",
    parks: 2,
    color: "rgba(30,58,95,0.7)",
    accentColor: "#4ECDC4",
  },
  {
    id: "tokyo",
    name: "Tokyo Disney Resort",
    location: "Urayasu, Japan",
    emoji: "🌸",
    tagline: "A World of Harmony and Magic",
    parks: 2,
    color: "rgba(30,58,95,0.7)",
    accentColor: "#FF9EBB",
  },
  {
    id: "hongkong",
    name: "Hong Kong Disneyland",
    location: "Lantau Island, HK",
    emoji: "🏮",
    tagline: "Where Fantasy Meets Asia",
    parks: 1,
    color: "rgba(30,58,95,0.7)",
    accentColor: "#F5A623",
  },
  {
    id: "shanghai",
    name: "Shanghai Disney Resort",
    location: "Pudong, China",
    emoji: "🐉",
    tagline: "Authentically Disney, Distinctly Chinese",
    parks: 1,
    color: "rgba(30,58,95,0.7)",
    accentColor: "#7ED321",
  },
  {
    id: "universal-orlando",
    name: "Universal Orlando",
    location: "Orlando, FL",
    emoji: "🎬",
    tagline: "Vacation Like You Mean It",
    parks: 3,
    color: "rgba(30,58,95,0.7)",
    accentColor: "#BD10E0",
  },
];

function ResortCard({ resort }: { resort: Resort }) {
  return (
    <Link
  href={`/resorts/${resort.id}`}
      className="group relative flex flex-col p-5 sm:p-6 rounded-2xl border transition-all duration-300 card-glow overflow-hidden"
      style={{
        background: resort.color,
        borderColor: `${resort.accentColor}20`,
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, ${resort.accentColor}15 0%, transparent 70%)`,
        }}
      />

      {resort.featured && (
        <div
          className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-body font-600"
          style={{
            background: `${resort.accentColor}20`,
            color: resort.accentColor,
            border: `1px solid ${resort.accentColor}40`,
          }}
        >
          Most Popular
        </div>
      )}

      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
        {resort.emoji}
      </div>

      <h3 className="font-display font-700 text-base sm:text-lg text-park-cream mb-1 leading-tight">
        {resort.name}
      </h3>

      <p className="font-body text-xs text-park-mist italic mb-3 leading-snug">
        &ldquo;{resort.tagline}&rdquo;
      </p>

      <div className="flex items-center gap-1 text-xs text-park-mist mb-4">
        <MapPin size={11} style={{ color: resort.accentColor }} />
        <span>{resort.location}</span>
        <span className="ml-auto text-park-mist/60">{resort.parks} {resort.parks === 1 ? "park" : "parks"}</span>
      </div>

      <div
        className="flex items-center gap-1.5 text-xs font-body font-600 mt-auto group-hover:gap-2.5 transition-all"
        style={{ color: resort.accentColor }}
      >
        Plan this resort
        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

export default function ResortsSection() {
  return (
    <section id="resorts" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="font-body text-xs uppercase tracking-widest text-park-gold mb-3 font-600">
            All Resorts
          </p>
          <h2 className="font-display font-700 text-3xl sm:text-4xl md:text-5xl text-park-cream mb-4">
            Every Magical <span className="italic text-park-gold">Destination</span>
          </h2>
          <p className="font-body text-park-mist max-w-xl mx-auto text-base">
            From Orlando to Tokyo, our AI knows every park, ride, and shortcut.
            Pick your resort and we&apos;ll build your perfect day.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {RESORTS.map((resort) => (
            <ResortCard key={resort.id} resort={resort} />
          ))}
        </div>
      </div>
    </section>
  );
}
