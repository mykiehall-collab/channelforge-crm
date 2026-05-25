import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BellOff,
  Building2,
  CheckCircle2,
  Star,
  XCircle,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { NotificationType } from "../backend";
import type { InAppNotification } from "../backend.d";
import { useNotifications } from "../hooks/useNotifications";
import { timeAgo } from "../utils/channelforge";

function NotifIcon({ type }: { type: NotificationType }) {
  if (type === NotificationType.DealApproved)
    return <CheckCircle2 size={15} className="text-green-400 flex-shrink-0" />;
  if (type === NotificationType.DealRejected)
    return <XCircle size={15} className="text-red-400 flex-shrink-0" />;
  if (type === NotificationType.WorkspaceActivated)
    return <Building2 size={15} className="text-primary flex-shrink-0" />;
  if (
    type === NotificationType.TierAssigned ||
    type === NotificationType.DuplicateDRFlagged ||
    type === NotificationType.DuplicateDRReviewed
  )
    return <Star size={15} className="text-yellow-400 flex-shrink-0" />;
  return <Bell size={15} className="text-muted-foreground flex-shrink-0" />;
}

function entityRoute(notif: InAppNotification): string | null {
  if (!notif.entityId) return null;
  const t = notif.entityType;
  if (t === "deal" || t === "DealRegistration") return "/deal-registrations";
  if (t === "reseller" || t === "CompanyProfile")
    return `/reseller/${notif.entityId}`;
  return null;
}

export function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const recent = notifications.slice(0, 5);

  async function handleNotifClick(notif: InAppNotification) {
    setOpen(false);
    if (!notif.isRead) await markRead(notif.id);
    const route = entityRoute(notif);
    if (route) navigate({ to: route as Parameters<typeof navigate>[0]["to"] });
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      data-ocid="notifications.bell_wrapper"
    >
      {/* Bell trigger */}
      <button
        type="button"
        data-ocid="notifications.bell.button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
        className="relative w-9 h-9 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bell size={15} />
        {unreadCount > 0 && (
          <span
            data-ocid="notifications.unread_badge"
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse"
            style={{ background: "#FF6B2B" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          data-ocid="notifications.bell.popover"
          className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-border bg-card shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">
                Notifications
              </p>
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                  style={{ background: "#FF6B2B22", color: "#FF6B2B" }}
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                data-ocid="notifications.mark_all_read.button"
                onClick={() => markAllRead()}
                className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification rows */}
          <ScrollArea className="max-h-72">
            {recent.length === 0 ? (
              <div
                data-ocid="notifications.empty_state"
                className="flex flex-col items-center gap-2 py-8"
              >
                <BellOff size={20} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No notifications
                </p>
                <p className="text-xs text-muted-foreground/60">
                  You&apos;re all caught up
                </p>
              </div>
            ) : (
              recent.map((notif, i) => (
                <button
                  key={notif.id}
                  type="button"
                  data-ocid={`notifications.item.${i + 1}`}
                  onClick={() => handleNotifClick(notif)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-secondary/30 transition-colors border-b border-border/40 last:border-0 ${
                    !notif.isRead ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="mt-0.5">
                    <NotifIcon type={notif.notificationType} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground leading-snug truncate">
                      {notif.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 break-words">
                      {notif.message.slice(0, 60)}
                      {notif.message.length > 60 ? "…" : ""}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                      style={{ background: "#FF6B2B" }}
                    />
                  )}
                </button>
              ))
            )}
          </ScrollArea>

          {/* Footer */}
          <Separator />
          <div className="px-4 py-2.5">
            <Button
              variant="ghost"
              size="sm"
              data-ocid="notifications.view_all.link"
              className="w-full text-xs h-7"
              style={{ color: "#FF6B2B" }}
              onClick={() => {
                setOpen(false);
                navigate({ to: "/notifications" });
              }}
            >
              View all notifications
              {notifications.length > 5 && (
                <span className="ml-1 text-muted-foreground">
                  ({notifications.length})
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
