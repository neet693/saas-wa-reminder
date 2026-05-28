import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function PUT(req) {
  const cookieStore = cookies();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    },
  );

  // ambil user login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const body = await req.json();

  const { id, name, phone } = body;

  if (!id) {
    return Response.json(
      {
        error: "ID required",
      },
      {
        status: 400,
      },
    );
  }

  if (!name || !phone) {
    return Response.json(
      {
        error: "Name & phone required",
      },
      {
        status: 400,
      },
    );
  }

  // update hanya milik user login
  const { data, error } = await supabase
    .from("customers")
    .update({
      name,
      phone,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }

  return Response.json({
    success: true,
    customer: data,
  });
}
