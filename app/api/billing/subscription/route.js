import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";
import { PLANS } from "@/lib/subscription";

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const plan = subscription?.plan || "free";
  const limits = PLANS[plan];

  // Hitung usage customers
  const { count: customerCount } = await supabaseAdmin
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Hitung usage reminders bulan ini
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: reminderCount } = await supabaseAdmin
    .from("reminders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth.toISOString());

  return Response.json({
    subscription: subscription || { plan: "free", status: "active" },
    usage: {
      customers: customerCount || 0,
      reminders: reminderCount || 0,
    },
  });
}
