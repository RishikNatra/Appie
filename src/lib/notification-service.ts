import { createClient } from "./supabase/server";
import { UserNotification, NotificationType, NotificationPriority, LiveTrackingSummary } from "./types";

const inMemoryNotifications = new Map<string, UserNotification>();

// Seed sample notifications
const sampleNotif1 = "notif-demo-1";
inMemoryNotifications.set(sampleNotif1, {
  id: sampleNotif1,
  userId: "patient-demo-user",
  type: "consultation",
  title: "Upcoming Consultation in 24 Hours",
  message: "Your teleconsultation with Dr. Priya Sharma is scheduled for tomorrow at 10:30 AM.",
  linkUrl: "/consultations",
  isRead: false,
  priority: "high",
  createdAt: new Date(Date.now() - 3600000).toISOString(),
});

const sampleNotif2 = "notif-demo-2";
inMemoryNotifications.set(sampleNotif2, {
  id: sampleNotif2,
  userId: "patient-demo-user",
  type: "order",
  title: "Pharmacy Order Dispatched",
  message: "Your medicine order #ORD-2026-78421 has been handed over to BlueDart. Track delivery in real time.",
  linkUrl: "/orders",
  isRead: false,
  priority: "normal",
  createdAt: new Date(Date.now() - 7200000).toISOString(),
});

const sampleNotif3 = "notif-demo-3";
inMemoryNotifications.set(sampleNotif3, {
  id: sampleNotif3,
  userId: "patient-demo-user",
  type: "prescription",
  title: "New E-Prescription Issued",
  message: "Dr. Priya Sharma issued a digitally signed e-prescription #RX-2026-8812A.",
  linkUrl: "/prescriptions",
  isRead: true,
  priority: "normal",
  createdAt: new Date(Date.now() - 14400000).toISOString(),
});

export async function sendNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  priority?: NotificationPriority;
}): Promise<UserNotification> {
  const notifId = "notif-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
  const notif: UserNotification = {
    id: notifId,
    userId: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    linkUrl: params.linkUrl,
    isRead: false,
    priority: params.priority || "normal",
    createdAt: new Date().toISOString(),
  };

  try {
    const supabase = await createClient();
    await supabase.from("user_notifications").insert({
      id: notifId,
      user_id: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      link_url: params.linkUrl,
      is_read: false,
      priority: notif.priority,
    });
  } catch (err) {
    console.warn("Supabase notification insert warning:", err);
  }

  inMemoryNotifications.set(notifId, notif);
  return notif;
}

export async function getUserNotifications(
  userId: string,
  typeFilter?: NotificationType
): Promise<UserNotification[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("user_notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (typeFilter) {
      query = query.eq("type", typeFilter);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        userId: d.user_id,
        type: d.type as NotificationType,
        title: d.title,
        message: d.message,
        linkUrl: d.link_url,
        isRead: d.is_read,
        priority: d.priority as NotificationPriority,
        createdAt: d.created_at,
      }));
    }
  } catch (err) {
    // fallback
  }

  const results: UserNotification[] = [];
  for (const n of inMemoryNotifications.values()) {
    if (n.userId === userId || userId.includes("demo") || n.userId.includes("demo")) {
      if (!typeFilter || n.type === typeFilter) {
        results.push(n);
      }
    }
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationAsRead(notifId: string): Promise<void> {
  const n = inMemoryNotifications.get(notifId);
  if (n) n.isRead = true;

  try {
    const supabase = await createClient();
    await supabase.from("user_notifications").update({ is_read: true }).eq("id", notifId);
  } catch (err) {
    // fallback
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  for (const n of inMemoryNotifications.values()) {
    if (n.userId === userId || userId.includes("demo")) {
      n.isRead = true;
    }
  }

  try {
    const supabase = await createClient();
    await supabase.from("user_notifications").update({ is_read: true }).eq("user_id", userId);
  } catch (err) {
    // fallback
  }
}

export async function deleteNotification(notifId: string): Promise<void> {
  inMemoryNotifications.delete(notifId);

  try {
    const supabase = await createClient();
    await supabase.from("user_notifications").delete().eq("id", notifId);
  } catch (err) {
    // fallback
  }
}

