export async function register() {
  // Hanya jalankan di server, bukan edge runtime
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startWhatsApp } = await import("./lib/whatsapp");
    await startWhatsApp();
    console.log("🚀 WhatsApp auto-start dari instrumentation");
  }
}
