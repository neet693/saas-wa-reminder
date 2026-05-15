import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">WhatsApp Reminder SaaS</h1>

      <p className="text-zinc-500">Reminder otomatis untuk bisnis kecil</p>

      <div className="flex gap-4">
        <a href="/login" className="bg-black text-white px-4 py-2 rounded">
          Login
        </a>

        <a href="/register" className="border px-4 py-2 rounded">
          Register
        </a>
      </div>
    </div>
  );
}
