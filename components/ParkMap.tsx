"use client";
import { useState } from "react";
import { X, Zap } from "lucide-react";

interface RideWait { name: string; wait: number | null; isOpen: boolean; trend?: string | null; }

interface Land {
  id: string; name: string; color: string;
  x: number; y: number; w: number; h: number; rx?: number;
  shape?: "ellipse"; rides: string[];
}

// ── Park Layout Definitions ─────────────────────────────────────────
const PARK_LAYOUTS: Record<string, { lands: Land[]; centerX: number; centerY: number; centerLabel: string }> = {

  // Magic Kingdom
  "75ea578a-adc8-4116-a54d-dccb60765ef9": {
    centerX: 50, centerY: 46, centerLabel: "🏰",
    lands: [
      { id: "mainstreet",    name: "Main Street",      color: "#8B6914", x: 38, y: 72, w: 24, h: 20, rx: 4,  rides: ["Walt Disney World Railroad"] },
      { id: "adventureland", name: "Adventureland",    color: "#2D6A4F", x: 8,  y: 42, w: 26, h: 26, rx: 8,  rides: ["Jungle Cruise","Pirates of the Caribbean","A Pirate's Adventure"] },
      { id: "frontierland",  name: "Frontierland",     color: "#8B4513", x: 8,  y: 20, w: 24, h: 24, rx: 6,  rides: ["Big Thunder Mountain Railroad","Tiana's Bayou Adventure"] },
      { id: "liberty",       name: "Liberty Square",   color: "#5C4B32", x: 30, y: 22, w: 18, h: 18, rx: 4,  rides: ["Haunted Mansion","Liberty Belle Riverboat"] },
      { id: "fantasyland",   name: "Fantasyland",      color: "#6B3FA0", x: 32, y: 4,  w: 36, h: 26, rx: 10, rides: ["Seven Dwarfs Mine Train","Peter Pan's Flight","\"it's a small world\"","Dumbo the Flying Elephant","The Many Adventures of Winnie the Pooh"] },
      { id: "tomorrowland",  name: "Tomorrowland",     color: "#1A5276", x: 66, y: 22, w: 26, h: 32, rx: 8,  rides: ["TRON Lightcycle / Run","Space Mountain","Buzz Lightyear's Space Ranger Spin","Tomorrowland Speedway"] },
      { id: "castle",        name: "Castle",           color: "#4B6CB7", x: 42, y: 28, w: 16, h: 16, rx: 8,  rides: [] },
    ],
  },

  // EPCOT
  "47f90d2c-e191-4239-a466-5892ef59a88b": {
    centerX: 50, centerY: 28, centerLabel: "🌍",
    lands: [
      { id: "world-discovery", name: "World Discovery",  color: "#1A5276", x: 52, y: 4,  w: 42, h: 30, rx: 8,  rides: ["Guardians of the Galaxy: Cosmic Rewind","Test Track","Mission: SPACE"] },
      { id: "world-nature",    name: "World Nature",     color: "#2D6A4F", x: 6,  y: 4,  w: 42, h: 30, rx: 8,  rides: ["Soarin' Around the World","Journey of Water, Inspired by Moana","Living with the Land","The Seas with Nemo & Friends"] },
      { id: "world-celebration",name: "World Celebration",color: "#5C3317",x: 28, y: 30, w: 44, h: 24, rx: 6,  rides: ["Remy's Ratatouille Adventure","Frozen Ever After","Disney and Pixar Short Film Festival"] },
      { id: "world-showcase",  name: "World Showcase",   color: "#4A235A", x: 6,  y: 54, w: 88, h: 38, rx: 12, rides: ["Gran Fiesta Tour Starring The Three Caballeros","Reflections of China","Canada Far and Wide"] },
    ],
  },

  // Hollywood Studios
  "288747d1-8b4f-4a64-867e-ea7c9b27bad8": {
    centerX: 50, centerY: 50, centerLabel: "🎬",
    lands: [
      { id: "galaxys-edge",  name: "Galaxy's Edge",     color: "#2C3E50", x: 4,  y: 4,  w: 38, h: 44, rx: 8,  rides: ["Millennium Falcon: Smugglers Run","Star Wars: Rise of the Resistance"] },
      { id: "toy-story",     name: "Toy Story Land",    color: "#E67E22", x: 4,  y: 56, w: 30, h: 36, rx: 8,  rides: ["Slinky Dog Dash","Alien Swirling Saucers","Toy Story Mania!"] },
      { id: "sunset-blvd",   name: "Sunset Blvd",       color: "#922B21", x: 60, y: 4,  w: 36, h: 48, rx: 8,  rides: ["The Twilight Zone Tower of Terror™","Rock 'n' Roller Coaster Starring Aerosmith"] },
      { id: "grand-ave",     name: "Grand Ave",         color: "#1E8449", x: 44, y: 54, w: 30, h: 38, rx: 6,  rides: ["Vacation Fun"] },
      { id: "echo-lake",     name: "Echo Lake",         color: "#6E2F9A", x: 38, y: 4,  w: 24, h: 48, rx: 4,  rides: ["Mickey & Minnie's Runaway Railway","Star Tours – The Adventures Continue"] },
    ],
  },

  // Animal Kingdom
  "1c84a229-8862-4648-9c71-378ddd2c7693": {
    centerX: 50, centerY: 50, centerLabel: "🌳",
    lands: [
      { id: "pandora",       name: "Pandora",           color: "#1A5276", x: 54, y: 4,  w: 42, h: 36, rx: 10, rides: ["Avatar Flight of Passage","Na'vi River Journey"] },
      { id: "africa",        name: "Africa",            color: "#784212", x: 6,  y: 4,  w: 44, h: 36, rx: 8,  rides: ["Kilimanjaro Safaris","Wildlife Express Train"] },
      { id: "asia",          name: "Asia",              color: "#1E8449", x: 6,  y: 48, w: 38, h: 36, rx: 8,  rides: ["Expedition Everest - Legend of the Forbidden Mountain","Kali River Rapids"] },
      { id: "dinoland",      name: "DinoLand / Zootopia",color: "#5D6D7E",x: 52, y: 48, w: 44, h: 36, rx: 8,  rides: ["Zootopia: Better Zoogether!"] },
      { id: "discovery",     name: "Discovery Island",  color: "#2E7D32", x: 30, y: 34, w: 40, h: 28, rx: 8,  rides: ["Tree of Life"] },
    ],
  },

  // Disneyland Park
  "7340550b-c14d-4def-80bb-acdb51d49a66": {
    centerX: 50, centerY: 45, centerLabel: "✨",
    lands: [
      { id: "mainstreet",    name: "Main Street",       color: "#8B6914", x: 38, y: 74, w: 24, h: 20, rx: 4,  rides: ["Disneyland Railroad","Main Street Vehicles"] },
      { id: "adventureland", name: "Adventureland",     color: "#2D6A4F", x: 6,  y: 44, w: 28, h: 28, rx: 8,  rides: ["Indiana Jones™ Adventure","Jungle Cruise","Pirates of the Caribbean"] },
      { id: "new-orleans",   name: "New Orleans Square",color: "#5C3317", x: 6,  y: 24, w: 24, h: 22, rx: 6,  rides: ["Haunted Mansion"] },
      { id: "frontierland",  name: "Frontierland",      color: "#8B4513", x: 8,  y: 4,  w: 28, h: 22, rx: 6,  rides: ["Big Thunder Mountain Railroad","Tiana's Bayou Adventure"] },
      { id: "fantasyland",   name: "Fantasyland",       color: "#6B3FA0", x: 32, y: 4,  w: 36, h: 26, rx: 10, rides: ["Matterhorn Bobsleds","Peter Pan's Flight","\"it's a small world\"","Alice in Wonderland"] },
      { id: "tomorrowland",  name: "Tomorrowland",      color: "#1A5276", x: 66, y: 24, w: 28, h: 36, rx: 8,  rides: ["Space Mountain","Buzz Lightyear Astro Blasters","Autopia"] },
      { id: "star-wars",     name: "Galaxy's Edge",     color: "#2C3E50", x: 66, y: 4,  w: 28, h: 22, rx: 8,  rides: ["Millennium Falcon: Smugglers Run","Star Wars: Rise of the Resistance"] },
      { id: "toontown",      name: "Toontown",          color: "#E74C3C", x: 36, y: 28, w: 30, h: 18, rx: 8,  rides: ["Mickey & Minnie's Runaway Railway"] },
    ],
  },

  // Disney California Adventure
  "832fcd51-ea19-4e77-85c7-75d5843b127c": {
    centerX: 50, centerY: 50, centerLabel: "🌅",
    lands: [
      { id: "avengers",      name: "Avengers Campus",   color: "#7B241C", x: 58, y: 4,  w: 38, h: 36, rx: 8,  rides: ["WEB SLINGERS: A Spider-Man Adventure","Guardians of the Galaxy - Mission: BREAKOUT!"] },
      { id: "pixar-pier",    name: "Pixar Pier",        color: "#D4AC0D", x: 58, y: 48, w: 38, h: 36, rx: 8,  rides: ["Incredicoaster","Inside Out Emotional Whirlwind","Toy Story Midway Mania!"] },
      { id: "cars-land",     name: "Cars Land",         color: "#D35400", x: 4,  y: 48, w: 50, h: 44, rx: 10, rides: ["Radiator Springs Racers","Luigi's Rollickin' Roadsters","Mater's Junkyard Jamboree"] },
      { id: "grizzly-peak",  name: "Grizzly Peak",      color: "#1E8449", x: 4,  y: 4,  w: 50, h: 40, rx: 10, rides: ["Soarin' Over California","Grizzly River Run"] },
    ],
  },

  // Universal Islands of Adventure
  "267615cc-8943-4c2a-ae2c-5da728ca591f": {
    centerX: 50, centerY: 50, centerLabel: "🏝",
    lands: [
      { id: "wizarding",     name: "Wizarding World",   color: "#4A235A", x: 4,  y: 4,  w: 36, h: 44, rx: 8,  rides: ["Harry Potter and the Forbidden Journey™","Flight of the Hippogriff™","Hagrid's Magical Creatures Motorbike Adventure™"] },
      { id: "jurassic",      name: "Jurassic World",    color: "#1E8449", x: 4,  y: 54, w: 36, h: 38, rx: 8,  rides: ["Jurassic World VelociCoaster","Jurassic Park River Adventure™","Pteranodon Flyers™"] },
      { id: "marvel",        name: "Marvel Super Hero Island",color: "#C0392B",x: 60,y: 4, w: 36, h: 44, rx: 8,  rides: ["The Amazing Adventures of Spider-Man®","Doctor Doom's Fearfall®","The Incredible Hulk Coaster®"] },
      { id: "seuss",         name: "Seuss Landing",     color: "#27AE60", x: 60, y: 54, w: 36, h: 38, rx: 8,  rides: ["The Cat in The Hat™","One Fish, Two Fish, Red Fish, Blue Fish™"] },
      { id: "toon-lagoon",   name: "Toon Lagoon",       color: "#2980B9", x: 32, y: 28, w: 36, h: 36, rx: 10, rides: ["Dudley Do-Right's Ripsaw Falls®","Popeye & Bluto's Bilge-Rat Barges®"] },
    ],
  },
};

function waitColor(wait: number | null, open: boolean): string {
  if (!open || wait === null) return "rgba(255,255,255,0.12)";
  if (wait <= 15) return "#4ECDC4"; if (wait <= 30) return "#7FDB8A";
  if (wait <= 50) return "#FFD700"; if (wait <= 75) return "#F5A623";
  return "#FF6B6B";
}

function avgLandWait(land: Land, rides: RideWait[]) {
  const matched = rides.filter(r => land.rides.some(lr =>
    r.name.toLowerCase().includes(lr.toLowerCase().slice(0, 14)) ||
    lr.toLowerCase().includes(r.name.toLowerCase().slice(0, 14))
  ));
  const open = matched.filter(r => r.isOpen && r.wait !== null);
  if (!open.length) return { avg: null, count: 0 };
  return { avg: Math.round(open.reduce((s, r) => s + (r.wait ?? 0), 0) / open.length), count: open.length };
}

export default function ParkMap({ parkId, rides, onAlertAdd }: {
  parkId: string; rides: RideWait[]; onAlertAdd?: (name: string) => void;
}) {
  const layout = PARK_LAYOUTS[parkId];
  const [selectedLand, setSelectedLand] = useState<string | null>(null);
  const [selectedRide, setSelectedRide] = useState<RideWait & { landName: string } | null>(null);

  if (!layout) {
    // Generic grid for unmapped parks
    const openRides = rides.filter(r => r.isOpen && r.wait !== null).sort((a, b) => (a.wait ?? 0) - (b.wait ?? 0));
    return (
      <div className="rounded-2xl border p-4" style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(255,215,0,0.15)" }}>
        <p className="text-xs font-body text-center mb-3" style={{ color: "rgba(220,235,255,0.5)" }}>Live wait times</p>
        <div className="grid grid-cols-1 gap-1.5">
          {openRides.slice(0, 10).map((ride, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", borderLeft: `3px solid ${waitColor(ride.wait, true)}` }}>
              <span className="text-xs flex-1 truncate" style={{ color: "#FFFFFF", fontFamily: "var(--font-nunito)" }}>{ride.name}</span>
              <span className="text-xs font-bold" style={{ color: waitColor(ride.wait, true), fontFamily: "var(--font-nunito)" }}>{ride.wait}m</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { lands, centerX, centerY, centerLabel } = layout;
  const activeLand = lands.find(l => l.id === selectedLand);
  const landRides = activeLand
    ? rides.filter(r => activeLand.rides.some(lr =>
        r.name.toLowerCase().includes(lr.toLowerCase().slice(0, 14)) ||
        lr.toLowerCase().includes(r.name.toLowerCase().slice(0, 14))
      ))
    : [];

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(13,27,42,0.85)", borderColor: "rgba(255,215,0,0.15)" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,215,0,0.08)", background: "rgba(255,215,0,0.04)" }}>
        <span style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "0.8rem", color: "#FFFFFF" }}>🗺 Live Park Map</span>
        <div className="flex items-center gap-3">
          {[["#4ECDC4","≤15m"],["#7FDB8A","≤30m"],["#FFD700","≤50m"],["#FF6B6B",">50m"]].map(([c,l]) => (
            <span key={l} className="flex items-center gap-1" style={{ fontFamily: "var(--font-nunito)", fontSize: "0.6rem", color: "rgba(220,235,255,0.5)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
            </span>
          ))}
        </div>
      </div>

      <div className="p-3">
        <div className="relative w-full" style={{ paddingBottom: "72%" }}>
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full"
            style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.6))" }}>
            <rect x="0" y="0" width="100" height="100" fill="#0A1628" rx="8" />
            {/* Hub */}
            <circle cx={centerX} cy={centerY} r="8" fill="rgba(30,58,95,0.5)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
            <text x={centerX} y={centerY} textAnchor="middle" dominantBaseline="middle" fontSize="7">{centerLabel}</text>

            {lands.map((land) => {
              if (land.id === "castle") {
                return (
                  <g key={land.id}>
                    <rect x={land.x} y={land.y} width={land.w} height={land.h} rx={land.rx || 4}
                      fill="rgba(100,130,200,0.25)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
                    <text x={land.x + land.w/2} y={land.y + land.h/2} textAnchor="middle" dominantBaseline="middle" fontSize="6">🏰</text>
                  </g>
                );
              }
              const { avg, count } = avgLandWait(land, rides);
              const fill = count > 0 ? waitColor(avg, true) : "rgba(255,255,255,0.06)";
              const isSelected = selectedLand === land.id;
              return (
                <g key={land.id} onClick={() => setSelectedLand(isSelected ? null : land.id)} style={{ cursor: "pointer" }}>
                  <rect x={land.x} y={land.y} width={land.w} height={land.h} rx={land.rx || 4}
                    fill={`${fill}${isSelected ? "cc" : "55"}`}
                    stroke={isSelected ? fill : "rgba(255,255,255,0.1)"}
                    strokeWidth={isSelected ? 0.7 : 0.25} />
                  <text x={land.x + land.w/2} y={land.y + land.h/2 - (avg ? 2.5 : 0)}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="rgba(255,255,255,0.9)" fontSize="2.4" fontWeight="600"
                    style={{ fontFamily: "sans-serif", pointerEvents: "none" }}>
                    {land.name.split(" ").slice(0, 2).join(" ")}
                  </text>
                  {avg !== null && (
                    <text x={land.x + land.w/2} y={land.y + land.h/2 + 3.2}
                      textAnchor="middle" dominantBaseline="middle"
                      fill={fill} fontSize="3.2" fontWeight="700"
                      style={{ pointerEvents: "none" }}>
                      ~{avg}m
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Land detail */}
        {activeLand && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "0.82rem", color: "#FFFFFF" }}>{activeLand.name}</span>
              <button onClick={() => { setSelectedLand(null); setSelectedRide(null); }}>
                <X size={13} style={{ color: "rgba(220,235,255,0.4)" }} />
              </button>
            </div>
            <div className="space-y-1.5">
              {landRides.length === 0 && (
                <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.72rem", color: "rgba(220,235,255,0.4)" }}>No live ride data for this land</p>
              )}
              {landRides.map((ride, i) => (
                <div key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer"
                  style={{ background: selectedRide?.name === ride.name ? "rgba(255,215,0,0.08)" : "rgba(255,255,255,0.04)" }}
                  onClick={() => setSelectedRide(selectedRide?.name === ride.name ? null : { ...ride, landName: activeLand.name })}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: waitColor(ride.wait, ride.isOpen) }} />
                  <span className="flex-1 text-xs truncate" style={{ color: "#FFFFFF", fontFamily: "var(--font-nunito)" }}>{ride.name}</span>
                  {ride.trend === "down" && <span style={{ color: "#4ECDC4", fontSize: "0.7rem" }}>↓</span>}
                  {ride.trend === "up" && <span style={{ color: "#FF6B6B", fontSize: "0.7rem" }}>↑</span>}
                  {ride.isOpen && ride.wait !== null
                    ? <span className="text-xs font-bold" style={{ color: waitColor(ride.wait, true), fontFamily: "var(--font-nunito)" }}>{ride.wait}m</span>
                    : <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.65rem", color: "rgba(220,235,255,0.35)" }}>Closed</span>
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ride detail */}
        {selectedRide && (
          <div className="mt-2.5 p-3 rounded-xl border" style={{ background: "rgba(255,215,0,0.05)", borderColor: "rgba(255,215,0,0.2)" }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.85rem", color: "#FFFFFF" }}>{selectedRide.name}</p>
                <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.65rem", color: "rgba(220,235,255,0.5)" }}>{selectedRide.landName}</p>
              </div>
              <button onClick={() => setSelectedRide(null)}><X size={12} style={{ color: "rgba(220,235,255,0.4)" }} /></button>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {selectedRide.isOpen && selectedRide.wait !== null && (
                <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "1.1rem", color: waitColor(selectedRide.wait, true) }}>
                  {selectedRide.wait} min wait
                </span>
              )}
              {!selectedRide.isOpen && (
                <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.8rem", color: "rgba(220,235,255,0.5)" }}>Currently closed</span>
              )}
              {selectedRide.isOpen && onAlertAdd && (
                <button onClick={() => onAlertAdd(selectedRide.name)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
                  style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.25)", fontFamily: "var(--font-nunito)", fontSize: "0.65rem", fontWeight: 700, color: "#FFD700" }}>
                  <Zap size={9} />Set Alert
                </button>
              )}
            </div>
          </div>
        )}

        {!selectedLand && (
          <p className="text-center mt-2" style={{ fontFamily: "var(--font-nunito)", fontSize: "0.6rem", color: "rgba(220,235,255,0.3)" }}>
            Tap any land to see rides
          </p>
        )}
      </div>
    </div>
  );
}
