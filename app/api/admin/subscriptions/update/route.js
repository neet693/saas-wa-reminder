import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";

const ADMIN_EMAILS = ["davegpakpahan@gmail.com"];

export async function POST(req) {
  const user = await getAuthUser(req);

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { id, plan, status, max_customers, max_reminders, expired_at } = body;

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      plan,
      status,
      max_customers,
      max_reminders,
      expired_at,
    })
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    success: true,
  });
}
