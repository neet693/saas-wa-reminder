import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";
import { checkReminderLimit } from "@/lib/subscription";

export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { allowed, current, limit, plan } = await checkReminderLimit(user.id);
  if (!allowed) {
    return Response.json(
      {
        error: `Batas reminder plan ${plan} sudah tercapai (${current}/${limit}). Upgrade plan untuk menambah lebih banyak.`,
        limitReached: true,
      },
      { status: 403 },
    );
  }

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("reminders")
    .insert({ user_id: user.id, ...body })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ success: true, reminder: data });
}
