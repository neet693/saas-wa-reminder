import { supabaseAdmin } from "./supabaseAdmin";

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    customers: 30,
    reminders: 30,
    devices: 1,
  },
  starter: {
    name: "Starter",
    price: 49000,
    customers: 150,
    reminders: 300,
    devices: 1,
  },
  pro: {
    name: "Pro",
    price: 129000,
    customers: 500,
    reminders: 1000,
    devices: 2,
  },
};

export async function getUserPlan(userId) {
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("plan, status, expired_at")
    .eq("user_id", userId)
    .single();

  // Belum ada subscription → free
  if (!data) return "free";

  // Expired → free
  if (data.expired_at && new Date(data.expired_at) < new Date()) return "free";

  // Pending → free dulu sampai dikonfirmasi
  if (data.status !== "active") return "free";

  return data.plan;
}

// export async function getPlanLimits(userId) {
//   const plan = await getUserPlan(userId);
//   return { plan, ...PLANS[plan] };
// }

export async function getPlanLimits(userId) {
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select(
      `
      plan,
      status,
      expired_at,
      max_customers,
      max_reminders
    `,
    )
    .eq("user_id", userId)
    .single();

  // Default free
  if (!data) {
    return {
      plan: "free",
      ...PLANS.free,
    };
  }

  // Expired / inactive
  if (
    data.status !== "active" ||
    (data.expired_at && new Date(data.expired_at) < new Date())
  ) {
    return {
      plan: "free",
      ...PLANS.free,
    };
  }

  const defaultPlan = PLANS[data.plan] || PLANS.free;

  return {
    plan: data.plan,

    // Ambil dari DB kalau ada
    customers: data.max_customers ?? defaultPlan.customers,
    reminders: data.max_reminders ?? defaultPlan.reminders,

    // Sisanya dari default plan
    devices: defaultPlan.devices,
    price: defaultPlan.price,
    name: defaultPlan.name,
  };
}

export async function checkCustomerLimit(userId) {
  const { plan, customers: limit } = await getPlanLimits(userId);

  const { count } = await supabaseAdmin
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return {
    allowed: count < limit,
    current: count,
    limit,
    plan,
  };
}

export async function checkReminderLimit(userId) {
  const { plan, reminders: limit } = await getPlanLimits(userId);

  // Hitung reminder bulan ini
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabaseAdmin
    .from("reminders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  return {
    allowed: count < limit,
    current: count,
    limit,
    plan,
  };
}
