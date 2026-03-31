import Link from "next/link";
import { MapPin, Heart } from "lucide-react";

const LINKS = {
  Resorts: ["Walt Disney World", "Disneyland", "Disneyland Paris", "Tokyo Disney", "Universal Orlando"],
  Tools: ["AI Itinerary Builder", "Wait Time Tracker", "Budget Planner", "Hotel Finder"],
  Company: ["About", "Privacy Policy", "Terms of Service", "Contact"],
};

export default function Footer() {
  return (
    <footer
      className="relative border-t py-14 sm:py-16 px-4 sm:px-6"
      style={{ borderColor: "rgba(245,200,66,0.1)", background: "rgba(10,18,28,0.8)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
                <MapPin size={15} className="text-park-night" />
              </div>
              <span className="font-display font-700 text-xl text-park-cream">
                Park<span className="text-park-gold">Plan</span>
                <span className="text-park-mist text-sm font-body font-normal ml-1">.ai</span>
              </span>
            </Link>
            <p className="font-body text-sm text-park-mist leading-relaxed max-w-xs mb-4">
              AI-powered theme park planning for families, superfans, and first-timers. 
              Free forever. No hidden costs.
            </p>
            <p className="font-body text-xs text-park-mist/50 italic">
              ParkPlan.ai is not affiliated with, endorsed by, or connected to The Walt Disney Company, Universal Parks & Resorts, or any of their affiliates.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-body font-600 text-park-cream text-sm mb-4 uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="font-body text-sm text-park-mist hover:text-park-gold transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t"
          style={{ borderColor: "rgba(245,200,66,0.08)" }}
        >
          <p className="font-body text-xs text-park-mist/60 text-center sm:text-left">
            © {new Date().getFullYear()} ParkPlan.ai — All rights reserved.
          </p>
          <p className="font-body text-xs text-park-mist/60 flex items-center gap-1">
            Built with <Heart size={11} className="text-park-coral" /> for park families everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
