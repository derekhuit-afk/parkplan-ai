import { NextRequest, NextResponse } from "next/server";

const RESORT_COORDS: Record<string, { lat: number; lon: number; tz: string }> = {
  wdw:               { lat: 28.3772, lon: -81.5707, tz: "America/New_York" },
  disneyland:        { lat: 33.8121, lon: -117.9190, tz: "America/Los_Angeles" },
  paris:             { lat: 48.8722, lon:   2.7757, tz: "Europe/Paris" },
  tokyo:             { lat: 35.6329, lon: 139.8804, tz: "Asia/Tokyo" },
  hongkong:          { lat: 22.3130, lon: 114.0413, tz: "Asia/Hong_Kong" },
  shanghai:          { lat: 31.1440, lon: 121.6570, tz: "Asia/Shanghai" },
  "universal-orlando": { lat: 28.4739, lon: -81.4668, tz: "America/New_York" },
};

const WMO: Record<number, { label: string; emoji: string }> = {
  0:  { label: "Clear sky", emoji: "☀️" },
  1:  { label: "Mainly clear", emoji: "🌤" },
  2:  { label: "Partly cloudy", emoji: "⛅" },
  3:  { label: "Overcast", emoji: "☁️" },
  45: { label: "Foggy", emoji: "🌫" },
  48: { label: "Foggy", emoji: "🌫" },
  51: { label: "Light drizzle", emoji: "🌦" },
  53: { label: "Drizzle", emoji: "🌦" },
  55: { label: "Heavy drizzle", emoji: "🌧" },
  61: { label: "Light rain", emoji: "🌧" },
  63: { label: "Rain", emoji: "🌧" },
  65: { label: "Heavy rain", emoji: "🌧" },
  71: { label: "Light snow", emoji: "🌨" },
  73: { label: "Snow", emoji: "❄️" },
  75: { label: "Heavy snow", emoji: "❄️" },
  80: { label: "Light showers", emoji: "🌦" },
  81: { label: "Showers", emoji: "🌧" },
  82: { label: "Heavy showers", emoji: "⛈" },
  95: { label: "Thunderstorm", emoji: "⛈" },
  99: { label: "Thunderstorm", emoji: "⛈" },
};

function celsiusToF(c: number) { return Math.round((c * 9) / 5 + 32); }

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resortId = searchParams.get("resort") || "wdw";
  const coords = RESORT_COORDS[resortId] || RESORT_COORDS.wdw;

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(coords.lat));
    url.searchParams.set("longitude", String(coords.lon));
    url.searchParams.set("timezone", coords.tz);
    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("current", "temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m");
    url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_mean,wind_speed_10m_max");

    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`Weather API ${res.status}`);
    const raw = await res.json();
    const cur = raw.current;
    const daily = raw.daily;

    const forecast = (daily.time as string[]).map((date: string, i: number) => ({
      date,
      ...(WMO[daily.weather_code[i] as number] || { label: "Unknown", emoji: "🌡" }),
      highF: celsiusToF(daily.temperature_2m_max[i]),
      lowF: celsiusToF(daily.temperature_2m_min[i]),
      rainChance: daily.precipitation_probability_mean[i] ?? 0,
    }));

    return NextResponse.json({
      resort: resortId,
      fetchedAt: new Date().toISOString(),
      current: {
        tempF: celsiusToF(cur.temperature_2m),
        feelsLikeF: celsiusToF(cur.apparent_temperature),
        humidity: cur.relative_humidity_2m,
        windMph: Math.round((cur.wind_speed_10m ?? 0) * 0.621),
        ...(WMO[cur.weather_code as number] || { label: "Unknown", emoji: "🌡" }),
      },
      forecast,
    });
  } catch (err) {
    return NextResponse.json({ error: "Weather unavailable", details: String(err) }, { status: 500 });
  }
}
