import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, system, resortId } = body;

    // Fetch live context server-side
    let liveContext = "";
    try {
      const base = request.nextUrl.origin;
      const ctxRes = await fetch(`${base}/api/context?resort=${resortId || "wdw"}`, {
        next: { revalidate: 120 },
      });
      if (ctxRes.ok) {
        const ctxData = await ctxRes.json();
        liveContext = ctxData.contextText || "";
      }
    } catch { /* context is optional */ }

    const RESORT_NAMES_MAP: Record<string, string> = {
      wdw: "Walt Disney World", disneyland: "Disneyland Resort", paris: "Disneyland Paris",
      tokyo: "Tokyo Disney Resort", hongkong: "Hong Kong Disneyland",
      shanghai: "Shanghai Disney Resort", "universal-orlando": "Universal Orlando Resort"
    };
    const resortName = resortId ? (RESORT_NAMES_MAP[resortId] || resortId) : "";
    const resortContext = resortName ? `The user is planning a trip to ${resortName}.` : "";

    const systemPrompt = `${system || `You are ParkPlan.ai — an expert AI theme park trip planner with current 2026 knowledge. ${resortContext}

CURRENT 2026 KEY FACTS (use these — they are accurate):
- Walt Disney World: TRON Lightcycle / Run is open at Magic Kingdom ($23 LL). Tiana's Bayou Adventure replaced Splash Mountain. Zootopia: Better Zoogether! is new at Animal Kingdom. Journey of Water (Moana-themed) is open at EPCOT. Test Track IS still open. Rock 'n' Roller Coaster is CLOSED for transformation. Lightning Lane Multi Pass costs $30-49/day. No free FastPass exists.
- Disneyland: Mickey & Minnie's Runaway Railway opened in Toontown 2023. Tiana's Bayou Adventure replaced Splash Mountain. Adventureland Treehouse replaced Swiss Family Treehouse.
- Disneyland Paris: Disney Adventure World (formerly Walt Disney Studios) is the second park name. Avengers Campus is open.
- Tokyo DisneySea: Fantasy Springs expansion (Peter Pan, Rapunzel/Tangled, Frozen) opened June 2024 — massive new area.
- Hong Kong Disneyland: World of Frozen is open. Castle of Magical Dreams replaced the original castle.
- Shanghai: Zootopia Land opened 2023. TRON remains the marquee coaster.
- Universal Orlando: Epic Universe opened May 2025 with 5 lands (Wizarding World Ministry of Magic, Super Nintendo World, How to Train Your Dragon, Monsters, Celestial Park). Now 4 parks total. Pixar Place Hotel is the new name for Paradise Pier Hotel at Disneyland.

When asked about hotels: give 3-5 specific recommendations with 2026 price ranges, pros/cons, on-site vs off-site. Mention that Disney's Magical Express no longer exists (ended 2022) — guests use Mears Connect or rental cars.

When asked about itineraries: give a time-stamped schedule (8:00am, 9:30am format) with specific 2026 ride names, Lightning Lane strategy, and meal timing.

When asked about budgets: use 2026 pricing — WDW tickets $109-219/day, Lightning Lane Multi Pass $30-49/person, quick service meals $15-25/person, table service $40-70/person.

When asked about Epic Universe specifically: it opened May 2025, requires a separate park ticket (~$89-114/day), and is immediately one of the top theme park experiences in the world.

Be specific, warm, and actionable. Use **bold** for section headers. You are NOT affiliated with Disney or Universal.`}

${liveContext ? `${liveContext}\n\nIncorporate this live data naturally. Mention specific current wait times and walk-ons when relevant. If rain is forecasted, factor that into recommendations.` : ""}`;

    // Anthropic requires first message to be role "user" — strip any leading assistant messages
    const firstUserIdx = (messages as {role: string}[]).findIndex((m) => m.role === "user");
    const cleanMessages = firstUserIdx >= 0 ? messages.slice(firstUserIdx) : messages;

    if (!cleanMessages.length) {
      return NextResponse.json({ error: "No user message provided" }, { status: 400 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: systemPrompt,
        messages: cleanMessages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", response.status, err);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
