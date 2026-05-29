import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";

export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { plan, proofUrl } = await req.json();

  if (!["starter", "pro"].includes(plan)) {
    return Response.json({ error: "Plan tidak valid" }, { status: 400 });
  }

  const PRICES = { starter: 49000, pro: 129000 };

  const { error } = await supabaseAdmin.from("payments").insert({
    user_id: user.id,
    plan,
    amount: PRICES[plan],
    proof_url: proofUrl,
    status: "pending",
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ success: true });
}
