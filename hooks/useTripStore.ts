"use client";
import { useState, useEffect, useCallback } from "react";

export interface SavedTrip {
  id: string;
  title: string;
  resortId: string;
  resortName: string;
  messages: { role: "user" | "assistant"; content: string }[];
  travelDates?: string;
  groupSize?: string;
  budget?: string;
  savedAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "parkplan_trips_v1";
const DEVICE_ID_KEY = "parkplan_device_id";

function genId() { return `trip_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
function genDeviceId() { return `dev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`; }

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) { id = genDeviceId(); localStorage.setItem(DEVICE_ID_KEY, id); }
  return id;
}

function load(): SavedTrip[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

function save(trips: SavedTrip[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(trips)); }
  catch { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(trips.slice(-20))); } catch { } }
}

// Export trips as a compressed base64 URL fragment
export function exportTripsToUrl(trips: SavedTrip[]): string {
  const data = JSON.stringify(trips.map(t => ({
    id: t.id, title: t.title, resortId: t.resortId, resortName: t.resortName,
    messages: t.messages.slice(-20), // last 20 messages only
    travelDates: t.travelDates, groupSize: t.groupSize, budget: t.budget,
    savedAt: t.savedAt, updatedAt: t.updatedAt,
  })));
  const encoded = btoa(encodeURIComponent(data));
  const base = typeof window !== "undefined" ? window.location.origin : "https://parkplan-ai.vercel.app";
  return `${base}/trips/import#data=${encoded}`;
}

// Parse trips from URL fragment
export function importTripsFromHash(hash: string): SavedTrip[] | null {
  try {
    const match = hash.match(/data=([^&]+)/);
    if (!match) return null;
    const decoded = decodeURIComponent(atob(match[1]));
    const trips = JSON.parse(decoded);
    return Array.isArray(trips) ? trips : null;
  } catch { return null; }
}

export function useTripStore() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => { setTrips(load()); setReady(true); }, []);

  const saveTrip = useCallback((
    messages: { role: "user" | "assistant"; content: string }[],
    resortId: string, resortName: string,
    meta?: { travelDates?: string; groupSize?: string; budget?: string; title?: string }
  ): SavedTrip => {
    const firstUser = messages.find((m) => m.role === "user")?.content || "";
    const autoTitle = meta?.title || (firstUser.length > 0 ? firstUser.slice(0, 50).trim() + (firstUser.length > 50 ? "…" : "") : `${resortName} Trip`);
    const now = new Date().toISOString();
    const trip: SavedTrip = { id: genId(), title: autoTitle, resortId, resortName, messages, travelDates: meta?.travelDates, groupSize: meta?.groupSize, budget: meta?.budget, savedAt: now, updatedAt: now };
    setTrips((prev) => { const next = [trip, ...prev].slice(0, 50); save(next); return next; });
    return trip;
  }, []);

  const updateTrip = useCallback((id: string, messages: { role: "user" | "assistant"; content: string }[]) => {
    setTrips((prev) => { const next = prev.map((t) => t.id === id ? { ...t, messages, updatedAt: new Date().toISOString() } : t); save(next); return next; });
  }, []);

  const deleteTrip = useCallback((id: string) => {
    setTrips((prev) => { const next = prev.filter((t) => t.id !== id); save(next); return next; });
  }, []);

  const getTrip = useCallback((id: string) => trips.find((t) => t.id === id), [trips]);

  const importTrips = useCallback((incoming: SavedTrip[]) => {
    setTrips((prev) => {
      const existingIds = new Set(prev.map((t) => t.id));
      const newTrips = incoming.filter((t) => !existingIds.has(t.id));
      const merged = [...newTrips, ...prev].slice(0, 50);
      save(merged);
      return merged;
    });
  }, []);

  const clearAll = useCallback(() => { setTrips([]); try { localStorage.removeItem(STORAGE_KEY); } catch { } }, []);

  return { trips, ready, saveTrip, updateTrip, deleteTrip, getTrip, importTrips, clearAll };
}
