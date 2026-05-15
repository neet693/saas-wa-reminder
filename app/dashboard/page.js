"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function sendReminders() {
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/reminders/send", { method: "POST" });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="mt-4 text-zinc-600">
        Welcome to your WhatsApp automation SaaS.
      </p>

      <button
        onClick={sendReminders}
        disabled={loading}
        style={{
          backgroundColor: "#9333ea",
          color: "white",
          padding: "8px 16px",
          borderRadius: "4px",
          marginTop: "24px",
          display: "block",
        }}
      >
        {loading ? "Sending..." : "Send Reminders"}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-zinc-100 rounded text-sm">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
