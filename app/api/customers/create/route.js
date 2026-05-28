import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(req) {
  const cookieStore = cookies();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
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

  const { name, phone } = body;

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

  const { data, error } = await supabase
    .from("customers")
    .insert({
      user_id: user.id,
      name,
      phone,
    })
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
