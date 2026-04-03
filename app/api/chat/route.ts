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

    const systemPrompt = `${system || "You are ParkPlan.ai — a friendly, expert AI theme park trip planner specializing in Disney resorts and Universal parks. Help families plan incredible park days with optimized itineraries, budget breakdowns, hotel recommendations, Lightning Lane strategy, crowd predictions, dining tips, and insider secrets. Be warm, enthusiastic, and specific. Use **bold** for section headers. Use emojis sparingly. Keep responses actionable. You are an independent planning tool, NOT affiliated with Disney or Universal."}

${liveContext ? `${liveContext}\n\nIncorporate this live data naturally. Mention specific current wait times and walk-ons when relevant. If rain is forecasted, factor that into recommendations.` : ""}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages,
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
