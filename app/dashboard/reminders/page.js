"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ReminderDT from "@/components/ReminderDT";

export default function RemindersPage() {
  const [customers, setCustomers] = useState([]);
  const [reminders, setReminders] = useState([]);

  // const [customerId, setCustomerId] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [message, setMessage] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  async function fetchCustomers() {
    const { data } = await supabase.from("customers").select("*");

    setCustomers(data || []);
  }

  async function fetchReminders() {
    const { data } = await supabase
      .from("reminders")
      .select(
        `
        *,
        customers (
          name,
          phone
        )
      `,
      )
      .order("scheduled_at", {
        ascending: true,
      });

    setReminders(data || []);
  }

  // async function addReminder() {
  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser();

  //   // Konversi datetime-local ke UTC sebelum disimpan
  //   const scheduledAtUTC = new Date(scheduledAt).toISOString();

  //   const { error } = await supabase.from("reminders").insert([
  //     {
  //       user_id: user.id,
  //       customer_id: customerId,
  //       message,
  //       scheduled_at: scheduledAtUTC, // ← pakai UTC
  //     },
  //   ]);

  //   if (error) {
  //     alert(error.message);
  //     return;
  //   }

  //   setCustomerId("");
  //   setMessage("");
  //   setScheduledAt("");

  //   fetchReminders();
  // }

  async function addReminder() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const scheduledAtUTC = new Date(scheduledAt).toISOString();

    const rows = selectedCustomers.map((customerId) => ({
      user_id: user.id,
      customer_id: customerId,
      message,
      scheduled_at: scheduledAtUTC,
      status: "pending",
    }));

    const { error } = await supabase.from("reminders").insert(rows);

    if (error) {
      alert(error.message);
      return;
    }

    setSelectedCustomers([]);
    setMessage("");
    setScheduledAt("");

    fetchReminders();
  }

  async function deleteReminder(id) {
    await supabase.from("reminders").delete().eq("id", id);

    fetchReminders();
  }

  useEffect(() => {
    fetchCustomers();
    fetchReminders();
  }, []);

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reminders</h1>

      <div className="flex flex-col gap-4 mb-10">
        {/* <select
          className="border p-2"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">Select Customer</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select> */}

        <div className="border rounded p-4 max-h-60 overflow-y-auto">
          <p className="font-semibold mb-3">Select Customers</p>

          <div className="flex flex-col gap-2">
            {customers.map((customer) => (
              <label key={customer.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(customer.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCustomers([...selectedCustomers, customer.id]);
                    } else {
                      setSelectedCustomers(
                        selectedCustomers.filter((id) => id !== customer.id),
                      );
                    }
                  }}
                />

                <div>
                  <p className="font-medium">{customer.name}</p>

                  <p className="text-sm text-gray-500">{customer.phone}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <textarea
          className="border p-2"
          placeholder="Reminder Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="datetime-local"
          className="border p-2"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />

        {/* <button
          onClick={addReminder}
          className="bg-black text-white p-2 rounded"
        >
          Add Reminder
        </button> */}

        <button
          onClick={addReminder}
          disabled={selectedCustomers.length === 0 || !message || !scheduledAt}
          className="bg-black text-white p-2 rounded disabled:opacity-50"
        >
          Add Reminder
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <ReminderDT />
      </div>
    </div>
  );
}
