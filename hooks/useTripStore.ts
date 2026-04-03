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

function genId() {
  return `trip_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function load(): SavedTrip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(trips: SavedTrip[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch {
    // storage full — remove oldest
    try {
      const trimmed = trips.slice(-20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch { /* silent */ }
  }
}

export function useTripStore() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTrips(load());
    setReady(true);
  }, []);

  const saveTrip = useCallback((
    messages: { role: "user" | "assistant"; content: string }[],
    resortId: string,
    resortName: string,
    meta?: { travelDates?: string; groupSize?: string; budget?: string; title?: string }
  ): SavedTrip => {
    // Auto-generate title from first user message
    const firstUser = messages.find((m) => m.role === "user")?.content || "";
    const autoTitle = meta?.title ||
      (firstUser.length > 0
        ? firstUser.slice(0, 50).trim() + (firstUser.length > 50 ? "…" : "")
        : `${resortName} Trip`);

    const now = new Date().toISOString();
    const trip: SavedTrip = {
      id: genId(),
      title: autoTitle,
      resortId,
      resortName,
      messages,
      travelDates: meta?.travelDates,
      groupSize: meta?.groupSize,
      budget: meta?.budget,
      savedAt: now,
      updatedAt: now,
    };

    setTrips((prev) => {
      const next = [trip, ...prev].slice(0, 50); // max 50 trips
      save(next);
      return next;
    });
    return trip;
  }, []);

  const updateTrip = useCallback((
    id: string,
    messages: { role: "user" | "assistant"; content: string }[]
  ) => {
    setTrips((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, messages, updatedAt: new Date().toISOString() } : t
      );
      save(next);
      return next;
    });
  }, []);

  const deleteTrip = useCallback((id: string) => {
    setTrips((prev) => {
      const next = prev.filter((t) => t.id !== id);
      save(next);
      return next;
    });
  }, []);

  const getTrip = useCallback((id: string): SavedTrip | undefined => {
    return trips.find((t) => t.id === id);
  }, [trips]);

  const clearAll = useCallback(() => {
    setTrips([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* */ }
  }, []);

  return { trips, ready, saveTrip, updateTrip, deleteTrip, getTrip, clearAll };
}
