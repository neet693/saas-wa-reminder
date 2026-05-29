import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function GET() {
  try {
    // Total reminders
    const { count: totalReminders } = await supabase
      .from("reminders")
      .select("*", {
        count: "exact",
        head: true,
      });

    // Active reminders
    const { count: activeReminders } = await supabase
      .from("reminders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("is_active", true);

    // WhatsApp session
    const { data: session } = await supabase
      .from("whatsapp_sessions")
      .select("*")
      .limit(1)
      .single();

    // Recent reminders
    const { data: recentReminders } = await supabase
      .from("reminders")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    return NextResponse.json({
      totalReminders: totalReminders || 0,
      activeReminders: activeReminders || 0,
      whatsappStatus: session?.status || "disconnected",
      recentReminders: recentReminders || [],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch dashboard data",
      },
      {
        status: 500,
      },
    );
  }
}
