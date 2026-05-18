"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetchReminders();

    const interval = setInterval(() => {
      fetchReminders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function renderStatus(status) {
    if (status === "pending") {
      return (
        <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
          Pending
        </span>
      );
    }

    if (status === "sent") {
      return (
        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
          Sent
        </span>
      );
    }

    if (status === "failed") {
      return (
        <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
          Failed
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
        Unknown
      </span>
    );
  }

  return (
    <div className="mt-10 border rounded-xl overflow-hidden bg-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Reminder List</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">No</th>
              <th className="p-4">To</th>
              <th className="p-4">Message</th>
              <th className="p-4">Schedule</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : reminders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No reminders found.
                </td>
              </tr>
            ) : (
              reminders.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>

                  <td className="p-4 font-medium">
                    <div className="font-medium">
                      {item.customers?.name || "-"}
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      {item.customers?.phone || "-"}
                    </div>
                  </td>

                  <td className="p-4 max-w-75 truncate">
                    <div
                      className="truncate cursor-pointer"
                      title={item.message}
                    >
                      {item.message}
                    </div>
                  </td>

                  <td className="p-4">
                    {new Date(item.scheduled_at).toLocaleString("id-ID", {
                      timeZone: "Asia/Jakarta",
                    })}
                  </td>

                  <td className="p-4">{renderStatus(item.status)}</td>

                  <td className="p-4">
                    <button
                      onClick={() => deleteReminder(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
