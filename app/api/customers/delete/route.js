import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  const { error } = await supabaseAdmin
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    return Response.json({
      success: false,
      error,
    });
  }

  return Response.json({
    success: true,
  });
}