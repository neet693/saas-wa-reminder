"use client";

import { useEffect, useState } from "react";

function Badge({ children, color }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}
    >
      {children}
    </span>
  );
}

export default function DataTable() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchReminders() {
    try {
      const res = await fetch("/api/reminders/list");
      const data = await res.json();

      setReminders(data.reminders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteReminder(id) {
    const ok = confirm("Hapus reminder ini?");

    if (!ok) return;

    try {
      await fetch(`/api/reminders/delete?id=${id}`, {
        method: "DELETE",
      });

      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleReminder(id, isActive) {
    try {
      await fetch("/api/reminders/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          is_active: !isActive,
        }),
      });

      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchReminders();

    const interval = setInterval(() => {
      fetchReminders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // function renderStatus(status) {
  //   if (status === "pending") {
  //     return <Badge color="bg-yellow-100 text-yellow-700">⏳ Pending</Badge>;
  //   }

  //   if (status === "sent") {
  //     return <Badge color="bg-green-100 text-green-700">✅ Sent</Badge>;
  //   }

  //   if (status === "failed") {
  //     return <Badge color="bg-red-100 text-red-700">❌ Failed</Badge>;
  //   }

  //   return <Badge color="bg-gray-100 text-gray-700">Unknown</Badge>;
  // }

  function renderStatus(item) {
    const isRecurring = item.repeat_interval && item.repeat_unit;

    if (isRecurring) {
      if (!item.is_active) {
        return <Badge color="bg-gray-100 text-gray-700">⏸ Paused</Badge>;
      }

      return <Badge color="bg-blue-100 text-blue-700">🔁 Recurring</Badge>;
    }

    if (item.status === "pending") {
      return <Badge color="bg-yellow-100 text-yellow-700">⏳ Pending</Badge>;
    }

    if (item.status === "sent") {
      return <Badge color="bg-green-100 text-green-700">✅ Sent</Badge>;
    }

    if (item.status === "failed") {
      return <Badge color="bg-red-100 text-red-700">❌ Failed</Badge>;
    }

    return <Badge color="bg-gray-100 text-gray-700">Unknown</Badge>;
  }

  function formatRepeat(item) {
    if (!item.repeat_interval || !item.repeat_unit) {
      return "One Time";
    }

    const labels = {
      minute: "Minute",
      hout: "Hour",
      day: "Day",
      week: "Week",
      month: "Month",
      year: "Year",
    };

    const label = labels[item.repeat_unit] || item.repeat_unit;

    return `Every ${item.repeat_interval} ${label}${
      item.repeat_interval > 1 ? "s" : ""
    }`;
  }

  return (
    <div className="mt-10 border rounded-xl overflow-hidden bg-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Reminder List</h2>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No reminders found.
          </div>
        ) : (
          <div className="grid gap-3">
            {reminders.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:border-black transition"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {item.customers?.name || "-"}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.customers?.phone || "-"}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap justify-end">
                    <Badge
                      color={
                        item.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {item.is_active ? "🟢 Active" : "⏸ Paused"}
                    </Badge>

                    {renderStatus(item)}
                  </div>
                </div>

                {/* Message */}
                <div className="mt-4">
                  <p
                    className="text-sm text-gray-700 line-clamp-2"
                    title={item.message}
                  >
                    {item.message}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs text-gray-500">Next Run</p>

                    <p className="text-sm">
                      {new Date(item.scheduled_at).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })}
                    </p>

                    <p className="text-xs text-blue-600">
                      {formatRepeat(item)}
                    </p>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => toggleReminder(item.id, item.is_active)}
                      className={`px-3 py-2 rounded text-sm text-white ${
                        item.is_active ? "bg-yellow-500" : "bg-green-600"
                      }`}
                    >
                      {item.is_active ? "Pause" : "Resume"}
                    </button>

                    <button
                      onClick={() => deleteReminder(item.id)}
                      className="px-3 py-2 rounded text-sm bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
