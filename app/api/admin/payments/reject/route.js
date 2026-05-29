import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthUser } from "@/lib/auth";

const ADMIN_EMAILS = ["davegpakpahan@gmail.com"];

export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { paymentId } = await req.json();

  await supabaseAdmin
    .from("payments")
    .update({ status: "rejected" })
    .eq("id", paymentId);

  return Response.json({ success: true });
}
