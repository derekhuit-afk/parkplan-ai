-- ParkPlan.ai v2.0 — Run this once in your Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/vvkdnzqgtajeouxlliuk/sql/new

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

CREATE TABLE IF NOT EXISTS parkplan_profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  home_resort TEXT DEFAULT 'wdw',
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
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

CREATE POLICY "users_own_trips" ON parkplan_trips
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "service_role_all_trips" ON parkplan_trips
  FOR ALL TO service_role USING (true);

CREATE INDEX IF NOT EXISTS idx_wait_history_park_ride 
  ON parkplan_wait_history(park_id, ride_name, day_of_week, hour_of_day);

CREATE INDEX IF NOT EXISTS idx_trips_user 
  ON parkplan_trips(user_id, updated_at DESC);
