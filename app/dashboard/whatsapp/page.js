"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function WhatsAppDashboard() {
  const [session, setSession] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      const res = await fetchWithAuth("/api/whatsapp/status");
      const data = await res.json();
      setSession(data);
    }

    loadStatus();
    const interval = setInterval(loadStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  async function handleCreateSession() {
    setCreating(true);
    await fetchWithAuth("/api/whatsapp/connect", { method: "POST" });
    setCreating(false);
  }

  async function handleDisconnect() {
    await fetchWithAuth("/api/whatsapp/disconnect", { method: "POST" });
  }

  const status = session?.status || null;
  const qr = session?.qr || "";
  const phone = session?.phone || "";

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">WhatsApp Connection</h1>

      {/* Belum ada session */}
      {status === null && (
        <div className="space-y-4">
          <p className="text-gray-500">Belum ada sesi WhatsApp.</p>
          <button
            onClick={handleCreateSession}
            disabled={creating}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded"
          >
            {creating ? "Creating..." : "Create Session"}
          </button>
        </div>
      )}

      {/* Status Badge */}
      {status && (
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
                : status === "pending"
                  ? "Starting..."
                  : "Disconnected"}
          </span>
        </div>
      )}

      {/* Connected */}
      {status === "open" && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            ✅ WhatsApp Connected Successfully
            <div className="mt-2 text-sm">{phone}</div>
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

      {/* Pending */}
      {status === "pending" && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          ⏳ Menunggu QR dari server...
        </div>
      )}

      {/* Disconnected tapi sudah ada session */}
      {status === "close" && (
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            ⚠️ WhatsApp terputus.
          </div>
          <button
            onClick={handleCreateSession}
            disabled={creating}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded"
          >
            {creating ? "Reconnecting..." : "Reconnect"}
          </button>
        </div>
      )}
    </div>
  );
}
