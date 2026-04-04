import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");
  if (!userId) return NextResponse.json({ trips: [] });

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("parkplan_trips")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return NextResponse.json({ trips: data || [] });
  } catch (err) {
    return NextResponse.json({ trips: [], error: String(err) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, id, ...tripData } = body;
    if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });
    const now = new Date().toISOString();

    if (id) {
      const { data, error } = await getSupabaseAdmin()
        .from("parkplan_trips")
        .update({ ...tripData, updated_at: now })
        .eq("id", id).eq("user_id", user_id)
        .select().single();
      if (error) throw error;
      return NextResponse.json({ trip: data });
    } else {
      const { data, error } = await getSupabaseAdmin()
        .from("parkplan_trips")
        .insert({ user_id, ...tripData, created_at: now, updated_at: now })
        .select().single();
      if (error) throw error;
      return NextResponse.json({ trip: data });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("user_id");
  if (!id || !userId) return NextResponse.json({ error: "id and user_id required" }, { status: 400 });
  try {
    const { error } = await getSupabaseAdmin()
      .from("parkplan_trips").delete()
      .eq("id", id).eq("user_id", userId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
