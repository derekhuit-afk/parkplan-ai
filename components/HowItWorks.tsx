"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const STEPS = [
  { n: "1", emoji: "💬", title: "Tell us your trip",     desc: "Dates, resort, group, budget. 60 seconds." },
  { n: "2", emoji: "🔮", title: "AI builds your plan",   desc: "Crowd data, wait times, dining — all optimized." },
  { n: "3", emoji: "✨", title: "Enjoy the magic",       desc: "Screenshot and go. No app, no login, no fuss." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto text-center">

        <p className="font-body text-xs font-700 uppercase tracking-[0.2em] mb-3"
          style={{ color: "rgba(255,215,0,0.7)", fontFamily: "var(--font-nunito)" }}>
          How It Works
        </p>
        <h2 className="font-display font-700 mb-14"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#FFF8E7", fontFamily: "var(--font-cinzel)" }}>
          Three Steps to <span className="text-script">Your Perfect Day</span>
        </h2>

        {/* Steps — horizontal, very clean */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14 relative">
          {/* Connector */}
          <div className="hidden sm:block absolute top-9 left-[calc(16.5%+2rem)] right-[calc(16.5%+2rem)] h-px"
            style={{ background: "linear-gradient(90deg, rgba(255,215,0,0.4), rgba(192,132,252,0.4), rgba(135,206,235,0.4))" }} />

          {STEPS.map((s, i) => (
            <div key={s.n} className="flex flex-col items-center text-center relative">
              {/* Orb */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl relative z-10"
                style={{
                  background: "rgba(10,31,92,0.7)",
                  border: "2px solid rgba(255,215,0,0.4)",
                  boxShadow: "0 0 24px rgba(255,215,0,0.15)",
                }}>
                {s.emoji}
              </div>
              <h3 className="font-display font-700 text-base mb-2"
                style={{ color: "#FFF8E7", fontFamily: "var(--font-cinzel)" }}>
                {s.title}
              </h3>
              <p className="font-body text-sm" style={{ color: "rgba(200,216,240,0.65)", fontFamily: "var(--font-nunito)" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* BIG CTA — the whole point */}
        <Link href="/plan"
          className="btn-primary mx-auto"
          style={{ padding: "1.2rem 3.5rem", fontSize: "1.2rem", fontWeight: 800 }}>
          <Sparkles size={22} />
          Start Planning — It&apos;s Free
        </Link>
        <p className="font-body text-xs mt-4" style={{ color: "rgba(200,216,240,0.35)", fontFamily: "var(--font-nunito)" }}>
          No account required · No credit card · 100% free forever
        </p>
      </div>
    </section>
  );
}
