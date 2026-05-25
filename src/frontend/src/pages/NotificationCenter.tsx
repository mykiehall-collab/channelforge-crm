import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  BellOff,
  Building2,
  CheckCircle2,
  ExternalLink,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { NotificationType } from "../backend";
import type { InAppNotification } from "../backend.d";
import { useNotifications } from "../hooks/useNotifications";
import { formatDate, timeAgo } from "../utils/channelforge";

type FilterTab = "all" | "unread" | "workspace" | "deals" | "engagement";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "workspace", label: "Workspace" },
  { key: "deals", label: "Deals" },
  { key: "engagement", label: "Engagement Alerts" },
];

const PAGE_SIZE = 10;

function typeMatchesTab(
  type: NotificationType | "EngagementGapAlert",
  tab: FilterTab,
): boolean {
  if (tab === "all") return true;
  if (tab === "unread") return false; // handled separately
  if (tab === "engagement") return type === "EngagementGapAlert";
  if (tab === "workspace")
    return (
      type === NotificationType.WorkspaceActivated ||
      type === NotificationType.TierAssigned
    );
  if (tab === "deals")
    return (
      type === NotificationType.DealApproved ||
      type === NotificationType.DealRejected ||
      type === NotificationType.DuplicateDRFlagged ||
      type === NotificationType.DuplicateDRReviewed
    );
  return true;
}

function NotifTypeIcon({
  type,
}: { type: NotificationType | "EngagementGapAlert" }) {
  if (type === "EngagementGapAlert")
    return (
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(249,115,22,0.12)" }}
      >
        <AlertTriangle size={16} style={{ color: "#f97316" }} />
      </div>
    );
  if (type === NotificationType.DealApproved)
    return (
      <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 size={16} className="text-green-400" />
      </div>
    );
  if (type === NotificationType.DealRejected)
    return (
      <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
        <XCircle size={16} className="text-red-400" />
      </div>
    );
  if (type === NotificationType.WorkspaceActivated)
    return (
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Building2 size={16} className="text-primary" />
      </div>
    );
  if (
    type === NotificationType.TierAssigned ||
    type === NotificationType.DuplicateDRFlagged ||
    type === NotificationType.DuplicateDRReviewed
  )
    return (
      <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
        <Star size={16} className="text-yellow-400" />
      </div>
    );
  return (
    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
      <Bell size={16} className="text-muted-foreground" />
    </div>
  );
}

// Parse engagement gap metadata from the notification message/title
function parseGapMeta(notif: InAppNotification): {
  entityName: string;
  daysInactive: number;
  severity: "Critical" | "High" | null;
} | null {
  if ((notif.notificationType as string) !== "EngagementGapAlert") return null;
  const dayMatch = notif.message.match(/(\d+)\s*day/i);
  const daysInactive = dayMatch ? Number.parseInt(dayMatch[1], 10) : 0;
  const isCritical = /critical/i.test(notif.title + notif.message);
  const isHigh = /high/i.test(notif.title + notif.message);
  return {
    entityName: notif.entityId ?? "",
    daysInactive,
    severity: isCritical ? "Critical" : isHigh ? "High" : null,
  };
}

function entityRoute(notif: InAppNotification): string | null {
  if (!notif.entityId) return null;
  const t = notif.entityType;
  if (t === "deal" || t === "DealRegistration") return "/deal-registrations";
  if (t === "reseller" || t === "CompanyProfile")
    return `/reseller/${notif.entityId}`;
  return null;
}

function NotifCard({
  notif,
  onMarkRead,
  onDelete,
}: {
  notif: InAppNotification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const navigate = useNavigate();
  const route =
    (notif.notificationType as string) === "EngagementGapAlert"
      ? `/accounts/${notif.entityId}`
      : entityRoute(notif);
  const [hoverDate, setHoverDate] = useState(false);

  const isEngagementGap =
    (notif.notificationType as string) === "EngagementGapAlert";
  const gapMeta = parseGapMeta(notif);

  return (
    <div
      data-ocid={`notification_center.card.${notif.id}`}
      className={`relative rounded-xl border ${
        isEngagementGap
          ? "border-orange-500/30 bg-orange-500/5"
          : !notif.isRead
            ? "border-primary/30 bg-primary/5"
            : "border-border bg-card"
      } px-4 py-4 flex items-start gap-4 transition-colors`}
    >
      {/* Left border stripe — orange for gap alerts, primary for unread */}
      {(isEngagementGap || !notif.isRead) && (
        <span
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
          style={{ background: isEngagementGap ? "#f97316" : "#FF6B2B" }}
        />
      )}

      <NotifTypeIcon type={notif.notificationType} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <p className="text-sm font-semibold text-foreground leading-snug">
            {notif.title}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isEngagementGap && gapMeta?.severity && (
              <span
                data-ocid={`notification_center.severity.${notif.id}`}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
                style={
                  gapMeta.severity === "Critical"
                    ? {
                        background: "rgba(239,68,68,0.15)",
                        color: "#f87171",
                        border: "1px solid rgba(239,68,68,0.3)",
                      }
                    : {
                        background: "rgba(251,146,60,0.15)",
                        color: "#fb923c",
                        border: "1px solid rgba(251,146,60,0.3)",
                      }
                }
              >
                {gapMeta.severity}
              </span>
            )}
            {!notif.isRead && !isEngagementGap && (
              <Badge
                className="text-[9px] px-1.5 py-0.5"
                style={{
                  background: "#FF6B2B22",
                  color: "#FF6B2B",
                  border: "1px solid #FF6B2B44",
                }}
              >
                Unread
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 break-words leading-relaxed">
          {notif.message}
        </p>
        <div
          className="mt-2 cursor-default"
          onMouseEnter={() => setHoverDate(true)}
          onMouseLeave={() => setHoverDate(false)}
        >
          <span className="text-[11px] text-muted-foreground/70">
            {hoverDate ? formatDate(notif.createdAt) : timeAgo(notif.createdAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {route && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-ocid={`notification_center.view.button.${notif.id}`}
            className="h-7 px-2 text-[11px] flex items-center gap-1"
            style={isEngagementGap ? { color: "#f97316" } : { color: "" }}
            aria-label={isEngagementGap ? "View Account" : "View"}
            onClick={() =>
              navigate({ to: route as Parameters<typeof navigate>[0]["to"] })
            }
          >
            <ExternalLink size={13} />
            {isEngagementGap ? "View Account" : ""}
          </Button>
        )}
        {!notif.isRead && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-ocid={`notification_center.mark_read.button.${notif.id}`}
            className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
            onClick={() => onMarkRead(notif.id)}
          >
            <CheckCircle2 size={13} className="mr-1" />
            Read
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          data-ocid={`notification_center.delete.button.${notif.id}`}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400"
          aria-label="Delete notification"
          onClick={() => onDelete(notif.id)}
        >
          <Trash2 size={13} />
        </Button>
      </div>
    </div>
  );
}

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markRead,
    deleteNotification,
    markAllRead,
    loading,
  } = useNotifications();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    return typeMatchesTab(
      n.notificationType as NotificationType | "EngagementGapAlert",
      activeTab,
    );
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  return (
    <div
      data-ocid="notification_center.page"
      className="max-w-3xl mx-auto px-4 py-6 space-y-6"
    >
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground font-display">
            Notification Center
          </h1>
          {unreadCount > 0 && (
            <Badge
              data-ocid="notification_center.unread_badge"
              className="text-xs px-2 py-0.5"
              style={{ background: "#FF6B2B", color: "#fff" }}
            >
              {unreadCount} unread
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="notification_center.mark_all_read.button"
            className="text-xs border-border"
            onClick={() => markAllRead()}
          >
            <CheckCircle2 size={13} className="mr-1.5" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div
        data-ocid="notification_center.filter.tabs"
        className="flex gap-1 border-b border-border"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            data-ocid={`notification_center.tab.${tab.key}`}
            onClick={() => {
              setActiveTab(tab.key);
              setVisibleCount(PAGE_SIZE);
            }}
            className={`px-3 py-2 text-xs font-medium transition-colors relative ${
              activeTab === tab.key
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.key === "unread" && unreadCount > 0 && (
              <span
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white"
                style={{ background: "#FF6B2B" }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            {activeTab === tab.key && (
              <span
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full"
                style={{ background: "#FF6B2B" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div
          data-ocid="notification_center.loading_state"
          className="space-y-3"
        >
          {(["n1", "n2", "n3", "n4"] as const).map((id) => (
            <div
              key={id}
              className="flex items-start gap-4 p-4 rounded-xl border border-border"
            >
              <Skeleton className="w-9 h-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div
          data-ocid="notification_center.empty_state"
          className="flex flex-col items-center gap-4 py-16 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <BellOff size={24} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {activeTab === "unread" ? "All caught up" : "No notifications"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeTab === "unread"
                ? "You have no unread notifications."
                : "Notifications will appear here."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((notif) => (
            <NotifCard
              key={notif.id}
              notif={notif}
              onMarkRead={markRead}
              onDelete={deleteNotification}
            />
          ))}

          {hasMore && (
            <div className="pt-2 text-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-ocid="notification_center.load_more.button"
                className="text-xs"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                Load more ({filtered.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
