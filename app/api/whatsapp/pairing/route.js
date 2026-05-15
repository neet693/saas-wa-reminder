import { getSock, waitUntilReady } from "@/lib/whatsapp";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return Response.json({ error: "Phone required" }, { status: 400 });
  }

  try {
    const sock = await getSock();

    // Pastikan socket sudah terdaftar sebelum minta pairing code
    // Jangan tunggu "open" — cukup tunggu socket ada
    await new Promise((r) => setTimeout(r, 2000));

    const jid = phone.replace(/\D/g, "");
    const code = await sock.requestPairingCode(jid);

    return Response.json({ code });
  } catch (err) {
    console.error("Pairing error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
