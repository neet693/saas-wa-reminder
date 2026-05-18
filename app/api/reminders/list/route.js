import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("reminders")
    .select(
      `
      *,
      customers (
        name,
        phone
      )
    `,
    )
    .order("scheduled_at", {
      ascending: false,
    });

  if (error) {
    return Response.json({
      success: false,
      error,
    });
  }

  return Response.json({
    success: true,
    reminders: data,
  });
}
