"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Trash2, ExternalLink, Sparkles, Download, Upload, Share2, Check } from "lucide-react";
import { useTripStore, exportTripsToUrl, importTripsFromHash } from "@/hooks/useTripStore";

export default function TripsPage() {
  const { trips, ready, deleteTrip, clearAll, importTrips } = useTripStore();
  const [search, setSearch] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [showExportToast, setShowExportToast] = useState(false);

  // Handle import from URL hash on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash.includes("data=")) {
      const imported = importTripsFromHash(hash);
      if (imported && imported.length > 0) {
        importTrips(imported);
        setImportMsg(`✅ ${imported.length} trip${imported.length > 1 ? "s" : ""} imported from link!`);
        window.history.replaceState({}, "", window.location.pathname);
        setTimeout(() => setImportMsg(null), 4000);
      }
    }
  }, [importTrips]);

  const filtered = trips.filter((t) =>
    search ? t.title.toLowerCase().includes(search.toLowerCase()) || t.resortName.toLowerCase().includes(search.toLowerCase()) : true
  );

  const handleShare = async (id: string, resortId: string) => {
    const url = `${window.location.origin}/plan?resort=${resortId}&load=${id}`;
    try { await navigator.clipboard.writeText(url); }
    catch { /* fallback */ }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAll = async () => {
    const url = exportTripsToUrl(trips);
    try { await navigator.clipboard.writeText(url); }
    catch { /* fallback */ }
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  const fmtDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
    catch { return iso; }
  };

  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#00194B" }}>
      <div className="text-center">
        <div className="text-4xl mb-3">🏰</div>
        <p style={{ fontFamily: "var(--font-cinzel)", color: "#FFD700" }}>Loading trips…</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen" style={{ background: "#00194B" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 py-4 border-b flex items-center gap-3"
        style={{ background: "rgba(0,25,75,0.97)", borderColor: "rgba(255,215,0,0.1)", backdropFilter: "blur(16px)" }}>
        <Link href="/" className="p-2 rounded-xl" style={{ color: "rgba(220,235,255,0.6)" }}>
          <ArrowLeft size={18} />
        </Link>
        <span className="text-xl">🏰</span>
        <span style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "1rem", color: "#FFD700" }}>
          My Trips
        </span>
        <div className="ml-auto flex items-center gap-2">
          {trips.length > 0 && (
            <button onClick={handleExportAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all"
              style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.25)", color: "#FFD700", fontFamily: "var(--font-nunito)", fontWeight: 700 }}>
              {showExportToast ? <Check size={12} /> : <Download size={12} />}
              {showExportToast ? "Copied!" : "Export All"}
            </button>
          )}
          <Link href="/start"
            className="btn-primary flex items-center gap-1.5 px-4 py-2 text-sm">
            <Sparkles size={13} />
            New Trip
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Import toast */}
        {importMsg && (
          <div className="px-4 py-3 rounded-2xl text-sm font-body text-center"
            style={{ background: "rgba(127,219,138,0.12)", border: "1px solid rgba(127,219,138,0.3)", color: "#7FDB8A", fontFamily: "var(--font-nunito)" }}>
            {importMsg}
          </div>
        )}

        {/* Export toast */}
        {showExportToast && (
          <div className="px-4 py-3 rounded-2xl text-sm font-body text-center"
            style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.25)", color: "#FFD700", fontFamily: "var(--font-nunito)" }}>
            📋 Link copied — open on any device to import your trips
          </div>
        )}

        {/* Cross-device sync info banner */}
        {trips.length > 0 && (
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Share2 size={14} style={{ color: "#FFD700", flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.78rem", color: "#FFFFFF", marginBottom: "2px" }}>
                Sync to another device
              </p>
              <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.72rem", color: "rgba(220,235,255,0.55)", lineHeight: 1.5 }}>
                Tap <strong style={{ color: "#FFD700" }}>Export All</strong> to copy a sync link. Open it on your phone or tablet to import all trips instantly — no account needed.
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        {trips.length > 3 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Search size={15} style={{ color: "rgba(220,235,255,0.4)", flexShrink: 0 }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trips…" className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "#FFFFFF", fontFamily: "var(--font-nunito)" }} />
          </div>
        )}

        {/* Empty state */}
        {trips.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✨</div>
            <h2 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "1.4rem", color: "#FFFFFF", marginBottom: "8px" }}>
              No saved trips yet
            </h2>
            <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.9rem", color: "rgba(220,235,255,0.55)", marginBottom: "24px" }}>
              Start planning and save your conversation to see it here.
            </p>
            <Link href="/start" className="btn-primary px-8 py-3">
              <Sparkles size={16} />
              Plan My First Trip
            </Link>
          </div>
        )}

        {/* Trip cards */}
        <div className="space-y-3">
          {filtered.map((trip) => {
            const firstMsg = trip.messages.find((m) => m.role === "user")?.content || "";
            const preview = firstMsg.length > 80 ? firstMsg.slice(0, 80) + "…" : firstMsg;
            const msgCount = trip.messages.filter((m) => m.role === "user").length;

            return (
              <div key={trip.id} className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                {/* Card top */}
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "0.95rem", color: "#FFFFFF", marginBottom: "3px" }}
                        className="truncate">
                        {trip.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.72rem", color: "#FFD700", fontWeight: 600 }}>
                          {trip.resortName}
                        </span>
                        {trip.travelDates && (
                          <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.68rem", color: "rgba(220,235,255,0.5)" }}>
                            · {trip.travelDates}
                          </span>
                        )}
                        {trip.groupSize && (
                          <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.68rem", color: "rgba(220,235,255,0.5)" }}>
                            · {trip.groupSize}
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => deleteTrip(trip.id)}
                      className="p-2 rounded-xl flex-shrink-0 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={14} style={{ color: "rgba(220,235,255,0.35)" }} />
                    </button>
                  </div>

                  {preview && (
                    <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.78rem", color: "rgba(220,235,255,0.55)", lineHeight: 1.5 }}>
                      {preview}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.65rem", color: "rgba(220,235,255,0.35)" }}>
                      {msgCount} message{msgCount !== 1 ? "s" : ""} · Saved {fmtDate(trip.savedAt)}
                    </span>
                  </div>
                </div>

                {/* Card actions */}
                <div className="flex border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <button
                    onClick={() => handleShare(trip.id, trip.resortId)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs transition-all"
                    style={{ fontFamily: "var(--font-nunito)", fontWeight: 600, color: copiedId === trip.id ? "#7FDB8A" : "rgba(220,235,255,0.5)" }}>
                    {copiedId === trip.id ? <Check size={12} /> : <Share2 size={12} />}
                    {copiedId === trip.id ? "Copied!" : "Share"}
                  </button>

                  <div style={{ width: "1px", background: "rgba(255,255,255,0.06)" }} />

                  <Link
                    href={`/plan?resort=${trip.resortId}&load=${trip.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all"
                    style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, color: "#FFD700" }}>
                    <ExternalLink size={12} />
                    Continue
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clear all */}
        {trips.length > 0 && (
          <div className="pt-4 text-center">
            {confirmClear ? (
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => { clearAll(); setConfirmClear(false); }}
                  className="px-4 py-2 rounded-xl text-sm"
                  style={{ background: "rgba(255,100,100,0.15)", border: "1px solid rgba(255,100,100,0.3)", color: "#FF6B6B", fontFamily: "var(--font-nunito)", fontWeight: 700 }}>
                  Yes, delete all
                </button>
                <button onClick={() => setConfirmClear(false)}
                  style={{ fontFamily: "var(--font-nunito)", fontSize: "0.8rem", color: "rgba(220,235,255,0.4)" }}>
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)}
                style={{ fontFamily: "var(--font-nunito)", fontSize: "0.75rem", color: "rgba(220,235,255,0.3)" }}>
                Clear all trips
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
