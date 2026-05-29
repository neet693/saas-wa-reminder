import Image from "next/image";
import { ArrowRight, BellRing, MessageCircle, Repeat } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Navbar */}
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-green-500 p-2 text-white">
              <MessageCircle size={18} />
            </div>

            <h1 className="text-lg font-semibold">WA Reminder</h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="text-sm font-medium text-zinc-600 hover:text-black"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
            >
              Start Free
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-2">
        {/* Left */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
            <BellRing size={16} />
            WhatsApp Reminder Automation
          </div>

          <h2 className="text-5xl font-bold leading-tight tracking-tight">
            Reminder otomatis lewat WhatsApp.
          </h2>

          <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-600">
            Bantu bisnis dan aktivitas harian tetap teratur dengan reminder
            WhatsApp otomatis yang simpel dan cepat.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/register"
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-green-600"
            >
              Mulai Gratis
              <ArrowRight size={18} />
            </a>

            <a
              href="/login"
              className="rounded-2xl border border-zinc-300 px-6 py-4 text-center text-sm font-semibold transition hover:bg-zinc-100"
            >
              Login Dashboard
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-zinc-500">
            <div>✓ Reminder otomatis</div>
            <div>✓ Repeat schedule</div>
            <div>✓ WhatsApp integration</div>
          </div>
        </div>

        {/* Right Mockup */}
        <div className="relative">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-green-100 blur-3xl" />

          <div className="relative rounded-4xl border border-zinc-200 bg-zinc-950 p-4 shadow-2xl">
            <div className="rounded-3xl bg-[#ECE5DD] p-4">
              <div className="mb-4 rounded-2xl rounded-tl-sm bg-white p-4 text-sm shadow">
                ⏰ Reminder meeting jam 3 sore
              </div>

              <div className="mb-4 ml-auto w-fit rounded-2xl rounded-tr-sm bg-[#DCF8C6] p-4 text-sm shadow">
                Siap 👍
              </div>

              <div className="mb-4 rounded-2xl rounded-tl-sm bg-white p-4 text-sm shadow">
                💳 Tagihan customer jatuh tempo besok
              </div>

              <div className="rounded-2xl rounded-tl-sm bg-white p-4 text-sm shadow">
                🔁 Reminder mingguan berhasil dikirim
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-20 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <BellRing className="mb-5 text-green-500" size={28} />

            <h3 className="text-xl font-semibold">Auto Reminder</h3>

            <p className="mt-3 leading-7 text-zinc-600">
              Kirim reminder otomatis sesuai jadwal.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <Repeat className="mb-5 text-green-500" size={28} />

            <h3 className="text-xl font-semibold">Repeat Schedule</h3>

            <p className="mt-3 leading-7 text-zinc-600">
              Support harian, mingguan, dan bulanan.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <MessageCircle className="mb-5 text-green-500" size={28} />

            <h3 className="text-xl font-semibold">WhatsApp Integration</h3>

            <p className="mt-3 leading-7 text-zinc-600">
              Reminder langsung terkirim ke WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
