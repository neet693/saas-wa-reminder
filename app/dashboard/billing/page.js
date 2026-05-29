"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const PLANS = {
  free: { name: "Free", price: 0, customers: 30, reminders: 30, devices: 1 },
  starter: {
    name: "Starter",
    price: 49000,
    customers: 150,
    reminders: 300,
    devices: 1,
  },
  pro: {
    name: "Pro",
    price: 129000,
    customers: 500,
    reminders: 1000,
    devices: 2,
  },
};

function formatPrice(price) {
  if (price === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [proofUrl, setProofUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchWithAuth("/api/billing/subscription");
      const data = await res.json();
      setSubscription(data.subscription);
      setUsage(data.usage);
    }
    load();
  }, []);

  async function handleUpgrade() {
    if (!selectedPlan || !proofUrl) return;
    setLoading(true);

    const res = await fetchWithAuth("/api/billing/request-upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: selectedPlan, proofUrl }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Request upgrade berhasil! Menunggu konfirmasi admin.");
    setSelectedPlan(null);
    setProofUrl("");
  }

  const currentPlan = subscription?.plan || "free";
  const planInfo = PLANS[currentPlan];

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Billing & Subscription</h1>

      {/* Plan Sekarang */}
      <div className="border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Plan Aktif</h2>
        <div className="flex items-center gap-3">
          <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
            {planInfo?.name}
          </span>
          <span className="text-gray-500">
            {formatPrice(planInfo?.price)}/bulan
          </span>
        </div>

        {/* Usage */}
        {usage && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-2xl font-bold">
                {usage.customers}/{planInfo?.customers}
              </p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black rounded-full h-2"
                  style={{
                    width: `${Math.min((usage.customers / planInfo?.customers) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Reminders bulan ini</p>
              <p className="text-2xl font-bold">
                {usage.reminders}/{planInfo?.reminders}
              </p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black rounded-full h-2"
                  style={{
                    width: `${Math.min((usage.reminders / planInfo?.reminders) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {subscription?.expired_at && (
          <p className="text-sm text-gray-500">
            Aktif hingga:{" "}
            {new Date(subscription.expired_at).toLocaleDateString("id-ID")}
          </p>
        )}
      </div>

      {/* Pilih Plan */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upgrade Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(PLANS).map(([key, plan]) => (
            <div
              key={key}
              onClick={() => key !== "free" && setSelectedPlan(key)}
              className={`border rounded-xl p-5 space-y-3 cursor-pointer transition ${
                selectedPlan === key
                  ? "border-black ring-2 ring-black"
                  : currentPlan === key
                    ? "border-green-500 bg-green-50"
                    : "hover:border-gray-400"
              } ${key === "free" ? "cursor-default opacity-60" : ""}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{plan.name}</h3>
                {currentPlan === key && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold">
                {formatPrice(plan.price)}
                <span className="text-sm font-normal text-gray-500">
                  /bulan
                </span>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ {plan.customers} customers</li>
                <li>✓ {plan.reminders} reminders/bulan</li>
                <li>✓ {plan.devices} WA device</li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Form Pembayaran */}
      {selectedPlan && selectedPlan !== currentPlan && (
        <div className="border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Pembayaran</h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <p className="font-medium">Transfer ke:</p>
            <p>
              BCA: <span className="font-mono font-bold">2832577368</span> a/n
              Dave Guardyan Pakpahan
            </p>
            <p>QRIS: scan QR di bawah</p>
            <p className="text-gray-500">
              Nominal:{" "}
              <span className="font-bold text-black">
                {formatPrice(PLANS[selectedPlan].price)}
              </span>
            </p>
          </div>

          {/* Ganti dengan QR kamu */}
          <div className="border rounded-lg p-4 text-center text-gray-400 text-sm">
            [QRIS image di sini]
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-sm">
              Link Bukti Transfer
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              className="border rounded-lg p-2 w-full"
            />
            <p className="text-xs text-gray-500">
              Upload foto bukti transfer ke Google Drive / Imgur lalu paste
              linknya
            </p>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={!proofUrl || loading}
            className="bg-black text-white px-6 py-2 rounded-lg disabled:opacity-50 w-full"
          >
            {loading
              ? "Mengirim..."
              : `Request Upgrade ke ${PLANS[selectedPlan].name}`}
          </button>
        </div>
      )}
    </div>
  );
}
