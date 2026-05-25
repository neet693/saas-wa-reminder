"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ReminderDT from "@/components/ReminderDT";

export default function RemindersPage() {
  const [customers, setCustomers] = useState([]);

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [message, setMessage] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const [repeatInterval, setRepeatInterval] = useState("");
  const [repeatUnit, setRepeatUnit] = useState("");

  async function fetchCustomers() {
    const { data } = await supabase.from("customers").select("*");

    setCustomers(data || []);
  }

  async function addReminder() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User tidak ditemukan");
      return;
    }

    if ((repeatInterval && !repeatUnit) || (!repeatInterval && repeatUnit)) {
      alert("Repeat interval dan unit harus diisi bersamaan");
      return;
    }

    if (repeatInterval && Number(repeatInterval) <= 0) {
      alert("Repeat interval harus lebih dari 0");
      return;
    }

    const scheduledAtUTC = new Date(scheduledAt).toISOString();

    const rows = selectedCustomers.map((customerId) => ({
      user_id: user.id,
      customer_id: customerId,
      message,
      scheduled_at: scheduledAtUTC,
      status: "pending",

      repeat_interval: repeatInterval ? Number(repeatInterval) : null,

      repeat_unit: repeatUnit || null,

      is_active: true,
    }));

    const { error } = await supabase.from("reminders").insert(rows);

    if (error) {
      alert(error.message);
      return;
    }

    setSelectedCustomers([]);
    setMessage("");
    setScheduledAt("");

    setRepeatInterval("");
    setRepeatUnit("");

    alert("Reminder berhasil ditambahkan");
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reminders</h1>

      <div className="flex flex-col gap-4 mb-10">
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
          className="border p-2 rounded"
          placeholder="Reminder Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />

        <div>
          <label className="block mb-2 font-medium">Schedule Date & Time</label>

          <input
            type="datetime-local"
            className="border p-2 rounded w-full"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>

        <div className="border rounded p-4">
          <p className="font-semibold mb-3">Repeat Schedule (Optional)</p>

          <div className="flex gap-2 items-center flex-wrap">
            <span>Every</span>

            <input
              type="number"
              min="1"
              placeholder="1"
              disabled={!repeatUnit}
              value={repeatInterval}
              onChange={(e) => setRepeatInterval(e.target.value)}
              className="border p-2 rounded w-24 disabled:bg-gray-100"
            />

            <select
              value={repeatUnit}
              onChange={(e) => {
                const value = e.target.value;

                setRepeatUnit(value);

                if (!value) {
                  setRepeatInterval("");
                }
              }}
              className="border p-2 rounded"
            >
              <option value="">One Time</option>

              {/* Development */}
              <option value="minute">Minute</option>

              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Biarkan "One Time" untuk reminder sekali kirim.
          </p>
        </div>

        <button
          onClick={addReminder}
          disabled={selectedCustomers.length === 0 || !message || !scheduledAt}
          className="bg-black text-white p-2 rounded disabled:opacity-50"
        >
          Add Reminder
        </button>
      </div>

      <ReminderDT />
    </div>
  );
}
