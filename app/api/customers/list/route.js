import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ success: true, customers: data || [] });
}
