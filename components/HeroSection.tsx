"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, ChevronDown, Star, Clock, DollarSign, Map } from "lucide-react";

const FLOATING_ICONS = [
  { icon: "🏰", delay: 0, x: "8%", y: "30%", size: "text-4xl" },
  { icon: "🎢", delay: 1.2, x: "88%", y: "25%", size: "text-3xl" },
  { icon: "🎡", delay: 0.6, x: "78%", y: "65%", size: "text-2xl" },
  { icon: "✨", delay: 1.8, x: "15%", y: "70%", size: "text-2xl" },
  { icon: "🎠", delay: 0.3, x: "92%", y: "50%", size: "text-2xl" },
  { icon: "🌟", delay: 2.1, x: "5%", y: "50%", size: "text-xl" },
];

const STATS = [
  { icon: Map, value: "50+", label: "Parks Covered" },
  { icon: Clock, value: "Live", label: "Wait Times" },
  { icon: Star, value: "4.9★", label: "Avg Rating" },
  { icon: DollarSign, value: "Free", label: "Always" },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY, currentTarget } = e;
      const el = currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      heroRef.current.style.setProperty("--mx", `${x * 100}%`);
      heroRef.current.style.setProperty("--my", `${y * 100}%`);
    };
    const el = heroRef.current?.parentElement;
    el?.addEventListener("mousemove", handleMouseMove as EventListener);
    return () => el?.removeEventListener("mousemove", handleMouseMove as EventListener);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at var(--mx,30%) var(--my,50%), #1E3A5F 0%, #0D1B2A 65%)",
      }}
    >
      {/* Stars */}
      <div className="stars" />

      {/* Floating park icons */}
      {FLOATING_ICONS.map((item, i) => (
        <div
          key={i}
          className={`absolute ${item.size} select-none pointer-events-none opacity-30 hover:opacity-60`}
          style={{
            left: item.x,
            top: item.y,
            animation: `float ${6 + item.delay}s ease-in-out ${item.delay}s infinite`,
            filter: "drop-shadow(0 4px 12px rgba(245,200,66,0.3))",
          }}
        >
          {item.icon}
        </div>
      ))}

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(245,200,66,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <div ref={heroRef} className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-24 pb-8">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-body font-500 text-park-gold mb-8 border"
          style={{
            background: "rgba(245,200,66,0.08)",
            borderColor: "rgba(245,200,66,0.25)",
            animation: "fade-in 0.6s ease-out forwards",
          }}
        >
          <Sparkles size={12} />
          AI-Powered Theme Park Intelligence — 100% Free
        </div>

        {/* Headline */}
        <h1
          className="font-display font-900 text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none mb-6"
          style={{ opacity: 0, animation: "slide-up 0.7s ease-out 0.2s forwards" }}
        >
          <span className="text-park-cream">Your Perfect</span>
          <br />
          <span className="text-shimmer">Park Day</span>
          <br />
          <span className="text-park-cream italic">Planned by AI</span>
        </h1>

        {/* Subhead */}
        <p
          className="font-body text-lg sm:text-xl text-park-mist max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ opacity: 0, animation: "slide-up 0.7s ease-out 0.4s forwards" }}
        >
          Skip the overwhelm. Get AI-built itineraries, live wait times, budget breakdowns,
          and hotel picks for every Disney resort and Universal park — in seconds.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          style={{ opacity: 0, animation: "slide-up 0.7s ease-out 0.55s forwards" }}
        >
          <Link
            href="/plan"
            className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-body font-700 text-park-night transition-all duration-200 hover:scale-105 hover:shadow-2xl w-full sm:w-auto justify-center"
            style={{
              background: "linear-gradient(135deg, #F5C842, #E8A020)",
              boxShadow: "0 8px 32px rgba(245,200,66,0.35)",
            }}
          >
            <Sparkles size={18} />
            Start Planning — It&apos;s Free
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-body font-500 text-park-cream transition-all duration-200 hover:bg-white/10 w-full sm:w-auto justify-center border"
            style={{ borderColor: "rgba(255,248,231,0.2)" }}
          >
            🗺 Live Dashboard
          </Link>
          <a
            href="#resorts"
            className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-body font-500 text-park-cream transition-all duration-200 hover:bg-white/10 w-full sm:w-auto justify-center border"
            style={{ borderColor: "rgba(255,248,231,0.2)" }}
          >
            Browse Resorts
          </a>
        </div>

        {/* Stats bar */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
          style={{ opacity: 0, animation: "fade-in 0.8s ease-out 0.8s forwards" }}
        >
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 p-4 rounded-2xl border"
              style={{
                background: "rgba(30,58,95,0.4)",
                borderColor: "rgba(245,200,66,0.12)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Icon size={16} className="text-park-gold mb-1" />
              <span className="font-display font-700 text-xl text-park-cream">{value}</span>
              <span className="font-body text-xs text-park-mist">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs font-body text-park-mist tracking-widest uppercase">Explore</span>
        <ChevronDown size={16} className="text-park-gold animate-bounce" />
      </div>
    </section>
  );
}
