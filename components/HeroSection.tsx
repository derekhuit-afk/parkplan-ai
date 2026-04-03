"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, MapPin, ChevronDown } from "lucide-react";

// Minimal star field — sparse, not overwhelming
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 4,
  dur: Math.random() * 2 + 2,
}));

// Only 4 floating emojis — breathing room
const FLOATERS = [
  { emoji: "🏰", x: "6%",  y: "30%", delay: 0,   dur: 7, size: "2.4rem" },
  { emoji: "🎢", x: "88%", y: "28%", delay: 1.2, dur: 8, size: "2rem"   },
  { emoji: "✨", x: "85%", y: "68%", delay: 0.6, dur: 6, size: "1.5rem" },
  { emoji: "🌟", x: "10%", y: "70%", delay: 2,   dur: 9, size: "1.4rem" },
];

const RESORTS = [
  { id: "wdw",               label: "Walt Disney World",    emoji: "🏰" },
  { id: "disneyland",        label: "Disneyland",           emoji: "✨" },
  { id: "paris",             label: "Disneyland Paris",     emoji: "🗼" },
  { id: "tokyo",             label: "Tokyo Disney",         emoji: "🌸" },
  { id: "universal-orlando", label: "Universal Orlando",    emoji: "🎬" },
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5"
      style={{ background: "radial-gradient(ellipse 110% 75% at 50% 100%, #3D1A78 0%, #0A1F5C 45%, #00194B 72%)" }}>

      {/* Sparse stars */}
      {mounted && STARS.map((s) => (
        <div key={s.id} className="absolute rounded-full pointer-events-none"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            background: "#fff", opacity: 0.35,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }} />
      ))}

      {/* 4 floating emojis — subtle */}
      {FLOATERS.map((f, i) => (
        <div key={i} className="absolute pointer-events-none select-none"
          style={{
            left: f.x, top: f.y, fontSize: f.size, opacity: 0.4,
            animation: `float ${f.dur}s ease-in-out ${f.delay}s infinite`,
            filter: "drop-shadow(0 2px 8px rgba(255,215,0,0.3))",
          }}>
          {f.emoji}
        </div>
      ))}

      {/* Castle glow up from bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(255,215,0,0.07) 0%, transparent 70%)" }} />

      {/* CONTENT — centered, generous space */}
      <div className="relative z-10 text-center max-w-3xl mx-auto pt-20">

        {/* Small label */}
        <p className="anim-appear delay-100 font-body text-xs font-600 uppercase tracking-[0.2em] mb-6"
          style={{ color: "rgba(255,215,0,0.9)", fontFamily: "var(--font-nunito)" }}>
          ✦ AI-Powered Theme Park Planning ✦
        </p>

        {/* BIG headline — clean, not crowded */}
        <h1 className="anim-rise delay-200 font-display font-800 leading-tight mb-4"
          style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)", fontFamily: "var(--font-cinzel)" }}>
          <span style={{ color: "#FFF8E7", display: "block" }}>Plan Your</span>
          <span className="text-shimmer" style={{ display: "block" }}>Perfect Park Day</span>
        </h1>

        {/* Script subtitle — one line only */}
        <p className="anim-rise delay-300 text-script mb-6"
          style={{ fontSize: "clamp(1.4rem, 4vw, 2.2rem)" }}>
          Where magic meets intelligence ✨
        </p>

        {/* Single focused subhead */}
        <p className="anim-rise delay-400 font-body text-lg max-w-xl mx-auto mb-12 leading-relaxed"
          style={{ color: "rgba(220,235,255,0.9)", fontFamily: "var(--font-nunito)" }}>
          Live wait times, AI itineraries, budget breakdowns, and hotel picks
          for every Disney resort and Universal park. Free, always.
        </p>

        {/* TWO BIG BUTTONS — the whole point of this section */}
        <div className="anim-rise delay-500 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/plan"
            className="btn-primary w-full sm:w-auto"
            style={{ padding: "1.1rem 2.8rem", fontSize: "1.15rem", fontWeight: 800 }}>
            <Sparkles size={20} />
            Plan My Trip — Free
          </Link>
          <Link href="/dashboard"
            className="btn-ghost w-full sm:w-auto"
            style={{ padding: "1.05rem 2.4rem", fontSize: "1.05rem" }}>
            <MapPin size={18} />
            Live Wait Times
          </Link>
        </div>

        {/* Resort quick-select — simple pills */}
        <div className="anim-appear delay-700 flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="font-body text-xs" style={{ color: "rgba(220,235,255,0.7)", fontFamily: "var(--font-nunito)" }}>
            Jump to:
          </span>
          {RESORTS.map((r) => (
            <Link key={r.id} href={`/plan?resort=${r.id}`}
              className="font-body text-xs font-600 px-3.5 py-1.5 rounded-full transition-all hover:scale-105"
              style={{
                background: "rgba(255,215,0,0.08)",
                border: "1px solid rgba(255,215,0,0.2)",
                color: "#FFD700",
                fontFamily: "var(--font-nunito)",
              }}>
              {r.emoji} {r.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
        <span className="font-body text-[10px] uppercase tracking-widest" style={{ color: "#C8D8F0" }}>Explore</span>
        <ChevronDown size={14} style={{ color: "#FFD700" }} className="animate-bounce" />
      </div>
    </section>
  );
}
