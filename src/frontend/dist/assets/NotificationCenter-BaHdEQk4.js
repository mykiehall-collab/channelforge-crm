import { bs as useNotifications, r as reactExports, j as jsxRuntimeExports, a0 as Bell, o as Badge, m as Button, J as CircleCheck, bt as BellOff, bu as NotificationType, a as useNavigate, af as formatDate, an as timeAgo, E as ExternalLink, aC as Trash2, T as TriangleAlert, aa as CircleX, B as Building2, bv as Star } from "./index-DvFvlUBj.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
const TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "workspace", label: "Workspace" },
  { key: "deals", label: "Deals" },
  { key: "engagement", label: "Engagement Alerts" }
];
const PAGE_SIZE = 10;
function typeMatchesTab(type, tab) {
  if (tab === "all") return true;
  if (tab === "unread") return false;
  if (tab === "engagement") return type === "EngagementGapAlert";
  if (tab === "workspace")
    return type === NotificationType.WorkspaceActivated || type === NotificationType.TierAssigned;
  if (tab === "deals")
    return type === NotificationType.DealApproved || type === NotificationType.DealRejected || type === NotificationType.DuplicateDRFlagged || type === NotificationType.DuplicateDRReviewed;
  return true;
}
function NotifTypeIcon({
  type
}) {
  if (type === "EngagementGapAlert")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
        style: { background: "rgba(249,115,22,0.12)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16, style: { color: "#f97316" } })
      }
    );
  if (type === NotificationType.DealApproved)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16, className: "text-green-400" }) });
  if (type === NotificationType.DealRejected)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 16, className: "text-red-400" }) });
  if (type === NotificationType.WorkspaceActivated)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 16, className: "text-primary" }) });
  if (type === NotificationType.TierAssigned || type === NotificationType.DuplicateDRFlagged || type === NotificationType.DuplicateDRReviewed)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 16, className: "text-yellow-400" }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 16, className: "text-muted-foreground" }) });
}
function parseGapMeta(notif) {
  if (notif.notificationType !== "EngagementGapAlert") return null;
  const dayMatch = notif.message.match(/(\d+)\s*day/i);
  const daysInactive = dayMatch ? Number.parseInt(dayMatch[1], 10) : 0;
  const isCritical = /critical/i.test(notif.title + notif.message);
  const isHigh = /high/i.test(notif.title + notif.message);
  return {
    entityName: notif.entityId ?? "",
    daysInactive,
    severity: isCritical ? "Critical" : isHigh ? "High" : null
  };
}
function entityRoute(notif) {
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
  onDelete
}) {
  const navigate = useNavigate();
  const route = notif.notificationType === "EngagementGapAlert" ? `/accounts/${notif.entityId}` : entityRoute(notif);
  const [hoverDate, setHoverDate] = reactExports.useState(false);
  const isEngagementGap = notif.notificationType === "EngagementGapAlert";
  const gapMeta = parseGapMeta(notif);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `notification_center.card.${notif.id}`,
      className: `relative rounded-xl border ${isEngagementGap ? "border-orange-500/30 bg-orange-500/5" : !notif.isRead ? "border-primary/30 bg-primary/5" : "border-border bg-card"} px-4 py-4 flex items-start gap-4 transition-colors`,
      children: [
        (isEngagementGap || !notif.isRead) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "absolute left-0 top-3 bottom-3 w-0.5 rounded-full",
            style: { background: isEngagementGap ? "#f97316" : "#FF6B2B" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NotifTypeIcon, { type: notif.notificationType }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground leading-snug", children: notif.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
              isEngagementGap && (gapMeta == null ? void 0 : gapMeta.severity) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  "data-ocid": `notification_center.severity.${notif.id}`,
                  className: "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide",
                  style: gapMeta.severity === "Critical" ? {
                    background: "rgba(239,68,68,0.15)",
                    color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.3)"
                  } : {
                    background: "rgba(251,146,60,0.15)",
                    color: "#fb923c",
                    border: "1px solid rgba(251,146,60,0.3)"
                  },
                  children: gapMeta.severity
                }
              ),
              !notif.isRead && !isEngagementGap && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "text-[9px] px-1.5 py-0.5",
                  style: {
                    background: "#FF6B2B22",
                    color: "#FF6B2B",
                    border: "1px solid #FF6B2B44"
                  },
                  children: "Unread"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 break-words leading-relaxed", children: notif.message }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mt-2 cursor-default",
              onMouseEnter: () => setHoverDate(true),
              onMouseLeave: () => setHoverDate(false),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground/70", children: hoverDate ? formatDate(notif.createdAt) : timeAgo(notif.createdAt) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
          route && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              "data-ocid": `notification_center.view.button.${notif.id}`,
              className: "h-7 px-2 text-[11px] flex items-center gap-1",
              style: isEngagementGap ? { color: "#f97316" } : { color: "" },
              "aria-label": isEngagementGap ? "View Account" : "View",
              onClick: () => navigate({ to: route }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 13 }),
                isEngagementGap ? "View Account" : ""
              ]
            }
          ),
          !notif.isRead && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              "data-ocid": `notification_center.mark_read.button.${notif.id}`,
              className: "h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground",
              onClick: () => onMarkRead(notif.id),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13, className: "mr-1" }),
                "Read"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              "data-ocid": `notification_center.delete.button.${notif.id}`,
              className: "h-7 w-7 p-0 text-muted-foreground hover:text-red-400",
              "aria-label": "Delete notification",
              onClick: () => onDelete(notif.id),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
            }
          )
        ] })
      ]
    }
  );
}
function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markRead,
    deleteNotification,
    markAllRead,
    loading
  } = useNotifications();
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [visibleCount, setVisibleCount] = reactExports.useState(PAGE_SIZE);
  const filtered = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    return typeMatchesTab(
      n.notificationType,
      activeTab
    );
  });
  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "notification_center.page",
      className: "max-w-3xl mx-auto px-4 py-6 space-y-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 20, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display", children: "Notification Center" }),
            unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                "data-ocid": "notification_center.unread_badge",
                className: "text-xs px-2 py-0.5",
                style: { background: "#FF6B2B", color: "#fff" },
                children: [
                  unreadCount,
                  " unread"
                ]
              }
            )
          ] }),
          unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              "data-ocid": "notification_center.mark_all_read.button",
              className: "text-xs border-border",
              onClick: () => markAllRead(),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13, className: "mr-1.5" }),
                "Mark all as read"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "notification_center.filter.tabs",
            className: "flex gap-1 border-b border-border",
            children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": `notification_center.tab.${tab.key}`,
                onClick: () => {
                  setActiveTab(tab.key);
                  setVisibleCount(PAGE_SIZE);
                },
                className: `px-3 py-2 text-xs font-medium transition-colors relative ${activeTab === tab.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                children: [
                  tab.label,
                  tab.key === "unread" && unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white",
                      style: { background: "#FF6B2B" },
                      children: unreadCount > 9 ? "9+" : unreadCount
                    }
                  ),
                  activeTab === tab.key && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute inset-x-0 -bottom-px h-0.5 rounded-full",
                      style: { background: "#FF6B2B" }
                    }
                  )
                ]
              },
              tab.key
            ))
          }
        ),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "notification_center.loading_state",
            className: "space-y-3",
            children: ["n1", "n2", "n3", "n4"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-start gap-4 p-4 rounded-xl border border-border",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-lg" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
                  ] })
                ]
              },
              id
            ))
          }
        ) : visible.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "notification_center.empty_state",
            className: "flex flex-col items-center gap-4 py-16 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { size: 24, className: "text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: activeTab === "unread" ? "All caught up" : "No notifications" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: activeTab === "unread" ? "You have no unread notifications." : "Notifications will appear here." })
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          visible.map((notif) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            NotifCard,
            {
              notif,
              onMarkRead: markRead,
              onDelete: deleteNotification
            },
            notif.id
          )),
          hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              "data-ocid": "notification_center.load_more.button",
              className: "text-xs",
              onClick: () => setVisibleCount((c) => c + PAGE_SIZE),
              children: [
                "Load more (",
                filtered.length - visibleCount,
                " remaining)"
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
export {
  NotificationCenter
};
