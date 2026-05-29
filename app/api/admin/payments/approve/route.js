import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";

const ADMIN_EMAILS = ["davegpakpahan@gmail.com"];

export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { paymentId } = await req.json();

  const { data: payment, error: paymentError } = await supabaseAdmin
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (paymentError || !payment) {
    return Response.json({ error: "Payment tidak ditemukan" }, { status: 404 });
  }

  await supabaseAdmin
    .from("payments")
    .update({ status: "approved" })
    .eq("id", paymentId);

  const expiredAt = new Date();
  expiredAt.setDate(expiredAt.getDate() + 30);

  await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: payment.user_id,
      plan: payment.plan,
      status: "active",
      started_at: new Date().toISOString(),
      expired_at: expiredAt.toISOString(),
    },
    { onConflict: "user_id" },
  );

  return Response.json({ success: true });
}
