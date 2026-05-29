"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import CustomerDT from "@/components/CustomerDT";

export default function CustomersPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function addCustomer() {
    if (!name || !phone) return;

    setLoading(true);

    const res = await fetchWithAuth("/api/customers/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      setLoading(false);
      return;
    }

    setName("");
    setPhone("");
    setLoading(false);

    // Refresh tabel
    window.dispatchEvent(new Event("refresh-customers"));
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>

      <div className="flex flex-col gap-3 mb-8">
        <input
          className="border p-2"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={addCustomer}
          disabled={loading || !name || !phone}
          className="bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Customer"}
        </button>
      </div>

      <CustomerDT />
    </div>
  );
}
