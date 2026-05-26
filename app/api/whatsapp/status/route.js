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
    .eq("id", "main")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
