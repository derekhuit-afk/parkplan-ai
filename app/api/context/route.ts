import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resortId = searchParams.get("resort") || "wdw";
  const base = request.nextUrl.origin;

  try {
    const [waitRes, weatherRes] = await Promise.all([
      fetch(`${base}/api/waittimes?resort=${resortId}`, { next: { revalidate: 120 } }),
      fetch(`${base}/api/weather?resort=${resortId}`, { next: { revalidate: 1800 } }),
    ]);

    const waitData = waitRes.ok ? await waitRes.json() : null;
    const weatherData = weatherRes.ok ? await weatherRes.json() : null;

    const lines: string[] = ["=== LIVE PARK DATA (use this to give specific, current advice) ===\n"];

    if (weatherData?.current) {
      const w = weatherData.current;
      const today = weatherData.forecast?.[0];
      lines.push(`WEATHER RIGHT NOW: ${w.tempF}°F, ${w.label}, feels ${w.feelsLikeF}°F, humidity ${w.humidity}%, wind ${w.windMph}mph`);
      if (today) {
        lines.push(`TODAY: High ${today.highF}°F / Low ${today.lowF}°F, ${today.rainChance ?? 0}% rain chance`);
        if ((today.rainChance ?? 0) >= 40) lines.push("⚠️ RAIN LIKELY — recommend indoor/covered rides first. Suggest bringing a poncho.");
      }
      if (weatherData.forecast?.length > 1) {
        const upcoming = weatherData.forecast.slice(1, 4).map((d: { date: string; highF: number; lowF: number; rainChance: number; emoji: string }) =>
          `${d.date}: ${d.emoji} ${d.highF}/${d.lowF}°F, ${d.rainChance}% rain`).join(" | ");
        lines.push(`UPCOMING: ${upcoming}`);
      }
    }

    if (waitData?.parks) {
      for (const park of waitData.parks as {
        parkName: string; openAttractions: number; totalAttractions: number; avgWait: number;
        hours?: { open?: string; close?: string } | null;
        earlyEntry?: { open?: string } | null;
        topWaits: { name: string; wait: number | null }[];
        walkOns: { name: string; wait: number | null }[];
        shows: { name: string }[];
        llPrices: { name: string; price?: { formatted: string }; available?: boolean }[];
      }[]) {
        lines.push(`\n${park.parkName.toUpperCase()}:`);
        lines.push(`  Status: ${park.openAttractions} of ${park.totalAttractions} rides open | Avg wait ${park.avgWait}min`);

        if (park.hours?.open && park.hours?.close) {
          const o = new Date(park.hours.open).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
          const c = new Date(park.hours.close).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
          lines.push(`  Hours: ${o} – ${c}`);
        }
        if (park.earlyEntry?.open) lines.push(`  Early Entry: yes (resort guests)`);

        if (park.topWaits.length > 0)
          lines.push(`  Longest waits: ${park.topWaits.slice(0, 5).map(r => `${r.name} ${r.wait ?? "?"}min`).join(", ")}`);
        if (park.walkOns.length > 0)
          lines.push(`  Walk-ons NOW: ${park.walkOns.slice(0, 4).map(r => r.name).join(", ")}`);
        if (park.shows.length > 0)
          lines.push(`  Shows today: ${park.shows.slice(0, 3).map(s => s.name).join(", ")}`);

        const llMP = park.llPrices?.find(p => p.name?.includes("Multi Pass"));
        if (llMP) lines.push(`  Lightning Lane Multi Pass: ${llMP.price?.formatted ?? "unavailable"} (${llMP.available ? "available" : "sold out"})`);
      }
    }

    return NextResponse.json({ resort: resortId, contextText: lines.join("\n"), waitData, weatherData });
  } catch (err) {
    return NextResponse.json({ error: "Context failed", details: String(err) }, { status: 500 });
  }
}
