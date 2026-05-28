"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CustomerDT from "@/components/CustomerDT";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function fetchCustomers() {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setCustomers(data);
    }
  }

  async function addCustomer() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("customers").insert([
      {
        user_id: user.id,
        name,
        phone,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setPhone("");

    fetchCustomers();
  }

  async function deleteCustomer(id) {
    await supabase.from("customers").delete().eq("id", id);

    fetchCustomers();
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
      <CustomerDT />
    </div>
  );
}
