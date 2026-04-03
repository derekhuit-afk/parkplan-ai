"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export interface WaitAlert {
  id: string;
  rideName: string;
  parkId: string;
  parkName: string;
  threshold: number; // alert when wait drops below this
  active: boolean;
  createdAt: string;
  firedAt?: string;
}

const KEY = "parkplan_alerts_v1";

function load(): WaitAlert[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function save(alerts: WaitAlert[]) {
  try { localStorage.setItem(KEY, JSON.stringify(alerts)); } catch {}
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<WaitAlert[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAlerts(load());
    setReady(true);
    if ("Notification" in window) setPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return "denied" as NotificationPermission;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const addAlert = useCallback((alert: Omit<WaitAlert, "id" | "createdAt" | "active">) => {
    const newAlert: WaitAlert = {
      ...alert,
      id: `alert_${Date.now()}`,
      createdAt: new Date().toISOString(),
      active: true,
    };
    setAlerts((prev) => {
      const next = [newAlert, ...prev].slice(0, 20);
      save(next);
      return next;
    });
    return newAlert;
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => {
      const next = prev.filter((a) => a.id !== id);
      save(next);
      return next;
    });
  }, []);

  const fireAlert = useCallback((alert: WaitAlert, currentWait: number) => {
    // Browser notification
    if (permission === "granted") {
      try {
        new Notification(`🎢 ${alert.rideName}`, {
          body: `Wait time is now ${currentWait} min — under your ${alert.threshold} min threshold!`,
          icon: "/favicon.ico",
          tag: alert.id,
        });
      } catch {}
    }

    // Mark as fired
    setAlerts((prev) => {
      const next = prev.map((a) =>
        a.id === alert.id ? { ...a, firedAt: new Date().toISOString(), active: false } : a
      );
      save(next);
      return next;
    });
  }, [permission]);

  // Check alerts against current ride data
  const checkAlerts = useCallback((rides: { name: string; wait: number | null; isOpen: boolean }[], parkId: string) => {
    const activeAlerts = alerts.filter((a) => a.active && a.parkId === parkId);
    for (const alert of activeAlerts) {
      const ride = rides.find((r) => r.name.toLowerCase().includes(alert.rideName.toLowerCase()) || alert.rideName.toLowerCase().includes(r.name.toLowerCase().slice(0, 10)));
      if (ride && ride.isOpen && ride.wait !== null && ride.wait <= alert.threshold) {
        fireAlert(alert, ride.wait);
      }
    }
  }, [alerts, fireAlert]);

  return { alerts, ready, permission, requestPermission, addAlert, removeAlert, checkAlerts };
}
