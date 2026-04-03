import Link from "next/link";
import { Heart } from "lucide-react";

const LINKS = {
  Resorts: ["Walt Disney World", "Disneyland", "Disneyland Paris", "Tokyo Disney", "Universal Orlando"],
  Tools:   ["AI Itinerary Builder", "Wait Time Tracker", "Budget Planner", "Hotel Finder", "Live Dashboard"],
  Company: ["About", "Privacy Policy", "Terms of Service", "Contact"],
};

export default function Footer() {
  return (
    <footer className="relative border-t py-14 sm:py-16 px-4 sm:px-6 overflow-hidden"
      style={{ borderColor: "rgba(255,215,0,0.12)", background: "rgba(0,15,40,0.8)" }}>

      {/* Castle silhouette glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(255,215,0,0.05) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <span className="text-2xl" style={{ filter: "drop-shadow(0 0 8px rgba(255,215,0,0.6))" }}>🏰</span>
              <div>
                <div className="font-display font-700 text-lg" style={{ color: "#FFD700" }}>ParkPlan.ai</div>
                <div className="font-script text-xs" style={{ color: "rgba(200,216,240,0.6)" }}>Where Magic Meets Intelligence</div>
              </div>
            </Link>
            <p className="font-body text-sm leading-relaxed max-w-xs mb-4"
              style={{ color: "rgba(200,216,240,0.65)" }}>
              AI-powered theme park planning for families, superfans, and first-timers.
              Free forever. No hidden magic fees.
            </p>
            <p className="font-body text-xs italic"
              style={{ color: "rgba(200,216,240,0.3)" }}>
              ParkPlan.ai is not affiliated with, endorsed by, or connected to
              The Walt Disney Company, Universal, or any of their affiliates.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-600 text-xs mb-4 uppercase tracking-widest"
                style={{ color: "#FFD700" }}>
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#"
                      className="font-body text-sm transition-colors hover:text-park-gold"
                      style={{ color: "rgba(200,216,240,0.6)" }}>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Castle divider */}
        <div className="castle-divider mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-center sm:text-left"
            style={{ color: "rgba(200,216,240,0.35)" }}>
            © {new Date().getFullYear()} ParkPlan.ai — All rights reserved
          </p>
          <p className="font-body text-xs flex items-center gap-1.5"
            style={{ color: "rgba(200,216,240,0.35)" }}>
            Built with <Heart size={11} style={{ color: "#FF6B9D" }} /> for park families everywhere ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
