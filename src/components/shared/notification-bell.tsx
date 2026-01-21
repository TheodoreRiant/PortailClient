"use client";

import { useState, useEffect } from "react";
import { Bell, Package, FileText, CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Notification, NotificationType } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const notificationIcons: Record<NotificationType, typeof Bell> = {
  nouveau_livrable: Package,
  validation: CheckCircle,
  nouvelle_facture: FileText,
  rappel_paiement: FileText,
  projet_termine: CheckCircle,
  commentaire: MessageCircle,
};

const notificationColors: Record<NotificationType, string> = {
  nouveau_livrable: "text-blue-500 bg-blue-100",
  validation: "text-green-500 bg-green-100",
  nouvelle_facture: "text-purple-500 bg-purple-100",
  rappel_paiement: "text-orange-500 bg-orange-100",
  projet_termine: "text-green-500 bg-green-100",
  commentaire: "text-gray-500 bg-gray-100",
};

function NotificationItem({ notification }: { notification: Notification }) {
  const Icon = notificationIcons[notification.type] || Bell;
  const colorClass = notificationColors[notification.type] || "text-gray-500 bg-gray-100";

  const content = (
    <div
      className={cn(
        "flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors rounded-lg",
        !notification.lu && "bg-blue-50/50"
      )}
    >
      <div className={cn("p-2 rounded-full", colorClass)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {notification.titre}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {formatDistanceToNow(new Date(notification.date), {
            addSuffix: true,
            locale: fr,
          })}
        </p>
      </div>
      {!notification.lu && (
        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
      )}
    </div>
  );

  if (notification.lien) {
    return <Link href={notification.lien}>{content}</Link>;
  }

  return content;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Fetch notifications on mount
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-read", { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, lu: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary-600 hover:text-primary-700"
              onClick={markAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Bell className="w-8 h-8 mb-2 text-gray-300" />
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationBell;
