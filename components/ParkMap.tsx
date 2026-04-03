"use client";
import { useState } from "react";
import { X, Clock, Zap } from "lucide-react";

interface RideWait {
  name: string;
  wait: number | null;
  isOpen: boolean;
  trend?: "up" | "down" | "stable" | null;
}

interface Land {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
  rides: string[]; // subset of ride names
}

// Magic Kingdom land layout (normalized 0-100 coordinate space)
const MK_LANDS: Land[] = [
  { id: "mainstreet",    name: "Main Street",     color: "#8B6914", x: 38, y: 72, w: 24, h: 20, rx: 4, rides: ["Walt Disney World Railroad"] },
  { id: "adventureland", name: "Adventureland",   color: "#2D6A4F", x: 8,  y: 42, w: 26, h: 26, rx: 8, rides: ["Jungle Cruise","Pirates of the Caribbean","A Pirate's Adventure"] },
  { id: "frontierland",  name: "Frontierland",    color: "#8B4513", x: 8,  y: 20, w: 24, h: 24, rx: 6, rides: ["Big Thunder Mountain Railroad","Tiana's Bayou Adventure"] },
  { id: "liberty",       name: "Liberty Square",  color: "#5C4B32", x: 30, y: 22, w: 18, h: 18, rx: 4, rides: ["Haunted Mansion","Liberty Belle Riverboat"] },
  { id: "fantasyland",   name: "Fantasyland",     color: "#6B3FA0", x: 32, y: 4,  w: 36, h: 26, rx: 10, rides: ["Seven Dwarfs Mine Train","Peter Pan's Flight","\"it's a small world\"","Dumbo the Flying Elephant","The Many Adventures of Winnie the Pooh","Under the Sea ~ Journey of The Little Mermaid"] },
  { id: "tomorrowland",  name: "Tomorrowland",    color: "#1A5276", x: 66, y: 22, w: 26, h: 32, rx: 8, rides: ["TRON Lightcycle / Run","Space Mountain","Buzz Lightyear's Space Ranger Spin","Tomorrowland Speedway"] },
  { id: "castle",        name: "Cinderella Castle",color: "#4B6CB7", x: 42, y: 28, w: 16, h: 16, rx: 8, rides: [] },
];

// Hollywood Studios layout
const HS_LANDS: Land[] = [
  { id: "galaxys-edge",  name: "Galaxy's Edge",   color: "#2C3E50", x: 5,  y: 5,  w: 35, h: 40, rx: 8, rides: ["Millennium Falcon: Smugglers Run","Star Wars: Rise of the Resistance"] },
  { id: "toy-story",     name: "Toy Story Land",  color: "#E67E22", x: 5,  y: 55, w: 28, h: 38, rx: 8, rides: ["Slinky Dog Dash","Alien Swirling Saucers","Toy Story Mania!"] },
  { id: "sunset-blvd",   name: "Sunset Boulevard", color: "#922B21", x: 60, y: 5,  w: 35, h: 45, rx: 8, rides: ["The Twilight Zone Tower of Terror","Rock 'n' Roller Coaster Starring Aerosmith"] },
  { id: "grand-ave",     name: "Grand Avenue",    color: "#1E8449", x: 42, y: 55, w: 30, h: 38, rx: 6, rides: ["MuppetVision 3D"] },
  { id: "mk-main",       name: "Hollywood Blvd",  color: "#6E2F9A", x: 38, y: 5,  w: 20, h: 45, rx: 4, rides: ["Mickey & Minnie's Runaway Railway"] },
];

const PARK_LANDS: Record<string, Land[]> = {
  "75ea578a-adc8-4116-a54d-dccb60765ef9": MK_LANDS,  // Magic Kingdom
  "288747d1-8b4f-4a64-867e-ea7c9b27bad8": HS_LANDS,  // Hollywood Studios
};

function waitColor(wait: number | null, isOpen: boolean): string {
  if (!isOpen || wait === null) return "rgba(255,255,255,0.15)";
  if (wait <= 15) return "#4ECDC4";
  if (wait <= 30) return "#7ED321";
  if (wait <= 50) return "#F5C842";
  if (wait <= 75) return "#F5A623";
  return "#FF6B6B";
}

function avgLandWait(land: Land, rides: RideWait[]): { avg: number | null; open: number } {
  const landRides = rides.filter((r) =>
    land.rides.some((lr) => r.name.toLowerCase().includes(lr.toLowerCase().slice(0, 12)) || lr.toLowerCase().includes(r.name.toLowerCase().slice(0, 12)))
  );
  const openRides = landRides.filter((r) => r.isOpen && r.wait !== null);
  if (openRides.length === 0) return { avg: null, open: 0 };
  const avg = Math.round(openRides.reduce((s, r) => s + (r.wait ?? 0), 0) / openRides.length);
  return { avg, open: openRides.length };
}

interface SelectedRide {
  name: string;
  wait: number | null;
  isOpen: boolean;
  land: string;
  trend?: "up" | "down" | "stable" | null;
}

export default function ParkMap({
  parkId,
  rides,
  onAlertAdd,
}: {
  parkId: string;
  rides: RideWait[];
  onAlertAdd?: (rideName: string) => void;
}) {
  const lands = PARK_LANDS[parkId];
  const [selectedLand, setSelectedLand] = useState<string | null>(null);
  const [selectedRide, setSelectedRide] = useState<SelectedRide | null>(null);

  if (!lands) {
    // Generic heatmap for parks without custom layouts
    return (
      <div className="rounded-2xl border p-4" style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(245,200,66,0.15)" }}>
        <p className="text-xs text-park-mist font-body text-center py-4">
          Interactive map available for Magic Kingdom & Hollywood Studios.<br />
          More parks coming in v4.1.
        </p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {rides.filter((r) => r.isOpen && r.wait !== null).slice(0, 8).map((ride, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-body"
              style={{ background: "rgba(30,58,95,0.5)", borderLeft: `3px solid ${waitColor(ride.wait, ride.isOpen)}` }}>
              <span className="text-park-cream truncate flex-1 min-w-0 pr-2">{ride.name}</span>
              <span className="font-600 flex-shrink-0" style={{ color: waitColor(ride.wait, ride.isOpen) }}>{ride.wait}m</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activeLand = lands.find((l) => l.id === selectedLand);
  const landRides = activeLand
    ? rides.filter((r) =>
        activeLand.rides.some((lr) =>
          r.name.toLowerCase().includes(lr.toLowerCase().slice(0, 12)) ||
          lr.toLowerCase().includes(r.name.toLowerCase().slice(0, 12))
        )
      )
    : [];

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(245,200,66,0.15)" }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(245,200,66,0.1)", background: "rgba(245,200,66,0.05)" }}>
        <span className="text-sm font-body font-600 text-park-cream">🗺 Live Park Map</span>
        <div className="ml-auto flex items-center gap-3 text-[10px] font-body text-park-mist">
          {[["#4ECDC4","≤15m"],["#7ED321","≤30m"],["#F5C842","≤50m"],["#FF6B6B",">50m"]].map(([c,l]) => (
            <span key={l} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />{l}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* SVG Map */}
        <div className="relative w-full" style={{ paddingBottom: "75%" }}>
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            style={{ filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.5))" }}
          >
            {/* Background */}
            <rect x="0" y="0" width="100" height="100" fill="#0A1628" rx="8" />

            {/* Hub paths */}
            <circle cx="50" cy="46" r="10" fill="rgba(30,58,95,0.4)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

            {lands.map((land) => {
              const { avg, open } = avgLandWait(land, rides);
              const fill = open > 0 ? waitColor(avg, true) : "rgba(255,255,255,0.08)";
              const isSelected = selectedLand === land.id;
              const iscastle = land.id === "castle";

              return (
                <g key={land.id}>
                  <rect
                    x={land.x}
                    y={land.y}
                    width={land.w}
                    height={land.h}
                    rx={land.rx || 4}
                    fill={iscastle ? "rgba(100,130,200,0.3)" : `${fill}${isSelected ? "ee" : "88"}`}
                    stroke={isSelected ? fill : "rgba(255,255,255,0.12)"}
                    strokeWidth={isSelected ? 0.8 : 0.3}
                    className={iscastle ? "" : "cursor-pointer transition-all"}
                    onClick={() => !iscastle && setSelectedLand(isSelected ? null : land.id)}
                  />
                  {!iscastle && (
                    <>
                      <text
                        x={land.x + land.w / 2}
                        y={land.y + land.h / 2 - (avg !== null ? 2 : 0)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="rgba(255,255,255,0.9)"
                        fontSize="2.8"
                        fontWeight="600"
                        style={{ pointerEvents: "none", fontFamily: "DM Sans, sans-serif" }}
                      >
                        {land.name.split(" ").slice(0, 2).join(" ")}
                      </text>
                      {avg !== null && (
                        <text
                          x={land.x + land.w / 2}
                          y={land.y + land.h / 2 + 3.5}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={fill}
                          fontSize="3.5"
                          fontWeight="700"
                          style={{ pointerEvents: "none" }}
                        >
                          ~{avg}m
                        </text>
                      )}
                      {avg === null && open === 0 && (
                        <text
                          x={land.x + land.w / 2}
                          y={land.y + land.h / 2 + 3.5}
                          textAnchor="middle"
                          fill="rgba(255,255,255,0.3)"
                          fontSize="2.5"
                          style={{ pointerEvents: "none" }}
                        >
                          closed
                        </text>
                      )}
                    </>
                  )}
                  {iscastle && (
                    <text x={land.x + land.w/2} y={land.y + land.h/2} textAnchor="middle" dominantBaseline="middle" fontSize="6" style={{ pointerEvents: "none" }}>🏰</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Land detail panel */}
        {activeLand && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-body font-600 text-sm text-park-cream">{activeLand.name}</h4>
              <button onClick={() => setSelectedLand(null)} className="p-1 rounded-lg hover:bg-white/5">
                <X size={13} className="text-park-mist" />
              </button>
            </div>
            <div className="space-y-1.5">
              {landRides.length === 0 && (
                <p className="text-xs text-park-mist/60 font-body">No live ride data for this land</p>
              )}
              {landRides.map((ride, i) => (
                <div key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                  style={{ background: "rgba(30,58,95,0.4)" }}
                  onClick={() => setSelectedRide(selectedRide?.name === ride.name ? null : { ...ride, land: activeLand.name })}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: waitColor(ride.wait, ride.isOpen) }} />
                  <span className="text-xs text-park-cream font-body flex-1 min-w-0 truncate">{ride.name}</span>
                  {ride.trend === "up" && <span className="text-[10px] text-park-coral">↑</span>}
                  {ride.trend === "down" && <span className="text-[10px] text-park-mint">↓</span>}
                  {ride.isOpen && ride.wait !== null ? (
                    <span className="text-xs font-body font-600 flex-shrink-0" style={{ color: waitColor(ride.wait, ride.isOpen) }}>
                      {ride.wait}m
                    </span>
                  ) : (
                    <span className="text-[10px] text-park-mist/50 font-body">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ride detail tooltip */}
        {selectedRide && (
          <div className="mt-3 p-3 rounded-xl border" style={{ background: "rgba(26,46,69,0.8)", borderColor: `${waitColor(selectedRide.wait, selectedRide.isOpen)}40` }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-body font-600 text-sm text-park-cream">{selectedRide.name}</p>
                <p className="text-[10px] text-park-mist font-body">{selectedRide.land}</p>
              </div>
              <button onClick={() => setSelectedRide(null)}><X size={12} className="text-park-mist mt-0.5" /></button>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {selectedRide.isOpen && selectedRide.wait !== null ? (
                <div className="flex items-center gap-1.5">
                  <Clock size={11} style={{ color: waitColor(selectedRide.wait, selectedRide.isOpen) }} />
                  <span className="font-body font-700 text-base" style={{ color: waitColor(selectedRide.wait, selectedRide.isOpen) }}>
                    {selectedRide.wait} min wait
                  </span>
                </div>
              ) : (
                <span className="text-xs text-park-mist font-body">Currently closed</span>
              )}
              {selectedRide.isOpen && onAlertAdd && (
                <button
                  onClick={() => onAlertAdd(selectedRide.name)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-body font-600 transition-all"
                  style={{ background: "rgba(245,200,66,0.12)", color: "#F5C842", border: "1px solid rgba(245,200,66,0.25)" }}
                >
                  <Zap size={9} />Set Alert
                </button>
              )}
            </div>
          </div>
        )}

        <p className="text-[9px] text-park-mist/30 text-center font-body mt-3">Tap a land to see rides · Data from ThemeParks.wiki</p>
      </div>
    </div>
  );
}
