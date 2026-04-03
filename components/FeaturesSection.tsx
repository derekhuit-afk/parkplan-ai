"use client";
import { Clock, Map, DollarSign, Hotel, Route, Users, Zap, Star } from "lucide-react";

const FEATURES = [
  { icon: Map,       title: "AI Itinerary Builder",   desc: "Tell us your dates, group size, and must-do rides. Our AI builds a minute-by-minute optimized day — including Lightning Lane strategy.",                              color: "#FFD700",  tag: "✦ Core Magic",    emoji: "🗺" },
  { icon: Clock,     title: "Live Wait Time Intel",   desc: "Real-time crowd data for every attraction. Know which rides are walk-ons right now and when crowds peak throughout the day.",                                         color: "#87CEEB",  tag: "⚡ Live Data",    emoji: "⏱" },
  { icon: DollarSign,title: "Budget Planner",         desc: "Full cost breakdowns for tickets, hotels, dining, and extras. Compare deluxe vs. value resorts and find where to save without sacrificing magic.",                   color: "#7FDB8A",  tag: "💰 Save Money",   emoji: "💵" },
  { icon: Hotel,     title: "Hotel & Dining Picks",   desc: "On-site vs. off-site comparisons with real prices. Dining reservation strategies, must-eat spots, and character meal booking tips.",                                  color: "#C084FC",  tag: "🏰 Stay & Eat",  emoji: "🏨" },
  { icon: Route,     title: "Rope Drop Strategy",     desc: "Maximize your first 90 minutes. Our AI knows exactly which rides to hit first based on your group&apos;s must-dos and current crowd patterns.",                      color: "#FFA500",  tag: "🏃 Pro Tips",    emoji: "🎯" },
  { icon: Users,     title: "Group Optimizer",        desc: "Planning with kids, seniors, and thrill-seekers? Get itineraries that keep everyone happy — split-party strategies included.",                                       color: "#FF9EBB",  tag: "👨‍👩‍👧 Families", emoji: "👨‍👩‍👧" },
  { icon: Zap,       title: "Instant Plan Updates",   desc: "Ride down for maintenance? Weather rolling in? Tell our AI and it rebuilds your day in seconds — no stress, no guesswork, pure magic.",                             color: "#4ECDC4",  tag: "🔄 Adaptive",    emoji: "⚡" },
  { icon: Star,      title: "Hidden Gems & Secrets",  desc: "Secret spots, underrated attractions, off-menu snacks, and insider tips most park-goers never discover. The local&apos;s guide, AI-powered.",                       color: "#FFD700",  tag: "🌟 Insider",     emoji: "🔮" },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      {/* Purple nebula glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(61,26,120,0.2) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-14">
          <p className="font-body text-[11px] uppercase tracking-[0.25em] font-700 mb-3"
            style={{ color: "#FFD700" }}>
            ✦ What ParkPlan Does ✦
          </p>
          <h2 className="font-display font-700 mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FFF8E7" }}>
            Eight Magical Tools to Make{" "}
            <span className="text-shimmer">Every Minute Count</span>
          </h2>
          <p className="font-body max-w-xl mx-auto"
            style={{ color: "rgba(200,216,240,0.8)", fontSize: "1rem" }}>
            AI-powered intelligence designed to eliminate park anxiety and replace it with pure, effortless magic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.title}
                className="group relative p-5 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-1.5"
                style={{
                  background: "linear-gradient(135deg, rgba(18,41,110,0.55) 0%, rgba(10,31,92,0.65) 100%)",
                  border: `1px solid ${f.color}18`,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
                  animationDelay: `${i * 60}ms`,
                }}>

                {/* Top shimmer */}
                <div className="absolute top-0 left-4 right-4 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}50, transparent)` }} />

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 20% 20%, ${f.color}12 0%, transparent 60%)` }} />

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 relative z-10"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}30`, boxShadow: `0 4px 16px ${f.color}20` }}>
                  <Icon size={19} style={{ color: f.color }} />
                </div>

                {/* Tag */}
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-body font-700 mb-3 relative z-10"
                  style={{ background: `${f.color}12`, color: f.color }}>
                  {f.tag}
                </div>

                <h3 className="font-display font-700 text-sm mb-2 relative z-10"
                  style={{ color: "#FFF8E7" }}>{f.title}</h3>
                <p className="font-body text-xs leading-relaxed relative z-10"
                  style={{ color: "rgba(200,216,240,0.75)" }}
                  dangerouslySetInnerHTML={{ __html: f.desc }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
