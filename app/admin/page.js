"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const ADMIN_EMAILS = ["davegpakpahan@gmail.com"];

export default function AdminPage() {
  const [payments, setPayments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPayments() {
    const res = await fetchWithAuth("/api/admin/payments");
    const data = await res.json();

    setPayments(data.payments || []);
    setLoading(false);
  }

  async function fetchSubscriptions() {
    const res = await fetchWithAuth("/api/admin/subscriptions");
    const data = await res.json();

    setSubscriptions(data.subscriptions || []);
  }

  async function handleApprove(paymentId) {
    const ok = confirm("Approve pembayaran ini?");
    if (!ok) return;

    const res = await fetchWithAuth("/api/admin/payments/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Pembayaran diapprove!");
    fetchPayments();
    fetchSubscriptions();
  }

  async function handleReject(paymentId) {
    const ok = confirm("Reject pembayaran ini?");
    if (!ok) return;

    const res = await fetchWithAuth("/api/admin/payments/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Pembayaran direject!");
    fetchPayments();
  }

  async function handleSave(sub) {
    const res = await fetchWithAuth("/api/admin/subscriptions/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sub),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Subscription updated!");
    fetchSubscriptions();
  }

  useEffect(() => {
    fetchPayments();
    fetchSubscriptions();
  }, []);

  function formatPrice(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-500 mt-1">
          Kelola pembayaran dan subscription user.
        </p>
      </div>

      {/* Pending Payments */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pending Payments</h2>

        {loading ? (
          <p>Loading...</p>
        ) : payments.length === 0 ? (
          <p className="text-gray-500">Tidak ada pembayaran pending.</p>
        ) : (
          <div className="border rounded-xl overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Bukti</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{payment.users?.email}</td>

                    <td className="p-4 font-medium capitalize">
                      {payment.plan}
                    </td>

                    <td className="p-4">{formatPrice(payment.amount)}</td>

                    <td className="p-4">
                      <a
                        href={payment.proof_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Lihat Bukti
                      </a>
                    </td>

                    <td className="p-4">
                      {new Date(payment.created_at).toLocaleDateString("id-ID")}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(payment.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleReject(payment.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manage Subscriptions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Manage Subscriptions</h2>

        <div className="border rounded-xl overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Max Customer</th>
                <th className="p-4">Max Reminder</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {subscriptions.map((sub, index) => (
                <tr key={sub.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{sub.users?.email}</td>

                  <td className="p-4">
                    <select
                      value={sub.plan}
                      onChange={(e) => {
                        const updated = [...subscriptions];
                        updated[index].plan = e.target.value;
                        setSubscriptions(updated);
                      }}
                      className="border rounded px-2 py-1"
                    >
                      <option value="free">Free</option>
                      <option value="starter">Starter</option>
                      <option value="pro">Pro</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <input
                      type="number"
                      value={sub.max_customers || 0}
                      onChange={(e) => {
                        const updated = [...subscriptions];
                        updated[index].max_customers = Number(e.target.value);
                        setSubscriptions(updated);
                      }}
                      className="border rounded px-2 py-1 w-24"
                    />
                  </td>

                  <td className="p-4">
                    <input
                      type="number"
                      value={sub.max_reminders || 0}
                      onChange={(e) => {
                        const updated = [...subscriptions];
                        updated[index].max_reminders = Number(e.target.value);
                        setSubscriptions(updated);
                      }}
                      className="border rounded px-2 py-1 w-24"
                    />
                  </td>

                  <td className="p-4">
                    <select
                      value={sub.status}
                      onChange={(e) => {
                        const updated = [...subscriptions];
                        updated[index].status = e.target.value;
                        setSubscriptions(updated);
                      }}
                      className="border rounded px-2 py-1"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="expired">Expired</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleSave(sub)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {subscriptions.length === 0 && (
            <p className="p-4 text-gray-500">Tidak ada subscription.</p>
          )}
        </div>
      </div>
    </div>
  );
}
