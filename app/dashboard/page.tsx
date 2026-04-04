"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, RefreshCw, Sparkles, ArrowLeft, Clock, CloudRain, Zap, TrendingDown, TrendingUp, Bell, ChevronDown } from "lucide-react";
import ParkMap from "@/components/ParkMap";
import AlertsPanel from "@/components/AlertsPanel";
import ItineraryOptimizer from "@/components/ItineraryOptimizer";
import WaitTrends from "@/components/WaitTrends";
import { useAlerts } from "@/hooks/useAlerts";
import { useWaitHistory } from "@/hooks/useWaitHistory";

const RESORTS = [
  { id: "wdw", name: "Walt Disney World", parks: [
    { id: "75ea578a-adc8-4116-a54d-dccb60765ef9", name: "Magic Kingdom", emoji: "🏰" },
    { id: "47f90d2c-e191-4239-a466-5892ef59a88b", name: "EPCOT", emoji: "🌍" },
    { id: "288747d1-8b4f-4a64-867e-ea7c9b27bad8", name: "Hollywood Studios", emoji: "🎬" },
    { id: "1c84a229-8862-4648-9c71-378ddd2c7693", name: "Animal Kingdom", emoji: "🦁" },
  ]},
  { id: "disneyland", name: "Disneyland Resort", parks: [
    { id: "7340550b-c14d-4def-80bb-acdb51d49a66", name: "Disneyland", emoji: "✨" },
    { id: "832fcd51-ea19-4e77-85c7-75d5843b127c", name: "California Adventure", emoji: "🌅" },
  ]},
  { id: "universal-orlando", name: "Universal Orlando", parks: [
    { id: "267615cc-8943-4c2a-ae2c-5da728ca591f", name: "Islands of Adventure", emoji: "🏝" },
    { id: "eb3f4560-2383-4a36-9152-6b3e5ed6bc57", name: "Universal Studios", emoji: "🎬" },
  ]},
];

interface RideWait { name: string; wait: number | null; isOpen: boolean; trend?: "up"|"down"|"stable"|null; }
interface ShowTime { name: string; status: string; showtimes: string[]; }
interface Restaurant { name: string; status: string; }
interface LLPrice { name: string; price?: { formatted: string }; available?: boolean; }
interface ParkData { parkId: string; parkName: string; totalAttractions: number; openAttractions: number; avgWait: number; topWaits: RideWait[]; walkOns: RideWait[]; shows: ShowTime[]; restaurants: Restaurant[]; hours: {open?:string;close?:string}|null; llPrices: LLPrice[]; }
interface WeatherData { current: { tempF: number; feelsLikeF: number; label: string; emoji: string; humidity: number; rainChance?: number; }; forecast: { date: string; highF: number; lowF: number; rainChance: number; emoji: string; label: string; }[]; }

function waitColor(w: number|null, open: boolean) {
  if (!open || w === null) return "#B8C9D9";
  if (w <= 15) return "#4ECDC4"; if (w <= 30) return "#7ED321";
  if (w <= 50) return "#FFD700"; if (w <= 75) return "#F5A623";
  return "#FF6B6B";
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const defaultResort = searchParams.get("resort") || "wdw";
  const resort = RESORTS.find(r => r.id === defaultResort) || RESORTS[0];

  const [selectedResortId, setSelectedResortId] = useState(defaultResort);
  const [selectedParkIdx, setSelectedParkIdx] = useState(0);
  const [parkData, setParkData] = useState<ParkData[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"map"|"optimizer"|"alerts"|"shows"|"trends">("map");
  const [showResortPicker, setShowResortPicker] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const selectedResort = RESORTS.find(r => r.id === selectedResortId) || RESORTS[0];
  const currentPark = selectedResort.parks[selectedParkIdx];

  const { checkAlerts } = useAlerts();
  const { record, getTrend, loadHistory } = useWaitHistory();

  const fetchData = useCallback(async () => {
    try {
      const [waitRes, wxRes] = await Promise.all([
        fetch(`/api/waittimes?resort=${selectedResortId}`),
        fetch(`/api/weather?resort=${selectedResortId}`),
      ]);
      if (waitRes.ok) {
        const wd = await waitRes.json();
        const parks: ParkData[] = wd.parks || [];

        // Record history + check alerts for each park
        for (const park of parks) {
          const history = record(park.parkId, [...park.topWaits, ...park.walkOns]);
          // Add trend to rides
          const allRides = [...park.topWaits, ...park.walkOns];
          for (const ride of allRides) {
            (ride as RideWait).trend = getTrend(history, ride.name);
          }
          checkAlerts([...park.topWaits, ...park.walkOns], park.parkId);
        }
        setParkData(parks);
        setLastUpdate(new Date());
      }
      if (wxRes.ok) setWeather(await wxRes.json());
    } catch {}
    finally { setLoading(false); }
  }, [selectedResortId, record, getTrend, checkAlerts]);

  useEffect(() => {
    setLoading(true);
    fetchData();
    intervalRef.current = setInterval(fetchData, 5 * 60 * 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchData]);

  const curParkData = parkData[selectedParkIdx];
  const allRides: RideWait[] = curParkData ? [...curParkData.topWaits, ...curParkData.walkOns].filter((r,i,arr)=>arr.findIndex(x=>x.name===r.name)===i) : [];
  const today = weather?.forecast?.[0];
  const rainAlert = (today?.rainChance ?? 0) >= 40;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#00194B" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0 sticky top-0 z-20"
        style={{ borderColor: "rgba(255,215,0,0.1)", background: "rgba(0,25,75,0.97)", backdropFilter: "blur(16px)" }}>
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft size={15} className="text-park-mist group-hover:text-park-gold transition-colors" />
          <div className="w-6 h-6 rounded-full bg-gold-gradient flex items-center justify-center">
            <MapPin size={11} className="text-park-night" />
          </div>
          <span className="font-display font-700 text-base text-park-cream hidden sm:block">
            Park<span className="text-park-gold">Plan</span><span className="text-park-mist text-[10px] font-body font-normal ml-1">.ai</span>
          </span>
        </Link>

        {/* Resort picker */}
        <div className="relative">
          <button onClick={() => setShowResortPicker(!showResortPicker)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body font-600 border transition-all"
            style={{ borderColor: "rgba(255,215,0,0.25)", color: "#FFD700", background: "rgba(245,200,66,0.08)" }}>
            {selectedResort.name.split(" ").slice(0,2).join(" ")}
            <ChevronDown size={10} className={`transition-transform ${showResortPicker ? "rotate-180" : ""}`} />
          </button>
          {showResortPicker && (
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl border shadow-2xl z-30 overflow-hidden"
              style={{ background: "#00194B", borderColor: "rgba(245,200,66,0.2)" }}>
              {RESORTS.map(r => (
                <button key={r.id} onClick={() => { setSelectedResortId(r.id); setSelectedParkIdx(0); setShowResortPicker(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-body transition-colors hover:bg-white/5 border-b"
                  style={{ color: r.id === selectedResortId ? "#FFD700" : "#B8C9D9", borderColor: "rgba(255,255,255,0.04)" }}>
                  {r.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-[10px] text-park-mist/40 font-body hidden sm:block">
              {lastUpdate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </span>
          )}
          <button onClick={fetchData} className="p-1.5 rounded-lg hover:bg-white/5">
            <RefreshCw size={13} className={`text-park-mist ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* Park tabs */}
      <div className="flex gap-1 px-4 py-2 border-b flex-shrink-0 overflow-x-auto" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {selectedResort.parks.map((park, i) => (
          <button key={park.id} onClick={() => setSelectedParkIdx(i)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body font-500 flex-shrink-0 transition-all"
            style={selectedParkIdx === i
              ? { background: "rgba(255,215,0,0.1)", color: "#FFD700", border: "1px solid rgba(245,200,66,0.25)" }
              : { color: "#B8C9D9", border: "1px solid transparent" }}>
            <span>{park.emoji}</span>
            <span className="hidden sm:block">{park.name}</span>
            {parkData[i] && <span className="text-[9px] opacity-60">({parkData[i].openAttractions})</span>}
          </button>
        ))}
      </div>

      {/* Live status bar */}
      {curParkData && (
        <div className="flex items-center gap-4 px-4 py-2.5 border-b flex-shrink-0 overflow-x-auto"
          style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(26,46,69,0.3)" }}>
          {[
            { label: "Open rides", value: `${curParkData.openAttractions}/${curParkData.totalAttractions}`, color: "#4ECDC4" },
            { label: "Avg wait", value: `${curParkData.avgWait}min`, color: "#FFD700" },
            { label: "Walk-ons", value: String(curParkData.walkOns.length), color: "#7ED321" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-1.5 flex-shrink-0">
              <span className="font-display font-700 text-lg" style={{ color }}>{value}</span>
              <span className="text-[10px] text-park-mist/60 font-body">{label}</span>
            </div>
          ))}
          {weather && (
            <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
              <span className="text-sm">{weather.current.emoji}</span>
              <span className="text-xs text-park-cream font-body">{weather.current.tempF}°F</span>
              {rainAlert && <span className="text-[10px] text-park-coral flex items-center gap-0.5"><CloudRain size={9} />{today?.rainChance}%</span>}
            </div>
          )}
          {curParkData.hours?.open && (
            <div className="flex items-center gap-1 flex-shrink-0 text-[10px] text-park-mist/50 font-body ml-2">
              <Clock size={9} />
              {new Date(curParkData.hours.open).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}–
              {curParkData.hours.close ? new Date(curParkData.hours.close).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "?"}
            </div>
          )}
        </div>
      )}

      {/* Rain alert banner */}
      {rainAlert && (
        <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-body"
          style={{ background: "rgba(78,205,196,0.08)", border: "1px solid rgba(78,205,196,0.2)" }}>
          <CloudRain size={14} className="text-park-mint flex-shrink-0" />
          <span className="text-park-mint font-600">{today?.rainChance}% rain today</span>
          <span className="text-park-mist/70 text-xs"> — Covered rides: Haunted Mansion, Pirates, Space Mountain, Rise of the Resistance</span>
        </div>
      )}

      {/* Feature tab switcher */}
      <div className="flex gap-1 px-4 py-2 mt-2 flex-shrink-0">
        {([
          { key: "map", icon: MapPin, label: "Live Map" },
          { key: "optimizer", icon: Sparkles, label: "Optimizer" },
          { key: "alerts", icon: Bell, label: "Alerts" },
          { key: "shows", icon: Clock, label: "Shows" },
          { key: "trends", icon: TrendingUp, label: "Trends" },
        ] as { key: typeof activeTab; icon: typeof MapPin; label: string }[]).map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-body font-500 transition-all"
            style={activeTab === key
              ? { background: "rgba(255,107,107,0.12)", color: "#FF6B6B", border: "1px solid rgba(255,107,107,0.25)" }
              : { color: "#B8C9D9", border: "1px solid transparent" }}>
            <Icon size={11} />{label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
        {loading && (
          <div className="flex items-center justify-center py-12 gap-2">
            <RefreshCw size={16} className="text-park-mist animate-spin" />
            <span className="text-sm text-park-mist font-body">Fetching live park data…</span>
          </div>
        )}

        {!loading && (
          <div className="space-y-4 max-w-2xl mx-auto">

            {/* Live Map tab */}
            {activeTab === "map" && currentPark && (
              <>
                <ParkMap
                  parkId={currentPark.id}
                  rides={allRides}
                  onAlertAdd={(name) => { setActiveTab("alerts"); }}
                />
                {/* Quick wait list below map */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(78,205,196,0.15)" }}>
                  <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "rgba(78,205,196,0.1)" }}>
                    <TrendingUp size={13} style={{ color: "#4ECDC4" }} />
                    <span className="font-body font-600 text-sm text-park-cream">All Open Rides</span>
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  </div>
                  <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {allRides.filter(r => r.isOpen && r.wait !== null).sort((a,b)=>(a.wait??0)-(b.wait??0)).map((ride,i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                        style={{ background: "rgba(30,58,95,0.4)", borderLeft: `3px solid ${waitColor(ride.wait, ride.isOpen)}` }}>
                        <span className="text-xs text-park-cream font-body flex-1 min-w-0 truncate">{ride.name}</span>
                        {ride.trend === "down" && <TrendingDown size={10} className="text-park-mint flex-shrink-0" />}
                        {ride.trend === "up" && <TrendingUp size={10} className="text-park-coral flex-shrink-0" />}
                        <span className="text-xs font-body font-700 flex-shrink-0" style={{ color: waitColor(ride.wait, ride.isOpen) }}>
                          {ride.wait}m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Optimizer tab */}
            {activeTab === "optimizer" && currentPark && (
              <ItineraryOptimizer
                resortId={selectedResortId}
                parkId={currentPark.id}
                parkName={currentPark.name}
                rides={allRides}
              />
            )}

            {/* Alerts tab */}
            {activeTab === "alerts" && (
              <AlertsPanel
                rides={allRides.map(r => ({ name: r.name, parkId: currentPark?.id || "", parkName: currentPark?.name || "" }))}
              />
            )}

            {/* Shows tab */}
            {activeTab === "shows" && curParkData && (
              <div className="space-y-4">
                {/* Shows */}
                {curParkData.shows.length > 0 && (
                  <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(189,16,224,0.2)" }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(189,16,224,0.1)", background: "rgba(189,16,224,0.05)" }}>
                      <span className="font-body font-600 text-sm text-park-cream">🎭 Shows & Entertainment</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {curParkData.shows.map((show, i) => (
                        <div key={i} className="flex items-start justify-between gap-3">
                          <span className="text-xs text-park-cream font-body flex-1 min-w-0">{show.name}</span>
                          <div className="flex flex-wrap gap-1 justify-end flex-shrink-0">
                            {show.showtimes.slice(0,3).map((t,j) => (
                              <span key={j} className="text-[10px] px-2 py-0.5 rounded font-body"
                                style={{ background: "rgba(189,16,224,0.15)", color: "#BD10E0" }}>
                                {new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}
                              </span>
                            ))}
                            {show.showtimes.length === 0 && <span className="text-[10px] text-park-mist">See park app</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Dining */}
                {curParkData.restaurants.length > 0 && (
                  <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(245,163,35,0.2)" }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(245,163,35,0.1)", background: "rgba(245,163,35,0.05)" }}>
                      <span className="font-body font-600 text-sm text-park-cream">🍽 Dining Status</span>
                    </div>
                    <div className="p-4 flex flex-wrap gap-2">
                      {curParkData.restaurants.map((r,i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body"
                          style={{ background: r.status === "OPERATING" ? "rgba(245,163,35,0.1)" : "rgba(255,255,255,0.04)", color: r.status === "OPERATING" ? "#F5A623" : "#B8C9D9", border: `1px solid ${r.status === "OPERATING" ? "rgba(245,163,35,0.2)" : "rgba(255,255,255,0.06)"}` }}>
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: r.status === "OPERATING" ? "#F5A623" : "#B8C9D9" }} />
                          {r.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* LL Prices */}
                {curParkData.llPrices?.length > 0 && (
                  <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(126,211,33,0.15)" }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(126,211,33,0.1)" }}>
                      <span className="font-body font-600 text-sm text-park-cream">⚡ Lightning Lane Prices Today</span>
                    </div>
                    <div className="p-4 space-y-2">
                      {curParkData.llPrices.map((ll,i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-body">
                          <span className="text-park-mist">{ll.name.replace("Lightning Lane for ","")}</span>
                          <span className="font-600" style={{ color: ll.available ? "#7ED321" : "#B8C9D9" }}>
                            {ll.price?.formatted ?? "—"} {!ll.available && "· Sold Out"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

      {/* Bottom quick-access bar */}
      <div className="border-t px-4 py-3 flex items-center justify-between flex-shrink-0"
        style={{ borderColor: "rgba(255,215,0,0.08)", background: "rgba(13,27,42,0.95)" }}>
        <div className="flex items-center gap-2">
          {curParkData?.walkOns.slice(0,2).map((ride,i) => (
            <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-body"
              style={{ background: "rgba(78,205,196,0.1)", color: "#4ECDC4", border: "1px solid rgba(78,205,196,0.2)" }}>
              <Zap size={9} />{ride.name.split(" ").slice(0,2).join(" ")} {ride.wait}m
            </div>
          ))}
        </div>
        <Link href={`/plan?resort=${selectedResortId}`}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-body font-600 text-park-night"
          style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)" }}>
          <Sparkles size={11} />Ask AI
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-park-night"><div className="text-park-gold animate-pulse font-display text-xl">Loading dashboard…</div></div>}>
      <DashboardContent />
    </Suspense>
  );
}
