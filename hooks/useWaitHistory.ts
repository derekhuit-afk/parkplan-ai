"use client";
import { useCallback } from "react";

const KEY_PREFIX = "parkplan_waithist_";
const MAX_ENTRIES_PER_RIDE = 48; // 4 hours at 5-min intervals

export interface WaitEntry {
  ts: number; // unix ms
  wait: number;
}

export interface RideHistory {
  [rideName: string]: WaitEntry[];
}

function getKey(parkId: string) { return KEY_PREFIX + parkId.slice(0, 8); }

export function loadHistory(parkId: string): RideHistory {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(getKey(parkId)) || "{}"); } catch { return {}; }
}

export function useWaitHistory() {
  const record = useCallback((
    parkId: string,
    rides: { name: string; wait: number | null; isOpen: boolean }[]
  ) => {
    const history = loadHistory(parkId);
    const now = Date.now();
    let changed = false;

    for (const ride of rides) {
      if (!ride.isOpen || ride.wait === null) continue;
      if (!history[ride.name]) history[ride.name] = [];
      
      // Only record if enough time has passed (5 min) or no entry yet
      const last = history[ride.name].at(-1);
      if (last && now - last.ts < 4 * 60 * 1000) continue;
      
      history[ride.name].push({ ts: now, wait: ride.wait });
      history[ride.name] = history[ride.name].slice(-MAX_ENTRIES_PER_RIDE);
      changed = true;
    }

    if (changed) {
      try { localStorage.setItem(getKey(parkId), JSON.stringify(history)); } catch {}
    }
    return history;
  }, []);

  const getTrend = useCallback((history: RideHistory, rideName: string): "up" | "down" | "stable" | null => {
    const entries = history[rideName];
    if (!entries || entries.length < 3) return null;
    const recent = entries.slice(-3);
    const diff = recent[2].wait - recent[0].wait;
    if (diff >= 10) return "up";
    if (diff <= -10) return "down";
    return "stable";
  }, []);

  return { record, getTrend, loadHistory };
}
