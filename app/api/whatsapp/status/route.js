//Baca dari vercel
// import { getStatus } from "@/lib/whatsapp";

// export async function GET() {
//   return Response.json({
//     status: getStatus(),
//   });
// }
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function GET() {
  const { data, error } = await supabase
    .from("whatsapp_sessions")
    .select("*")
    .eq("user_id", "demo-user")
    .single();

  if (error) {
    return Response.json({
      status: "close",
      qr: null,
      phone: null,
    });
  }

  return Response.json(data);
}
