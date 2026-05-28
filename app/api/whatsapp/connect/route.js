import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";

export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data: existing } = await supabaseAdmin
    .from("whatsapp_sessions")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    const { error } = await supabaseAdmin.from("whatsapp_sessions").insert({
      user_id: user.id,
      status: "pending",
      qr: null,
    });

    console.log("INSERT ERROR:", error?.message);
  }

  return Response.json({ success: true });
}
