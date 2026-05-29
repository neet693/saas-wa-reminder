"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function ReminderDT() {
  const [reminders, setReminders] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────
  // FETCH DATA
  // ─────────────────────────────
  async function fetchReminders() {
    try {
      const res = await fetchWithAuth("/api/reminders/list");
      const data = await res.json();

      setReminders(data.reminders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────
  // DELETE
  // ─────────────────────────────
  async function deleteReminder(id) {
    const ok = confirm("Delete reminder?");
    if (!ok) return;

    try {
      await fetchWithAuth(`/api/reminders/delete?id=${id}`, {
        method: "DELETE",
      });

      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  }

  // ─────────────────────────────
  // INIT
  // ─────────────────────────────
  useEffect(() => {
    fetchReminders();

    window.addEventListener("refresh-reminders", fetchReminders);
    return () =>
      window.removeEventListener("refresh-reminders", fetchReminders);
  }, []);

  // ─────────────────────────────
  // FILTER + SORT
  // ─────────────────────────────
  const filteredReminders = useMemo(() => {
    let data = [...reminders];

    data = data.filter((r) => {
      const keyword = search.toLowerCase();

      return (
        r.message?.toLowerCase().includes(keyword) ||
        r.customers?.name?.toLowerCase().includes(keyword) ||
        r.customers?.phone?.toLowerCase().includes(keyword)
      );
    });

    data.sort((a, b) => {
      if (sortAsc) {
        return (a.customers?.name || "").localeCompare(b.customers?.name || "");
      }

      return (b.customers?.name || "").localeCompare(a.customers?.name || "");
    });

    return data;
  }, [reminders, search, sortAsc]);

  // ─────────────────────────────
  // UI
  // ─────────────────────────────
  return (
    <div className="mt-10 border rounded-xl overflow-hidden bg-white">
      {/* HEADER */}
      <div className="p-4 border-b flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">Reminder List</h2>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search reminder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="border px-4 py-2 rounded-lg"
          >
            {sortAsc ? "A-Z" : "Z-A"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">No</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Message</th>
              <th className="p-4">Status</th>
              <th className="p-4">Schedule</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredReminders.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No reminders found.
                </td>
              </tr>
            ) : (
              filteredReminders.map((r, index) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>

                  <td className="p-4 font-medium">
                    {r.customers?.name || "-"}
                  </td>

                  <td className="p-4">{r.customers?.phone || "-"}</td>

                  <td className="p-4">{r.message}</td>

                  <td className="p-4">{r.status}</td>

                  <td className="p-4">
                    {new Date(r.scheduled_at).toLocaleString("id-ID")}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => deleteReminder(r.id)}
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
