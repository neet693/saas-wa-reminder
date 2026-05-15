import { startWhatsApp, getStatus } from "@/lib/whatsapp";

export async function GET() {
  await startWhatsApp();

  return Response.json({
    success: true,
    status: getStatus(),
  });
}
