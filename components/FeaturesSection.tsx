"use client";
import { Clock, Map, DollarSign, Hotel, Route, Users, Zap, Star } from "lucide-react";

const FEATURES = [
  {
    icon: Map,
    title: "AI Itinerary Builder",
    description: "Tell us your travel dates, group size, and ride priorities. Our AI builds a minute-by-minute optimized day — including Lightning Lane strategy.",
    color: "#F5C842",
    tag: "Core Feature",
  },
  {
    icon: Clock,
    title: "Live Wait Time Intel",
    description: "Real-time crowd data for every attraction at every park. Know which rides are walk-ons right now and when crowds peak.",
    color: "#4ECDC4",
    tag: "Live Data",
  },
  {
    icon: DollarSign,
    title: "Budget Planner",
    description: "Full cost breakdowns for tickets, hotels, dining, and extras. Compare deluxe vs. value resorts and find where to save without sacrificing magic.",
    color: "#FF6B6B",
    tag: "Save Money",
  },
  {
    icon: Hotel,
    title: "Hotel & Dining",
    description: "On-site vs. off-site hotel comparisons with real prices. Dining reservation strategies, must-eat spots, and character meal booking tips.",
    color: "#BD10E0",
    tag: "Stay & Eat",
  },
  {
    icon: Route,
    title: "Rope Drop Strategy",
    description: "Maximize your first 90 minutes in the park. Our AI knows exactly which rides to hit first based on your group's must-dos.",
    color: "#F5A623",
    tag: "Pro Tip",
  },
  {
    icon: Users,
    title: "Group Optimizer",
    description: "Planning with kids, seniors, thrill-seekers, or all three? Get itineraries that keep everyone happy — split-party strategies included.",
    color: "#7ED321",
    tag: "Families",
  },
  {
    icon: Zap,
    title: "Instant Plan Updates",
    description: "Ride down for maintenance? Weather rolling in? Tell our AI and it rebuilds your day in seconds — no stress, no guesswork.",
    color: "#00D4FF",
    tag: "Adaptive",
  },
  {
    icon: Star,
    title: "Hidden Gems",
    description: "Secret spots, underrated attractions, off-menu snacks, and insider tips most park-goers never discover. The local's guide, AI-powered.",
    color: "#FF9EBB",
    tag: "Insider",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      {/* Section background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(30,58,95,0.25) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="font-body text-xs uppercase tracking-widest text-park-gold mb-3 font-600">
            What ParkPlan Does
          </p>
          <h2 className="font-display font-700 text-3xl sm:text-4xl md:text-5xl text-park-cream mb-4">
            Intelligence That Makes<br />
            <span className="italic text-park-gold">Every Minute Count</span>
          </h2>
          <p className="font-body text-park-mist max-w-xl mx-auto text-base">
            Eight AI-powered tools designed to eliminate park anxiety and
            replace it with confidence.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(26,46,69,0.5)",
                  borderColor: `${feature.color}18`,
                  backdropFilter: "blur(8px)",
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-6 right-6 h-px rounded-full opacity-60"
                  style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }}
                />

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${feature.color}15`,
                    border: `1px solid ${feature.color}30`,
                  }}
                >
                  <Icon size={18} style={{ color: feature.color }} />
                </div>

                <div
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-body font-600 mb-3"
                  style={{
                    background: `${feature.color}12`,
                    color: feature.color,
                  }}
                >
                  {feature.tag}
                </div>

                <h3 className="font-display font-700 text-base text-park-cream mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-park-mist leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
