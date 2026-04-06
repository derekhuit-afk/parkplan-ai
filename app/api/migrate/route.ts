import { NextRequest, NextResponse } from "next/server";

const MIGRATION_TOKEN = process.env.MIGRATION_TOKEN || "parkplan-migrate-2026";
const PROJECT_REF = "vvkdnzqgtajeouxlliuk";

const SQL_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS parkplan_trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    resort_id TEXT NOT NULL DEFAULT \'\',
    resort_name TEXT NOT NULL DEFAULT \'\',
    title TEXT NOT NULL DEFAULT \'My Trip\',
    messages JSONB NOT NULL DEFAULT \'[]\',
    travel_dates TEXT, group_size TEXT, budget TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS parkplan_wait_history (
    id BIGSERIAL PRIMARY KEY,
    park_id TEXT NOT NULL, park_name TEXT NOT NULL,
    resort_id TEXT NOT NULL, ride_name TEXT NOT NULL,
    wait_time INTEGER NOT NULL, day_of_week INTEGER NOT NULL,
    hour_of_day INTEGER NOT NULL, recorded_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `ALTER TABLE parkplan_trips ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = \'service_all\' AND tablename = \'parkplan_trips\') THEN EXECUTE \'CREATE POLICY service_all ON parkplan_trips FOR ALL TO service_role USING (true)\'; END IF; END $$`,
  `CREATE INDEX IF NOT EXISTS idx_parkplan_trips_user ON parkplan_trips(user_id, updated_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_wait_history_park ON parkplan_wait_history(park_id, ride_name, day_of_week, hour_of_day)`,
];

async function runViaMgmtApi(serviceKey: string): Promise<{ok: boolean; results: string[]; error?: string}> {
  const results: string[] = [];
  
  for (const stmt of SQL_STATEMENTS) {
    const r = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: stmt }),
      }
    );
    
    const data = await r.json().catch(() => ({}));
    if (r.ok || (data.message && data.message.includes("already exists"))) {
      results.push(`✅ ${stmt.slice(0, 50).replace(/\s+/g, " ").trim()}`);
    } else {
      results.push(`❌ ${data.message || r.status}: ${stmt.slice(0, 40)}`);
      if (!data.message?.includes("already exists")) {
        return { ok: false, results, error: data.message || `HTTP ${r.status}` };
      }
    }
  }
  return { ok: true, results };
}

async function verifyTables(serviceKey: string): Promise<string[]> {
  const r = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: { "Authorization": `Bearer ${serviceKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: "SELECT tablename FROM pg_tables WHERE tablename LIKE \'parkplan_%\' ORDER BY tablename" }),
    }
  );
  if (!r.ok) return [];
  const data = await r.json();
  return (data || []).map((row: Record<string, string>) => row.tablename).filter(Boolean);
}

export const maxDuration = 30;
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (token !== MIGRATION_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "Service key not configured" }, { status: 500 });
  }

  try {
    const { ok, results, error } = await runViaMgmtApi(serviceKey);
    const tables = await verifyTables(serviceKey);
    
    return NextResponse.json({
      ok,
      method: "management-api",
      tables,
      statements: results,
      error,
      message: ok && tables.length > 0 
        ? `✅ Migration complete — ${tables.length} tables created` 
        : "Migration attempted — check statements for details",
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
