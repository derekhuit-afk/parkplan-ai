"use client";
import { Clock, Map, DollarSign, Hotel, Route, Users, Zap, Star } from "lucide-react";

const FEATURES = [
  { icon: Map,        title: "AI Itinerary",        desc: "Optimized ride order using live crowd and wait time data.",          color: "#FFD700" },
  { icon: Clock,      title: "Live Wait Times",      desc: "Real-time waits for every park and ride, updated every 5 min.",     color: "#87CEEB" },
  { icon: DollarSign, title: "Budget Planner",       desc: "Full cost breakdown — tickets, food, hotel, and extras.",           color: "#7FDB8A" },
  { icon: Hotel,      title: "Hotel Finder",         desc: "On-site vs. off-site comparison with real prices and perks.",       color: "#C084FC" },
  { icon: Route,      title: "Rope Drop Strategy",   desc: "Maximize your first 90 minutes with expert sequencing.",           color: "#FFA500" },
  { icon: Users,      title: "Group Optimizer",      desc: "Itineraries for every mix — kids, seniors, thrill-seekers.",       color: "#FF9EBB" },
  { icon: Zap,        title: "Instant Rebuilds",     desc: "Ride down? Rain coming? AI rebuilds your day in seconds.",         color: "#7FDBCA" },
  { icon: Star,       title: "Hidden Gems",          desc: "Insider tips, secret spots, and off-menu snacks most miss.",       color: "#FFD700" },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-5 sm:px-8 relative">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <p className="font-body text-xs font-700 uppercase tracking-[0.2em] mb-3"
            style={{ color: "rgba(255,215,0,0.7)", fontFamily: "var(--font-nunito)" }}>
            What ParkPlan Does
          </p>
          <h2 className="font-display font-700"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#FFFFFF", fontFamily: "var(--font-cinzel)" }}>
            Eight Tools. One Perfect Day.
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="card p-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                  <Icon size={18} style={{ color: f.color }} />
                </div>
                <h3 className="font-display font-700 text-sm mb-1.5"
                  style={{ color: "#FFFFFF", fontFamily: "var(--font-cinzel)" }}>
                  {f.title}
                </h3>
                <p className="font-body text-xs leading-relaxed"
                  style={{ color: "rgba(220,235,255,0.85)", fontFamily: "var(--font-nunito)" }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
