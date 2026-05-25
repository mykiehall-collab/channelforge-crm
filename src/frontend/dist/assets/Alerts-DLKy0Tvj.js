import { c as createLucideIcon, u as useApp, p as useActor, r as reactExports, aK as AlertSeverity, j as jsxRuntimeExports, m as Button, aL as AlertType, J as CircleCheck, ab as ue, az as Copy, aH as Tag, T as TriangleAlert, a0 as Bell, an as timeAgo, aa as CircleX } from "./index-DvFvlUBj.js";
import { C as CalendarDays } from "./calendar-days-BhEBMHaO.js";
import { T as Timer } from "./timer-DirFeAk4.js";
import { P as Phone } from "./phone-DSozTLzi.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = createLucideIcon("user-x", __iconNode);
const ALERT_CONFIG = {
  [AlertType.RenewalDue]: {
    icon: Bell,
    color: "text-orange-400",
    label: "Renewal Due"
  },
  [AlertType.LeadToCall]: {
    icon: Phone,
    color: "text-green-400",
    label: "Lead to Call"
  },
  [AlertType.CustomerRisk]: {
    icon: TriangleAlert,
    color: "text-red-400",
    label: "Customer Risk"
  },
  [AlertType.MissingContact]: {
    icon: UserX,
    color: "text-yellow-400",
    label: "Missing Contact"
  },
  [AlertType.DealExpiry]: {
    icon: Timer,
    color: "text-orange-400",
    label: "Deal Expiry"
  },
  [AlertType.PromoExpiry]: {
    icon: Tag,
    color: "text-purple-400",
    label: "Promo Expiry"
  },
  [AlertType.BusinessPlanDue]: {
    icon: CalendarDays,
    color: "text-blue-400",
    label: "Business Plan Due"
  },
  [AlertType.DuplicateAccount]: {
    icon: Copy,
    color: "text-red-400",
    label: "Duplicate Account"
  }
};
const SEVERITY_CONFIG = {
  [AlertSeverity.High]: {
    label: "High",
    className: "bg-red-500/20 text-red-300 border-red-500/30"
  },
  [AlertSeverity.Medium]: {
    label: "Medium",
    className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
  },
  [AlertSeverity.Low]: {
    label: "Low",
    className: "bg-green-500/20 text-green-300 border-green-500/30"
  }
};
const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "high", label: "High Priority" },
  { id: AlertType.RenewalDue, label: "Renewals" },
  { id: AlertType.CustomerRisk, label: "Customer Risk" },
  { id: AlertType.DealExpiry, label: "Deal Expiry" },
  { id: AlertType.LeadToCall, label: "Leads" }
];
function Alerts() {
  const { alerts, refreshAlerts } = useApp();
  const { actor } = useActor();
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [dismissingIds, setDismissingIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [markingIds, setMarkingIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [markingAll, setMarkingAll] = reactExports.useState(false);
  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const highCount = alerts.filter(
    (a) => a.severity === AlertSeverity.High
  ).length;
  const todayCount = reactExports.useMemo(() => {
    const start = /* @__PURE__ */ new Date();
    start.setHours(0, 0, 0, 0);
    return alerts.filter((a) => {
      const ms = Number(a.createdAt) / 1e6;
      return ms >= start.getTime();
    }).length;
  }, [alerts]);
  const filtered = reactExports.useMemo(() => {
    switch (activeTab) {
      case "unread":
        return alerts.filter((a) => !a.isRead);
      case "high":
        return alerts.filter((a) => a.severity === AlertSeverity.High);
      case "all":
        return alerts;
      default:
        return alerts.filter((a) => a.alertType === activeTab);
    }
  }, [alerts, activeTab]);
  async function handleMarkRead(id) {
    if (!actor) return;
    setMarkingIds((s) => new Set(s).add(id));
    try {
      await actor.markAlertRead(id);
      await refreshAlerts();
      ue.success("Alert marked as read");
    } catch {
      ue.error("Failed to mark alert as read");
    } finally {
      setMarkingIds((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  }
  async function handleDismiss(id) {
    if (!actor) return;
    setDismissingIds((s) => new Set(s).add(id));
    try {
      await actor.dismissAlert(id);
      await refreshAlerts();
      ue.success("Alert dismissed");
    } catch {
      ue.error("Failed to dismiss alert");
    } finally {
      setDismissingIds((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  }
  async function handleMarkAllRead() {
    if (!actor) return;
    setMarkingAll(true);
    try {
      const unread = alerts.filter((a) => !a.isRead);
      await Promise.all(unread.map((a) => actor.markAlertRead(a.id)));
      await refreshAlerts();
      ue.success(`${unread.length} alerts marked as read`);
    } catch {
      ue.error("Failed to mark all alerts as read");
    } finally {
      setMarkingAll(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-6 fade-in", "data-ocid": "alerts.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Alerts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Monitor and act on important notifications" })
      ] }),
      unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: handleMarkAllRead,
          disabled: markingAll,
          className: "border-border text-foreground hover:bg-card",
          "data-ocid": "alerts.mark_all_read_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-4 h-4 mr-2" }),
            markingAll ? "Marking…" : "Mark all read"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-3 gap-4",
        "data-ocid": "alerts.summary_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-4 flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Unread" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold font-display text-foreground", children: unreadCount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-4 flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "High Priority" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold font-display text-red-400", children: highCount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-4 flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Today" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold font-display text-foreground", children: todayCount })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-1 border-b border-border overflow-x-auto scrollbar-thin pb-0",
        "data-ocid": "alerts.filter_tabs",
        children: FILTER_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab(tab.id),
            "data-ocid": `alerts.${tab.id}.tab`,
            className: `px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === tab.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`,
            children: [
              tab.label,
              tab.id === "unread" && unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 bg-accent/20 text-accent text-xs px-1.5 py-0.5 rounded-full", children: unreadCount })
            ]
          },
          tab.id
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", "data-ocid": "alerts.list", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crm-card flex flex-col items-center justify-center py-16 gap-3 text-center",
        "data-ocid": "alerts.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-12 h-12 text-green-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground", children: "No active alerts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "You're all caught up!" })
        ]
      }
    ) : filtered.map((alert, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertRow,
      {
        alert,
        index: idx + 1,
        isMarking: markingIds.has(alert.id),
        isDismissing: dismissingIds.has(alert.id),
        onMarkRead: handleMarkRead,
        onDismiss: handleDismiss
      },
      alert.id
    )) })
  ] });
}
function AlertRow({
  alert,
  index,
  isMarking,
  isDismissing,
  onMarkRead,
  onDismiss
}) {
  const config = ALERT_CONFIG[alert.alertType] ?? ALERT_CONFIG[AlertType.RenewalDue];
  const Icon = config.icon;
  const severity = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG[AlertSeverity.Low];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `alerts.item.${index}`,
      className: `crm-card p-4 flex items-start gap-4 transition-opacity ${alert.isRead ? "opacity-60" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-card border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${config.color}` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: config.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${severity.className}`,
                children: severity.label
              }
            ),
            !alert.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-accent flex-shrink-0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mt-1 break-words", children: alert.message }),
          alert.accountId && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
            "Account: ",
            alert.accountId
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: timeAgo(alert.createdAt) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-shrink-0 ml-auto", children: [
          !alert.isRead && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: () => onMarkRead(alert.id),
              disabled: isMarking,
              "data-ocid": `alerts.mark_read_button.${index}`,
              className: "text-xs text-muted-foreground hover:text-foreground h-7",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-3.5 h-3.5 mr-1" }),
                isMarking ? "…" : "Mark read"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: () => onDismiss(alert.id),
              disabled: isDismissing,
              "data-ocid": `alerts.dismiss_button.${index}`,
              className: "text-xs text-muted-foreground hover:text-red-400 h-7",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 mr-1" }),
                isDismissing ? "…" : "Dismiss"
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  Alerts
};
