"use client";
import { useEffect, useState, useCallback } from "react";
import { Cloud, Wind, Droplets, Thermometer } from "lucide-react";

interface CurrentWeather {
  tempF: number;
  feelsLikeF: number;
  humidity: number;
  windMph: number;
  label: string;
  emoji: string;
}

interface ForecastDay {
  date: string;
  emoji: string;
  label: string;
  highF: number;
  lowF: number;
  rainChance: number;
}

interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
  fetchedAt: string;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeatherPanel({ resortId }: { resortId: string }) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch(`/api/weather?resort=${resortId}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [resortId]);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  if (loading) return (
    <div className="rounded-2xl border p-5 animate-pulse" style={{ background: "rgba(26,46,69,0.4)", borderColor: "rgba(245,200,66,0.1)" }}>
      <div className="h-4 w-24 bg-white/10 rounded mb-3" />
      <div className="h-10 w-16 bg-white/10 rounded" />
    </div>
  );

  if (!data) return null;

  const { current, forecast } = data;
  const today = forecast[0];
  const rainAlert = (today?.rainChance ?? 0) >= 40;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(13,27,42,0.8)", borderColor: "rgba(245,200,66,0.15)" }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(245,200,66,0.1)", background: "rgba(245,200,66,0.05)" }}>
        <Cloud size={13} style={{ color: "#F5C842" }} />
        <span className="font-body font-600 text-sm text-park-cream">Park Weather</span>
      </div>

      <div className="p-4">
        {/* Current conditions */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-4xl mb-1">{current.emoji}</div>
            <div className="font-display font-700 text-3xl text-park-cream">{current.tempF}°F</div>
            <div className="text-xs text-park-mist font-body">{current.label} · Feels {current.feelsLikeF}°</div>
          </div>
          <div className="space-y-2 text-right">
            <div className="flex items-center justify-end gap-1.5 text-xs text-park-mist font-body">
              <Droplets size={11} className="text-park-mint" />
              {current.humidity}% humidity
            </div>
            <div className="flex items-center justify-end gap-1.5 text-xs text-park-mist font-body">
              <Wind size={11} className="text-park-mint" />
              {current.windMph} mph wind
            </div>
            <div className="flex items-center justify-end gap-1.5 text-xs text-park-mist font-body">
              <Thermometer size={11} className="text-park-gold" />
              {today?.highF}° / {today?.lowF}° today
            </div>
          </div>
        </div>

        {/* Rain alert */}
        {rainAlert && (
          <div className="mb-3 px-3 py-2 rounded-xl text-xs font-body flex items-center gap-2" style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.25)", color: "#FF6B6B" }}>
            🌧 {today.rainChance}% chance of rain today — pack a poncho!
          </div>
        )}

        {/* 7-day forecast strip */}
        <div className="grid grid-cols-7 gap-0.5">
          {forecast.slice(0, 7).map((day) => {
            const d = new Date(day.date + "T12:00:00");
            const dayName = DAY_NAMES[d.getDay()];
            const isToday = day === forecast[0];
            return (
              <div
                key={day.date}
                className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg text-center"
                style={isToday ? { background: "rgba(245,200,66,0.1)", border: "1px solid rgba(245,200,66,0.2)" } : {}}
              >
                <span className="text-[9px] font-body font-600 uppercase tracking-wide" style={{ color: isToday ? "#F5C842" : "#B8C9D9" }}>
                  {isToday ? "Today" : dayName}
                </span>
                <span className="text-base leading-none">{day.emoji}</span>
                <span className="text-[10px] text-park-cream font-body font-600">{day.highF}°</span>
                <span className="text-[9px] text-park-mist font-body">{day.lowF}°</span>
                {(day.rainChance ?? 0) > 20 && (
                  <span className="text-[9px] font-body" style={{ color: "#4ECDC4" }}>{day.rainChance}%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
