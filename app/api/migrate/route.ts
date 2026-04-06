import { NextRequest, NextResponse } from "next/server";

const MIGRATION_TOKEN = process.env.MIGRATION_TOKEN || "parkplan-migrate-2026";

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS parkplan_trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  resort_id TEXT NOT NULL DEFAULT '',
  resort_name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'My Trip',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  travel_dates TEXT,
  group_size TEXT,
  budget TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parkplan_wait_history (
  id BIGSERIAL PRIMARY KEY,
  park_id TEXT NOT NULL,
  park_name TEXT NOT NULL,
  resort_id TEXT NOT NULL,
  ride_name TEXT NOT NULL,
  wait_time INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL,
  hour_of_day INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE parkplan_trips ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'service_all' AND tablename = 'parkplan_trips'
  ) THEN
    EXECUTE 'CREATE POLICY service_all ON parkplan_trips FOR ALL TO service_role USING (true)';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'users_own_trips' AND tablename = 'parkplan_trips'
  ) THEN
    EXECUTE 'CREATE POLICY users_own_trips ON parkplan_trips FOR ALL USING (auth.uid()::text = user_id::text)';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_parkplan_trips_user 
  ON parkplan_trips(user_id, updated_at DESC);
  
CREATE INDEX IF NOT EXISTS idx_wait_history_park 
  ON parkplan_wait_history(park_id, ride_name, day_of_week, hour_of_day);
  
CREATE INDEX IF NOT EXISTS idx_wait_history_recorded 
  ON parkplan_wait_history(recorded_at DESC);
`;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (token !== MIGRATION_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: "SUPABASE_DB_URL not configured" }, { status: 500 });
  }

  try {
    // Use node-postgres via the connection pooler
    // Vercel's network can reach aws-0-us-east-1.pooler.supabase.com
    const { Client } = await import("pg");
    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    });

    await client.connect();

    // Run statements individually for better error reporting
    const statements = MIGRATION_SQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    const results: string[] = [];
    for (const stmt of statements) {
      try {
        await client.query(stmt + ";");
        const action = stmt.slice(0, 50).replace(/\s+/g, " ").trim();
        results.push(`✅ ${action}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("already exists")) {
          results.push(`ℹ️ Already exists: ${stmt.slice(0, 40)}`);
        } else {
          results.push(`❌ Error: ${msg.slice(0, 80)}`);
        }
      }
    }

    // Verify tables exist
    const { rows } = await client.query(
      `SELECT tablename FROM pg_tables WHERE tablename LIKE 'parkplan_%' ORDER BY tablename`
    );
    await client.end();

    return NextResponse.json({
      ok: true,
      tables: rows.map((r) => r.tablename),
      statements: results,
      message: "Migration complete — ParkPlan.ai v2.0 database ready",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
