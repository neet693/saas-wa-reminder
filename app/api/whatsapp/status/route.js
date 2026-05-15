import { getStatus } from "@/lib/whatsapp";

export async function GET() {
  return Response.json({
    status: getStatus(),
  });
}
