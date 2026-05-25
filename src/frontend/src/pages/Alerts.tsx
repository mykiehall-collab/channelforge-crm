import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  Copy,
  Phone,
  Tag,
  Timer,
  UserX,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import { AlertSeverity, AlertType } from "../backend";
import type { Alert } from "../backend";
import { useActor } from "../hooks/useActor";
import { timeAgo } from "../utils/channelforge";

// ─── Alert type config ──────────────────────────────────────────────────────
const ALERT_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    label: string;
  }
> = {
  [AlertType.RenewalDue]: {
    icon: Bell,
    color: "text-orange-400",
    label: "Renewal Due",
  },
  [AlertType.LeadToCall]: {
    icon: Phone,
    color: "text-green-400",
    label: "Lead to Call",
  },
  [AlertType.CustomerRisk]: {
    icon: AlertTriangle,
    color: "text-red-400",
    label: "Customer Risk",
  },
  [AlertType.MissingContact]: {
    icon: UserX,
    color: "text-yellow-400",
    label: "Missing Contact",
  },
  [AlertType.DealExpiry]: {
    icon: Timer,
    color: "text-orange-400",
    label: "Deal Expiry",
  },
  [AlertType.PromoExpiry]: {
    icon: Tag,
    color: "text-purple-400",
    label: "Promo Expiry",
  },
  [AlertType.BusinessPlanDue]: {
    icon: CalendarDays,
    color: "text-blue-400",
    label: "Business Plan Due",
  },
  [AlertType.DuplicateAccount]: {
    icon: Copy,
    color: "text-red-400",
    label: "Duplicate Account",
  },
};

const SEVERITY_CONFIG: Record<string, { label: string; className: string }> = {
  [AlertSeverity.High]: {
    label: "High",
    className: "bg-red-500/20 text-red-300 border-red-500/30",
  },
  [AlertSeverity.Medium]: {
    label: "Medium",
    className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  [AlertSeverity.Low]: {
    label: "Low",
    className: "bg-green-500/20 text-green-300 border-green-500/30",
  },
};

type FilterTab = "all" | "unread" | "high" | string;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "high", label: "High Priority" },
  { id: AlertType.RenewalDue, label: "Renewals" },
  { id: AlertType.CustomerRisk, label: "Customer Risk" },
  { id: AlertType.DealExpiry, label: "Deal Expiry" },
  { id: AlertType.LeadToCall, label: "Leads" },
];

export function Alerts() {
  const { alerts, refreshAlerts } = useApp();
  const { actor } = useActor();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());
  const [markingIds, setMarkingIds] = useState<Set<string>>(new Set());
  const [markingAll, setMarkingAll] = useState(false);

  // Computed counts
  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const highCount = alerts.filter(
    (a) => a.severity === AlertSeverity.High,
  ).length;
  const todayCount = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return alerts.filter((a) => {
      const ms = Number(a.createdAt) / 1_000_000;
      return ms >= start.getTime();
    }).length;
  }, [alerts]);

  // Filtered list
  const filtered = useMemo(() => {
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

  async function handleMarkRead(id: string) {
    if (!actor) return;
    setMarkingIds((s) => new Set(s).add(id));
    try {
      await actor.markAlertRead(id);
      await refreshAlerts();
      toast.success("Alert marked as read");
    } catch {
      toast.error("Failed to mark alert as read");
    } finally {
      setMarkingIds((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  }

  async function handleDismiss(id: string) {
    if (!actor) return;
    setDismissingIds((s) => new Set(s).add(id));
    try {
      await actor.dismissAlert(id);
      await refreshAlerts();
      toast.success("Alert dismissed");
    } catch {
      toast.error("Failed to dismiss alert");
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
      toast.success(`${unread.length} alerts marked as read`);
    } catch {
      toast.error("Failed to mark all alerts as read");
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 fade-in" data-ocid="alerts.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Alerts
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor and act on important notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="border-border text-foreground hover:bg-card"
            data-ocid="alerts.mark_all_read_button"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            {markingAll ? "Marking…" : "Mark all read"}
          </Button>
        )}
      </div>

      {/* Summary counters */}
      <div
        className="grid grid-cols-3 gap-4"
        data-ocid="alerts.summary_section"
      >
        <div className="crm-card p-4 flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Unread
          </span>
          <span className="text-3xl font-bold font-display text-foreground">
            {unreadCount}
          </span>
        </div>
        <div className="crm-card p-4 flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            High Priority
          </span>
          <span className="text-3xl font-bold font-display text-red-400">
            {highCount}
          </span>
        </div>
        <div className="crm-card p-4 flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Today
          </span>
          <span className="text-3xl font-bold font-display text-foreground">
            {todayCount}
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-1 border-b border-border overflow-x-auto scrollbar-thin pb-0"
        data-ocid="alerts.filter_tabs"
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`alerts.${tab.id}.tab`}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.id === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 bg-accent/20 text-accent text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="flex flex-col gap-3" data-ocid="alerts.list">
        {filtered.length === 0 ? (
          <div
            className="crm-card flex flex-col items-center justify-center py-16 gap-3 text-center"
            data-ocid="alerts.empty_state"
          >
            <CheckCircle2 className="w-12 h-12 text-green-400" />
            <p className="text-lg font-semibold text-foreground">
              No active alerts
            </p>
            <p className="text-sm text-muted-foreground">
              You're all caught up!
            </p>
          </div>
        ) : (
          filtered.map((alert, idx) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              index={idx + 1}
              isMarking={markingIds.has(alert.id)}
              isDismissing={dismissingIds.has(alert.id)}
              onMarkRead={handleMarkRead}
              onDismiss={handleDismiss}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── AlertRow sub-component ──────────────────────────────────────────────────
interface AlertRowProps {
  alert: Alert;
  index: number;
  isMarking: boolean;
  isDismissing: boolean;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

function AlertRow({
  alert,
  index,
  isMarking,
  isDismissing,
  onMarkRead,
  onDismiss,
}: AlertRowProps) {
  const config =
    ALERT_CONFIG[alert.alertType] ?? ALERT_CONFIG[AlertType.RenewalDue];
  const Icon = config.icon;
  const severity =
    SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG[AlertSeverity.Low];

  return (
    <div
      data-ocid={`alerts.item.${index}`}
      className={`crm-card p-4 flex items-start gap-4 transition-opacity ${
        alert.isRead ? "opacity-60" : ""
      }`}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-card border border-border">
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">
            {config.label}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${severity.className}`}
          >
            {severity.label}
          </span>
          {!alert.isRead && (
            <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-foreground mt-1 break-words">
          {alert.message}
        </p>
        {alert.accountId && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Account: {alert.accountId}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {timeAgo(alert.createdAt)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0 ml-auto">
        {!alert.isRead && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onMarkRead(alert.id)}
            disabled={isMarking}
            data-ocid={`alerts.mark_read_button.${index}`}
            className="text-xs text-muted-foreground hover:text-foreground h-7"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1" />
            {isMarking ? "…" : "Mark read"}
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDismiss(alert.id)}
          disabled={isDismissing}
          data-ocid={`alerts.dismiss_button.${index}`}
          className="text-xs text-muted-foreground hover:text-red-400 h-7"
        >
          <XCircle className="w-3.5 h-3.5 mr-1" />
          {isDismissing ? "…" : "Dismiss"}
        </Button>
      </div>
    </div>
  );
}
