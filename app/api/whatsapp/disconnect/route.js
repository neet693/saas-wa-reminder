import { disconnectWhatsApp } from "@/lib/whatsapp";

export async function POST() {
  await disconnectWhatsApp();
  return Response.json({ success: true, message: "Disconnected" });
}
