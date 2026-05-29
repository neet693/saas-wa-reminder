import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";

const ADMIN_EMAILS = ["davegpakpahan@gmail.com"];

export async function GET(req) {
  const user = await getAuthUser(req);

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ambil subscriptions
  const { data: subscriptions, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Ambil auth users
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.listUsers();

  if (authError) {
    return Response.json({ error: authError.message }, { status: 500 });
  }

  // Merge email ke subscription
  const merged = subscriptions.map((sub) => {
    const authUser = authData.users.find((u) => u.id === sub.user_id);

    return {
      ...sub,
      email: authUser?.email || "-",
    };
  });

  return Response.json({
    subscriptions: merged,
  });
}
