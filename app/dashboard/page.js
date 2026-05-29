"use client";

import { useState } from "react";
import { BellRing, CheckCircle2, Loader2, MessageCircle } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function sendReminders() {
    try {
      setLoading(true);
      setResult(null);

      const res = await fetch("/api/reminders/send", {
        method: "POST",
      });

      const data = await res.json();

      setResult(data);
    } catch (error) {
      setResult({
        error: "Failed to send reminders",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-500 p-2 text-white">
              <MessageCircle size={18} />
            </div>

            <div>
              <h1 className="text-lg font-semibold">WA Reminder Dashboard</h1>

              <p className="text-sm text-zinc-500">
                WhatsApp automation management
              </p>
            </div>
          </div>

          <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            Connected
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold tracking-tight text-zinc-900">
            Dashboard
          </h2>

          <p className="mt-3 text-lg text-zinc-600">
            Kelola reminder WhatsApp otomatis dengan mudah.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-green-100 p-3 text-green-600">
              <BellRing size={24} />
            </div>

            <p className="text-sm text-zinc-500">Total Reminder</p>

            <h3 className="mt-2 text-3xl font-bold">128</h3>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-blue-100 p-3 text-blue-600">
              <CheckCircle2 size={24} />
            </div>

            <p className="text-sm text-zinc-500">Sent Today</p>

            <h3 className="mt-2 text-3xl font-bold">34</h3>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-purple-100 p-3 text-purple-600">
              <MessageCircle size={24} />
            </div>

            <p className="text-sm text-zinc-500">WhatsApp Status</p>

            <h3 className="mt-2 text-2xl font-bold text-green-600">Active</h3>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Send Reminders</h3>

              <p className="mt-2 text-zinc-600">
                Jalankan reminder secara manual untuk testing atau force send.
              </p>
            </div>

            <button
              onClick={sendReminders}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <BellRing size={18} />
                  Send Reminders
                </>
              )}
            </button>
          </div>

          {result && (
            <div className="mt-8 overflow-auto rounded-2xl bg-zinc-900 p-5 text-sm text-green-400">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Quick Tips</h3>

            <ul className="mt-4 space-y-3 text-sm text-zinc-600">
              <li>• Gunakan repeat reminder untuk follow-up.</li>
              <li>• Pastikan WhatsApp selalu connected.</li>
              <li>• Gunakan interval reminder untuk tagihan.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">System Status</h3>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500" />

              <p className="text-sm text-zinc-600">All systems operational</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
