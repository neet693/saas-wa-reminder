import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(req) {
  try {
    const { id, is_active } = await req.json();

    const { error } = await supabase
      .from("reminders")
      .update({
        is_active,
      })
      .eq("id", id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
