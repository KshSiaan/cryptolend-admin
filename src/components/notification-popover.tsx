"use client";

import { useState } from "react";
import { Bell, BookOpen, ShoppingBag, CalendarCheck, X, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type NotificationType = "booking" | "order" | "event";

type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "booking",
    title: "New Course Booking",
    body: "A new student enrolled in Open Water Diver — 2 seats reserved for June 12.",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    type: "order",
    title: "New Order Received",
    body: "Order #4821 placed for BCD + Regulator set. Payment confirmed.",
    time: "18m ago",
    read: false,
  },
  {
    id: 3,
    type: "event",
    title: "Event Booked Successfully",
    body: "Night Dive Experience on June 15 is now fully booked. 12 participants confirmed.",
    time: "1h ago",
    read: false,
  },
  {
    id: 4,
    type: "event",
    title: "Event Booked Successfully",
    body: "Reef Exploration Trip — 3 new participants added. Total 8 confirmed.",
    time: "2h ago",
    read: true,
  },
  {
    id: 5,
    type: "booking",
    title: "New Course Booking",
    body: "Advanced Open Water course has a new booking for July 3 session.",
    time: "3h ago",
    read: true,
  },
  {
    id: 6,
    type: "order",
    title: "New Order Received",
    body: "Order #4819 for Dive Computer + Fins. Awaiting shipment confirmation.",
    time: "5h ago",
    read: true,
  },
  {
    id: 7,
    type: "event",
    title: "Event Booked Successfully",
    body: "Wreck Dive Adventure on June 20 confirmed. Deposit collected from all 6 divers.",
    time: "1d ago",
    read: true,
  },
];

const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; bg: string; iconColor: string }
> = {
  booking: {
    icon: CalendarCheck,
    bg: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-500",
  },
  order: {
    icon: ShoppingBag,
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-500",
  },
  event: {
    icon: BookOpen,
    bg: "bg-violet-50 dark:bg-violet-950/40",
    iconColor: "text-violet-500",
  },
};

export function NotificationPopover() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function clearAll() {
    setNotifications([]);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function deleteOne(id: number) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function markRead(id: number) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full size-9"
        >
          <Bell className="size-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-destructive text-[9px] font-bold text-white flex items-center justify-center leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[380px] p-0 rounded-2xl shadow-2xl border border-border/60 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[15px]">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[11px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 px-2 py-1 rounded-md hover:bg-primary/5 transition-colors"
              >
                <CheckCheck className="size-3.5" />
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-destructive px-2 py-1 rounded-md hover:bg-destructive/5 transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/60 mx-5" />

        {/* List */}
        <div className="max-h-[440px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                <Bell className="size-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  No notifications right now.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-1">
              {notifications.map((n, i) => {
                const cfg = typeConfig[n.type];
                const Icon = cfg.icon;
                return (
                  <div key={n.id}>
                    <button
                      type="button"
                      onClick={() => markRead(n.id)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") markRead(n.id); }}
                      className={cn(
                        "w-full text-left flex items-start gap-3 px-5 py-3.5 group cursor-pointer transition-colors relative",
                        n.read
                          ? "hover:bg-muted/40"
                          : "bg-primary/[0.03] hover:bg-primary/[0.06]"
                      )}
                    >
                      {/* Unread dot */}
                      {!n.read && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-primary" />
                      )}

                      {/* Icon */}
                      <div
                        className={cn(
                          "mt-0.5 shrink-0 size-9 rounded-xl flex items-center justify-center",
                          cfg.bg
                        )}
                      >
                        <Icon className={cn("size-4", cfg.iconColor)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-baseline justify-between gap-2">
                          <span
                            className={cn(
                              "text-sm leading-tight",
                              n.read ? "font-medium text-foreground" : "font-semibold text-foreground"
                            )}
                          >
                            {n.title}
                          </span>
                          <span className="text-[11px] text-muted-foreground shrink-0 whitespace-nowrap">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                          {n.body}
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteOne(n.id);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        aria-label="Dismiss"
                      >
                        <X className="size-3.5" />
                      </button>
                    </button>
                    {i < notifications.length - 1 && (
                      <div className="h-px bg-border/40 mx-5" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <div className="h-px bg-border/60 mx-5" />
            <div className="px-5 py-3">
              <button type="button" className="w-full text-xs text-center text-primary hover:text-primary/80 font-medium py-1 rounded-lg hover:bg-primary/5 transition-colors">
                View all notifications
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
