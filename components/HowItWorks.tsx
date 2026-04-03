"use client";
import Link from "next/link";
import { MessageSquare, Cpu, Download, Sparkles } from "lucide-react";

const STEPS = [
  { number: "01", icon: MessageSquare, emoji: "💬", title: "Tell Us Your Trip",      desc: "Share your dates, resort, group size, budget, and top must-do experiences. 60 seconds. That&apos;s all.",       color: "#FFD700" },
  { number: "02", icon: Cpu,           emoji: "🔮", title: "AI Conjures Your Plan",  desc: "Our AI analyzes crowd forecasts, wait time patterns, ticket options, and dining windows to build your optimal day.", color: "#C084FC" },
  { number: "03", icon: Download,      emoji: "✨", title: "Receive Your Magic",     desc: "A detailed itinerary, budget breakdown, hotel picks, and insider tips — ready to screenshot and go enjoy the magic.",  color: "#87CEEB" },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">

      {/* Deep violet background for this section */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(61,26,120,0.25) 0%, transparent 70%)" }} />

      {/* Decorative arcs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "transparent", border: "1px solid rgba(255,215,0,0.06)", borderRadius: "0 0 300px 300px", borderTop: "none" }} />

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="font-body text-[11px] uppercase tracking-[0.25em] font-700 mb-3"
            style={{ color: "#FFD700" }}>
            ✦ How The Magic Works ✦
          </p>
          <h2 className="font-display font-700 mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FFF8E7" }}>
            From Zero to{" "}
            <span className="font-script" style={{ color: "#FFD700", fontSize: "1.15em" }}>Perfect Day</span>{" "}
            in 60 Seconds
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-14 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px"
            style={{ background: "linear-gradient(90deg, #FFD700, #C084FC, #87CEEB)" }} />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative flex flex-col items-center text-center"
                style={{ animationDelay: `${i * 150}ms` }}>

                {/* Number orb */}
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center mb-6 z-10"
                  style={{
                    background: `${step.color}15`,
                    border: `2px solid ${step.color}`,
                    boxShadow: `0 0 30px ${step.color}40, 0 0 60px ${step.color}15`,
                  }}>
                  <span className="text-2xl">{step.emoji}</span>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center font-display font-900 text-[10px]"
                    style={{ background: step.color, color: "#00194B" }}>
                    {step.number.slice(-1)}
                  </div>
                </div>

                <h3 className="font-display font-700 text-xl mb-3" style={{ color: "#FFF8E7" }}>
                  {step.title}
                </h3>
                <p className="font-body text-sm leading-relaxed max-w-xs"
                  style={{ color: "rgba(200,216,240,0.75)" }}
                  dangerouslySetInnerHTML={{ __html: step.desc }} />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link href="/plan"
            className="btn-magic inline-flex items-center gap-2.5 px-10 py-4 text-base font-body font-700"
            style={{ boxShadow: "0 8px 40px rgba(255,215,0,0.35)", fontFamily: "var(--font-nunito)" }}>
            <Sparkles size={18} style={{ color: "#00194B" }} />
            <span style={{ color: "#00194B" }}>Try It Now — Free Forever</span>
          </Link>
          <p className="font-body text-xs mt-3" style={{ color: "rgba(200,216,240,0.4)" }}>
            No signup required · No credit card · No ads · Just magic ✨
          </p>
        </div>
      </div>
    </section>
  );
}
