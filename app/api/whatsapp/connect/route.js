import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("whatsapp_sessions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Belum ada session
  if (error || !data) {
    return Response.json(null);
  }

  return Response.json(data);
}
