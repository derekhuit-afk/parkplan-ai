"use client";
import { useState } from "react";
import { Bell, BellOff, Plus, Trash2, Zap, X } from "lucide-react";
import { useAlerts, type WaitAlert } from "@/hooks/useAlerts";

interface RideOption { name: string; parkId: string; parkName: string; }

export default function AlertsPanel({ rides }: { rides: RideOption[] }) {
  const { alerts, permission, requestPermission, addAlert, removeAlert } = useAlerts();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedRide, setSelectedRide] = useState("");
  const [threshold, setThreshold] = useState(20);
  const [search, setSearch] = useState("");

  const handleAdd = async () => {
    if (!selectedRide) return;
    if (permission !== "granted") {
      const p = await requestPermission();
      if (p !== "granted") return;
    }
    const ride = rides.find((r) => r.name === selectedRide);
    if (!ride) return;
    addAlert({ rideName: ride.name, parkId: ride.parkId, parkName: ride.parkName, threshold });
    setSelectedRide("");
    setThreshold(20);
    setShowAdd(false);
    setSearch("");
  };

  const filteredRides = rides.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8);
  const activeAlerts = alerts.filter((a) => a.active);
  const firedAlerts = alerts.filter((a) => !a.active);

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(245,200,66,0.2)" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(245,200,66,0.1)", background: "rgba(245,200,66,0.05)" }}>
        <div className="flex items-center gap-2">
          <Bell size={13} style={{ color: "#F5C842" }} />
          <span className="font-body font-600 text-sm text-park-cream">Wait Alerts</span>
          {activeAlerts.length > 0 && (
            <span className="w-4 h-4 rounded-full text-[9px] font-body font-700 flex items-center justify-center"
              style={{ background: "#F5C842", color: "#0D1B2A" }}>
              {activeAlerts.length}
            </span>
          )}
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-body font-600 transition-all"
          style={{ background: "rgba(245,200,66,0.1)", color: "#F5C842", border: "1px solid rgba(245,200,66,0.2)" }}>
          <Plus size={11} />Add
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Permission banner */}
        {permission === "default" && (
          <div className="px-3 py-2.5 rounded-xl flex items-center gap-2 text-xs font-body"
            style={{ background: "rgba(245,200,66,0.08)", border: "1px solid rgba(245,200,66,0.2)" }}>
            <BellOff size={12} className="text-park-gold flex-shrink-0" />
            <span className="text-park-mist flex-1">Enable notifications to receive alerts</span>
            <button onClick={requestPermission}
              className="text-park-gold font-600 underline flex-shrink-0">Enable</button>
          </div>
        )}

        {permission === "denied" && (
          <div className="px-3 py-2 rounded-xl text-xs font-body text-park-mist/60"
            style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)" }}>
            ⚠️ Notifications blocked. Enable in browser settings to receive alerts.
          </div>
        )}

        {/* Add alert form */}
        {showAdd && (
          <div className="p-3 rounded-xl border space-y-3" style={{ background: "rgba(30,58,95,0.4)", borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-body font-600 text-park-cream">New alert</p>
              <button onClick={() => setShowAdd(false)}><X size={12} className="text-park-mist" /></button>
            </div>

            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelectedRide(""); }}
              placeholder="Search rides…"
              className="w-full text-xs font-body text-park-cream rounded-lg px-3 py-2 outline-none"
              style={{ background: "rgba(13,27,42,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
            />

            {search && (
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {filteredRides.map((r) => (
                  <button key={r.name} onClick={() => { setSelectedRide(r.name); setSearch(r.name); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-body transition-colors hover:bg-white/5"
                    style={{ background: selectedRide === r.name ? "rgba(245,200,66,0.1)" : "transparent", color: selectedRide === r.name ? "#F5C842" : "#B8C9D9" }}>
                    {r.name}
                    <span className="text-park-mist/50 ml-2">{r.parkName}</span>
                  </button>
                ))}
                {filteredRides.length === 0 && <p className="text-xs text-park-mist/50 px-3 py-2 font-body">No rides found</p>}
              </div>
            )}

            {selectedRide && (
              <div>
                <label className="text-[10px] uppercase tracking-widest text-park-mist font-body font-600 block mb-1.5">
                  Alert when wait drops below
                </label>
                <div className="flex items-center gap-3">
                  <input type="range" min="5" max="60" step="5" value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="flex-1" style={{ accentColor: "#F5C842" }} />
                  <span className="font-display font-700 text-lg text-park-gold w-14 text-right">{threshold}m</span>
                </div>
              </div>
            )}

            <button onClick={handleAdd} disabled={!selectedRide}
              className="w-full py-2 rounded-xl text-xs font-body font-700 transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #F5C842, #E8A020)", color: "#0D1B2A" }}>
              <Zap size={11} className="inline mr-1.5" />
              Set Alert for {threshold}min
            </button>
          </div>
        )}

        {/* Active alerts */}
        {activeAlerts.length === 0 && !showAdd && (
          <p className="text-xs text-park-mist/50 font-body text-center py-2">
            No active alerts. Add one to get notified when a ride drops below your wait threshold.
          </p>
        )}

        {activeAlerts.map((alert) => (
          <div key={alert.id} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border"
            style={{ background: "rgba(245,200,66,0.05)", borderColor: "rgba(245,200,66,0.15)" }}>
            <Zap size={11} className="text-park-gold flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-body font-600 text-park-cream truncate">{alert.rideName}</p>
              <p className="text-[10px] text-park-mist font-body">Alert when &lt; {alert.threshold}min</p>
            </div>
            <button onClick={() => removeAlert(alert.id)} className="p-1 rounded-lg hover:bg-red-500/10 flex-shrink-0">
              <Trash2 size={11} className="text-park-mist/50 hover:text-park-coral transition-colors" />
            </button>
          </div>
        ))}

        {/* Fired alerts */}
        {firedAlerts.slice(0, 2).map((alert) => (
          <div key={alert.id} className="flex items-center gap-2 px-3 py-2 rounded-xl opacity-50"
            style={{ background: "rgba(78,205,196,0.05)", border: "1px solid rgba(78,205,196,0.1)" }}>
            <Bell size={10} className="text-park-mint flex-shrink-0" />
            <p className="text-[10px] font-body text-park-mist flex-1 truncate">
              ✓ {alert.rideName} fired at {alert.firedAt ? new Date(alert.firedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "—"}
            </p>
            <button onClick={() => removeAlert(alert.id)}><X size={10} className="text-park-mist/30" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
