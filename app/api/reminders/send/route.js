import { createClient } from "@supabase/supabase-js";
import { getSock, getStatus } from "@/lib/whatsapp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // pakai service role, bukan anon key
);

export async function POST() {
  // Cek WA sudah connect
  if (getStatus() !== "open") {
    return Response.json(
      { error: "WhatsApp belum terkoneksi" },
      { status: 400 },
    );
  }

  // Ambil reminder yang sudah due dan masih pending
  const now = new Date().toISOString();
  const { data: reminders, error } = await supabase
    .from("reminders")
    .select("*, customers(name, phone)")
    .eq("status", "pending")
    .lte("scheduled_at", now);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!reminders || reminders.length === 0) {
    return Response.json({ message: "Tidak ada reminder yang perlu dikirim" });
  }

  const sock = await getSock();
  const results = [];

  for (const reminder of reminders) {
    const phone = reminder.customers?.phone;
    const name = reminder.customers?.name;

    if (!phone) {
      results.push({ id: reminder.id, status: "skip", reason: "no phone" });
      continue;
    }

    // Format nomor: pastikan pakai kode negara, tanpa +
    const jid = phone.replace(/\D/g, "") + "@s.whatsapp.net";

    try {
      await sock.sendMessage(jid, { text: reminder.message });

      // Update status ke sent
      await supabase
        .from("reminders")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
        })
        .eq("id", reminder.id);

      console.log(`✅ Reminder terkirim ke ${name} (${phone})`);
      results.push({ id: reminder.id, status: "sent", to: phone });
    } catch (err) {
      console.error(`❌ Gagal kirim ke ${phone}:`, err.message);

      // Update status ke failed
      await supabase
        .from("reminders")
        .update({ status: "failed" })
        .eq("id", reminder.id);

      results.push({ id: reminder.id, status: "failed", reason: err.message });
    }
  }

  return Response.json({ results });
}
