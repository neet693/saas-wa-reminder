import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import fs from "fs";

const g = global;

if (!g._waState) {
  g._waState = {
    sock: null,
    isConnecting: false,
    status: "close",
    lastQR: null,
    instanceId: null,
  };
}

const state = g._waState;

export async function startWhatsApp() {
  if (state.isConnecting) return;
  if (state.sock && state.status === "open") return state.sock;

  state.isConnecting = true;

  const myId = Date.now().toString();
  state.instanceId = myId;

  const { state: authState, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: authState,
    printQRInTerminal: false,
    markOnlineOnConnect: false,
    syncFullHistory: false,
  });

  state.sock = sock;

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    if (state.instanceId !== myId) return;

    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      state.lastQR = qr;
      state.status = "qr";
    }

    if (connection === "open") {
      console.log("✅ WA CONNECTED");
      state.status = "open";
      state.lastQR = null;
      state.isConnecting = false;
    }

    if (connection === "close") {
      state.status = "close";
      state.isConnecting = false;
      state.lastQR = null;
      state.sock = null;

      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const reason = lastDisconnect?.error?.message || "";
      console.log("❌ WA CLOSED, code:", statusCode, reason);

      if (
        statusCode === DisconnectReason.loggedOut ||
        reason.includes("conflict")
      ) {
        console.log("⛔ Tidak reconnect:", reason || "logged out");

        // Kalau logout dari HP, hapus auth dan siapkan QR baru
        if (statusCode === DisconnectReason.loggedOut) {
          deleteAuthFolder();
          await new Promise((r) => setTimeout(r, 1000));
          startWhatsApp(); // restart untuk tampilkan QR baru
        }
        return;
      }

      console.log("🔄 Reconnecting...");
      await new Promise((r) => setTimeout(r, 3000));

      if (state.instanceId === myId && state.status === "close") {
        startWhatsApp();
      }
    }
  });

  state.isConnecting = false;
  return sock;
}

function deleteAuthFolder() {
  try {
    if (fs.existsSync("auth")) {
      fs.rmSync("auth", { recursive: true, force: true });
      console.log("🗑️ Auth folder deleted");
    }
  } catch (err) {
    console.error("Gagal hapus auth folder:", err.message);
  }
}

export async function disconnectWhatsApp() {
  // Tandai instance ini tidak perlu reconnect
  state.instanceId = null;

  if (state.sock) {
    try {
      await state.sock.logout();
    } catch (_) {}
    state.sock = null;
  }

  state.status = "close";
  state.lastQR = null;
  state.isConnecting = false;

  // Hapus auth supaya QR muncul lagi
  deleteAuthFolder();

  // Restart untuk tampilkan QR baru
  await new Promise((r) => setTimeout(r, 1000));
  startWhatsApp();
}

export async function getSock() {
  if (!state.sock) await startWhatsApp();
  return state.sock;
}

export function getQR() {
  return state.lastQR;
}

export function getStatus() {
  return state.status;
}
