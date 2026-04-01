import { NextRequest, NextResponse } from "next/server";

const PARK_ID_MAP: Record<string, number[]> = {
  wdw: [6, 5, 7, 8],           // Magic Kingdom, EPCOT, Hollywood Studios, Animal Kingdom
  disneyland: [16, 17],         // Disneyland, DCA
  paris: [4, 28],               // Disneyland Paris, Adventure World
  tokyo: [274, 275],            // Tokyo Disneyland, DisneySea
  hongkong: [31],               // HK Disneyland
  shanghai: [30],               // Shanghai Disney
  "universal-orlando": [64, 65, 67, 334], // IoA, USF, Volcano Bay, Epic Universe
};

const PARK_NAMES: Record<number, string> = {
  6: "Magic Kingdom",
  5: "EPCOT",
  7: "Hollywood Studios",
  8: "Animal Kingdom",
  16: "Disneyland",
  17: "Disney California Adventure",
  4: "Disneyland Park Paris",
  28: "Disney Adventure World",
  274: "Tokyo Disneyland",
  275: "Tokyo DisneySea",
  31: "Hong Kong Disneyland",
  30: "Shanghai Disney Resort",
  64: "Islands of Adventure",
  65: "Universal Studios Florida",
  67: "Volcano Bay",
  334: "Epic Universe",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resortId = searchParams.get("resort") || "wdw";
  const parkIds = PARK_ID_MAP[resortId] || PARK_ID_MAP.wdw;

  try {
    const results = await Promise.all(
      parkIds.map(async (id) => {
        const res = await fetch(
          `https://queue-times.com/parks/${id}/queue_times.json`,
          { next: { revalidate: 300 } } // Cache 5 min
        );
        if (!res.ok) return { parkId: id, parkName: PARK_NAMES[id], lands: [] };
        const data = await res.json();

        // Flatten all rides across lands
        const allRides: { name: string; wait: number; isOpen: boolean; land: string }[] = [];
        for (const land of data.lands || []) {
          for (const ride of land.rides || []) {
            allRides.push({
              name: ride.name,
              wait: ride.wait_time ?? 0,
              isOpen: ride.is_open ?? false,
              land: land.name,
            });
          }
        }

        const openRides = allRides.filter((r) => r.isOpen);
        const avgWait = openRides.length
          ? Math.round(openRides.reduce((s, r) => s + r.wait, 0) / openRides.length)
          : 0;
        const topWaits = [...allRides]
          .filter((r) => r.isOpen && r.wait > 0)
          .sort((a, b) => b.wait - a.wait)
          .slice(0, 8);
        const walkOns = allRides
          .filter((r) => r.isOpen && r.wait <= 15)
          .slice(0, 6);

        return {
          parkId: id,
          parkName: PARK_NAMES[id] || `Park ${id}`,
          totalRides: allRides.length,
          openRides: openRides.length,
          avgWait,
          topWaits,
          walkOns,
          allRides,
        };
      })
    );

    return NextResponse.json({
      resort: resortId,
      fetchedAt: new Date().toISOString(),
      parks: results,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch wait times", details: String(err) }, { status: 500 });
  }
}
