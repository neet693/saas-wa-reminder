"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
  },
  {
    name: "Reminders",
    href: "/dashboard/reminders",
  },
  {
    name: "WhatsApp",
    href: "/dashboard/whatsapp",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">WA SaaS</h1>

      <nav className="flex flex-col gap-2">
        {menus.map((menu) => {
          const active = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`px-4 py-3 rounded-lg transition ${
                active ? "bg-white text-black" : "hover:bg-zinc-800"
              }`}
            >
              {menu.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
