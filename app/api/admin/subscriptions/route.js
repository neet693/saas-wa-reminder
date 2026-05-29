import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";

const ADMIN_EMAILS = ["davegpakpahan@gmail.com"];

export async function GET(req) {
  const user = await getAuthUser(req);

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select(
      `
      id,
      user_id,
      plan,
      status,
      max_customers,
      max_reminders,
      expired_at,
      users (
        email
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    subscriptions: data || [],
  });
}
