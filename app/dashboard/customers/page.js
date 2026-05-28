"use client";

import { useEffect, useState } from "react";
import CustomerDT from "@/components/CustomerDT";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function fetchCustomers() {
    try {
      const res = await fetch("/api/customers/list");

      const data = await res.json();

      setCustomers(data.customers || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function addCustomer() {
    try {
      const res = await fetch("/api/customers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed");
        return;
      }

      setName("");
      setPhone("");

      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteCustomer(id) {
    try {
      await fetch(`/api/customers/delete?id=${id}`, {
        method: "DELETE",
      });

      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

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
          className="bg-black text-white p-2 rounded"
        >
          Add Customer
        </button>
      </div>

      <CustomerDT
        customers={customers}
        onDelete={deleteCustomer}
        refreshCustomers={fetchCustomers}
      />
    </div>
  );
}
