"use client";
import { ExternalLink } from "lucide-react";

interface AffiliateLink { label: string; url: string; tag: string; emoji: string; color: string; }

const RESORT_AFFILIATES: Record<string, AffiliateLink[]> = {
  wdw: [
    { label: "WDW Tickets",           url: "https://www.viator.com/Walt-Disney-World/d810-ttd?pid=P00077012&mcid=42383&medium=link", tag: "Tickets", emoji: "🎟",  color: "#FFD700" },
    { label: "WDW Hotels",            url: "https://www.booking.com/searchresults.html?ss=Walt+Disney+World&aid=304142",             tag: "Hotels",  emoji: "🏨",  color: "#87CEEB" },
    { label: "Park Shuttle",          url: "https://www.viator.com/tours/Orlando/Shared-Shuttle-from-Orlando-Airport/d615-3695INT",  tag: "Transport",emoji: "🚌", color: "#7FDB8A" },
    { label: "Character Dining",      url: "https://www.viator.com/Orlando/d615-ttd?pid=P00077012&mcid=42383&medium=link",           tag: "Dining",  emoji: "🍽",  color: "#FF9EBB" },
  ],
  disneyland: [
    { label: "Disneyland Tickets",    url: "https://www.viator.com/Anaheim-and-Disneyland/d814-ttd?pid=P00077012&mcid=42383&medium=link", tag: "Tickets", emoji: "🎟", color: "#FFD700" },
    { label: "Anaheim Hotels",        url: "https://www.booking.com/searchresults.html?ss=Anaheim+Disneyland&aid=304142",             tag: "Hotels",  emoji: "🏨",  color: "#87CEEB" },
    { label: "LAX Airport Transfer",  url: "https://www.viator.com/tours/Anaheim-Disneyland/LAX-to-Disneyland/d814-5080DSNLND",     tag: "Transport",emoji: "✈",  color: "#7FDB8A" },
  ],
  paris: [
    { label: "DLP Tickets",           url: "https://www.viator.com/Paris-Disneyland/d479-ttd?pid=P00077012&mcid=42383&medium=link",  tag: "Tickets", emoji: "🎟",  color: "#FFD700" },
    { label: "Paris Hotels",          url: "https://www.booking.com/searchresults.html?ss=Disneyland+Paris&aid=304142",              tag: "Hotels",  emoji: "🏨",  color: "#87CEEB" },
    { label: "Paris Transfer",        url: "https://www.viator.com/tours/Paris/Shared-Shuttle-to-Disneyland-Paris/d479-7898P1",     tag: "Transport",emoji: "🚂", color: "#7FDB8A" },
  ],
  "universal-orlando": [
    { label: "Universal Tickets",     url: "https://www.viator.com/Orlando/d615-ttd?pid=P00077012&mcid=42383&medium=link",           tag: "Tickets", emoji: "🎟",  color: "#C084FC" },
    { label: "Universal Hotels",      url: "https://www.booking.com/searchresults.html?ss=Universal+Studios+Orlando&aid=304142",     tag: "Hotels",  emoji: "🏨",  color: "#87CEEB" },
    { label: "Express Pass",          url: "https://www.viator.com/tours/Orlando/Universal-Studios-Florida-Express-Pass/d615-8740P3",tag: "Upgrades",emoji: "⚡",  color: "#FFD700" },
    { label: "Epic Universe Tickets", url: "https://www.viator.com/Orlando/d615-ttd?pid=P00077012&mcid=42383&medium=link",           tag: "New!",    emoji: "🌌",  color: "#FF9EBB" },
  ],
};

const DEFAULT_AFFILIATES: AffiliateLink[] = [
  { label: "Find Hotels",            url: "https://www.booking.com/index.html?aid=304142",                                          tag: "Hotels",  emoji: "🏨",  color: "#87CEEB" },
  { label: "Book Activities",        url: "https://www.viator.com/?pid=P00077012&mcid=42383&medium=link",                           tag: "Tickets", emoji: "🎟",  color: "#FFD700" },
];

export default function AffiliateStrip({ resortId }: { resortId: string }) {
  const links = RESORT_AFFILIATES[resortId] || DEFAULT_AFFILIATES;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "0.75rem", color: "#FFFFFF" }}>
          🛒 Book & Save
        </p>
        <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.6rem", color: "rgba(220,235,255,0.4)", marginTop: "2px" }}>
          Affiliate links · Supports ParkPlan.ai free
        </p>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        {links.map((link) => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-3 rounded-xl group transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ fontSize: "1.3rem" }}>{link.emoji}</span>
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.72rem", color: "#FFFFFF" }}
                className="truncate group-hover:text-yellow-300 transition-colors">{link.label}</p>
              <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.6rem", color: link.color }}>{link.tag}</p>
            </div>
            <ExternalLink size={10} style={{ color: "rgba(220,235,255,0.25)", flexShrink: 0 }} />
          </a>
        ))}
      </div>
    </div>
  );
}
