"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RemindersPage() {
  const [customers, setCustomers] = useState([]);
  const [reminders, setReminders] = useState([]);

  const [customerId, setCustomerId] = useState("");
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

  async function addReminder() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Konversi datetime-local ke UTC sebelum disimpan
    const scheduledAtUTC = new Date(scheduledAt).toISOString();

    const { error } = await supabase.from("reminders").insert([
      {
        user_id: user.id,
        customer_id: customerId,
        message,
        scheduled_at: scheduledAtUTC, // ← pakai UTC
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setCustomerId("");
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
        <select
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
        </select>

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

        <button
          onClick={addReminder}
          className="bg-black text-white p-2 rounded"
        >
          Add Reminder
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="border p-4 rounded">
            <h2 className="font-bold">{reminder.customers?.name}</h2>

            <p>{reminder.customers?.phone}</p>

            <p className="mt-2">{reminder.message}</p>

            <p className="text-sm text-zinc-500 mt-2">
              {new Date(reminder.scheduled_at).toLocaleString()}
            </p>

            <button
              onClick={() => deleteReminder(reminder.id)}
              className="text-red-500 mt-3"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
