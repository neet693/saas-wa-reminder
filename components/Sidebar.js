"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

const menus = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "🏠",
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: "👥",
  },
  {
    name: "Reminders",
    href: "/dashboard/reminders",
    icon: "⏰",
  },
  {
    name: "WhatsApp",
    href: "/dashboard/whatsapp",
    icon: "💬",
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: "💵",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  return (
    <aside
      className={`min-h-screen bg-zinc-900 text-white p-4 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        {!collapsed && <h1 className="text-2xl font-bold">WA SaaS</h1>}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-zinc-800 hover:bg-zinc-700 transition px-3 py-2 rounded-lg"
        >
          ☰
        </button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menus.map((menu) => {
          const active = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                active ? "bg-white text-black" : "hover:bg-zinc-800"
              }`}
            >
              <span className="text-lg">{menu.icon}</span>

              {!collapsed && <span>{menu.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="mt-auto pt-6 border-t border-zinc-800">
        {user && (
          <div className="space-y-3">
            {!collapsed && (
              <div>
                <p className="text-sm text-zinc-400">Logged in as</p>

                <p className="text-sm font-medium break-all">{user.email}</p>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm"
            >
              {collapsed ? "↩" : "Logout"}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
