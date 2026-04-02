"use client";
import { Ticket, Clock } from "lucide-react";

interface Show {
  name: string;
  status: string;
  showtimes: string[];
}

interface Restaurant {
  name: string;
  status: string;
}

export default function ShowsPanel({
  shows,
  restaurants,
  parkName,
}: {
  shows: Show[];
  restaurants: Restaurant[];
  parkName: string;
}) {
  const activeShows = shows.filter((s) => s.status !== "CLOSED" || s.showtimes.length > 0);
  const openRestaurants = restaurants.filter((r) => r.status === "OPERATING");

  function formatTime(iso: string) {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch {
      return iso;
    }
  }

  if (activeShows.length === 0 && openRestaurants.length === 0) return null;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(189,16,224,0.2)" }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(189,16,224,0.1)", background: "rgba(189,16,224,0.05)" }}>
        <Ticket size={13} style={{ color: "#BD10E0" }} />
        <span className="font-body font-600 text-sm text-park-cream">Today at {parkName}</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Shows */}
        {activeShows.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest font-body font-600 mb-2" style={{ color: "#BD10E0" }}>
              🎭 Shows & Entertainment
            </p>
            <div className="space-y-2">
              {activeShows.slice(0, 6).map((show, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <span className="text-xs text-park-cream font-body leading-tight flex-1 min-w-0 truncate">
                    {show.name}
                  </span>
                  <div className="flex flex-wrap gap-1 justify-end flex-shrink-0">
                    {show.showtimes.slice(0, 3).map((t, j) => (
                      <span
                        key={j}
                        className="text-[10px] px-1.5 py-0.5 rounded font-body font-500"
                        style={{ background: "rgba(189,16,224,0.15)", color: "#BD10E0" }}
                      >
                        <Clock size={8} className="inline mr-0.5" />
                        {formatTime(t)}
                      </span>
                    ))}
                    {show.showtimes.length === 0 && (
                      <span className="text-[10px] text-park-mist font-body">See park app</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dining */}
        {openRestaurants.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest font-body font-600 mb-2" style={{ color: "#F5A623" }}>
              🍽 Dining Open Now
            </p>
            <div className="flex flex-wrap gap-1.5">
              {openRestaurants.map((r, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-1 rounded-lg font-body"
                  style={{ background: "rgba(245,163,35,0.1)", color: "#F5A623", border: "1px solid rgba(245,163,35,0.2)" }}
                >
                  {r.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
