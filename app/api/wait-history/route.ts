import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// POST: record wait time observations (called from WaitTimesPanel)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rides, parkId, parkName, resortId } = body;
    if (!rides || !parkId) return NextResponse.json({ ok: false });

    const now = new Date();
    const records = (rides as { name: string; wait: number; isOpen: boolean }[])
      .filter((r) => r.isOpen && r.wait !== null && r.wait > 0)
      .map((r) => ({
        park_id: parkId,
        park_name: parkName || parkId,
        resort_id: resortId || "unknown",
        ride_name: r.name,
        wait_time: r.wait,
        day_of_week: now.getDay(),
        hour_of_day: now.getHours(),
        recorded_at: now.toISOString(),
      }));

    if (records.length === 0) return NextResponse.json({ ok: true, recorded: 0 });

    const { error } = await getSupabaseAdmin()
      .from("parkplan_wait_history")
      .insert(records);

    if (error) {
      // Table doesn't exist yet — fail silently
      return NextResponse.json({ ok: false, error: error.message });
    }
    return NextResponse.json({ ok: true, recorded: records.length });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) });
  }
}

// GET: aggregate wait time history for a park/ride
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parkId = searchParams.get("park_id");
  const rideName = searchParams.get("ride");

  if (!parkId) return NextResponse.json({ data: [] });

  try {
    let query = getSupabaseAdmin()
      .from("parkplan_wait_history")
      .select("ride_name, wait_time, day_of_week, hour_of_day, recorded_at")
      .eq("park_id", parkId)
      .gte("recorded_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("recorded_at", { ascending: false })
      .limit(500);

    if (rideName) query = query.eq("ride_name", rideName);

    const { data, error } = await query;
    if (error) return NextResponse.json({ data: [], error: error.message });

    // Aggregate by hour + day
    const aggregated: Record<string, { samples: number; avg: number; min: number; max: number }> = {};
    for (const row of data || []) {
      const key = `${row.ride_name}|${row.day_of_week}|${row.hour_of_day}`;
      if (!aggregated[key]) aggregated[key] = { samples: 0, avg: 0, min: 999, max: 0 };
      const a = aggregated[key];
      a.samples++;
      a.avg = (a.avg * (a.samples - 1) + row.wait_time) / a.samples;
      a.min = Math.min(a.min, row.wait_time);
      a.max = Math.max(a.max, row.wait_time);
    }

    return NextResponse.json({
      parkId,
      totalSamples: data?.length || 0,
      aggregated: Object.entries(aggregated).map(([key, stats]) => {
        const [ride, dow, hour] = key.split("|");
        return { ride, dayOfWeek: Number(dow), hour: Number(hour), ...stats, avg: Math.round(stats.avg) };
      }),
    });
  } catch (err) {
    return NextResponse.json({ data: [], error: String(err) });
  }
}
