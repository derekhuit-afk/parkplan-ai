"use client";
import Link from "next/link";
import { MessageSquare, Cpu, Download, Sparkles } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Tell Us Your Trip",
    description: "Share your dates, resort, group size, budget, and top must-do experiences. 60 seconds max.",
    color: "#F5C842",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Builds Your Plan",
    description: "Our AI analyzes crowd forecasts, wait time patterns, ticket options, and dining windows to build your optimal day.",
    color: "#4ECDC4",
  },
  {
    number: "03",
    icon: Download,
    title: "Get Your Complete Guide",
    description: "Receive a detailed itinerary, budget breakdown, hotel picks, and insider tips — ready to screenshot and go.",
    color: "#FF6B6B",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative arc */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(245,200,66,0.04) 0%, transparent 70%)",
          border: "1px solid rgba(245,200,66,0.06)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-12 sm:mb-16">
          <p className="font-body text-xs uppercase tracking-widest text-park-gold mb-3 font-600">
            How It Works
          </p>
          <h2 className="font-display font-700 text-3xl sm:text-4xl md:text-5xl text-park-cream mb-4">
            From Zero to <span className="italic text-park-gold">Perfect Day</span>
            <br />in 60 Seconds
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop */}
          <div
            className="hidden md:block absolute top-12 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px"
            style={{ background: "linear-gradient(90deg, #F5C842, #4ECDC4, #FF6B6B)" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {/* Number circle */}
                  <div
                    className="relative w-14 h-14 rounded-full flex items-center justify-center mb-6 z-10"
                    style={{
                      background: `${step.color}15`,
                      border: `2px solid ${step.color}`,
                      boxShadow: `0 0 24px ${step.color}30`,
                    }}
                  >
                    <Icon size={22} style={{ color: step.color }} />
                    <div
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-body font-700"
                      style={{
                        background: step.color,
                        color: "#0D1B2A",
                      }}
                    >
                      {step.number.slice(-1)}
                    </div>
                  </div>

                  <h3 className="font-display font-700 text-xl text-park-cream mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-park-mist text-sm leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <Link
            href="/plan"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-body font-700 text-park-night transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #F5C842, #E8A020)",
              boxShadow: "0 8px 32px rgba(245,200,66,0.3)",
            }}
          >
            <Sparkles size={18} />
            Try It Now — Free Forever
          </Link>
          <p className="font-body text-xs text-park-mist mt-3 opacity-70">
            No signup required · No credit card · No ads
          </p>
        </div>
      </div>
    </section>
  );
}
