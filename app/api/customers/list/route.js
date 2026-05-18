import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return Response.json({
      success: false,
      error,
    });
  }

  return Response.json({
    success: true,
    customers: data,
  });
}
