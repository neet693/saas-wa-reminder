import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";
import { checkCustomerLimit } from "@/lib/subscription";

export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Cek limit
  const { allowed, current, limit, plan } = await checkCustomerLimit(user.id);
  if (!allowed) {
    return Response.json(
      {
        error: `Batas customer plan ${plan} sudah tercapai (${current}/${limit}). Upgrade plan untuk menambah lebih banyak.`,
        limitReached: true,
      },
      { status: 403 },
    );
  }

  const { name, phone, notes } = await req.json();

  const { data, error } = await supabaseAdmin
    .from("customers")
    .insert({ user_id: user.id, name, phone, notes })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ success: true, customer: data });
}
