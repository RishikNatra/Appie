import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-service";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/lib/notification-service";
import { NotificationType } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const typeFilter = (searchParams.get("type") as NotificationType) || undefined;

  const notifications = await getUserNotifications(user.id, typeFilter);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return NextResponse.json({
    notifications,
    totalCount: notifications.length,
    unreadCount,
  });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (body.markAll) {
    await markAllNotificationsAsRead(user.id);
    return NextResponse.json({ success: true, message: "All notifications marked as read" });
  }

  if (body.notificationId) {
    await markNotificationAsRead(body.notificationId);
    return NextResponse.json({ success: true, message: "Notification marked as read" });
  }

  return NextResponse.json({ error: "notificationId or markAll required" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Notification id required" }, { status: 400 });
  }

  await deleteNotification(id);
  return NextResponse.json({ success: true, message: "Notification deleted" });
}

