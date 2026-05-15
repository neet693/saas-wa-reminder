import { getQR, getStatus } from "@/lib/whatsapp";

export async function GET() {
  const qr = getQR();
  const status = getStatus();

  return Response.json({ qr, status });
}
