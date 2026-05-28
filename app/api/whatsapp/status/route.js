import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
  const user = await getAuthUser(req);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("AUTH USER:", user.id);

  const { data, error } = await supabaseAdmin
    .from("whatsapp_sessions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("DB ERROR:", error.message);
  }

  if (!data) {
    return Response.json({
      status: "close",
      qr: null,
      phone: null,
    });
  }

  return Response.json(data);
}
