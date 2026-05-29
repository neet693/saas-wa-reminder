"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);

  async function fetchCustomers() {
    try {
      const res = await fetchWithAuth("/api/customers/list");
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCustomer(id) {
    const ok = confirm("Delete customer?");
    if (!ok) return;

    try {
      await fetchWithAuth(`/api/customers/delete?id=${id}`, {
        method: "DELETE",
      });
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCustomers();

    window.addEventListener("refresh-customers", fetchCustomers);
    return () =>
      window.removeEventListener("refresh-customers", fetchCustomers);
  }, []);

  const filteredCustomers = useMemo(() => {
    let data = [...customers];

    data = data.filter((customer) => {
      const keyword = search.toLowerCase();

      return (
        customer.name?.toLowerCase().includes(keyword) ||
        customer.phone?.toLowerCase().includes(keyword)
      );
    });

    data.sort((a, b) => {
      if (sortAsc) {
        return a.name.localeCompare(b.name);
      }

      return b.name.localeCompare(a.name);
    });

    return data;
  }, [customers, search, sortAsc]);

  return (
    <div className="mt-10 border rounded-xl overflow-hidden bg-white">
      <div className="p-4 border-b flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">Customer List</h2>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search customer..."
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

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">No</th>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Created</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer, index) => (
                <tr key={customer.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>

                  <td className="p-4 font-medium">{customer.name}</td>

                  <td className="p-4">{customer.phone}</td>

                  <td className="p-4">
                    {new Date(customer.created_at).toLocaleString("id-ID")}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => deleteCustomer(customer.id)}
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
