import { NextRequest, NextResponse } from "next/server";

// ThemeParks.wiki entity IDs — covers ALL 7 resorts including Tokyo, HK, Shanghai
const RESORT_PARK_IDS: Record<string, { id: string; name: string }[]> = {
  wdw: [
    { id: "75ea578a-adc8-4116-a54d-dccb60765ef9", name: "Magic Kingdom" },
    { id: "47f90d2c-e191-4239-a466-5892ef59a88b", name: "EPCOT" },
    { id: "288747d1-8b4f-4a64-867e-ea7c9b27bad8", name: "Hollywood Studios" },
    { id: "1c84a229-8862-4648-9c71-378ddd2c7693", name: "Animal Kingdom" },
  ],
  disneyland: [
    { id: "7340550b-c14d-4def-80bb-acdb51d49a66", name: "Disneyland Park" },
    { id: "832fcd51-ea19-4e77-85c7-75d5843b127c", name: "California Adventure" },
  ],
  paris: [
    { id: "dae968d5-630d-4719-8b06-3d107e944401", name: "Disneyland Park" },
    { id: "ca888437-ebb4-4d50-aed2-d227f7096968", name: "Disney Adventure World" },
  ],
  tokyo: [
    { id: "3cc919f1-d16d-43e0-8c3f-1dd269bd1a42", name: "Tokyo Disneyland" },
    { id: "67b290d5-3478-4f23-b601-2f8fb71ba803", name: "Tokyo DisneySea" },
  ],
  hongkong: [
    { id: "bd0eb47b-2f02-4d4d-90fa-cb3a68988e3b", name: "Hong Kong Disneyland" },
  ],
  shanghai: [
    { id: "ddc4357c-c148-4b36-9888-07894fe75e83", name: "Shanghai Disneyland" },
  ],
  "universal-orlando": [
    { id: "267615cc-8943-4c2a-ae2c-5da728ca591f", name: "Islands of Adventure" },
    { id: "eb3f4560-2383-4a36-9152-6b3e5ed6bc57", name: "Universal Studios Florida" },
    { id: "fe78a026-b91b-470c-b906-9d2266b692da", name: "Volcano Bay" },
    { id: "12dbb85b-265f-44e6-bccf-f1faa17211fc", name: "Epic Universe" },
  ],
};

const BASE = "https://api.themeparks.wiki/v1/entity";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resortId = searchParams.get("resort") || "wdw";
  const parks = RESORT_PARK_IDS[resortId] || RESORT_PARK_IDS.wdw;

  try {
    const results = await Promise.all(
      parks.map(async ({ id, name }) => {
        const [liveRes, schedRes] = await Promise.all([
          fetch(`${BASE}/${id}/live`, { next: { revalidate: 120 } }),
          fetch(`${BASE}/${id}/schedule`, { next: { revalidate: 3600 } }),
        ]);

        const liveData = liveRes.ok ? await liveRes.json() : { liveData: [] };
        const schedData = schedRes.ok ? await schedRes.json() : { schedule: [] };

        const entities: {
          id: string; name: string; entityType: string; status: string;
          queue?: { STANDBY?: { waitTime?: number | null } };
          showtimes?: { startTime?: string; endTime?: string; type?: string }[];
          operatingHours?: { openingTime?: string; closingTime?: string; type?: string }[];
        }[] = liveData.liveData || [];

        // Attractions
        const attractions = entities
          .filter((e) => e.entityType === "ATTRACTION")
          .map((e) => ({
            name: e.name,
            status: e.status,
            wait: e.queue?.STANDBY?.waitTime ?? null,
            isOpen: e.status === "OPERATING",
          }));

        // Shows with times
        const shows = entities
          .filter((e) => e.entityType === "SHOW")
          .map((e) => ({
            name: e.name,
            status: e.status,
            showtimes: (e.showtimes || [])
              .map((s) => s.startTime)
              .filter(Boolean) as string[],
          }));

        // Restaurants
        const restaurants = entities
          .filter((e) => e.entityType === "RESTAURANT")
          .map((e) => ({ name: e.name, status: e.status }));

        // Park hours today
        const todayStr = new Date().toISOString().slice(0, 10);
        const todaySchedule = (schedData.schedule || []).filter(
          (s: { date?: string }) => s.date?.startsWith(todayStr)
        );
        const operatingHours = todaySchedule.find(
          (s: { type?: string }) => s.type === "OPERATING"
        );
        const earlyEntry = todaySchedule.find(
          (s: { description?: string }) => s.description?.toLowerCase().includes("early")
        );

        // Lightning Lane prices from schedule
        const llPrices = (operatingHours as { purchases?: { name: string; price?: { formatted: string }; available?: boolean }[] })?.purchases || [];

        // Wait stats
        const openRides = attractions.filter((a) => a.isOpen && a.wait !== null);
        const avgWait = openRides.length
          ? Math.round(openRides.reduce((s, r) => s + (r.wait ?? 0), 0) / openRides.length)
          : 0;
        const topWaits = [...attractions]
          .filter((a) => a.isOpen && (a.wait ?? 0) > 0)
          .sort((a, b) => (b.wait ?? 0) - (a.wait ?? 0))
          .slice(0, 8);
        const walkOns = attractions
          .filter((a) => a.isOpen && (a.wait ?? 0) <= 15)
          .slice(0, 6);

        return {
          parkId: id,
          parkName: name,
          totalAttractions: attractions.length,
          openAttractions: openRides.length,
          avgWait,
          topWaits,
          walkOns,
          shows,
          restaurants,
          hours: operatingHours
            ? {
                open: (operatingHours as { openingTime?: string }).openingTime,
                close: (operatingHours as { closingTime?: string }).closingTime,
              }
            : null,
          earlyEntry: earlyEntry
            ? {
                open: (earlyEntry as { openingTime?: string }).openingTime,
                close: (earlyEntry as { closingTime?: string }).closingTime,
              }
            : null,
          llPrices: llPrices.slice(0, 4),
        };
      })
    );

    return NextResponse.json({
      resort: resortId,
      fetchedAt: new Date().toISOString(),
      parks: results,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch", details: String(err) }, { status: 500 });
  }
}
