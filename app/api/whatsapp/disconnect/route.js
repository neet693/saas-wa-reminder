import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";

export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await supabaseAdmin.from("whatsapp_sessions").delete().eq("user_id", user.id);

  return Response.json({ success: true });
}
