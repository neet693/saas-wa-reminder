"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function WhatsAppDashboard() {
  const [qr, setQr] = useState("");
  const [status, setStatus] = useState("close");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/whatsapp/qr");
      const data = await res.json();

      setStatus(data.status);
      if (data.qr) setQr(data.qr);
      if (data.status === "open") setQr("");
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  async function handleDisconnect() {
    await fetch("/api/whatsapp/disconnect", { method: "POST" });
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">WhatsApp Connection</h1>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            status === "open"
              ? "bg-green-500"
              : status === "qr"
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
        />
        <span className="font-medium">
          {status === "open"
            ? "Connected"
            : status === "qr"
              ? "Waiting for scan..."
              : "Disconnected"}
        </span>
      </div>

      {/* Connected */}
      {status === "open" && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            ✅ WhatsApp Connected Successfully
          </div>
          <button
            onClick={handleDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* QR Code */}
      {status === "qr" && qr && (
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Scan QR ini dengan WhatsApp kamu → Linked Devices → Link a Device
          </p>
          <div className="p-4 bg-white inline-block rounded-lg border">
            <QRCodeSVG value={qr} size={256} />
          </div>
          <p className="text-xs text-gray-400">
            QR refresh otomatis setiap 20 detik
          </p>
        </div>
      )}

      {/* Disconnected */}
      {status === "close" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          ⚠️ WhatsApp belum terkoneksi. Menunggu koneksi...
        </div>
      )}
    </div>
  );
}
