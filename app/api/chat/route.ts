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

    const resortContext = resortId ? `The user is planning a trip to ${
      ({ wdw: "Walt Disney World", disneyland: "Disneyland Resort", paris: "Disneyland Paris",
         tokyo: "Tokyo Disney Resort", hongkong: "Hong Kong Disneyland", shanghai: "Shanghai Disney Resort",
         "universal-orlando": "Universal Orlando Resort" } as Record<string,string>)[resortId] || resortId
    }.` : "";

    const systemPrompt = `${system || `You are ParkPlan.ai — an expert AI theme park trip planner. ${resortContext}

When asked about hotels: give 3-5 specific hotel recommendations with price ranges, pros/cons, and whether they are on-site or off-site. Always mention Disney's Magical Express or equivalent transport perks.

When asked about itineraries: give a time-stamped schedule (e.g. 8:00am, 9:30am) with specific ride names, Lightning Lane strategy, and when to eat.

When asked about budgets: give specific dollar amounts for tickets, meals (quick service ~$15-25/person, table service ~$35-60/person), hotels (value/moderate/deluxe tiers), and daily totals.

Be specific, warm, and actionable. Use **bold** for section headers. Format with clear line breaks. You are NOT affiliated with Disney or Universal.`}

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
