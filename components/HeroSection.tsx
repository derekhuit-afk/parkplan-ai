"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, ChevronDown, Star, Clock, DollarSign, Map } from "lucide-react";

// Procedural star field
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 4,
  dur: Math.random() * 2 + 1.5,
  opacity: Math.random() * 0.6 + 0.2,
}));

// Floating park icons
const FLOATERS = [
  { emoji: "🏰", x: "7%",  y: "28%", size: "2.8rem", delay: 0,   dur: 7 },
  { emoji: "🎢", x: "89%", y: "22%", size: "2.2rem", delay: 1.2, dur: 8 },
  { emoji: "🎡", x: "80%", y: "62%", size: "1.8rem", delay: 0.6, dur: 6 },
  { emoji: "✨", x: "14%", y: "68%", size: "1.6rem", delay: 1.8, dur: 9 },
  { emoji: "🎠", x: "91%", y: "46%", size: "1.7rem", delay: 0.3, dur: 7 },
  { emoji: "🌟", x: "4%",  y: "50%", size: "1.4rem", delay: 2.1, dur: 5 },
  { emoji: "🏯", x: "50%", y: "5%",  size: "1.6rem", delay: 0.9, dur: 8 },
  { emoji: "🎆", x: "70%", y: "10%", size: "1.5rem", delay: 1.5, dur: 6 },
];

const STATS = [
  { icon: Map,       value: "50+",    label: "Parks Covered" },
  { icon: Clock,     value: "Live",   label: "Wait Times" },
  { icon: Star,      value: "Free",   label: "Always & Forever" },
  { icon: DollarSign,value: "AI",     label: "Powered Planning" },
];

// Sparkle positions for magical effect
const SPARKLES = Array.from({ length: 12 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 3,
  dur: Math.random() * 1 + 1,
}));

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 120% 80% at 50% 100%, #3D1A78 0%, #12296E 40%, #00194B 70%)",
      }}>

      {/* Star field */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {STARS.map((s) => (
            <div key={s.id}
              className="absolute rounded-full"
              style={{
                left: `${s.x}%`, top: `${s.y}%`,
                width: s.size, height: s.size,
                background: "#fff",
                opacity: s.opacity,
                animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              }} />
          ))}
        </div>
      )}

      {/* Magical sparkles (gold) */}
      {mounted && SPARKLES.map((sp, i) => (
        <div key={i} className="absolute pointer-events-none"
          style={{
            left: `${sp.x}%`, top: `${sp.y}%`,
            width: 4, height: 4,
            background: "#FFD700",
            borderRadius: "50%",
            animation: `sparkle ${sp.dur}s ease-in-out ${sp.delay}s infinite`,
            boxShadow: "0 0 6px #FFD700",
          }} />
      ))}

      {/* Castle glow from bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(255,215,0,0.08) 0%, transparent 70%)" }} />

      {/* Floating icons */}
      {FLOATERS.map((f, i) => (
        <div key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left: f.x, top: f.y,
            fontSize: f.size,
            animation: `float ${f.dur}s ease-in-out ${f.delay}s infinite`,
            filter: "drop-shadow(0 4px 12px rgba(255,215,0,0.4))",
            opacity: 0.55,
          }}>
          {f.emoji}
        </div>
      ))}

      {/* Radial purple glow center */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 55%, rgba(61,26,120,0.4) 0%, transparent 70%)" }} />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-24 pb-12">

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 font-body text-xs font-600"
          style={{
            background: "rgba(255,215,0,0.08)",
            border: "1px solid rgba(255,215,0,0.3)",
            color: "#FFD700",
            opacity: 0,
            animation: "fade-in 0.8s ease-out 0.1s forwards",
            boxShadow: "0 0 20px rgba(255,215,0,0.1)",
          }}>
          <span style={{ animation: "twinkle 1.5s ease-in-out infinite" }}>✦</span>
          AI-Powered Theme Park Intelligence — 100% Free
          <span style={{ animation: "twinkle 1.5s ease-in-out 0.5s infinite" }}>✦</span>
        </div>

        {/* Main headline */}
        <h1 className="font-display font-900 leading-none mb-6"
          style={{
            fontSize: "clamp(2.8rem, 8vw, 6rem)",
            opacity: 0,
            animation: "slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards",
          }}>
          <span style={{ color: "#FFF8E7", display: "block" }}>Your Perfect</span>
          <span className="text-shimmer" style={{ display: "block" }}>Park Day</span>
          <span className="font-script"
            style={{
              display: "block",
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              color: "#C8D8F0",
              marginTop: "-4px",
            }}>
            planned by magic ✨
          </span>
        </h1>

        {/* Subheadline */}
        <p className="font-body text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{
            color: "rgba(200,216,240,0.85)",
            opacity: 0,
            animation: "slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s forwards",
          }}>
          Skip the overwhelm. Get AI-built itineraries, live wait times, budget breakdowns,
          and hotel picks for every Disney resort and Universal park — in seconds.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          style={{ opacity: 0, animation: "slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.55s forwards" }}>
          <Link href="/plan"
            className="btn-magic flex items-center gap-2.5 px-9 py-4 text-base font-body font-700 w-full sm:w-auto justify-center"
            style={{ fontSize: "1rem", boxShadow: "0 8px 40px rgba(255,215,0,0.4), 0 0 0 1px rgba(255,215,0,0.3)" }}>
            <Sparkles size={18} style={{ color: "#00194B" }} />
            <span style={{ color: "#00194B" }}>Start Planning — It&apos;s Free</span>
          </Link>
          <Link href="/dashboard"
            className="flex items-center gap-2.5 px-9 py-4 rounded-full text-base font-body font-500 w-full sm:w-auto justify-center transition-all hover:bg-white/10 border"
            style={{ borderColor: "rgba(255,215,0,0.25)", color: "#FFF8E7" }}>
            🗺 Live Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
          style={{ opacity: 0, animation: "fade-in 1s ease-out 0.9s forwards" }}>
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="disney-card rounded-2xl p-4 flex flex-col items-center gap-1.5">
              <Icon size={16} style={{ color: "#FFD700" }} />
              <span className="font-display font-700 text-xl" style={{ color: "#FFD700" }}>{value}</span>
              <span className="font-body text-xs" style={{ color: "rgba(200,216,240,0.7)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: "#C8D8F0" }}>Discover</span>
        <ChevronDown size={15} style={{ color: "#FFD700" }} className="animate-bounce" />
      </div>
    </section>
  );
}
